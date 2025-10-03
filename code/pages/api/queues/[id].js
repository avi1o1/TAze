import dbConnect from '../../../lib/mongodb';
import Queue from '../../../models/Queue';
import { requireAuth, requireAdmin } from '../../../lib/middleware';

async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            try {
                const queue = await Queue.findById(id);
                if (!queue) {
                    return res.status(404).json({ success: false, message: 'Queue not found' });
                }
                res.status(200).json({ success: true, data: queue });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'PUT':
            try {
                const queue = await Queue.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!queue) {
                    return res.status(404).json({ success: false, message: 'Queue not found' });
                }
                res.status(200).json({ success: true, data: queue });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
            break;

        case 'DELETE':
            try {
                const deletedQueue = await Queue.deleteOne({ _id: id });
                if (!deletedQueue.deletedCount) {
                    return res.status(404).json({ success: false, message: 'Queue not found' });
                }
                res.status(200).json({ success: true, data: {} });
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

    if (method === 'DELETE') {
        // Require admin for deleting queues
        return requireAdmin(handler)(req, res);
    } else {
        // Regular auth for other operations
        return requireAuth(handler)(req, res);
    }
}
