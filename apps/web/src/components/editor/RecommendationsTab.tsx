"use client";
import { useState } from "react";
import { TipTapEditor } from "./TipTapEditor";
import { DocumentUpload } from "./DocumentUpload";
import { GripVertical, Plus, Settings2, CheckCircle2, Circle, Upload } from "lucide-react";

export function RecommendationsTab() {
    const [showSectionText, setShowSectionText] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [sectionContent, setSectionContent] = useState("<p>Healthcare-associated infections (HAIs) are a major threat to patient safety worldwide...</p>");

    return (
        <div className="flex h-full pb-20">
            {/* Sidebar: Table of Contents / Outline Builder */}
            <div className="w-72 border-r border-slate-200 bg-slate-50 overflow-y-auto">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-slate-50 z-10">
                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Sections</h3>
                    <button className="text-navy-600 hover:text-navy-800 text-sm font-medium flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
                <div className="p-2 space-y-1 text-sm">
                    {/* Mock draggable items */}
                    <div className="flex items-center gap-2 p-2 bg-navy-100 text-navy-800 rounded font-medium border border-navy-200 cursor-pointer">
                        <GripVertical className="w-4 h-4 text-navy-400" />
                        1. Introduction
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-200 text-slate-700 rounded cursor-pointer">
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        2. Standard Precautions
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-200 text-slate-700 rounded cursor-pointer pl-6">
                        <GripVertical className="w-4 h-4 text-slate-400" />
                        2.1 Hand Hygiene
                    </div>
                </div>
            </div>

            {/* Main Authoring Area */}
            <div className="flex-1 overflow-y-auto bg-white p-6 lg:p-10 relative">
                <div className="max-w-3xl mx-auto">
                    {/* Section Title Editor */}
                    <input
                        type="text"
                        defaultValue="1. Introduction"
                        className="w-full text-3xl font-serif font-bold text-navy-900 border-none outline-none focus:ring-0 p-0 mb-6 bg-transparent placeholder-slate-300"
                        placeholder="Section Title"
                    />

                    {/* Section Background Text Toggle */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <span className="text-sm font-bold text-slate-700">Section Background Text</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowUpload(!showUpload)}
                                className="text-sm text-navy-600 hover:underline flex items-center gap-1"
                            >
                                <Upload className="w-4 h-4" /> Upload Document
                            </button>
                            <button
                                onClick={() => setShowSectionText(!showSectionText)}
                                className="text-sm text-navy-600 hover:underline flex items-center gap-1"
                            >
                                <Settings2 className="w-4 h-4" /> {showSectionText ? "Hide" : "Show"} Text
                            </button>
                        </div>
                    </div>

                    {showUpload && (
                        <div className="mb-6">
                            <DocumentUpload onExtract={(content) => {
                                setSectionContent(content);
                                setShowUpload(false);
                                setShowSectionText(true);
                            }} />
                        </div>
                    )}

                    {showSectionText && (
                        <div className="mb-10">
                            <TipTapEditor content={sectionContent} onChange={setSectionContent} />
                        </div>
                    )}

                    {/* Recommendations List Container */}
                    <div className="mb-6 flex justify-between items-end">
                        <h3 className="text-xl font-bold font-serif text-slate-800">Recommendations</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Mock Recommendation Editor Card */}
                        <div className="border border-slate-300 rounded-lg bg-white shadow-sm hover:border-slate-400 transition-colors">
                            <div className="flex items-center gap-2 p-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                                <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                                <span className="font-bold text-slate-700 text-sm">Recommendation 1</span>

                                <div className="ml-auto flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> Content</span>
                                    <span className="flex items-center gap-1 text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> GRADE</span>
                                    <span className="flex items-center gap-1 text-slate-400"><Circle className="w-4 h-4" /> Evidence Linked</span>
                                </div>
                            </div>

                            <div className="p-5 space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendation Text</label>
                                    <TipTapEditor content="<p>We recommend that healthcare workers in all settings should routinely perform hand hygiene using an alcohol-based hand rub (ABHR) if hands are not visibly soiled.</p>" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-md">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GRADE Strength</label>
                                        <select className="w-full text-sm border-slate-300 rounded p-2 focus:ring-navy-500 focus:border-navy-500">
                                            <option>Strong For</option>
                                            <option>Conditional For</option>
                                            <option>Conditional Against</option>
                                            <option>Strong Against</option>
                                            <option>Best Practice Statement</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Certainty of Evidence</label>
                                        <select className="w-full text-sm border-slate-300 rounded p-2 focus:ring-navy-500 focus:border-navy-500">
                                            <option>High (⊕⊕⊕⊕)</option>
                                            <option>Moderate (⊕⊕⊕○)</option>
                                            <option>Low (⊕⊕○○)</option>
                                            <option>Very Low (⊕○○○)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rationale</label>
                                    <TipTapEditor content="<p>Hand hygiene is the most effective measure to prevent the transmission of healthcare-associated pathogens.</p>" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Remarks (Optional)</label>
                                    <TipTapEditor content="<p>Ensure ABHR dispensers are available at the point of care.</p>" />
                                </div>
                            </div>
                        </div>

                        {/* Add Recommendation Button */}
                        <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-navy-400 hover:text-navy-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" /> Add new recommendation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
