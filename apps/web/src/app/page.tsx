import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // Mock data to visualize the design until the backend is hooked up
  const featuredGuidelines = [
    { id: '1', title: 'National Guidelines for Infection Prevention and Control in Healthcare Facilities', dept: 'Epidemiology', date: '2025-10-12', status: 'Published', version: '2.0', living: true },
    { id: '2', title: 'Management of Type 2 Diabetes Mellitus', dept: 'Non-Communicable Diseases', date: '2024-11-05', status: 'Published', version: '1.2', living: false },
    { id: '3', title: 'Ethical Guidelines for Biomedical Research on Human Participants', dept: 'Bioethics', date: '2023-08-20', status: 'Published', version: '4.0', living: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main id="main-content" className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-800 to-navy-600 text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '20px 20px' }}></div>
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-4 z-10 relative">
            <span className="px-3 py-1 bg-gold/20 text-gold-300 text-xs font-bold uppercase tracking-wider rounded-full border border-gold/30">
              Evidence-Based Practice
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold max-w-3xl leading-tight">
              Evidence into Action for Better Health Outcomes
            </h2>
            <p className="text-lg text-slate-200 max-w-2xl mt-2 mb-6">
              Access the official, evidence-based clinical practice guidelines formulated by ICMR expert groups. Search, browse, and implement recommendations with clear GRADE certainty of evidence.
            </p>
            <div className="flex gap-4">
              <Link href="/guidelines" className="px-6 py-3 bg-gold hover:bg-gold-600 text-navy-900 font-semibold rounded-md transition-colors shadow-lg flex items-center gap-2">
                Browse All Guidelines <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Guidelines List Section */}
        <section className="max-w-7xl mx-auto w-full px-4 py-16">
          <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-navy-800">Recently Published</h3>
              <p className="text-slate-500 mt-1">Latest updates and newly formulated guidelines</p>
            </div>
            <Link href="/guidelines" className="text-navy-600 hover:text-navy-800 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGuidelines.map((guideline) => (
              <div key={guideline.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-start h-full group">
                <div className="flex items-center gap-2 mb-3 w-full justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {guideline.dept}
                  </span>
                  {guideline.living && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-sm border border-green-200">
                      Living Guideline
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-navy-600 transition-colors">
                  {guideline.title}
                </h4>
                <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>Version {guideline.version}</span>
                  <span>•</span>
                  <span>Published: {new Date(guideline.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
