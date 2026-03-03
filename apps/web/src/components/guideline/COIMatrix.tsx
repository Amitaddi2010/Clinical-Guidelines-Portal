import React from 'react';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface AuthorCOI {
    id: string;
    name: string;
    role: string;
    affiliation: string;
    financial_coi: string | null;
    non_financial_coi: string | null;
}

// Mock data representing panel members and their declarations
const MOCK_AUTHORS: AuthorCOI[] = [
    {
        id: '1', name: 'Dr. Sarah Jenkins', role: 'Co-Chair', affiliation: 'National Institute of Oncology',
        financial_coi: null, non_financial_coi: null
    },
    {
        id: '2', name: 'Dr. Robert Chen', role: 'Methodologist', affiliation: 'University Medical Center',
        financial_coi: 'Research grant from PharmaCorp (ended 2024)', non_financial_coi: null
    },
    {
        id: '3', name: 'Prof. Amita Rao', role: 'Clinical Expert', affiliation: 'Tata Memorial Hospital',
        financial_coi: null, non_financial_coi: 'Board member of National Cancer Society'
    },
    {
        id: '4', name: 'Dr. James Wood', role: 'Patient Representative', affiliation: 'Lung Cancer Alliance',
        financial_coi: null, non_financial_coi: null
    }
];

export const COIMatrix = () => {
    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mt-8 mb-12">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold font-serif text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Summary of Declared Interests
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Panel members' affiliations and conflict of interest declarations.</p>
                </div>
                <div className="text-xs font-medium px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm">
                    {MOCK_AUTHORS.length} Members
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Panel Member</th>
                            <th className="px-6 py-3">Affiliation</th>
                            <th className="px-6 py-3">Financial Interests</th>
                            <th className="px-6 py-3">Non-Financial Interests</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_AUTHORS.map((author) => (
                            <tr key={author.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{author.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{author.role}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-700">{author.affiliation}</td>
                                <td className="px-6 py-4">
                                    {author.financial_coi ? (
                                        <div className="inline-flex items-start gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{author.financial_coi}</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> None declared
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {author.non_financial_coi ? (
                                        <div className="inline-flex items-start gap-1.5 text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 text-xs">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>{author.non_financial_coi}</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> None declared
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500">
                <strong>Note:</strong> Members with significant financial conflicts are recused from voting on specific recommendations related to those interests.
            </div>
        </div>
    );
};
