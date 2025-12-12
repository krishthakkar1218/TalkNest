import Link from 'next/link';
import { cn } from '../lib/utils';
import { getSession } from '../lib/auth';
import { UserMenu } from './UserMenu';
import { MessageCircle, Bell, Search, Menu, X } from 'lucide-react';

export async function Navbar() {
    const session = await getSession();

    return (
        <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-500 hover:text-blue-400 transition-colors tracking-tight flex-shrink-0">
                        TalkNest
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-400">
                        <Link href="/" className="hover:text-white hover:bg-gray-800 transition-all px-4 py-2 rounded-lg">Home</Link>
                        <Link href="/popular" className="hover:text-white hover:bg-gray-800 transition-all px-4 py-2 rounded-lg">Popular</Link>
                        <Link href="/all" className="hover:text-white hover:bg-gray-800 transition-all px-4 py-2 rounded-lg">All</Link>
                    </div>

                    {/* Right side - Search & Auth */}
                    <div className="flex items-center gap-3">
                        {/* Search - hidden on mobile */}
                        <div className="hidden lg:flex items-center relative group">
                            <Search className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 xl:w-64 transition-all text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Auth buttons */}
                        {session ? (
                            <UserMenu user={session.user} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2">
                                    Log In
                                </Link>
                                <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden border-t border-gray-800 py-2 flex gap-2">
                    <Link href="/" className="flex-1 text-center hover:bg-gray-800 transition-all px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white">Home</Link>
                    <Link href="/popular" className="flex-1 text-center hover:bg-gray-800 transition-all px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white">Popular</Link>
                    <Link href="/all" className="flex-1 text-center hover:bg-gray-800 transition-all px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white">All</Link>
                </div>
            </div>
        </nav>
    );
}
