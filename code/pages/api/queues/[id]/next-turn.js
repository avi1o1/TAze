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

        // Check if we can increment currentTurn (shouldn't exceed nextTicket - 1)
        if (queue.currentTurn >= queue.nextTicket - 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot advance turn. No more tickets available.'
            });
        }

        // Increment currentTurn
        queue.currentTurn += 1;
        await queue.save();

        res.status(200).json({ success: true, data: queue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export default requireAuth(handler);
