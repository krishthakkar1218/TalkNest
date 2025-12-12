'use server'

import connectDB from '../lib/db';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import Vote from '../models/Vote';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { login, logout, getSession } from '../lib/auth';
import { redirect } from 'next/navigation';

export async function registerUser(prevState, formData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !email || !password) {
        return { error: 'All fields are required' };
    }

    await connectDB();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    const userData = {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
    };

    await login(userData);
    redirect('/');
}

export async function loginUser(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return { error: 'All fields are required' };
    }

    await connectDB();

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return { error: 'Invalid credentials' };
    }

    const userData = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
    };

    await login(userData);
    redirect('/');
}

export async function logoutUser() {
    await logout();
    redirect('/login');
}

export async function createPost(prevState, formData) {
    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const type = formData.get('type') || 'discussion';
    const sideA = formData.get('sideA');
    const sideB = formData.get('sideB');

    if (!title || !content || !category) {
        return { error: 'All fields are required' };
    }

    if (type === 'debate' && (!sideA || !sideB)) {
        return { error: 'Both debate sides must be defined' };
    }

    const session = await getSession();
    if (!session || !session.user) {
        return { error: 'You must be logged in' };
    }

    await connectDB();
    const newPost = await Post.create({
        title,
        content,
        category,
        author: session.user.id,
        type,
        debateSides: type === 'debate' ? { sideA, sideB } : undefined
    });

    redirect(`/post/${newPost._id}`);
}

export async function updateProfile(prevState, formData) {
    const session = await getSession();
    if (!session || !session.user) return { error: 'Not logged in' };

    const bio = formData.get('bio');

    await connectDB();

    try {
        await User.findByIdAndUpdate(session.user.id, { bio });
        revalidatePath('/profile');
        revalidatePath('/settings');
        return { success: 'Profile updated' };
    } catch (e) {
        return { error: 'Failed to update profile' };
    }
}
export async function addComment(formData) {
    const content = formData.get('content');
    const postId = formData.get('postId');
    const debateSide = formData.get('debateSide');

    if (!content || !postId) return;

    const session = await getSession();
    if (!session || !session.user) return;

    await connectDB();
    await Comment.create({
        content,
        post: postId,
        author: session.user.id,
        debateSide: debateSide || undefined
    });

    revalidatePath(`/post/${postId}`);
}

export async function vote(id, type, voteType) {
    const session = await getSession();
    if (!session || !session.user) return;

    await connectDB();

    // FOR DEBATE COMMENTS: Check if user has voted on opposite side
    if (type === 'comment') {
        const comment = await Comment.findById(id).populate('post');
        if (comment && comment.post && comment.post.type === 'debate' && comment.debateSide) {
            // Get all user's votes on this debate's comments
            const allComments = await Comment.find({ post: comment.post._id }).select('_id debateSide');
            const commentIds = allComments.map(c => c._id);
            const userVotes = await Vote.find({
                user: session.user.id,
                comment: { $in: commentIds }
            }).populate('comment');

            // Check if user has voted on the opposite side
            for (const vote of userVotes) {
                if (vote.comment && vote.comment.debateSide && vote.comment.debateSide !== comment.debateSide) {
                    return { error: `You've already voted on Side ${vote.comment.debateSide}. You can only support one side in a debate.` };
                }
            }
        }
    }

    // Check if vote exists
    const existingVote = await Vote.findOne({
        user: session.user.id,
        [type === 'post' ? 'post' : 'comment']: id
    });

    if (existingVote) {
        if (existingVote.type === voteType) {
            // Toggle off (remove vote)
            await Vote.findByIdAndDelete(existingVote._id);
            // Decrement counter on target
            if (type === 'post') {
                await Post.findByIdAndUpdate(id, { $inc: { [voteType === 'up' ? 'upvotes' : 'downvotes']: -1 } });
            } else {
                await Comment.findByIdAndUpdate(id, { $inc: { [voteType === 'up' ? 'upvotes' : 'downvotes']: -1 } });
            }
        } else {
            // Change vote
            existingVote.type = voteType;
            await existingVote.save();
            // Adjust counters (remove old, add new)
            const oldType = voteType === 'up' ? 'down' : 'up';
            if (type === 'post') {
                await Post.findByIdAndUpdate(id, { $inc: { [oldType + 'votes']: -1, [voteType + 'votes']: 1 } });
            } else {
                await Comment.findByIdAndUpdate(id, { $inc: { [oldType + 'votes']: -1, [voteType + 'votes']: 1 } });
            }
        }
    } else {
        // New vote
        await Vote.create({
            user: session.user.id,
            [type === 'post' ? 'post' : 'comment']: id,
            type: voteType
        });
        if (type === 'post') {
            await Post.findByIdAndUpdate(id, { $inc: { [voteType + 'votes']: 1 } });
        } else {
            await Comment.findByIdAndUpdate(id, { $inc: { [voteType + 'votes']: 1 } });
        }
    }

    // Rough revalidation - ideally we'd know the path better
    // For now we assume we are on the post page or home page
    revalidatePath('/');
    // We can't easily valid dynamic path without ID passing, but usually client sees update optimistically or on refresh
}

