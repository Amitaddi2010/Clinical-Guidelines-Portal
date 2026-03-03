"use client";
import { Search, Plus, Upload, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ReferencesTab({ guideline }: { guideline: any }) {
    const [references, setReferences] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pmidInput, setPmidInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!guideline?.id) return;
        const fetchRefs = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`http://localhost:3000/guidelines/${guideline.id}/references`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReferences(data);
                }
            } catch (error) {
                console.error("Failed to fetch references", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRefs();
    }, [guideline?.id]);

    const addReference = async (customData?: any) => {
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const payload = customData || { title: "New Reference", authors: [], year: new Date().getFullYear(), reference_type: "other" };
            const res = await fetch(`http://localhost:3000/guidelines/${guideline.id}/references`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to create reference");
            const newRef = await res.json();
            setReferences(prev => [newRef, ...prev]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const saveReference = async (id: string, field: string, value: any) => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/guidelines/${guideline.id}/references/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ [field]: value })
            });
            if (!res.ok) throw new Error("Failed to update reference");
            setReferences(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReference = async (id: string) => {
        if (!confirm("Are you sure you want to delete this reference?")) return;
        setIsSaving(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            const res = await fetch(`http://localhost:3000/guidelines/${guideline.id}/references/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete reference");
            setReferences(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const fetchPubMed = async () => {
        if (!pmidInput) return;
        setIsSaving(true);
        // Mock PubMed Fetcher
        setTimeout(() => {
            const mockedRef = {
                title: `Mocked PubMed Article for PMID ${pmidInput}`,
                authors: ["Smith J", "Doe A"],
                journal: "The Lancet",
                year: 2023,
                pubmed_id: pmidInput,
                reference_type: "systematic_review"
            };
            addReference(mockedRef);
            setPmidInput("");
        }, 1000);
    };

    const filteredReferences = references.filter(r =>
        (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.pubmed_id || "").includes(searchTerm)
    );
    return (
        <div className="flex flex-col h-full bg-slate-50 p-6 lg:p-10">
            <div className="max-w-6xl mx-auto w-full space-y-6">

                {/* Header and Actions */}
                <div className="flex justify-between items-end pb-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-1">Bibliography</h2>
                        <p className="text-sm text-slate-500">Manage all references cited in this guideline.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <Upload className="w-4 h-4 text-slate-500" /> Import RIS
                        </button>
                        <button onClick={() => addReference()} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-md text-sm font-medium hover:bg-navy-700 transition-colors shadow-sm disabled:opacity-50">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Reference
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search references by title, author, or PMID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                    <div className="shrink-0 flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-2 border border-slate-200 rounded-md">
                        <span>Search NCBI PubMed:</span>
                        <input type="text" value={pmidInput} onChange={e => setPmidInput(e.target.value)} placeholder="Enter PMID" className="w-32 px-2 py-1 rounded bg-white border border-slate-300 focus:outline-none text-xs" />
                        <button onClick={fetchPubMed} disabled={!pmidInput || isSaving} className="bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50 font-medium z-10 disabled:opacity-50">Fetch</button>
                    </div>
                </div>

                {/* References List */}
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left text-slate-700">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Citation</th>
                                <th className="px-6 py-4 w-40 text-center">Type</th>
                                <th className="px-6 py-4 w-32 text-center">Linked Links</th>
                                <th className="px-6 py-4 w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-500">Loading references...</td></tr>
                            ) : filteredReferences.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-10 text-slate-500">No references found.</td></tr>
                            ) : filteredReferences.map((ref: any, idx: number) => (
                                <tr key={ref.id || idx} className="hover:bg-slate-50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 mb-1">
                                            <input
                                                className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none"
                                                defaultValue={ref.title || ""}
                                                onBlur={(e) => saveReference(ref.id, 'title', e.target.value)}
                                                placeholder="Enter title..."
                                            />
                                        </div>
                                        <div className="text-slate-600 text-xs flex gap-2 items-center">
                                            <input
                                                className="w-1/3 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none"
                                                defaultValue={(ref.authors || []).join(", ")}
                                                onBlur={(e) => saveReference(ref.id, 'authors', e.target.value.split(',').map(s => s.trim()))}
                                                placeholder="Authors (comma separated)"
                                            />
                                            <input
                                                className="w-1/4 italic bg-transparent border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none"
                                                defaultValue={ref.journal || ""}
                                                onBlur={(e) => saveReference(ref.id, 'journal', e.target.value)}
                                                placeholder="Journal"
                                            />
                                            <input
                                                type="number"
                                                className="w-16 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none"
                                                defaultValue={ref.year || ""}
                                                onBlur={(e) => saveReference(ref.id, 'year', parseInt(e.target.value))}
                                                placeholder="Year"
                                            />
                                        </div>
                                        <div className="mt-1 flex gap-2 items-center">
                                            <span className="text-xs font-semibold text-slate-500">PMID:</span>
                                            <input
                                                className="text-xs text-navy-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-navy-500 focus:outline-none"
                                                defaultValue={ref.pubmed_id || ""}
                                                onBlur={(e) => saveReference(ref.id, 'pubmed_id', e.target.value)}
                                                placeholder="ID"
                                            />
                                            {ref.pubmed_id && (
                                                <a href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}`} target="_blank" rel="noreferrer" className="text-xs text-navy-600 hover:underline border border-navy-200 px-1.5 rounded-sm ml-2 bg-navy-50">View↗</a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center align-top pt-5">
                                        <select
                                            className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded whitespace-nowrap focus:outline-none"
                                            defaultValue={ref.reference_type || "other"}
                                            onChange={(e) => saveReference(ref.id, 'reference_type', e.target.value)}
                                        >
                                            <option value="systematic_review">Sys. Review</option>
                                            <option value="rct">RCT</option>
                                            <option value="observational">Observational</option>
                                            <option value="guideline">Guideline</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center align-top pt-5">
                                        <span className="text-xs text-slate-400 italic">No links yet</span>
                                    </td>
                                    <td className="px-6 py-4 align-top pt-5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <button onClick={() => deleteReference(ref.id)} className="hover:text-red-600 font-medium text-sm">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
