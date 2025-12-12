import { getSession } from '../../lib/auth';
import { redirect } from 'next/navigation';
import User from '../../models/User';
import connectDB from '../../lib/db';
import { SettingsForm } from '../../components/SettingsForm';

export default async function SettingsPage() {
    const session = await getSession();
    if (!session || !session.user) redirect('/login');

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) redirect('/login');

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your profile and account preferences.</p>
            </div>

            <div className="glass rounded-2xl p-8 border border-white/5">
                <SettingsForm initialBio={user.bio} />
            </div>
        </div>
    );
}
