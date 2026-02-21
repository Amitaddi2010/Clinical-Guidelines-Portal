"use client";
import Link from "next/link";
import { Search, Globe, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function Header() {
    const { isAuthenticated, logout, user, hasHydrated } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    // Prevent hydration mismatch by waiting for store to hydrate
    const isAuth = hasHydrated && isAuthenticated;
    const currentUser = hasHydrated ? user : null;

    return (
        <header className="w-full bg-white border-b border-gray-200">
            {/* Top Banner */}
            <div className="bg-slate-100 py-1 px-4 border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                        <span>GOVERNMENT OF INDIA</span>
                        <span className="text-gray-400">|</span>
                        <span>Official Government of India website</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#main-content" className="hover:text-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-500">
                            Skip to main content
                        </a>
                        <button className="flex items-center gap-1 hover:text-navy-600">
                            <Globe className="w-3 h-3" />
                            <span>English / हिन्दी</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("/ashoka-emblem.png")' }}></div>
                    <div>
                        <h1 className="text-xl font-bold text-navy-800 tracking-tight font-serif">
                            Indian Council of Medical Research
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Clinical Guidelines Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search guidelines..."
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 w-64"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuth ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors border border-slate-200"
                                >
                                    <User className="w-4 h-4" /> {currentUser?.name || 'Author Dashboard'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 px-2 py-2 text-sm font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="bg-navy-600 hover:bg-navy-700 text-white px-6 py-2 rounded-md text-sm font-bold transition-all shadow-sm">
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
