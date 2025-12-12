import { notFound } from 'next/navigation';
import connectDB from '../../../lib/db';
import Post from '../../../models/Post';
import Comment from '../../../models/Comment';
import User from '../../../models/User';
import Link from 'next/link';
import { MessageSquare, Share2, Swords, Shield, Sword, Trash2 } from 'lucide-react';
import { getSession } from '../../../lib/auth';
import { VoteControl } from '../../../components/VoteControl';
import { addComment } from '../../actions';
import { cn } from '../../../lib/utils';
import { DeletePostButton } from '../../../components/DeletePostButton';

export default async function PostPage(props) {
    const params = await props.params;
    const { id } = params;

    await connectDB();
    const _user = User; // ensure model loaded

    const post = await Post.findById(id).populate('author', 'username avatar').lean();
    if (!post) notFound();

    // Fetch comments
    const comments = await Comment.find({ post: id })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .lean();

    const session = await getSession();

    const postAuthor = post.author;
    const isDebate = post.type === 'debate';
    const isAuthor = session?.user?.id === post.author._id.toString();

    // Group comments for debate
    const commentsA = isDebate ? comments.filter(c => c.debateSide === 'A') : [];
    const commentsB = isDebate ? comments.filter(c => c.debateSide === 'B') : [];
    const commentsGeneral = isDebate ? comments.filter(c => !c.debateSide) : comments;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Post Card */}
            <div className={cn(
                "rounded-2xl overflow-hidden mb-8 shadow-2xl transition-all duration-300",
                isDebate ? "border-2 border-fuchsia-500/50 bg-black/40 backdrop-blur-md" : "glass-card"
            )}>
                {/* Header Decoration for Debate */}
                {isDebate && (
                    <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 h-2 w-full animate-glow" />
                )}

                <div className="flex flex-col md:flex-row">
                    {/* Vote Sidebar */}
                    <div className="md:w-16 bg-black/20 flex flex-row md:flex-col items-center justify-center md:justify-start py-4 gap-2 border-b md:border-b-0 md:border-r border-white/5">
                        <VoteControl
                            id={post._id.toString()}
                            type="post"
                            initialUpvotes={post.upvotes}
                            initialDownvotes={post.downvotes}
                        />
                    </div>

                    <div className="p-6 md:p-8 flex-1">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground mb-6">
                            <span className={cn("px-3 py-1 rounded-full font-bold text-white shadow-lg", isDebate ? "bg-gradient-to-r from-fuchsia-600 to-purple-600" : "bg-primary")}>
                                {isDebate ? "BATTLE ARENA" : "Discussion"}
                            </span>
                            <Link href={`/c/${post.category}`} className="font-bold hover:text-primary transition-colors">
                                r/{post.category}
                            </Link>
                            <span className="opacity-50">•</span>
                            <span className="font-medium flex items-center gap-1">
                                Posted by <span className="text-foreground font-bold">u/{postAuthor.username}</span>
                            </span>
                            <span className="opacity-50">•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                            {post.title}
                        </h1>

                        {/* Content */}
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">
                            {post.content}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-4 py-2 rounded-full font-medium">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                {comments.length} Comments
                            </div>
                            <button className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all font-medium">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                            {isAuthor && <DeletePostButton postId={post._id.toString()} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* DEBATE ARENA LAYOUT */}
            {isDebate && (
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <Swords className="w-8 h-8 text-fuchsia-500 animate-pulse" />
                        <h2 className="text-3xl font-black italic tracking-widest text-center uppercase bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            Battle Arena
                        </h2>
                        <Swords className="w-8 h-8 text-fuchsia-500 animate-pulse transform scale-x-[-1]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* SIDE A */}
                        <div className="space-y-4">
                            <div className="bg-violet-900/20 border border-violet-500/30 p-4 rounded-xl text-center backdrop-blur-sm sticky top-20 z-10">
                                <h3 className="text-xl font-bold text-violet-300 uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    {post.debateSides?.sideA || 'Side A'}
                                </h3>
                                <div className="text-sm text-violet-400/60 font-mono mt-1">{commentsA.length} Fighters</div>
                            </div>
                            <div className="space-y-4 min-h-[200px]">
                                {commentsA.map(comment => (
                                    <CommentCard key={comment._id} comment={comment} side="A" />
                                ))}
                                {commentsA.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground italic bg-violet-900/5 rounded-xl border-dashed border border-violet-500/20">
                                        No warriors yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SIDE B */}
                        <div className="space-y-4">
                            <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl text-center backdrop-blur-sm sticky top-20 z-10">
                                <h3 className="text-xl font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-2">
                                    {post.debateSides?.sideB || 'Side B'}
                                    <Sword className="w-5 h-5" />
                                </h3>
                                <div className="text-sm text-cyan-400/60 font-mono mt-1">{commentsB.length} Fighters</div>
                            </div>
                            <div className="space-y-4 min-h-[200px]">
                                {commentsB.map(comment => (
                                    <CommentCard key={comment._id} comment={comment} side="B" />
                                ))}
                                {commentsB.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground italic bg-cyan-900/5 rounded-xl border-dashed border border-cyan-500/20">
                                        No warriors yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comment Form */}
            {session ? (
                <div className={cn(
                    "p-6 rounded-2xl border mb-12",
                    isDebate ? "glass border-fuchsia-500/30" : "glass border-white/10"
                )}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Join the {isDebate ? "Battle" : "Conversation"}
                    </h3>
                    <form action={addComment}>
                        <input type="hidden" name="postId" value={post._id.toString()} />

                        {isDebate && (
                            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                                <label className="cursor-pointer">
                                    <input type="radio" name="debateSide" value="A" required className="peer sr-only" />
                                    <div className="p-2 md:p-3 rounded-xl border border-white/10 bg-black/20 peer-checked:bg-violet-600/20 peer-checked:border-violet-500 transition-all text-center text-xs md:text-sm font-bold text-gray-400 peer-checked:text-violet-300 hover:bg-white/5 h-full flex items-center justify-center">
                                        Join {post.debateSides?.sideA}
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="debateSide" value="B" required className="peer sr-only" />
                                    <div className="p-2 md:p-3 rounded-xl border border-white/10 bg-black/20 peer-checked:bg-cyan-600/20 peer-checked:border-cyan-500 transition-all text-center text-xs md:text-sm font-bold text-gray-400 peer-checked:text-cyan-300 hover:bg-white/5 h-full flex items-center justify-center">
                                        Join {post.debateSides?.sideB}
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="debateSide" value="" required className="peer sr-only" />
                                    <div className="p-2 md:p-3 rounded-xl border border-white/10 bg-black/20 peer-checked:bg-white/10 peer-checked:border-white transition-all text-center text-xs md:text-sm font-bold text-gray-400 peer-checked:text-white hover:bg-white/5 h-full flex items-center justify-center">
                                        Spectator (Neutral)
                                    </div>
                                </label>
                            </div>
                        )}

                        <textarea
                            name="content"
                            rows={isDebate ? 2 : 4}
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary mb-4 text-white placeholder-gray-500"
                            placeholder={isDebate ? "Make your point..." : "What are your thoughts?"}
                            required
                        />
                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-violet-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95">
                                {isDebate ? "Strike!" : "Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-12 p-8 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                    <p className="text-lg text-gray-300">
                        <Link href="/login" className="text-primary hover:text-white underline font-bold transition-colors">Log in</Link> to join the fray.
                    </p>
                </div>
            )}

            {/* Spectator/Neutral Gallery for Debates */}
            {isDebate && commentsGeneral.length > 0 && (
                <div className="space-y-4 mb-12">
                    <h3 className="text-xl font-bold text-gray-400 flex items-center gap-2 mb-4">
                        <span className="w-1 h-6 bg-gray-500 rounded-full" />
                        Spectator Gallery
                    </h3>
                    {commentsGeneral.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))}
                </div>
            )}

            {/* Standard Comments Layout (for non-debate) */}
            {!isDebate && (
                <div className="space-y-4">
                    {commentsGeneral.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))}
                    {commentsGeneral.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">Be the first to share your thoughts.</p>
                    )}
                </div>
            )}
        </div>
    );
}

// Reusable Comment Component
function CommentCard({ comment, side }) {
    const isSideA = side === 'A';
    const isSideB = side === 'B';

    return (
        <div className={cn(
            "p-4 rounded-xl border flex gap-4 transition-all hover:bg-white/5",
            isSideA ? "bg-violet-900/10 border-violet-500/20" :
                isSideB ? "bg-cyan-900/10 border-cyan-500/20" :
                    "bg-card border-white/5"
        )}>
            <div className="flex flex-col items-center gap-1">
                <VoteControl
                    id={comment._id.toString()}
                    type="comment"
                    initialUpvotes={comment.upvotes}
                    initialDownvotes={comment.downvotes}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", isSideA ? "bg-violet-600" : isSideB ? "bg-cyan-600" : "bg-gray-700")}>
                        {comment.author.username[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-sm text-gray-200">u/{comment.author.username}</span>
                    <span className="text-xs text-gray-500">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">{comment.content}</p>
            </div>
        </div>
    );
}
