import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, required: true, index: true },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        type: { type: String, enum: ['discussion', 'debate'], default: 'discussion' },
        debateSides: {
            sideA: { type: String },
            sideB: { type: String }
        }
    },
    { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
