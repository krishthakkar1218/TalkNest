'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { joinCommunity } from '../app/actions';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

export function JoinButton({ communityName, isJoined, className }) {
    // Optimistic state: [isJoined]
    const [optimisticJoined, setOptimisticJoined] = useOptimistic(
        isJoined,
        (state, newState) => newState
    );

    const [isPending, startTransition] = useTransition();

    const handleJoin = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation if button is inside a Link

        startTransition(async () => {
            const newState = !optimisticJoined;
            setOptimisticJoined(newState);
            await joinCommunity(communityName);
        });
    };

    return (
        <button
            onClick={handleJoin}
            disabled={isPending}
            className={cn(
                "font-bold transition-all duration-300 flex items-center justify-center gap-2",
                optimisticJoined
                    ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    : "bg-white text-black hover:scale-105 shadow-lg shadow-white/10",
                className
            )}
        >
            {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : null}
            {optimisticJoined ? (isPending ? 'Updating...' : 'Joined') : 'Join'}
        </button>
    );
}
