import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled'
    },
    description: {
        type: String,
        default: 'No description'
    },
    nextTicket: {
        type: Number,
        required: true,
        default: 1
    },
    currentTurn: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: String,
        default: 'Unknown'
    }
}, {
    timestamps: true
});

export default mongoose.models.Queue || mongoose.model('Queue', QueueSchema);
