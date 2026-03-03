"use client";
import { Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function EvidenceTab({ guideline }: { guideline: any }) {
    const [allPicos, setAllPicos] = useState<any[]>([]);
    const [activePicoId, setActivePicoId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newPicoRecId, setNewPicoRecId] = useState("");

    const allRecommendations = guideline?.sections?.flatMap((s: any) => s.recommendations || []) || [];

    useEffect(() => {
        if (guideline) {
            const picos = guideline.sections?.flatMap((s: any) =>
                s.recommendations?.flatMap((r: any) =>
                    (r.picos || []).map((p: any) => ({ ...p, recommendation: r }))
                ) || []
            ) || [];

            picos.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            setAllPicos(picos);

            if (!activePicoId && picos.length > 0) {
                setActivePicoId(picos[0].id);
            }
        }
    }, [guideline]); // Omit activePicoId to avoid loop resetting

    const activePico = allPicos.find(p => p.id === activePicoId);

    const savePico = async (field: string, value: string) => {
        if (!activePicoId) return;
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/evidence/picos/${activePicoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ [field]: value })
            });
            if (!res.ok) throw new Error("Failed to save PICO");
            setAllPicos(prev => prev.map(p => p.id === activePicoId ? { ...p, [field]: value } : p));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreatePico = async () => {
        if (!newPicoRecId) return;
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/evidence/recommendations/${newPicoRecId}/picos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ population: "New Population", intervention: "New Intervention", comparator: "", outcome: "" })
            });
            if (!res.ok) throw new Error("Failed to create PICO");
            const newPico = await res.json();
            const rec = allRecommendations.find((r: any) => r.id === newPicoRecId);
            const fullPico = { ...newPico, recommendation: rec };

            setAllPicos(prev => [...prev, fullPico]);
            setActivePicoId(newPico.id);
            setShowNewForm(false);
            setNewPicoRecId("");
        } catch (error) {
            console.error(error);
            alert("Failed to create PICO");
        } finally {
            setIsSaving(false);
        }
    };

    const addEvidenceSummary = async () => {
        if (!activePicoId) return;
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/evidence/picos/${activePicoId}/evidence-summaries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ outcome_name: "New Outcome", certainty: "LOW", importance: "IMPORTANT" })
            });
            if (!res.ok) throw new Error("Failed to create Evidence Summary");
            const newSummary = await res.json();

            setAllPicos(prev => prev.map(p => {
                if (p.id === activePicoId) {
                    return { ...p, evidence_summaries: [...(p.evidence_summaries || []), newSummary] };
                }
                return p;
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to create Outcome row");
        } finally {
            setIsSaving(false);
        }
    };

    const saveEvidenceSummary = async (summaryId: string, field: string, value: any) => {
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/evidence/evidence-summaries/${summaryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ [field]: value })
            });
            if (!res.ok) throw new Error("Failed to update Evidence Summary");

            setAllPicos(prev => prev.map(p => {
                if (p.id === activePicoId) {
                    return {
                        ...p,
                        evidence_summaries: p.evidence_summaries.map((s: any) => s.id === summaryId ? { ...s, [field]: value } : s)
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEvidenceSummary = async (summaryId: string) => {
        if (!confirm("Are you sure you want to delete this outcome?")) return;
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/evidence/evidence-summaries/${summaryId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete Evidence Summary");

            setAllPicos(prev => prev.map(p => {
                if (p.id === activePicoId) {
                    return {
                        ...p,
                        evidence_summaries: p.evidence_summaries.filter((s: any) => s.id !== summaryId)
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-full bg-slate-50 pb-20">
            {/* Sidebar: PICO List */}
            <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
                <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">PICO Questions</h3>
                        <button onClick={() => setShowNewForm(!showNewForm)} className="text-navy-600 hover:text-navy-800 text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> {showNewForm ? 'Cancel' : 'New'}
                        </button>
                    </div>
                    {showNewForm && (
                        <div className="mt-3 p-3 bg-slate-100 rounded border border-slate-200 text-sm space-y-2">
                            <label className="block text-xs font-bold text-slate-600">Select Recommendation</label>
                            <select
                                className="w-full p-1.5 border rounded border-slate-300"
                                value={newPicoRecId}
                                onChange={(e) => setNewPicoRecId(e.target.value)}
                            >
                                <option value="">-- Select --</option>
                                {allRecommendations.map((r: any, idx: number) => (
                                    <option key={r.id} value={r.id}>
                                        Rec {idx + 1}: {r.text ? r.text.replace(/<[^>]+>/g, '').substring(0, 30) + '...' : 'Untitled'}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleCreatePico}
                                disabled={!newPicoRecId || isSaving}
                                className="w-full bg-navy-600 text-white py-1.5 rounded hover:bg-navy-700 disabled:opacity-50"
                            >
                                Create PICO
                            </button>
                        </div>
                    )}
                    <div className="relative mt-3">
                        <input
                            type="text"
                            placeholder="Search PICOs..."
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-navy-500"
                        />
                        <Search className="absolute left-2.5 top-2 text-slate-400 w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full p-2 space-y-2 text-sm">
                    {allPicos.map((pico: any) => (
                        <div
                            key={pico.id}
                            onClick={() => setActivePicoId(pico.id)}
                            className={`p-3 border rounded-md cursor-pointer transition-colors shadow-sm ${activePicoId === pico.id ? 'border-navy-300 bg-navy-50' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <div className={`font-bold mb-1 leading-tight ${activePicoId === pico.id ? 'text-navy-900' : 'text-slate-700'}`}>
                                {pico.intervention || "Untitled"} {pico.comparator ? `vs ${pico.comparator}` : ''}
                            </div>
                            <div className={`text-xs font-medium ${activePicoId === pico.id ? 'text-navy-700' : 'text-slate-500'}`}>
                                Linked to: Recommendation {pico.recommendation?.id?.substring(0, 6)}
                            </div>
                        </div>
                    ))}
                    {allPicos.length === 0 && !showNewForm && (
                        <div className="text-center p-4 text-slate-500 text-sm">No PICO questions found. Create one to get started.</div>
                    )}
                </div>
            </div>

            {/* Main Evidence Area: PICO Config and SoF */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-10 relative">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* PICO Definition */}
                    <div className="bg-white border text-sm border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-slate-100 p-4 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                            PICO Definition
                            <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50">Link to Recommendation</button>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Population</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded text-sm focus:ring-navy-500 focus:border-navy-500" defaultValue={activePico?.population || ""} onBlur={(e) => savePico('population', e.target.value)} key={`pop-${activePico?.id}`} disabled={!activePico} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Intervention</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded text-sm focus:ring-navy-500 focus:border-navy-500" defaultValue={activePico?.intervention || ""} onBlur={(e) => savePico('intervention', e.target.value)} key={`int-${activePico?.id}`} disabled={!activePico} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comparator</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded text-sm focus:ring-navy-500 focus:border-navy-500" defaultValue={activePico?.comparator || ""} onBlur={(e) => savePico('comparator', e.target.value)} key={`comp-${activePico?.id}`} disabled={!activePico} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timeframe</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded text-sm focus:ring-navy-500 focus:border-navy-500" defaultValue={activePico?.timeframe || ""} onBlur={(e) => savePico('timeframe', e.target.value)} key={`time-${activePico?.id}`} disabled={!activePico} />
                            </div>
                        </div>
                    </div>

                    {/* Summary of Findings Table Builder */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-slate-100 p-4 border-b border-slate-200 font-bold text-slate-800 flex justify-between items-center">
                            Summary of Findings (Outcomes)
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-700 border-b border-slate-200">
                                <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-semibold text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 min-w-[200px]">Outcome</th>
                                        <th className="px-4 py-3">Studies (n)</th>
                                        <th className="px-4 py-3 min-w-[150px]">Effect Estimate</th>
                                        <th className="px-4 py-3 w-[180px]">Certainty</th>
                                        <th className="px-4 py-3">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activePico?.evidence_summaries || []).map((summary: any) => (
                                        <tr key={summary.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    className="font-bold text-slate-900 bg-transparent w-full border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none mb-1"
                                                    defaultValue={summary.outcome_name || ""}
                                                    onBlur={(e) => saveEvidenceSummary(summary.id, 'outcome_name', e.target.value)}
                                                />
                                                <select
                                                    className="text-xs font-semibold uppercase bg-transparent outline-none cursor-pointer"
                                                    defaultValue={summary.importance || "IMPORTANT"}
                                                    onChange={(e) => saveEvidenceSummary(summary.id, 'importance', e.target.value)}
                                                >
                                                    <option value="CRITICAL" className="text-red-600">Critical</option>
                                                    <option value="IMPORTANT" className="text-orange-500">Important</option>
                                                    <option value="NOT_IMPORTANT" className="text-slate-500">Not Important</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        className="w-12 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none text-center"
                                                        placeholder="n"
                                                        defaultValue={summary.no_of_studies || ""}
                                                        onBlur={(e) => saveEvidenceSummary(summary.id, 'no_of_studies', parseInt(e.target.value))}
                                                    />
                                                    <span className="text-slate-400">(</span>
                                                    <input
                                                        type="number"
                                                        className="w-16 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none text-center"
                                                        placeholder="pts"
                                                        defaultValue={summary.no_of_participants || ""}
                                                        onBlur={(e) => saveEvidenceSummary(summary.id, 'no_of_participants', parseInt(e.target.value))}
                                                    />
                                                    <span className="text-slate-400">)</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    className="font-medium text-slate-800 bg-transparent w-full border-b border-transparent hover:border-slate-300 focus:outline-none mb-1"
                                                    placeholder="e.g. RR 0.65"
                                                    defaultValue={summary.effect_estimate || ""}
                                                    onBlur={(e) => saveEvidenceSummary(summary.id, 'effect_estimate', e.target.value)}
                                                />
                                                <input
                                                    className="text-xs text-slate-500 bg-transparent w-full border-b border-transparent hover:border-slate-300 focus:outline-none"
                                                    placeholder="e.g. CI 0.55-0.76"
                                                    defaultValue={summary.confidence_interval || ""}
                                                    onBlur={(e) => saveEvidenceSummary(summary.id, 'confidence_interval', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <select
                                                    className="text-sm border border-slate-200 rounded p-1 w-full bg-slate-50"
                                                    defaultValue={summary.certainty || ""}
                                                    onChange={(e) => saveEvidenceSummary(summary.id, 'certainty', e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="HIGH">High (⊕⊕⊕⊕)</option>
                                                    <option value="MODERATE">Moderate (⊕⊕⊕○)</option>
                                                    <option value="LOW">Low (⊕⊕○○)</option>
                                                    <option value="VERY_LOW">Very Low (⊕○○○)</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <button onClick={() => deleteEvidenceSummary(summary.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Empty State / Add Row */}
                                    <tr>
                                        <td colSpan={5} className="p-0">
                                            <button
                                                onClick={addEvidenceSummary}
                                                disabled={!activePico || isSaving}
                                                className="w-full py-3 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-navy-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4" /> Add Outcome
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
