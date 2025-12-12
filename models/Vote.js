import mongoose, { Schema } from 'mongoose';

const VoteSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
        type: { type: String, enum: ['up', 'down'], required: true },
    },
    { timestamps: true }
);

// Compound index to ensure a user allows only one vote per target
VoteSchema.index({ user: 1, post: 1 }, { unique: true, partialFilterExpression: { post: { $exists: true } } });
VoteSchema.index({ user: 1, comment: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });

const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);
export default Vote;
