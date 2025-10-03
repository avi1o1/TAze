export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Clear any server-side sessions if needed
    // For now, we'll just return success since we're using localStorage

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        casLogoutUrl: 'https://login.iiit.ac.in/cas/logout'
    });
}
