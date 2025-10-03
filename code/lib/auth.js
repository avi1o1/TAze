const CAS_SERVER_URL = 'https://login.iiit.ac.in/cas';
const SERVICE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Custom CAS Provider for NextAuth.js
const CASProvider = {
    id: 'cas',
    name: 'IIIT CAS',
    type: 'credentials',

    credentials: {},

    async authorize(credentials, req) {
        const { query } = req;
        const ticket = query.ticket;

        if (!ticket) {
            return null;
        }

        // Validate the ticket with CAS server
        const validateUrl = `${CAS_SERVER_URL}/serviceValidate?service=${encodeURIComponent(`${SERVICE_URL}/api/auth/callback/cas`)}&ticket=${ticket}`;

        try {
            const response = await fetch(validateUrl);
            const xml = await response.text();

            console.log('CAS Response:', xml); // Debug log

            // Parse the CAS response XML
            if (xml.includes('<cas:authenticationSuccess>')) {
                const userMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);
                const user = userMatch ? userMatch[1] : null;

                if (user) {
                    return {
                        id: user,
                        name: user,
                        email: `${user}@iiit.ac.in`,
                    };
                }
            }

            return null;
        } catch (error) {
            console.error('CAS validation error:', error);
            return null;
        }
    },
};

export const authOptions = {
    providers: [CASProvider],
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
