'use client';

import { useState, useRef, useEffect } from 'react';
import { logoutUser } from '../app/actions';
import Link from 'next/link';
import { User, LogOut, Settings, PlusCircle, Users } from 'lucide-react';
import { cn } from '../lib/utils';

export function UserMenu({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-white/10 px-2 py-1.5 rounded-full transition-colors"
            >
                {user.image ? (
                    <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full bg-gray-700" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                        {user.username?.[0]?.toUpperCase()}
                    </div>
                )}
                <span className="text-sm font-medium hidden md:block text-gray-200">{user.username}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                        <p className="text-sm font-bold text-white">{user.username}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                        <Link
                            href="/create"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <PlusCircle className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
                            Create Post
                        </Link>
                        <Link
                            href="/create-community"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                        >
                            <Users className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                            Create Community
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                        <Link
                            href="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </div>

                    <div className="border-t border-white/5 p-2 mt-1">
                        <form action={logoutUser}>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
