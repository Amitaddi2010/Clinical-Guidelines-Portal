"use client";
import { Header } from "@/components/common/Header";
import { RecommendationBlock, type Recommendation } from "@/components/guideline/RecommendationBlock";
import { COIMatrix } from "@/components/guideline/COIMatrix";
import { CollapsibleSection } from "@/components/guideline/CollapsibleSection";
import { Download, Share2, Menu, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Minimize2, Maximize2, FileText, BookOpen, Check, Link2, UserPlus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from 'next/link';
import { API_BASE } from "@/lib/api";

export default function GuidelineReader() {
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [guideline, setGuideline] = useState<any>(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewToken, setReviewToken] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        const id = params.id as string;
        const response = await fetch(`${API_BASE}/guidelines/${id}`);
        if (!response.ok) throw new Error('Guideline not found');
        const data = await response.json();
        // Sort sections by order_index
        if (data.sections) {
          data.sections.sort((a: any, b: any) => a.order_index - b.order_index);
        }
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading guideline...</p>
        </div>
      </div>
    );
  }

  const sections = guideline.sections || [];
  const activeSectionData = sections.find((s: any) => s.id === activeSection);
  const activeSectionIndex = sections.findIndex((s: any) => s.id === activeSection);

  const goToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevSection = () => {
    if (activeSectionIndex > 0) {
      goToSection(sections[activeSectionIndex - 1].id);
    }
  };

  const goToNextSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      goToSection(sections[activeSectionIndex + 1].id);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
    setShowShareMenu(false);
  };

  const handlePDF = () => {
    window.print();
  };

  const generateReviewToken = () => {
    const token = `review_${params.id}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const reviewUrl = `${window.location.origin}/guidelines/${params.id}?review_token=${token}`;
    navigator.clipboard.writeText(reviewUrl);
    setReviewToken(token);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Guideline Title Bar */}
      <div className="bg-navy-900 text-white border-b border-navy-800 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Back Button */}
            <Link
              href="/guidelines"
              className="flex items-center justify-center p-2 text-navy-300 hover:text-white hover:bg-navy-800 rounded-full transition-colors shrink-0"
              title="Back to Guidelines"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="w-px h-8 bg-navy-800 mx-2 hidden md:block"></div>

            <BookOpen className="w-5 h-5 text-navy-300 shrink-0 hidden md:block" />
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-bold truncate leading-tight">
                {guideline.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-navy-300 mt-1">
                <span className="px-1.5 py-0.5 bg-navy-800 rounded text-navy-200 text-[10px] font-bold uppercase tracking-wider">
                  {guideline.status || 'Draft'}
                </span>
                <span className="opacity-70">v{guideline.version || '1.0'}</span>
                <span className="opacity-70">•</span>
                <span className="opacity-70">{guideline.department || 'General'}</span>
                {guideline.published_at && (
                  <>
                    <span className="opacity-70">•</span>
                    <span className="opacity-70">{new Date(guideline.published_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Share Menu */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 rounded text-sm font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Share</span>
              </button>
              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute right-0 top-10 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                    <button onClick={handleShare} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                      <Link2 className="w-4 h-4 text-slate-400" /> Copy link
                    </button>
                    <button onClick={generateReviewToken} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                      <UserPlus className="w-4 h-4 text-slate-400" /> Invite Guest Reviewer
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handlePDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 rounded text-sm font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 bg-navy-800 hover:bg-navy-700 rounded text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Share Toast */}
          {shareToast && (
            <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{reviewToken ? 'Review link copied!' : 'Link copied to clipboard!'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation Bar */}
      <div className="bg-slate-50 border-b border-slate-200 sticky top-[68px] z-20">
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarMinimized(!sidebarMinimized)}
              className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
              title={sidebarMinimized ? "Show sections" : "Hide sections"}
            >
              {sidebarMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              <span>{sidebarMinimized ? "Show" : "Hide"} Sections</span>
            </button>
            <span className="text-xs text-slate-400 hidden lg:inline">|</span>
            <span className="text-xs text-slate-500 font-medium">
              Section {activeSectionIndex + 1} of {sections.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevSection}
              disabled={activeSectionIndex <= 0}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={goToNextSection}
              disabled={activeSectionIndex >= sections.length - 1}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow flex max-w-[1600px] mx-auto w-full relative">
        {/* Sidebar — MAGICapp-style dark theme */}
        <aside className={`
          fixed lg:sticky top-[110px] left-0 h-[calc(100vh-110px)]
          bg-[#2d3748] overflow-y-auto z-10
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${sidebarMinimized ? "lg:w-0 lg:border-0 lg:overflow-hidden" : "lg:w-72"}
        `}>
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-[#2d3748] border-b border-white/10 px-5 py-4 flex justify-between items-center z-10">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Sections</h3>
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section List */}
          <nav className="py-2">
            {sections.map((section: any, index: number) => {
              const isActive = section.id === activeSection;

              return (
                <button
                  key={section.id}
                  onClick={() => goToSection(section.id)}
                  className={`w-full text-left px-5 py-3 text-[13px] transition-all duration-150 flex items-start gap-3 group border-l-[3px] ${isActive
                    ? 'bg-[#1a365d] text-white font-semibold border-l-[#4299e1]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-transparent'
                    }`}
                >
                  <span className="leading-snug">{section.title}</span>
                  {section.title === '3 Recommendations and supporting evidence' && (
                    <ChevronRight className={`w-3.5 h-3.5 mt-0.5 ml-auto shrink-0 ${isActive ? 'text-white/70' : 'text-slate-500'}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/20 z-0 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Main Content Area - Shows ONLY the active section */}
        <main ref={contentRef} className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-110px)] bg-white">
          {activeSectionData ? (
            <div className="max-w-3xl mx-auto px-6 md:px-10 lg:px-16 py-12 pb-32">
              {/* Section Title */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-navy-900 mb-2 leading-tight">
                  {activeSectionData.title}
                </h2>
                <div className="h-1 w-16 bg-navy-600 rounded-full"></div>
              </div>

              {/* Section Content */}
              {activeSectionData.content_html ? (
                <CollapsibleSection htmlContent={activeSectionData.content_html} />
              ) : (
                <p className="text-slate-500 italic">No content available for this section.</p>
              )}

              {/* Recommendations within this section */}
              {activeSectionData.recommendations && activeSectionData.recommendations.length > 0 && (
                <div className="mt-10 space-y-6">
                  <h3 className="text-lg font-bold text-navy-900 font-serif">Recommendations</h3>
                  {activeSectionData.recommendations.map((rec: any) => (
                    <RecommendationBlock key={rec.id} recommendation={rec} />
                  ))}
                </div>
              )}

              {/* Conditionally render the COI Matrix if we are on the Contributors/Annex section */}
              {activeSectionData.title && (activeSectionData.title.toLowerCase().includes('contributor') || activeSectionData.title.toLowerCase().includes('annex 1')) && (
                <COIMatrix />
              )}

              {/* Section Navigation Footer */}
              <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center">
                <div>
                  {activeSectionIndex > 0 && (
                    <button
                      onClick={goToPrevSection}
                      className="flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors group"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                      <div className="text-left">
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Previous</div>
                        <div className="text-navy-600 group-hover:text-navy-800">{sections[activeSectionIndex - 1].title}</div>
                      </div>
                    </button>
                  )}
                </div>
                <div>
                  {activeSectionIndex < sections.length - 1 && (
                    <button
                      onClick={goToNextSection}
                      className="flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors group text-right"
                    >
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider">Next</div>
                        <div className="text-navy-600 group-hover:text-navy-800">{sections[activeSectionIndex + 1].title}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : sections.length === 0 && guideline.description ? (
            <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-8">
              <h2 className="text-2xl font-bold font-serif text-navy-900 mb-6">Document Content</h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {guideline.description}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Select a section from the sidebar to begin reading.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
