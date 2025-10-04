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
        // Check if user is admin
        const adminEmails = process.env.ADMINS?.split(',').map(email => email.trim()) || [];
        const userEmail = req.user.email;
        const isAdmin = adminEmails.includes(userEmail);

        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only administrators can advance the queue'
            });
        }

        const queue = await Queue.findById(id);
        if (!queue) {
            return res.status(404).json({ success: false, message: 'Queue not found' });
        }

        // If there are people in the queue, move the first person to currentlyServing
        if (queue.ticketQueue.length > 0) {
            const nextPerson = queue.ticketQueue.shift(); // Remove first element
            queue.currentlyServing = nextPerson;
        } else {
            // If no one is waiting, clear the currentlyServing field
            queue.currentlyServing = null;
        }

        await queue.save();

        res.status(200).json({ success: true, data: queue });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export default requireAuth(handler);
