import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        image: { type: String },
        bio: { type: String },
        joinedCommunities: [{ type: String }],
        karma: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
