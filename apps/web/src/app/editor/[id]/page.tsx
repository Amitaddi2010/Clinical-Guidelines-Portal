"use client";
import { Header } from "@/components/common/Header";
import { RecommendationsTab } from "@/components/editor/RecommendationsTab";
import { EvidenceTab } from "@/components/editor/EvidenceTab";
import { ReferencesTab } from "@/components/editor/ReferencesTab";
import { Settings, Send } from "lucide-react";
import { useState } from "react";

export default function GuidelineEditor() {
    const [activeTab, setActiveTab] = useState("recommendations");

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            <Header />

            {/* Editor Main Toolbar */}
            <div className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-20 relative">
                <div className="flex justify-between items-center px-4 md:px-6 h-14">

                    <div className="flex items-center gap-4 border-r border-slate-200 pr-4">
                        <h1 className="font-bold font-serif text-navy-900 truncate max-w-[200px] sm:max-w-xs md:max-w-sm">
                            National Guidelines for Infection Prevention
                        </h1>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded border border-slate-200 hidden sm:inline-block">
                            Draft
                        </span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex h-full flex-1 ml-4 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('recommendations')}
                            className={`px-4 flex items-center h-full text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'recommendations' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Recommendations
                        </button>
                        <button
                            onClick={() => setActiveTab('evidence')}
                            className={`px-4 flex items-center h-full text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'evidence' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Evidence (PICO)
                        </button>
                        <button
                            onClick={() => setActiveTab('references')}
                            className={`px-4 flex items-center h-full text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'references' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            References
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                        <div className="hidden lg:flex items-center gap-2 mr-2 border-r border-slate-200 pr-4">
                            {/* Presence mock */}
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white" title="Dr. Amit">A</div>
                                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white" title="Dr. Sharma">S</div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">2 editing</span>
                        </div>

                        <button className="p-2 text-slate-500 hover:text-navy-600 hover:bg-slate-100 rounded-md transition-colors" title="Settings">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow-sm transition-colors">
                            <Send className="w-4 h-4" /> Publish
                        </button>
                    </div>
                </div >
            </div >

            {/* Main Authoring Area */}
            < div className="flex-1 overflow-hidden relative" >
                {activeTab === 'recommendations' && <RecommendationsTab />
                }
                {activeTab === 'evidence' && <EvidenceTab />}
                {activeTab === 'references' && <ReferencesTab />}
            </div >
        </div >
    );
}
