"use client";
import { Search, Plus, Upload } from "lucide-react";

export function ReferencesTab() {
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-navy-600 text-white rounded-md text-sm font-medium hover:bg-navy-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" /> Add Reference
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4 items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search references by title, author, or PMID..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                    </div>
                    <div className="shrink-0 flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-2 border border-slate-200 rounded-md">
                        <span>Search NCBI PubMed:</span>
                        <input type="text" placeholder="Enter PMID" className="w-32 px-2 py-1 rounded bg-white border border-slate-300 focus:outline-none text-xs" />
                        <button className="bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50 font-medium z-10">Fetch</button>
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
                            <tr className="hover:bg-slate-50 group">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 mb-1">1. Allegranzi B, Pittet D.</div>
                                    <div className="text-slate-600">
                                        Role of diseases transmitted by contaminated hands.
                                        <span className="italic ml-1">Lancet Infect Dis</span> 2009;9(5):303-314.
                                    </div>
                                    <div className="mt-1 flex gap-2">
                                        <a href="https://pubmed.ncbi.nlm.nih.gov/19393959" className="text-xs text-navy-600 hover:underline">PMID: 19393959</a>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded whitespace-nowrap">Observational</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center justify-center bg-navy-50 text-navy-700 rounded-full w-8 h-8 font-bold text-xs ring-1 ring-navy-200">
                                        Rec 1
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <button className="hover:text-navy-600 font-medium text-sm">Edit</button>
                                        <span>|</span>
                                        <button className="hover:text-red-600 font-medium text-sm">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
