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
                    <div className="w-12 h-16 flex items-center justify-center">
                        <svg viewBox="0 0 80 100" className="w-10 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Ashoka Emblem - Lion Capital stylized */}
                            {/* Top crown / abacus with lions */}
                            <circle cx="40" cy="18" r="12" fill="#1B365D" stroke="#B8860B" strokeWidth="1.5" />
                            <text x="40" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B8860B">☸</text>
                            {/* Pillar body */}
                            <rect x="30" y="30" width="20" height="8" rx="2" fill="#1B365D" />
                            <rect x="28" y="36" width="24" height="3" rx="1" fill="#B8860B" />
                            {/* Lion figures - simplified */}
                            <path d="M24 30 L40 10 L56 30" stroke="#B8860B" strokeWidth="1.5" fill="none" />
                            <circle cx="32" cy="14" r="3" fill="#B8860B" opacity="0.8" />
                            <circle cx="48" cy="14" r="3" fill="#B8860B" opacity="0.8" />
                            {/* Dharma Chakra */}
                            <circle cx="40" cy="52" r="10" stroke="#B8860B" strokeWidth="1.5" fill="none" />
                            <circle cx="40" cy="52" r="2" fill="#B8860B" />
                            {[...Array(24)].map((_, i) => (
                                <line key={i} x1="40" y1="44" x2="40" y2="42" stroke="#B8860B" strokeWidth="0.5"
                                    transform={`rotate(${i * 15} 40 52)`} />
                            ))}
                            {/* Base */}
                            <path d="M20 65 Q40 72 60 65" stroke="#1B365D" strokeWidth="2" fill="none" />
                            {/* Text: Satyameva Jayate */}
                            <text x="40" y="82" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#1B365D" fontFamily="serif">
                                सत्यमेव जयते
                            </text>
                        </svg>
                    </div>
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
