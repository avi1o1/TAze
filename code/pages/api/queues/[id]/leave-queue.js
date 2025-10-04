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

        // Get user name from the authenticated request
        const userName = req.user.name;

        // Check if user is in the queue
        const userIndex = queue.ticketQueue.indexOf(userName);
        if (userIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You are not in this queue'
            });
        }

        // Remove user from the ticket queue
        queue.ticketQueue.splice(userIndex, 1);
        await queue.save();

        res.status(200).json({
            success: true,
            data: queue,
            message: 'Successfully left the queue'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export default requireAuth(handler);
