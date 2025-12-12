import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment' }, // For nested comments
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        debateSide: { type: String, enum: ['A', 'B'] }, // 'A' or 'B'
    },
    { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
export default Comment;
