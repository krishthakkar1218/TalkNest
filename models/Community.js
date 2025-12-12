import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Normalize names
        minlength: 3,
        maxlength: 20,
    },
    description: {
        type: String,
        maxlength: 200,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    membersCount: {
        type: Number,
        default: 1, // Creator is first member
    },
    icon: {
        type: String, // URL or distinct color/icon identifier
    }
}, { timestamps: true });

export default mongoose.models.Community || mongoose.model('Community', CommunitySchema);
