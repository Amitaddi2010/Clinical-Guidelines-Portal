"use client";
import { useState, useEffect, useCallback } from "react";
import { TipTapEditor } from "./TipTapEditor";
import { DocumentUpload } from "./DocumentUpload";
import { GripVertical, Plus, Settings2, CheckCircle2, Circle, Upload } from "lucide-react";

export function RecommendationsTab({ guideline }: { guideline: any }) {
    const [showSectionText, setShowSectionText] = useState(true);
    const [showUpload, setShowUpload] = useState(false);

    // Sort sections by order_index and default to the first one
    const sortedSections = guideline?.sections?.sort((a: any, b: any) => a.order_index - b.order_index) || [];
    const [activeSectionId, setActiveSectionId] = useState<string | null>(sortedSections.length > 0 ? sortedSections[0].id : null);

    const activeSection = sortedSections.find((s: any) => s.id === activeSectionId);

    const [sectionContent, setSectionContent] = useState(
        activeSection?.content_html || "<p>Select or create a section to begin editing.</p>"
    );
    const [isSaving, setIsSaving] = useState(false);

    // Sync content when active section changes
    useEffect(() => {
        if (activeSection) {
            setSectionContent(activeSection.content_html || "");
            setShowSectionText(true);
        }
    }, [activeSectionId]);

    const saveSectionContent = async (newHtml: string) => {
        if (!activeSectionId || !guideline?.id) return;

        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/guidelines/${guideline.id}/sections/${activeSectionId}/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content_html: newHtml })
            });

            if (!res.ok) throw new Error("Failed to save section");

            // Optionally update local guideline state here, but react state is sufficient for now
        } catch (error) {
            console.error("Error saving section:", error);
            // Ignore alert to avoid blocking UI during auto-save
        } finally {
            setIsSaving(false);
        }
    };

    const saveRecommendation = async (recId: string, field: string, value: any) => {
        if (!activeSectionId || !guideline?.id) return;

        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/guidelines/${guideline.id}/sections/${activeSectionId}/recommendations/${recId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });

            if (!res.ok) throw new Error("Failed to save recommendation");
        } catch (error) {
            console.error("Error saving recommendation:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const addRecommendation = async () => {
        if (!activeSectionId || !guideline?.id) return;

        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/guidelines/${guideline.id}/sections/${activeSectionId}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: "" })
            });

            if (!res.ok) throw new Error("Failed to create recommendation");
            const newRec = await res.json();

            // Optimistically update the local activeSection so the new block appears immediately
            if (activeSection) {
                if (!activeSection.recommendations) {
                    activeSection.recommendations = [];
                }
                activeSection.recommendations.push(newRec);
                // Trigger a re-render
                setActiveSectionId(null);
                setTimeout(() => setActiveSectionId(activeSection.id), 0);
            }
        } catch (error) {
            console.error("Error creating recommendation:", error);
            alert("Failed to create new recommendation");
        } finally {
            setIsSaving(false);
        }
    };

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
                    {sortedSections.length === 0 && (
                        <div className="text-slate-500 italic p-3 text-xs text-center border border-dashed border-slate-300 mx-2 my-2 rounded">
                            No sections yet
                        </div>
                    )}
                    {sortedSections.map((section: any, idx: number) => {
                        const isActive = activeSectionId === section.id;
                        return (
                            <div
                                key={section.id}
                                onClick={() => setActiveSectionId(section.id)}
                                className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${isActive
                                    ? "bg-navy-100 text-navy-800 font-medium border border-navy-200"
                                    : "hover:bg-slate-200 text-slate-700 border border-transparent"
                                    }`}
                            >
                                <GripVertical className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? "text-navy-400" : "text-slate-400"}`} />
                                <span className="leading-snug">{idx + 1}. {section.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Authoring Area */}
            <div className="flex-1 overflow-y-auto bg-white p-6 lg:p-10 relative">
                <div className="max-w-3xl mx-auto">
                    {/* Section Title Editor */}
                    <input
                        type="text"
                        value={activeSection?.title || "Untitled Section"}
                        onChange={(e) => {
                            // Local state mutation for immediate feedback (will be replaced by API call later)
                        }}
                        className="w-full text-3xl font-serif font-bold text-navy-900 border-none outline-none focus:ring-0 p-0 mb-6 bg-transparent placeholder-slate-300"
                        placeholder="Section Title"
                        disabled={!activeSection}
                    />

                    {/* Section Background Text Toggle */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-700">Section Background Text</span>
                            {isSaving && <span className="text-xs text-navy-500 font-medium flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-navy-500 animate-pulse"></div> Saving...</span>}
                        </div>
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
                        <div className="mb-10 relative">
                            <TipTapEditor
                                content={sectionContent}
                                onChange={(newContent) => {
                                    setSectionContent(newContent);
                                    // In a real app, wrap this in a debounce
                                    saveSectionContent(newContent);
                                }}
                            />
                        </div>
                    )}

                    {/* Recommendations List Container */}
                    <div className="mb-6 flex justify-between items-end">
                        <h3 className="text-xl font-bold font-serif text-slate-800">Recommendations</h3>
                    </div>

                    <div className="space-y-6">
                        {!activeSection?.recommendations?.length && (
                            <div className="text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
                                No recommendations in this section yet.
                            </div>
                        )}
                        {activeSection?.recommendations?.map((rec: any, index: number) => (
                            <div key={rec.id} className="border border-slate-300 rounded-lg bg-white shadow-sm hover:border-slate-400 transition-colors">
                                <div className="flex items-center gap-2 p-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                                    <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                                    <span className="font-bold text-slate-700 text-sm">Recommendation {index + 1}</span>

                                    <div className="ml-auto flex items-center gap-4 text-sm">
                                        <span className={`flex items-center gap-1 ${rec.text ? 'text-slate-600' : 'text-slate-400'}`}><CheckCircle2 className={`w-4 h-4 ${rec.text ? 'text-green-500' : 'text-slate-300'}`} /> Content</span>
                                        <span className={`flex items-center gap-1 ${rec.strength ? 'text-slate-600' : 'text-slate-400'}`}><CheckCircle2 className={`w-4 h-4 ${rec.strength ? 'text-green-500' : 'text-slate-300'}`} /> GRADE</span>
                                        <span className="flex items-center gap-1 text-slate-400"><Circle className="w-4 h-4" /> Evidence Linked</span>
                                    </div>
                                </div>

                                <div className="p-5 space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommendation Text</label>
                                        <TipTapEditor
                                            content={rec.text || ""}
                                            onChange={(newVal) => saveRecommendation(rec.id, 'text', newVal)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-md">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GRADE Strength</label>
                                            <select
                                                className="w-full text-sm border-slate-300 rounded p-2 focus:ring-navy-500 focus:border-navy-500"
                                                defaultValue={rec.strength || ""}
                                                onChange={(e) => saveRecommendation(rec.id, 'strength', e.target.value)}
                                            >
                                                <option value="">Select Strength...</option>
                                                <option value="STRONG_FOR">Strong For</option>
                                                <option value="CONDITIONAL_FOR">Conditional For</option>
                                                <option value="CONDITIONAL_AGAINST">Conditional Against</option>
                                                <option value="STRONG_AGAINST">Strong Against</option>
                                                <option value="GOOD_PRACTICE">Good Practice Statement</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Certainty of Evidence</label>
                                            <select
                                                className="w-full text-sm border-slate-300 rounded p-2 focus:ring-navy-500 focus:border-navy-500"
                                                defaultValue={rec.evidence_level || ""}
                                                onChange={(e) => saveRecommendation(rec.id, 'evidence_level', e.target.value)}
                                            >
                                                <option value="">Select Certainty...</option>
                                                <option value="HIGH">High (⊕⊕⊕⊕)</option>
                                                <option value="MODERATE">Moderate (⊕⊕⊕○)</option>
                                                <option value="LOW">Low (⊕⊕○○)</option>
                                                <option value="VERY_LOW">Very Low (⊕○○○)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rationale</label>
                                        <TipTapEditor
                                            content={rec.rationale || ""}
                                            onChange={(newVal) => saveRecommendation(rec.id, 'rationale', newVal)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Remarks (Optional)</label>
                                        <TipTapEditor
                                            content={rec.remarks || ""}
                                            onChange={(newVal) => saveRecommendation(rec.id, 'remarks', newVal)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Recommendation Button */}
                        <button
                            onClick={addRecommendation}
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-navy-400 hover:text-navy-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!activeSection || isSaving}
                        >
                            <Plus className="w-5 h-5" /> Add new recommendation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
