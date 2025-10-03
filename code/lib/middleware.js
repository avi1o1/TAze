export async function withAuth(req, res, handler) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized. Please log in.',
            redirect: '/auth/signin'
        });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        // Decode the simple base64 token
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [username, timestamp] = decoded.split(':');

        // Check if token is not older than 24 hours
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (tokenAge > maxAge) {
            return res.status(401).json({
                success: false,
                error: 'Token expired. Please log in again.',
                redirect: '/auth/signin'
            });
        }

        // Add user info to request
        req.user = {
            name: username,
            email: username,
        };

        return handler(req, res);
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid token. Please log in again.',
            redirect: '/auth/signin'
        });
    }
}

export function requireAuth(handler) {
    return async (req, res) => {
        return withAuth(req, res, handler);
    };
}

export function requireAdmin(handler) {
    return async (req, res) => {
        return withAuth(req, res, (req, res) => {
            // Check if user is admin
            const adminEmails = process.env.ADMINS?.split(',').map(email => email.trim()) || [];
            const userEmail = req.user.email;

            // Check if user email directly matches admin list
            let isAdmin = adminEmails.includes(userEmail);

            if (!isAdmin) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden. Admin access required.',
                    message: 'You do not have permission to perform this action.'
                });
            }

            return handler(req, res);
        });
    };
}
