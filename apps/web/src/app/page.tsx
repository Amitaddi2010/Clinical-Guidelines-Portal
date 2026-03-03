import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { FileText, ArrowRight, BookOpen, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { HeroAnimation } from "@/components/common/HeroAnimation";

interface Guideline {
  id: string;
  title: string;
  department: string;
  status: string;
  version: string;
  is_living: boolean;
  published_at: string | null;
}

async function getPublishedGuidelines(): Promise<Guideline[]> {
  try {
    const res = await fetch('http://localhost:3000/guidelines?status=published', {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const publishedGuidelines = await getPublishedGuidelines();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main id="main-content" className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white relative overflow-hidden min-h-[520px]">
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Radial glow behind 3D scene */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-navy-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4 py-16 px-4 lg:px-8 relative z-10">
            {/* Left: Text content */}
            <div className="flex-1 flex flex-col items-start gap-4 lg:pr-8">
              <span className="px-3 py-1.5 bg-gold/15 text-amber-300 text-xs font-bold uppercase tracking-widest rounded-full border border-gold/25 backdrop-blur-sm">
                Evidence-Based Practice
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold max-w-xl leading-[1.15]">
                Evidence into Action for Better{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-gold">Health Outcomes</span>
              </h2>
              <p className="text-base text-slate-300 max-w-lg mt-1 mb-4 leading-relaxed">
                Access the official, evidence-based clinical practice guidelines formulated by ICMR expert groups. Search, browse, and implement recommendations with clear GRADE certainty of evidence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/guidelines" className="px-6 py-3 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-navy-900 font-semibold rounded-lg transition-all shadow-lg shadow-gold/20 flex items-center gap-2 hover:shadow-gold/30 hover:-translate-y-0.5">
                  Browse All Guidelines <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/methodology" className="px-6 py-3 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all flex items-center gap-2 backdrop-blur-sm hover:bg-white/5">
                  Our Methodology
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/10 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">50+</p>
                    <p className="text-xs text-slate-400">Guidelines</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">100+</p>
                    <p className="text-xs text-slate-400">Expert Groups</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">Pan-India</p>
                    <p className="text-xs text-slate-400">Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Animated Healthcare Illustration */}
            <div className="flex-1 w-full lg:w-auto h-[400px] lg:h-[480px] relative">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* Recently Published Section */}
        {publishedGuidelines.length > 0 && (
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
              {publishedGuidelines.map((guideline) => (
                <Link href={`/guidelines/${guideline.id}`} key={guideline.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-start h-full group">
                  <div className="flex items-center gap-2 mb-3 w-full justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {guideline.department}
                    </span>
                    {guideline.is_living && (
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
                    <span>
                      Published: {guideline.published_at
                        ? new Date(guideline.published_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

