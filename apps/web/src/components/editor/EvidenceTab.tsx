"use client";
import { Search, Plus } from "lucide-react";

export function EvidenceTab() {
    return (
        <div className="flex h-full bg-slate-50 pb-20">
            {/* Sidebar: PICO List */}
            <div className="w-80 border-r border-slate-200 bg-white overflow-y-auto flex flex-col">
                <div className="p-4 border-b border-slate-200 sticky top-0 bg-white z-10 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">PICO Questions</h3>
                        <button className="text-navy-600 hover:text-navy-800 text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> New
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search PICOs..."
                            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-navy-500"
                        />
                        <Search className="absolute left-2.5 top-2 text-slate-400 w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto w-full p-2 space-y-2 text-sm">
                    {/* Active PICO */}
                    <div className="p-3 border border-navy-300 bg-navy-50 rounded-md cursor-pointer relative shadow-sm">
                        <div className="font-bold text-navy-900 mb-1 leading-tight">Hand Hygiene vs No Hand Hygiene</div>
                        <div className="text-xs text-navy-700 font-medium">Linked to: Recommendation 1</div>
                    </div>

                    {/* Inactive PICOs */}
                    <div className="p-3 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-md cursor-pointer transition-colors">
                        <div className="font-bold text-slate-700 mb-1 leading-tight">Continuous Masks vs Standard</div>
                        <div className="text-xs text-slate-500 font-medium">Linked to: Recommendation 2</div>
                    </div>
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
                                <textarea rows={2} className="w-full border-slate-300 rounded focus:ring-navy-500 focus:border-navy-500" defaultValue="Healthcare workers in all settings" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Intervention</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded focus:ring-navy-500 focus:border-navy-500" defaultValue="Alcohol-based hand rub (ABHR)" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comparator</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded focus:ring-navy-500 focus:border-navy-500" defaultValue="Handwashing with soap and water" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timeframe</label>
                                <textarea rows={2} className="w-full border-slate-300 rounded focus:ring-navy-500 focus:border-navy-500" defaultValue="Routine care" />
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
                                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-slate-900">Reduction in HAIs</div>
                                            <div className="text-xs text-red-600 font-semibold uppercase mt-0.5">Critical</div>
                                        </td>
                                        <td className="px-4 py-3">12 (4,500)</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-800">RR 0.65</div>
                                            <div className="text-xs text-slate-400">CI 0.55-0.76</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-green-600 font-bold tracking-widest text-lg">⊕⊕⊕⊕</div>
                                            <div className="text-xs font-medium text-slate-500">High</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-navy-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>

                                    {/* Empty State / Add Row */}
                                    <tr>
                                        <td colSpan={5} className="p-0">
                                            <button className="w-full py-3 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-navy-600 transition-colors flex items-center justify-center gap-2">
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
