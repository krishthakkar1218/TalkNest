import connectDB from '../../lib/db';
import Community from '../../models/Community';
import { CreatePostForm } from '../../components/CreatePostForm';

export default async function CreatePostPage() {
    await connectDB();
    const communities = await Community.find({}).sort({ membersCount: -1 }).lean();

    return (
        <div className="max-w-3xl mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Create a Post
                </h1>
                <p className="text-muted-foreground">Share your thoughts or start a battle.</p>
            </div>

            <CreatePostForm communities={communities.map(c => ({ name: c.name, description: c.description }))} />
        </div>
    );
}
