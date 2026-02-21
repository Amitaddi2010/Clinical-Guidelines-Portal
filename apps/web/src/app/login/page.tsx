"use client";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import { useEffect } from "react";

export default function LoginPage() {
    const { login, isAuthenticated, hasHydrated } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (hasHydrated && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [hasHydrated, isAuthenticated, router]);

    const handleNICLogin = async () => {
        setIsLoading(true);
        // Simulate SAML SSO redirect/callback flow checking against the backed stub
        setTimeout(() => {
            // Mocking the backend token & user extraction
            login({
                id: 'usr_abc123',
                email: 'author@icmr.gov.in',
                name: 'Dr. Ananya Sharma',
                role: 'Guideline Admin',
                department: 'Epidemiology'
            }, 'mock_jwt_token');
            // After successful SSO, redirect to the dashboard
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-navy-900 p-6 text-center">
                        <Shield className="w-12 h-12 text-gold-500 mx-auto mb-3" />
                        <h1 className="text-2xl font-serif font-bold text-white mb-1">Author Portal</h1>
                        <p className="text-navy-200 text-sm">Sign in to manage ICMR Clinical Guidelines</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-base font-semibold text-slate-800 mb-2">Government & ICMR Staff</h2>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                    Access to the guideline authoring platform requires authentication via the National Informatics Centre (NIC) Single Sign-On.
                                </p>
                                <button
                                    onClick={handleNICLogin}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-navy-600 hover:bg-navy-700 text-white py-3 px-4 rounded-md font-medium transition-all shadow-sm disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign in with Parichay (NIC SSO)
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="relative pt-6 border-t border-slate-200">
                                <h3 className="text-sm font-semibold text-slate-800 mb-2">Guest Reviewers</h3>
                                <p className="text-xs text-slate-500 mb-3">
                                    If you were invited to review a guideline as an external expert, click below to enter your secure access token.
                                </p>
                                <button className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
                                    Use Reviewer Token
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            Having trouble signing in? <a href="#" className="text-navy-600 hover:underline">Contact IT Support</a>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