// Community Actions
import Community from "../models/Community";

export async function createCommunity(currentState, formData) {
    const session = await getSession();
    if (!session || !session.user) {
        return { error: 'You must be logged in.' };
    }

    const name = formData.get('name');
    const description = formData.get('description');

    if (!name || name.length < 3) return { error: 'Name must be at least 3 chars.' };
    const cleanName = name.toLowerCase().trim().replace(/\s+/g, '');

    if (cleanName.length < 3) return { error: 'Community name too short after formatting.' };

    await connectDB();

    // Check exist
    const existing = await Community.findOne({ name: cleanName });
    if (existing) return { error: 'Community already exists.' };

    try {
        const community = await Community.create({
            name: cleanName,
            description,
            creator: session.user.id,
            membersCount: 1 // Creator auto-joins
        });

        // Auto-join user
        const user = await User.findById(session.user.id);
        if (!user.joinedCommunities) user.joinedCommunities = [];
        if (!user.joinedCommunities.includes(cleanName)) {
            user.joinedCommunities.push(cleanName);
            await user.save();
        }

        revalidatePath('/');
    } catch (e) {
        console.error('Community Creation Error:', e);
        if (e.name === 'ValidationError') {
            const messages = Object.values(e.errors).map(val => val.message);
            return { error: messages[0] };
        }
        if (e.code === 11000) {
            return { error: 'Community already exists.' };
        }
        return { error: 'Failed to create community.' };
    }

    redirect(`/c/${cleanName}`);
}

export async function joinCommunity(communityName) {
    const session = await getSession();
    if (!session || !session.user) return;

    await connectDB();

    // Verify community exists
    const community = await Community.findOne({ name: communityName });
    if (!community) return; // Can't join non-existent community (or arguably should create it? No, explicit create is better)

    const user = await User.findById(session.user.id);
    if (!user.joinedCommunities) user.joinedCommunities = [];

    if (user.joinedCommunities.includes(communityName)) {
        // Leave
        user.joinedCommunities = user.joinedCommunities.filter(c => c !== communityName);
        await user.save();

        // Decrement count
        await Community.findByIdAndUpdate(community._id, { $inc: { membersCount: -1 } });
    } else {
        // Join
        user.joinedCommunities.push(communityName);
        await user.save();

        // Increment count
        await Community.findByIdAndUpdate(community._id, { $inc: { membersCount: 1 } });
    }

    revalidatePath('/');
}

export async function deletePost(postId) {
    const session = await getSession();
    if (!session || !session.user) return { error: 'Not logged in' };

    await connectDB();

    // Verify user owns the post
    const post = await Post.findById(postId);
    if (!post) return { error: 'Post not found' };
    if (post.author.toString() !== session.user.id) {
        return { error: 'Unauthorized - you can only delete your own posts' };
    }

    // Delete all associated data
    await Comment.deleteMany({ post: postId });
    await Vote.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);

    revalidatePath('/');
    redirect('/');
}
