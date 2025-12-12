import { PostCard } from "../../../components/PostCard";
import connectDB from "../../../lib/db";
import Post from "../../../models/Post";
import Community from "../../../models/Community";
import Comment from "../../../models/Comment";
import User from "../../../models/User";
import Vote from "../../../models/Vote";
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import { getSession } from "../../../lib/auth";
import { joinCommunity } from "../../actions";
import { Users, TrendingUp, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { JoinButton } from "../../../components/JoinButton";

export default async function CommunityPage(props) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const slug = params.slug;
    const sort = searchParams?.sort || 'new';

    await connectDB();

    // 1. Fetch Community Details
    const community = await Community.findOne({ name: slug });
    if (!community) {
        // Fallback for "legacy" categories that might not be in DB yet? 
        // Or just show 404. Let's start with 404 but maybe handle filtered posts if it's just a tag?
        // User asked for "dynamic communities", implying DB backing.
        // However, if sidebar links are hardcoded or migrated, we should respect DB.
        // If it returns null, we can check if there are posts with this category anyway?
        // Let's stick to DB validity for "Communities", but maybe allow viewing posts if it's just a category tag used before.
        // Actually, safer to just show 404 if not a "Real Community" to enforce creating them.
        notFound();
    }

    // 2. Fetch Session & Real Member Count
    const session = await getSession();
    let isJoined = false;
    if (session?.user?.id) {
        const user = await User.findById(session.user.id).select('joinedCommunities');
        if (user && user.joinedCommunities) {
            isJoined = user.joinedCommunities.includes(slug);
        }
    }

    const realMemberCount = await User.countDocuments({ joinedCommunities: slug });
    community.membersCount = realMemberCount; // Override with real count

    // 3. Fetch Posts
    let sortQuery = { createdAt: -1 };
    if (sort === 'trending') sortQuery = { upvotes: -1 };

    const posts = await Post.find({ category: slug })
        .populate('author', 'username')
        .sort(sortQuery)
        .limit(20)
        .lean();

    // 4. Fetch Meta (Comments, Votes)
    const postIds = posts.map(p => p._id);
    const commentCounts = await Comment.aggregate([
        { $match: { post: { $in: postIds } } },
        { $group: { _id: "$post", count: { $sum: 1 } } }
    ]);
    const commentCountMap = {};
    commentCounts.forEach(c => commentCountMap[c._id.toString()] = c.count);

    const userVotesMap = {};
    if (session?.user?.id) {
        const votes = await Vote.find({ user: session.user.id, post: { $in: postIds } });
        votes.forEach(v => userVotesMap[v.post.toString()] = v.type);
    }

    // 5. Format Posts
    const formattedPosts = posts.map((post) => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        author: { username: post.author?.username || 'Unknown' },
        category: post.category,
        type: post.type,
        votes: (post.upvotes || 0) - (post.downvotes || 0),
        upvotes: post.upvotes || 0,
        downvotes: post.downvotes || 0,
        userVote: userVotesMap[post._id.toString()] || null,
        commentCount: commentCountMap[post._id.toString()] || 0,
        timestamp: new Date(post.createdAt).toLocaleDateString(),
    }));

    return (
        <div className="max-w-4xl mx-auto pt-6">
            {/* Header */}
            <div className="glass rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600">r/{community.name}</span>
                        </h1>
                        <p className="text-gray-300 text-lg max-w-xl">{community.description || "A place for discussion."}</p>

                        <div className="flex items-center gap-6 mt-4 text-sm font-bold text-gray-500">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {community.membersCount} Members
                            </div>
                            <div>Created {new Date(community.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>

                    {session ? (
                        <JoinButton
                            communityName={slug}
                            isJoined={isJoined}
                            className="px-6 py-2 rounded-full text-sm"
                        />
                    ) : (
                        <Link href="/login" className="px-6 py-2 rounded-full font-bold text-sm bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/30 transition-all">
                            Login to Join
                        </Link>
                    )}
                </div>
            </div>

            {/* Feed Sort */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Posts</h2>
                <div className="flex gap-1 glass p-1 rounded-full border border-white/5">
                    <Link
                        href={`/c/${slug}?sort=trending`}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                            sort === 'trending'
                                ? "bg-white text-black shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <TrendingUp className="w-3 h-3" />
                        Trending
                    </Link>
                    <Link
                        href={`/c/${slug}?sort=new`}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                            sort === 'new'
                                ? "bg-white text-black shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Clock className="w-3 h-3" />
                        New
                    </Link>
                </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {formattedPosts.length > 0 ? (
                    formattedPosts.map(post => (
                        <PostCard key={post.id} {...post} />
                    ))
                ) : (
                    <div className="text-center py-20 rounded-3xl border border-white/5 border-dashed bg-black/20">
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No posts here yet</h3>
                        <Link href="/create" className="text-cyan-400 font-bold hover:underline">
                            Create the first post!
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
