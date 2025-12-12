import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { getSession } from "../lib/auth";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "TalkNest - The Community Platform for Everyone",
    description: "Join the conversation, share knowledge, and connect with communities.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pb-20`}
            >
                <Navbar />
                <main className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-6">
                    {children}
                </main>
            </body>
        </html>
    );
}
