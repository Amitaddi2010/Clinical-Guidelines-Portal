"use client";
import { CheckSquare, Settings2, ShieldCheck, CheckCircle2, Circle, Clock } from "lucide-react";
import { useState } from "react";

export function SettingsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('checklist');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transform transition-transform">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-bold text-navy-900 font-serif flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-navy-600" /> Guideline Management
        </h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 font-bold p-1">&times;</button>
      </div>

      {/* Internal Tabs */}
      <div className="flex border-b border-slate-200 bg-white shadow-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wide border-b-2 whitespace-nowrap ${activeTab === 'checklist' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Checklist
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wide border-b-2 whitespace-nowrap ${activeTab === 'members' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-3 py-2.5 text-xs font-bold uppercase tracking-wide border-b-2 whitespace-nowrap ${activeTab === 'activity' ? 'border-navy-600 text-navy-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Activity
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">

        {/* CHECKLIST TAB */}
        {activeTab === 'checklist' && (
          <div className="p-5 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-navy-500" /> Pre-Publish Requirements
              </h3>
              <div className="bg-white border text-sm border-slate-200 rounded-lg p-3 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">All sections have content</span>
                    <p className="text-xs text-slate-500">22/22 sections written</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">GRADE strengths assigned</span>
                    <p className="text-xs text-slate-500">14/14 recommendations graded</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Authors signed COI declarations</span>
                    <p className="text-xs text-amber-600">3/5 authors declared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">ICMR reference number set</span>
                    <p className="text-xs text-slate-500">ICMR-2025-EPI-01</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">At least one review round done (Delphi)</span>
                    <p className="text-xs text-amber-600">Pending review completion</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-navy-500" /> Tasks
              </h3>
              <div className="space-y-2">
                <div className="bg-white border text-sm border-slate-200 rounded-md p-3 relative">
                  <input type="checkbox" className="absolute top-3.5 left-3 w-4 h-4 rounded border-slate-300" />
                  <div className="pl-7">
                    <p className="font-medium text-slate-800 text-xs">Verify PICO Table 2.1 formatting</p>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-slate-500">Assigned: Dr. Amit</span>
                      <span className="text-red-600 font-semibold text-[10px] uppercase">Due Tomorrow</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 bg-slate-100 border border-slate-300 rounded text-xs font-semibold hover:bg-slate-200 text-slate-600 transition-colors">
                  + Add New Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="p-5 space-y-4">
            <button className="w-full py-2 bg-navy-600 text-white rounded text-sm font-medium hover:bg-navy-700 transition-colors">
              + Invite Member
            </button>
            <div className="space-y-3">
              {[
                { name: 'Dr. Ananya Sharma', role: 'Guideline Admin', email: 'ananya@icmr.gov.in', initial: 'A', bg: 'bg-blue-500' },
                { name: 'Dr. Ram Kumar', role: 'Author', email: 'ram@aiims.edu', initial: 'R', bg: 'bg-emerald-500' },
                { name: 'Prof. Sunita Rao', role: 'Reviewer', email: 'sunita@pgimer.edu', initial: 'S', bg: 'bg-purple-500' },
              ].map(member => (
                <div key={member.email} className="bg-white border border-slate-200 rounded-md p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${member.bg} text-white flex items-center justify-center font-bold text-sm`}>
                      {member.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-navy-600"><Settings2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="p-5">
            <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-4">
              <div className="relative">
                <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-navy-500 ring-4 ring-slate-50"></div>
                <div className="pl-5">
                  <p className="text-xs text-slate-500 mb-0.5">Today, 10:45 AM</p>
                  <p className="text-sm text-slate-800"><span className="font-semibold">Dr. Ananya</span> updated Recommendation 1 evidence certainty from Low to High.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-slate-50"></div>
                <div className="pl-5">
                  <p className="text-xs text-slate-500 mb-0.5">Yesterday, 4:20 PM</p>
                  <p className="text-sm text-slate-800"><span className="font-semibold">Dr. Ram</span> added a new PICO for Hand Hygiene.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-slate-50"></div>
                <div className="pl-5">
                  <p className="text-xs text-slate-500 mb-0.5">Feb 15, 2026</p>
                  <p className="text-sm text-slate-800"><span className="font-semibold">Prof. Sunita</span> left a comment on Section 2.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold shadow-sm flex justify-center items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Ready to Publish
        </button>
      </div>
    </div>
  );
}
