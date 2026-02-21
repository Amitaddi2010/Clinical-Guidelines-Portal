"use client";
import { Header } from "@/components/common/Header";
import { RecommendationBlock, type Recommendation } from "@/components/guideline/RecommendationBlock";
import { Download, Share2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Token storage or other client-side state could be added here if needed

export default function GuidelineReader() {
  const params = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("s1");
  const [guideline, setGuideline] = useState<any>(null);

  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`http://localhost:3000/guidelines/${id}`);
        if (!response.ok) throw new Error('Guideline not found');
        const data = await response.json();
        setGuideline(data);
        if (data.sections && data.sections.length > 0) {
          setActiveSection(data.sections[0].id);
        }
      } catch (error) {
        console.error('Error fetching guideline:', error);
      }
    };

    if (params.id) {
      fetchGuideline();
    }
  }, [params.id]);

  if (!guideline) {
    return <div className="min-h-screen flex items-center justify-center">Loading guideline...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Guideline Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-navy-100 text-navy-800 text-xs font-semibold rounded border border-navy-200">
                {guideline.department}
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                VERSION {guideline.version}
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide border-l border-slate-300 pl-2">
                PUBLISHED {guideline.published_at ? new Date(guideline.published_at).toLocaleDateString() : 'Draft'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-serif text-slate-900 leading-snug">
              {guideline.title}
            </h1>
          </div>
          <div className="flex gap-2 shrink-0 pt-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow flex max-w-[1400px] mx-auto w-full relative">
        {/* Sticky Table of Contents Sidebar */}
        <aside className={`
                fixed lg:sticky top-[105px] left-0 h-[calc(100vh-105px)] w-72 bg-slate-50 border-r border-slate-200
                overflow-y-auto z-10 p-4 transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h3 className="font-bold text-slate-800">Table of Contents</h3>
            <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
          </div>
          <nav className="space-y-1">
            {guideline.sections.map((section: any) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => {
                  setActiveSection(section.id);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 text-sm rounded transition-colors ${activeSection === section.id ? 'bg-navy-100 text-navy-800 font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {
          mobileMenuOpen && (
            <div className="fixed inset-0 bg-black/20 z-0 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          )
        }

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-4xl p-4 md:p-8 lg:p-12 pb-32">
          {guideline.sections && guideline.sections.length > 0 ? (
            guideline.sections.map((section: any) => (
              <div key={section.id} id={section.id} className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-bold font-serif text-navy-900 mb-6 pb-2 border-b border-navy-100">
                  {section.title}
                </h2>

                {section.content_html && (
                  <div
                    className="prose prose-slate max-w-none mb-8 text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content_html }}
                  />
                )}

                {section.recommendations && section.recommendations.map((rec: any) => (
                  <RecommendationBlock key={rec.id} recommendation={rec} />
                ))}
              </div>
            ))
          ) : (
            <div className="mb-16">
              <h2 className="text-2xl font-bold font-serif text-navy-900 mb-6 pb-2 border-b border-navy-100">
                Document Content
              </h2>
              {guideline.description ? (
                <div className="prose prose-slate max-w-none mb-8 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {guideline.description}
                </div>
              ) : (
                <p className="text-slate-500 italic">No content available for this guideline yet.</p>
              )}
            </div>
          )}
        </main>
      </div >
    </div >
  );
}
