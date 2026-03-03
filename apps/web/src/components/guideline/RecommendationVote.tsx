import React, { useState } from 'react';
import { BarChart3, CheckCircle2, UserCircle2 } from 'lucide-react';

interface VoteOption {
    id: string;
    label: string;
    color: string;
    bg: string;
}

const OPTIONS: VoteOption[] = [
    { id: 'strongly_agree', label: 'Strongly Agree', color: 'text-green-700', bg: 'bg-green-100' },
    { id: 'agree', label: 'Agree', color: 'text-blue-700', bg: 'bg-blue-100' },
    { id: 'neutral', label: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-100' },
    { id: 'disagree', label: 'Disagree', color: 'text-amber-700', bg: 'bg-amber-100' },
    { id: 'strongly_disagree', label: 'Strongly Disagree', color: 'text-red-700', bg: 'bg-red-100' },
];

// Mock data to simulate panel votes
const MOCK_RESULTS: Record<string, number> = {
    'strongly_agree': 8,
    'agree': 4,
    'neutral': 1,
    'disagree': 0,
    'strongly_disagree': 0
};

export const RecommendationVote = ({ recommendationId }: { recommendationId: string }) => {
    const [selectedVote, setSelectedVote] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleVote = (id: string) => {
        setSelectedVote(id);
        setShowResults(true);
        // In a real app, this would trigger an API call to save the vote.
    };

    const totalVotes = Object.values(MOCK_RESULTS).reduce((a, b) => a + b, 0) + (selectedVote && !showResults ? 1 : 0);

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mt-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800 font-serif flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    Panel Consensus
                </h4>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <UserCircle2 className="w-4 h-4" /> 13 Panel Members
                </div>
            </div>

            {!showResults ? (
                <div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">Cast your vote on this recommendation:</p>
                    <div className="flex flex-wrap gap-2">
                        {OPTIONS.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleVote(opt.id)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors ${selectedVote === opt.id ? 'ring-2 ring-navy-500 ring-offset-1' : ''}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {OPTIONS.map((opt) => {
                        const count = MOCK_RESULTS[opt.id] + (selectedVote === opt.id ? 1 : 0);
                        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

                        return (
                            <div key={opt.id} className="relative">
                                <div className="flex justify-between text-sm mb-1 font-medium">
                                    <span className={opt.color}>{opt.label} {selectedVote === opt.id && <CheckCircle2 className="w-3 h-3 inline ml-1" />}</span>
                                    <span className="text-slate-600">{percentage}% ({count})</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-full ${opt.bg.replace('bg-', 'bg-').replace('100', '400')} transition-all duration-1000 ease-out`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
