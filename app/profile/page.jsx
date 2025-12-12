import { PostCard } from "../../components/PostCard";
import connectDB from "../../lib/db";
import Post from "../../models/Post";
import User from "../../models/User";
import { getSession } from "../../lib/auth";
import { logoutUser } from "../actions";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Settings, LogOut, Calendar, MessageSquare, Award } from 'lucide-react';
import { cn } from "../../lib/utils";

export default async function ProfilePage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    await connectDB();

    // Fetch User Details
    const user = await User.findById(session.user.id);
    if (!user) redirect('/login');

    // Fetch User Posts
    const posts = await Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="max-w-4xl mx-auto pt-10 pb-20">
            {/* Header Card */}
            <div className="glass rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-20" />

                <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 pt-10">
                    <div className="w-32 h-32 rounded-3xl bg-black border-4 border-black shadow-2xl flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-gray-800 to-gray-900">
                        {user.username[0].toUpperCase()}
                    </div>

                    <div className="flex-1 mb-2">
                        <h1 className="text-4xl font-black text-white mb-2">{user.username}</h1>
                        <p className="text-gray-400 max-w-lg mb-4">{user.bio || "No bio yet."}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 font-bold">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-orange-400" />
                                {user.karma || 0} Karma
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link href="/settings" className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold text-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                        <form action={logoutUser}>
                            <button className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors font-bold text-sm flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Stats/Communities */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-white/5">
                        <h3 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-wider">Communities</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.joinedCommunities && user.joinedCommunities.length > 0 ? (
                                user.joinedCommunities.map(c => (
                                    <Link key={c} href={`/c/${c}`} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan-400 transition-colors">
                                        r/{c}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No communities joined.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Posts Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Post History</h2>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <PostCard
                                key={post._id}
                                id={post._id.toString()}
                                title={post.title}
                                content={post.content}
                                author={{ username: user.username }}
                                category={post.category}
                                type={post.type}
                                votes={(post.upvotes || 0) - (post.downvotes || 0)}
                                upvotes={post.upvotes}
                                downvotes={post.downvotes}
                                commentCount={0} // Ideally fetch this
                                timestamp={new Date(post.createdAt).toLocaleDateString()}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 rounded-2xl border border-white/5 border-dashed bg-white/5">
                            <p className="text-gray-400">No posts yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
