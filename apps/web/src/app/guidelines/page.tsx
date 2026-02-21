"use client";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FileText, Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GuidelinesList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [guidelines, setGuidelines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGuidelines();
    }, []);

    const fetchGuidelines = async () => {
        try {
            const response = await fetch('http://localhost:3000/guidelines');
            const data = await response.json();
            setGuidelines(data);
        } catch (error) {
            console.error('Error fetching guidelines:', error);
        } finally {
            setLoading(false);
        }
    };

    const departments = [...Array.from(new Set(guidelines.map(g => g.department)))];

    const filteredGuidelines = guidelines.filter(g => {
        const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDept = departmentFilter === "all" || g.department === departmentFilter;
        const matchesStatus = statusFilter === "all" || g.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-4 py-8">
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">All Published Guidelines</h1>
                    <p className="text-slate-600">Search and filter through the complete repository of ICMR clinical guidelines.</p>
                </div>

                {/* Filters and Search Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Search Keywords</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by title, topic, or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                        </div>
                    </div>

                    <div className="w-full md:w-64">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
                        >
                            <option value="all">All Departments</option>
                            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>

                    <div className="w-full md:w-48">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Guideline Type</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 bg-white"
                        >
                            <option value="all">All Types</option>
                            <option value="living">Living Guidelines Only</option>
                        </select>
                    </div>

                    <button className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors flex items-center gap-2 h-[38px] w-full md:w-auto justify-center">
                        <Filter className="w-4 h-4" /> Clear
                    </button>
                </div>

                {/* Results Info */}
                <div className="mb-4 text-sm text-slate-500 font-medium">
                    Showing {filteredGuidelines.length} guideline{filteredGuidelines.length !== 1 ? 's' : ''}
                </div>

                {/* Guidelines List */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto"></div>
                            <p className="text-slate-500 mt-2">Loading guidelines...</p>
                        </div>
                    ) : (
                        filteredGuidelines.map((guideline) => (
                            <Link href={`/guidelines/${guideline.id}`} key={guideline.id} className="block group">
                                <div className="bg-white rounded-lg border border-slate-200 shadow-sm group-hover:shadow-md transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group-hover:border-navy-300">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> {guideline.department}
                                            </span>
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-sm border border-blue-200">
                                                {guideline.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-navy-700 transition-colors mb-2">
                                            {guideline.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                            <span>ICMR Ref: {guideline.icmr_ref_no}</span>
                                            {guideline.published_date && (
                                                <>
                                                    <span>•</span>
                                                    <span>Published: {new Date(guideline.published_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center text-navy-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                        Read Guideline <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}

                    {filteredGuidelines.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No guidelines found</h3>
                            <p className="text-slate-500 mt-1">Try adjusting your search keywords or filters to find what you&apos;re looking for.</p>
                        </div>
                    )}
                </div>
            </main >

            <Footer />
        </div >
    );
}
