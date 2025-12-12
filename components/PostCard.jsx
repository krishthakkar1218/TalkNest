'use client'; // Client component for interactivity

import Link from 'next/link';
import { MessageSquare, Share2, Swords } from 'lucide-react';
import { cn } from '../lib/utils';
import { VoteControl } from './VoteControl';

export function PostCard({ id, title, content, author, category, votes, upvotes, downvotes, userVote, commentCount, timestamp, type }) {
    const isDebate = type === 'debate';

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/post/${id}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy', err);
        });
    };

    return (
        <div className={cn(
            "flex border rounded-2xl transition-all duration-300 overflow-hidden group relative",
            isDebate
                ? "bg-black/40 border-fuchsia-500/30 hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/50 backdrop-blur-sm"
                : "glass-card hover:bg-white/5"
        )}>
            {/* Type Indicator Line */}
            <div className={cn(
                "absolute top-0 left-0 bottom-0 w-1",
                isDebate ? "bg-gradient-to-b from-violet-500 via-fuchsia-500 to-cyan-500" : "bg-transparent group-hover:bg-primary/50 transition-colors"
            )} />

            {/* Vote Sidebar */}
            <div className="w-14 bg-black/20 flex flex-col items-center py-4 gap-1 border-r border-white/5">
                <VoteControl
                    id={id}
                    type="post"
                    initialUpvotes={upvotes}
                    initialDownvotes={downvotes}
                    initialUserVote={userVote}
                />
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
                {/* Meta Header */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    {isDebate && (
                        <div className="flex items-center gap-1 bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-fuchsia-500/30">
                            <Swords className="w-3 h-3" />
                            Battle
                        </div>
                    )}
                    <Link href={`/c/${category}`} className="font-bold text-gray-300 hover:text-white hover:underline">
                        r/{category}
                    </Link>
                    <span className="opacity-30">•</span>
                    <span>u/{author.username}</span>
                    <span className="opacity-30">•</span>
                    <span>{timestamp}</span>
                </div>

                {/* Title & Preview */}
                <Link href={`/post/${id}`} className="block group-hover:opacity-100">
                    <h3 className={cn(
                        "text-xl font-bold mb-2 transition-colors line-clamp-2",
                        isDebate ? "group-hover:text-fuchsia-300" : "group-hover:text-primary"
                    )}>
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                        {content}
                    </p>
                </Link>

                {/* Actions Footer */}
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                    <Link href={`/post/${id}`} className="flex items-center gap-2 hover:bg-white/5 hover:text-gray-300 px-3 py-1.5 rounded-full transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        {commentCount} Comments
                    </Link>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 hover:bg-white/5 hover:text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}
