import dbConnect from '../../lib/mongodb';
import Queue from '../../models/Queue';
import { requireAuth } from '../../lib/middleware';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    await dbConnect();

    try {
        // Check if queues already exist
        const existingQueues = await Queue.find({});

        if (existingQueues.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Queues already exist',
                data: existingQueues
            });
        }

        // Create sample queues
        const sampleQueues = [
            {
                title: 'Main Reception',
                description: 'General inquiries and document submission',
                nextTicket: 15,
                currentTurn: 12,
                createdBy: req.user.email || req.user.name
            },
            {
                title: 'Visa Processing',
                description: 'Visa applications and renewals',
                nextTicket: 8,
                currentTurn: 5,
                createdBy: req.user.email || req.user.name
            },
            {
                title: 'Document Verification',
                description: 'Document authentication and verification services',
                nextTicket: 25,
                currentTurn: 20,
                createdBy: req.user.email || req.user.name
            }
        ];

        const createdQueues = await Queue.insertMany(sampleQueues);

        res.status(201).json({
            success: true,
            message: 'Sample queues created successfully',
            data: createdQueues
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating sample queues',
            error: error.message
        });
    }
}

export default requireAuth(handler);
