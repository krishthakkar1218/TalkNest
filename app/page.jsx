import { PostCard } from "../components/PostCard";
import { TrendingUp, Clock } from "lucide-react";
import connectDB from "../lib/db";
import Post from "../models/Post";
import Comment from "../models/Comment";
import User from "../models/User";
import Vote from "../models/Vote"; // Need Vote model
import Link from 'next/link';
import { cn } from '../lib/utils';
import { getSession } from "../lib/auth"; // Need session for user context
import { joinCommunity } from "../app/actions"; // Action for sidebar
import Community from "../models/Community";
import { JoinButton } from "../components/JoinButton";

// Helper to ensure models are compiled
const ensureModels = () => {
    if (!User || !Vote) return;
};

export default async function Home(props) {
    const searchParams = await props.searchParams;
    const sort = searchParams?.sort || 'new';

    await connectDB();
    ensureModels();
    const session = await getSession();

    // Fetch User Data for Join Status
    let joinedCommunities = [];
    if (session?.user?.id) {
        const user = await User.findById(session.user.id).select('joinedCommunities');
        if (user) joinedCommunities = user.joinedCommunities || [];
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'trending') {
        sortQuery = { upvotes: -1 };
    }

    const posts = await Post.find({})
        .populate('author', 'username')
        .sort(sortQuery)
        .limit(20)
        .lean();

    // Fetch comment counts
    const postIds = posts.map(p => p._id);
    const commentCounts = await Comment.aggregate([
        { $match: { post: { $in: postIds } } },
        { $group: { _id: "$post", count: { $sum: 1 } } }
    ]);
    const commentCountMap = {};
    commentCounts.forEach(c => commentCountMap[c._id.toString()] = c.count);

    // Fetch User Votes for these posts
    const userVotesMap = {};
    if (session?.user?.id) {
        const votes = await Vote.find({
            user: session.user.id,
            post: { $in: postIds }
        });
        votes.forEach(v => {
            userVotesMap[v.post.toString()] = v.type; // 'up' or 'down'
        });
    }

    // Fetch Top Communities
    const topCommunitiesRaw = await Community.find({})
        .sort({ membersCount: -1 })
        .limit(5)
        .lean();

    // Calculate REAL counts dynamically from User collection to ensure accuracy
    const topCommunities = await Promise.all(topCommunitiesRaw.map(async (comm) => {
        const realCount = await User.countDocuments({ joinedCommunities: comm.name });
        return { ...comm, membersCount: realCount };
    }));

    // Format for UI
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
        userVote: userVotesMap[post._id.toString()] || null, // Pass user vote
        commentCount: commentCountMap[post._id.toString()] || 0,
        timestamp: new Date(post.createdAt).toLocaleDateString(),
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Your Feed
                    </h1>
                    <div className="flex gap-1 glass p-1.5 rounded-full border border-white/5 bg-black/40">
                        <Link
                            href="/?sort=trending"
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300",
                                sort === 'trending'
                                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Trending
                        </Link>
                        <Link
                            href="/?sort=new"
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300",
                                sort === 'new'
                                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Clock className="w-4 h-4" />
                            New
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {formattedPosts.length > 0 ? (
                        formattedPosts.map(post => (
                            <div key={post.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 glass rounded-3xl border border-white/5 border-dashed m-4">
                            <h3 className="text-2xl font-black text-white mb-2">It's quiet... too quiet.</h3>
                            <p className="text-gray-400 mb-8">Be the hero this city needs. Start a discussion!</p>
                            <Link href="/create" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
                                Create Post
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar with Join Logic */}
            <div className="hidden lg:block space-y-6">
                <div className="glass border border-white/5 rounded-3xl p-8 sticky top-28 z-10 backdrop-blur-xl bg-black/40">
                    <h2 className="font-black mb-6 text-xl text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
                        Top Communities
                    </h2>
                    <div className="space-y-2">
                        {topCommunities.length > 0 ? (
                            topCommunities.map((comm, i) => {
                                const topic = comm.name;
                                const isJoined = joinedCommunities.includes(topic);
                                return (
                                    <div key={topic} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/5">
                                        <Link href={`/c/${topic}`} className="flex items-center gap-4 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-sm font-bold text-gray-400 group-hover:from-violet-600 group-hover:to-fuchsia-600 group-hover:text-white transition-all shadow-inner">
                                                {i + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="capitalize font-bold text-gray-300 group-hover:text-white transition-colors">{topic}</span>
                                                <span className="text-[10px] text-gray-500">{comm.membersCount} members</span>
                                            </div>
                                        </Link>

                                        {session ? (
                                            <JoinButton
                                                communityName={topic}
                                                isJoined={isJoined}
                                                className="text-xs px-3 py-1.5 rounded-full"
                                            />
                                        ) : (
                                            <Link href="/login" className="text-xs text-white bg-white/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all font-bold">
                                                Join
                                            </Link>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No communities yet.</p>
                        )}

                        <Link href="/create-community" className="block w-full text-center mt-4 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider border border-white/5 rounded-xl py-3 hover:bg-white/5">
                            + Create New
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
