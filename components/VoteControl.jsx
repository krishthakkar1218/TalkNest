'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { vote } from '../app/actions';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { cn } from '../lib/utils';

export function VoteControl({ id, type, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = null }) {
    // We maintain a local state for the user's vote to drive the optimistic updates accurately
    // derived from initialUserVote prop
    const [currentVote, setCurrentVote] = useState(initialUserVote);

    // Calculate score based on props, assuming they include the user's initial vote
    const initialScore = (initialUpvotes || 0) - (initialDownvotes || 0);

    const [optimisticState, setOptimisticState] = useOptimistic(
        { score: initialScore, userVote: initialUserVote },
        (state, newVote) => {
            let newScore = state.score;
            let newUserVote = newVote;

            // Simple Logic:
            // 1. If clicking same vote -> Toggle Off (remove vote)
            // 2. If clicking different vote -> Swap (remove old, add new)
            // 3. If no vote -> Add new

            if (state.userVote === newVote) {
                // Toggle off
                newUserVote = null;
                if (newVote === 'up') newScore -= 1;
                else newScore += 1;
            } else {
                // Change or New
                if (newVote === 'up') {
                    newScore += 1;
                    if (state.userVote === 'down') newScore += 1; // Removed down, added up
                } else {
                    newScore -= 1;
                    if (state.userVote === 'up') newScore -= 1; // Removed up, added down
                }
            }

            return { score: newScore, userVote: newUserVote };
        }
    );

    const [isPending, startTransition] = useTransition();

    const handleVote = (voteType) => {
        startTransition(async () => {
            // Optimistic update
            setOptimisticState(voteType);

            // Actual server action
            await vote(id, type, voteType);

            // Sync local state logic (approximate until refresh, but keeps UI consistent interactively)
            if (currentVote === voteType) setCurrentVote(null);
            else setCurrentVote(voteType);
        });
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <button
                onClick={() => handleVote('up')}
                disabled={isPending}
                className={cn(
                    "p-1 rounded hover:bg-white/10 transition-colors",
                    "text-gray-500 active:scale-95",
                    optimisticState.userVote === 'up' && "text-orange-500 bg-orange-500/10"
                )}
            >
                <ArrowBigUp className="w-8 h-8" />
            </button>

            <span className={cn(
                "font-bold text-lg transition-colors",
                optimisticState.userVote === 'up' ? "text-orange-500" :
                    optimisticState.userVote === 'down' ? "text-blue-500" : "text-gray-400"
            )}>
                {optimisticState.score}
            </span>

            <button
                onClick={() => handleVote('down')}
                disabled={isPending}
                className={cn(
                    "p-1 rounded hover:bg-white/10 transition-colors",
                    "text-gray-500 active:scale-95",
                    optimisticState.userVote === 'down' && "text-blue-500 bg-blue-500/10"
                )}
            >
                <ArrowBigDown className="w-8 h-8" />
            </button>
        </div>
    );
}
