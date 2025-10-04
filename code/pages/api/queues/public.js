import dbConnect from '../../../lib/mongodb';
import Queue from '../../../models/Queue';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        await dbConnect();

        // Fetch all queues for public viewing (no authentication required)
        const queues = await Queue.find({}).sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: queues });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}