'use client';

import { useActionState, useState } from 'react';
import { createPost } from '../app/actions';
import { Loader2, MessageSquare, Swords, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const initialState = {
    error: '',
};

export function CreatePostForm({ communities }) {
    const [state, action, isPending] = useActionState(createPost, initialState);
    const [postType, setPostType] = useState('discussion'); // 'discussion' | 'debate'

    return (
        <form action={action} className="space-y-8">
            {state?.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl font-medium">
                    {state.error}
                </div>
            )}

            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setPostType('discussion')}
                    className={cn(
                        "flex flex-col items-center gap-2 p-6 rounded-xl border transition-all duration-200",
                        postType === 'discussion'
                            ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                            : "bg-card border-border hover:border-border/80 opacity-60 hover:opacity-100"
                    )}
                >
                    <MessageSquare className="w-8 h-8" />
                    <span className="font-bold">Discussion</span>
                </button>
                <button
                    type="button"
                    onClick={() => setPostType('debate')}
                    className={cn(
                        "flex flex-col items-center gap-2 p-6 rounded-xl border transition-all duration-200",
                        postType === 'debate'
                            ? "bg-fuchsia-500/20 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                            : "bg-card border-border hover:border-border/80 opacity-60 hover:opacity-100"
                    )}
                >
                    <Swords className="w-8 h-8" />
                    <span className="font-bold">Debate</span>
                </button>
                <input type="hidden" name="type" value={postType} />
            </div>

            <div className="space-y-4 glass-card p-6 rounded-xl">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        placeholder={postType === 'debate' ? "e.g., Vim is better than VS Code" : "Give your post a catchy title"}
                        className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Community</label>
                    <div className="relative">
                        <select
                            name="category"
                            required
                            className="w-full bg-black/40 text-white border border-white/10 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                        >
                            <option value="" className="bg-gray-900 text-gray-400">Select a community...</option>
                            {communities.map(comm => (
                                <option key={comm.name} value={comm.name} className="bg-gray-900 text-white py-2">
                                    r/{comm.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-xs text-gray-500">Choose which community to post in</p>
                </div>

                {postType === 'debate' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-fuchsia-400">Side A Label</label>
                            <input
                                name="sideA"
                                type="text"
                                required
                                placeholder="e.g., Pro-Vim"
                                className="w-full bg-secondary/30 border border-fuchsia-500/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-cyan-400">Side B Label</label>
                            <input
                                name="sideB"
                                type="text"
                                required
                                placeholder="e.g., Pro-VSCode"
                                className="w-full bg-secondary/30 border border-cyan-500/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                        name="content"
                        required
                        rows={8}
                        placeholder={postType === 'debate' ? "Explain the context of this battle..." : "What's on your mind?"}
                        className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none resize-y"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-violet-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                    {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                    {postType === 'debate' ? 'Start Battle' : 'Post Discussion'}
                </button>
            </div>
        </form>
    );
}
