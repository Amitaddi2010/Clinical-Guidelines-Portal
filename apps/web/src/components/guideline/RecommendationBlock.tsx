import { ChevronDown, ChevronRight, FileText, Anchor, ExternalLink } from "lucide-react";
import { useState } from "react";

type StrengthBadgeProps = {
    strength: 'strong_for' | 'conditional_for' | 'conditional_against' | 'strong_against' | 'best_practice';
};

const StrengthBadge = ({ strength }: StrengthBadgeProps) => {
    const configs = {
        strong_for: { label: 'Strong', icon: '↑↑', color: 'bg-green-100 text-green-800 border-green-300' },
        conditional_for: { label: 'Conditional', icon: '↑', color: 'bg-amber-100 text-amber-800 border-amber-300' },
        conditional_against: { label: 'Conditional Against', icon: '↓', color: 'bg-amber-100 text-amber-800 border-amber-300' },
        strong_against: { label: 'Strong Against', icon: '↓↓', color: 'bg-red-100 text-red-800 border-red-300' },
        best_practice: { label: 'Best Practice Statement', icon: '✓', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    };

    const config = configs[strength];
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
            <span className="font-bold">{config.icon}</span> {config.label}
        </span>
    );
};

const CertaintySymbols = ({ level }: { level: 'high' | 'moderate' | 'low' | 'very_low' }) => {
    const configs = {
        high: { symbols: '⊕⊕⊕⊕', color: 'text-green-600' },
        moderate: { symbols: '⊕⊕⊕○', color: 'text-blue-600' },
        low: { symbols: '⊕⊕○○', color: 'text-amber-600' },
        very_low: { symbols: '⊕○○○', color: 'text-red-600' },
    };
    const config = configs[level];
    return <span className={`font-bold tracking-widest ${config.color}`}>{config.symbols}</span>;
}

export interface Reference {
    authors: string[];
    title: string;
    journal?: string;
    year?: number;
    volume?: string;
    issue?: string;
    pages?: string;
    pubmed_id?: string;
}

export interface Outcome {
    name: string;
    effect_estimate: string;
    confidence_interval: string;
    no_of_studies?: number;
    no_of_participants?: number;
    certainty: 'high' | 'moderate' | 'low' | 'very_low';
}

export interface Pico {
    id: string;
    population: string;
    intervention: string;
    comparator: string;
    timeframe?: string;
    outcomes: Outcome[];
}

export interface Recommendation {
    id: string;
    text: string;
    strength: 'strong_for' | 'conditional_for' | 'conditional_against' | 'strong_against' | 'best_practice';
    evidence_level: 'high' | 'moderate' | 'low' | 'very_low';
    rationale?: string;
    remarks?: string;
    picos?: Pico[];
    references?: Reference[];
}

export function RecommendationBlock({ recommendation }: { recommendation: Recommendation }) {
    const [expandedLayer, setExpandedLayer] = useState<number>(1);

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-6 overflow-hidden">
            {/* Layer 1: Core Recommendation (Always visible) */}
            <div
                className="p-5 cursor-pointer hover:bg-slate-50 transition-colors relative"
                onClick={() => setExpandedLayer(expandedLayer === 1 ? 4 : 1)}
            >
                <div className="flex justify-between items-start gap-4 mb-3">
                    <div dangerouslySetInnerHTML={{ __html: recommendation.text || '' }} className="text-lg font-medium text-slate-900 prose prose-slate" />
                    <div className="shrink-0">
                        <StrengthBadge strength={recommendation.strength} />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mt-4 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                        <span>Certainty of Evidence:</span>
                        <CertaintySymbols level={recommendation.evidence_level} />
                        <span className="capitalize">({recommendation.evidence_level.replace('_', ' ')})</span>
                    </div>
                    <div className="flex items-center gap-1 text-navy-600 font-medium select-none">
                        {expandedLayer > 1 ? (
                            <><ChevronDown className="w-4 h-4" /> Hide details</>
                        ) : (
                            <><ChevronRight className="w-4 h-4" /> Show details (Rationale, Evidence, References)</>
                        )}
                    </div>
                </div>
            </div>

            {/* Layer 2: Rationale and Remarks */}
            {expandedLayer >= 2 && (
                <div className="p-5 bg-slate-50 border-t border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2 font-serif">Rationale</h4>
                    <div dangerouslySetInnerHTML={{ __html: recommendation.rationale || '' }} className="prose prose-sm prose-slate max-w-none mb-4" />

                    {recommendation.remarks && (
                        <>
                            <h4 className="font-bold text-slate-800 mb-2 font-serif">Remarks</h4>
                            <div dangerouslySetInnerHTML={{ __html: recommendation.remarks || '' }} className="prose prose-sm prose-slate max-w-none text-slate-600 italic" />
                        </>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                        {expandedLayer === 2 ? (
                            <button onClick={() => setExpandedLayer(3)} className="text-navy-600 hover:text-navy-800 text-sm font-medium">
                                Show Evidence Summary (PICO & SoF) ↓
                            </button>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Layer 3: PICO and SoF Table */}
            {expandedLayer >= 3 && recommendation.picos?.map((pico: Pico) => (
                <div key={pico.id} className="p-5 bg-white border-t border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-3 font-serif flex items-center gap-2">
                        <Anchor className="w-4 h-4 text-slate-400" /> Evidence Profile
                    </h4>

                    <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-4 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                            <div><strong className="text-slate-700">Population:</strong> {pico.population}</div>
                            <div><strong className="text-slate-700">Intervention:</strong> {pico.intervention}</div>
                            <div><strong className="text-slate-700">Comparator:</strong> {pico.comparator}</div>
                            {pico.timeframe && <div><strong className="text-slate-700">Timeframe:</strong> {pico.timeframe}</div>}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border border-slate-200 rounded-md">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-4 py-2 border-b">Outcome</th>
                                    <th className="px-4 py-2 border-b">Effect Estimate</th>
                                    <th className="px-4 py-2 border-b">Participants (Studies)</th>
                                    <th className="px-4 py-2 border-b">Certainty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pico.outcomes?.map((outcome: Outcome, idx: number) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">{outcome.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{outcome.effect_estimate}</div>
                                            <div className="text-[10px] text-slate-500">{outcome.confidence_interval}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {outcome.no_of_participants || '--'} ({outcome.no_of_studies || '--'})
                                        </td>
                                        <td className="px-4 py-3">
                                            <CertaintySymbols level={outcome.certainty} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                        {expandedLayer === 3 ? (
                            <button onClick={() => setExpandedLayer(4)} className="text-navy-600 hover:text-navy-800 text-sm font-medium">
                                Show References ↓
                            </button>
                        ) : null}
                    </div>
                </div>
            ))}

            {/* Layer 4: Full Evidence & References (Hidden by default) */}
            {expandedLayer >= 4 && (
                <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-6">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 font-serif flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" /> References
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            {recommendation.references?.map((ref: Reference, idx: number) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="font-bold text-slate-400">[{idx + 1}]</span>
                                    <div>
                                        <span className="font-medium text-slate-900">{ref.authors.join(", ")}</span>. {ref.title}. <span className="italic">{ref.journal}</span> {ref.year};{ref.volume}({ref.issue}):{ref.pages}.
                                        {ref.pubmed_id && (
                                            <a href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}`} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-navy-600 hover:underline">
                                                PMID: {ref.pubmed_id} <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                            {(!recommendation.references || recommendation.references.length === 0) && (
                                <li className="text-slate-400 italic">No references linked to this recommendation.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div >
    );
}
