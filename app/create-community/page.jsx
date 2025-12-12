'use client';

import { useActionState } from 'react';
import { createCommunity } from '../actions';
import { Users, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';

export default function CreateCommunityPage() {
    const [state, action, isPending] = useActionState(createCommunity, null);

    return (
        <div className="max-w-md mx-auto mt-20 p-6 glass rounded-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Create a Community
                </h1>
                <p className="text-sm text-gray-400">Start a new space for discussion</p>
            </div>

            <form action={action} className="space-y-4">
                {state?.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center animate-in fade-in">
                        {state.error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Name</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-bold">r/</span>
                        <input
                            name="name"
                            required
                            minLength={3}
                            maxLength={20}
                            placeholder="community_name"
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-8 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium"
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Lowercase, no spaces, 3-20 chars.</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea
                        name="description"
                        maxLength={200}
                        placeholder="What is this community about?"
                        rows={3}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-sm resize-none"
                    />
                </div>

                <button
                    disabled={isPending}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transaction-colors flex items-center justify-center gap-2 mt-4"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Community'
                    )}
                </button>

                <div className="text-center">
                    <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
