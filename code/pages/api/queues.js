import dbConnect from '../../lib/mongodb';
import Queue from '../../models/Queue';
import { requireAuth, requireAdmin } from '../../lib/middleware';

async function handler(req, res) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const queues = await Queue.find({}).sort({ createdAt: 1 });
                res.status(200).json({ success: true, data: queues });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'POST':
            try {
                // Add user info to queue creation
                const queueData = {
                    ...req.body,
                    createdBy: req.user.email || req.user.name,
                };
                const queue = await Queue.create(queueData);
                res.status(201).json({ success: true, data: queue });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        default:
            res.status(400).json({ success: false, message: 'Method not allowed' });
            break;
    }
}

// Apply different middleware based on method
export default function (req, res) {
    const { method } = req;

    if (method === 'POST') {
        // Require admin for creating queues
        return requireAdmin(handler)(req, res);
    } else {
        // Regular auth for other operations
        return requireAuth(handler)(req, res);
    }
}
