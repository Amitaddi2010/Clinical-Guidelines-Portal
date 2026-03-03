"use client";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { BookOpen, GraduationCap, Users, CheckCircle, BarChart3, FileText } from "lucide-react";

export default function MethodologyPage() {
    const steps = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "1. Topic Selection & Scoping",
            description: "Priority topics are identified based on disease burden, practice variation, and potential for improving patient outcomes. The scope is defined through key clinical questions framed in PICO format."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "2. Systematic Evidence Review",
            description: "Comprehensive systematic reviews are conducted following Cochrane methodology. Literature searches cover multiple databases with pre-defined inclusion/exclusion criteria."
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "3. GRADE Evidence Assessment",
            description: "The certainty of evidence is assessed using the Grading of Recommendations Assessment, Development and Evaluation (GRADE) framework, rating evidence from Very Low to High."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "4. Evidence-to-Decision Framework",
            description: "Recommendations are formulated using the EtD framework, considering benefits/harms balance, patient values, resource use, equity, acceptability, and feasibility."
        },
        {
            icon: <GraduationCap className="w-6 h-6" />,
            title: "5. Expert Panel Deliberation",
            description: "A multidisciplinary Guideline Development Group (GDG) comprising clinical experts, methodologists, and patient representatives deliberates on the evidence to formulate recommendations."
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "6. External Review & Publication",
            description: "Draft guidelines undergo external peer review. After incorporating feedback, guidelines are published with clear recommendation statements, strength ratings, and supporting evidence."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Header />

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">Guideline Development Methodology</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        ICMR clinical guidelines are developed using internationally recognized, evidence-based methods aligned with the WHO and GRADE frameworks.
                    </p>
                </div>

                {/* GRADE Overview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 mb-10">
                    <h2 className="text-xl font-bold text-navy-900 font-serif mb-4">The GRADE Approach</h2>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        The <strong>Grading of Recommendations Assessment, Development and Evaluation (GRADE)</strong> approach is the most widely adopted framework for grading the certainty of evidence and strength of recommendations. It provides a structured, transparent process for moving from evidence to healthcare recommendations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="font-bold text-green-800 text-sm mb-2">Strong Recommendation</h3>
                            <p className="text-sm text-green-700">The panel is confident that the desirable effects of the intervention outweigh the undesirable effects.</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="font-bold text-amber-800 text-sm mb-2">Conditional Recommendation</h3>
                            <p className="text-sm text-amber-700">The panel concludes that the desirable effects probably outweigh the undesirable effects, but there is uncertainty.</p>
                        </div>
                    </div>
                </div>

                {/* Certainty of Evidence */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 mb-10">
                    <h2 className="text-xl font-bold text-navy-900 font-serif mb-4">Certainty of Evidence</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-navy-50 text-navy-900">
                                    <th className="text-left px-4 py-2 border border-slate-200 font-semibold">Level</th>
                                    <th className="text-left px-4 py-2 border border-slate-200 font-semibold">Symbol</th>
                                    <th className="text-left px-4 py-2 border border-slate-200 font-semibold">Interpretation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="px-4 py-2 border border-slate-200 font-medium">High</td><td className="px-4 py-2 border border-slate-200">⊕⊕⊕⊕</td><td className="px-4 py-2 border border-slate-200 text-slate-600">Very confident the true effect is close to the estimate</td></tr>
                                <tr><td className="px-4 py-2 border border-slate-200 font-medium">Moderate</td><td className="px-4 py-2 border border-slate-200">⊕⊕⊕◯</td><td className="px-4 py-2 border border-slate-200 text-slate-600">Moderately confident; the true effect is likely close to the estimate</td></tr>
                                <tr><td className="px-4 py-2 border border-slate-200 font-medium">Low</td><td className="px-4 py-2 border border-slate-200">⊕⊕◯◯</td><td className="px-4 py-2 border border-slate-200 text-slate-600">Limited confidence; the true effect may be substantially different</td></tr>
                                <tr><td className="px-4 py-2 border border-slate-200 font-medium">Very Low</td><td className="px-4 py-2 border border-slate-200">⊕◯◯◯</td><td className="px-4 py-2 border border-slate-200 text-slate-600">Very little confidence; the true effect is likely substantially different</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Development Process Steps */}
                <h2 className="text-xl font-bold text-navy-900 font-serif mb-6">Development Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-navy-50 text-navy-600 rounded-lg shrink-0">
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
