import { withAuth } from '../../../lib/middleware';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Check if user is admin
        const adminEmails = process.env.ADMINS?.split(',').map(email => email.trim()) || [];
        const userEmail = req.user.email;

        // Check if user email directly matches admin list
        let isAdmin = adminEmails.includes(userEmail);

        // If we reach here, the user is authenticated (middleware passed)
        res.status(200).json({
            success: true,
            authenticated: true,
            user: req.user,
            isAdmin
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default async (req, res) => withAuth(req, res, handler);
