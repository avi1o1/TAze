import dbConnect from '../../../../lib/mongodb';
import Queue from '../../../../models/Queue';
import { requireAuth } from '../../../../lib/middleware';

async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await dbConnect();

    if (method !== 'PUT') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const queue = await Queue.findById(id);
        if (!queue) {
            return res.status(404).json({ success: false, message: 'Queue not found' });
        }

        // Increment nextTicket
        queue.nextTicket += 1;
        await queue.save();

        res.status(200).json({ success: true, data: queue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export default requireAuth(handler);
