'use client';

import { Trash2 } from 'lucide-react';
import { deletePost } from '../app/actions';

export function DeletePostButton({ postId }) {
    const handleDelete = async (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            await deletePost(postId);
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-full transition-all font-medium"
            >
                <Trash2 className="w-5 h-5" />
                Delete
            </button>
        </form>
    );
}
