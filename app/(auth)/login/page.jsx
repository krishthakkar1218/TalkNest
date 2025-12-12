'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginUser } from '../../actions';
import { Loader2 } from 'lucide-react';

const initialState = {
    error: '',
};

export default function LoginPage() {
    const [state, action, isPending] = useActionState(loginUser, initialState);

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to your account
                </p>
            </div>

            <form action={action} className="space-y-6">
                {state?.error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center font-medium">
                        {state.error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-lg bg-secondary/50 border border-border px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-lg bg-secondary/50 border border-border px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/register" className="font-medium text-primary hover:text-blue-400 transition-colors">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
