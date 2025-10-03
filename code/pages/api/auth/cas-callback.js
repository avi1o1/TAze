const CAS_SERVER_URL = 'https://login.iiit.ac.in/cas';
const SERVICE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export default async function handler(req, res) {
    const { ticket } = req.query;

    if (!ticket) {
        // Redirect to CAS login if no ticket
        const loginUrl = `${CAS_SERVER_URL}/login?service=${encodeURIComponent(`${SERVICE_URL}/api/auth/cas-callback`)}`;
        return res.redirect(302, loginUrl);
    }

    try {
        // Validate the ticket with CAS server
        const validateUrl = `${CAS_SERVER_URL}/serviceValidate?service=${encodeURIComponent(`${SERVICE_URL}/api/auth/cas-callback`)}&ticket=${ticket}`;

        const response = await fetch(validateUrl);
        const xml = await response.text();

        console.log('CAS Response:', xml); // Debug log

        // Parse the CAS response XML
        if (xml.includes('<cas:authenticationSuccess>')) {
            const userMatch = xml.match(/<cas:user>(.*?)<\/cas:user>/);
            const username = userMatch ? userMatch[1] : null;

            if (username) {
                // Generate a simple auth token
                const authToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');

                // Create a page that sets localStorage and redirects
                const redirectScript = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Success</title>
        </head>
        <body>
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
            <div style="text-align: center;">
              <h2>Authentication Successful</h2>
              <p>Redirecting...</p>
              <div style="margin: 20px 0;">
                <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
              </div>
            </div>
          </div>
          <script>
            localStorage.setItem('cas_auth_token', '${authToken}');
            localStorage.setItem('cas_auth_user', '${username}');
            localStorage.setItem('cas_auth_email', '${username}@iiit.ac.in');
            localStorage.setItem('cas_auth_timestamp', '${Date.now()}');
            setTimeout(function() {
              window.location.href = '/';
            }, 1000);
          </script>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </body>
        </html>
        `;

                res.setHeader('Content-Type', 'text/html');
                return res.send(redirectScript);
            }
        }

        // Authentication failed
        return res.redirect(302, '/auth/error?error=Authentication');
    } catch (error) {
        console.error('CAS validation error:', error);
        return res.redirect(302, '/auth/error?error=Validation');
    }
}
