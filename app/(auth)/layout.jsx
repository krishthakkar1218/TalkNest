export default function AuthLayout({ children }) {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl shadow-2xl">
                {children}
            </div>
        </div>
    );
}
