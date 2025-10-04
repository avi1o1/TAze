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
    ticketQueue: {
        type: [String],
        default: []
    },
    currentlyServing: {
        type: String,
        default: ''
    },
    createdBy: {
        type: String,
        default: 'Unknown'
    }
}, {
    timestamps: true
});

export default mongoose.models.Queue || mongoose.model('Queue', QueueSchema);
