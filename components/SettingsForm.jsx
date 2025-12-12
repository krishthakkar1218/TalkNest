'use client';

import { useActionState } from 'react';
import { updateProfile } from '../app/actions';
import { Loader2, Save } from 'lucide-react';
import Link from 'next/link';

export function SettingsForm({ initialBio }) {
    const [state, action, isPending] = useActionState(updateProfile, null);

    return (
        <form action={action} className="space-y-6">
            {state?.error && (
                <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-4 bg-green-500/10 text-green-400 rounded-xl text-sm font-bold">
                    {state.success}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                <textarea
                    name="bio"
                    rows={4}
                    defaultValue={initialBio || ''}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-600"
                />
                <p className="text-xs text-gray-500">Brief description for your profile.</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Cancel
                </Link>
                <button
                    disabled={isPending}
                    className="bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
