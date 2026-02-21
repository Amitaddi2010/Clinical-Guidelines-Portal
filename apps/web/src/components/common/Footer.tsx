export function Footer() {
    return (
        <footer className="bg-navy-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-bold font-serif text-gold mb-4">ICMR Clinical Guidelines</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        The national repository of evidence-based clinical practice guidelines authored and published by the Indian Council of Medical Research to standardize healthcare delivery across India.
                    </p>
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li><a href="#" className="hover:text-white transition-colors">All Guidelines</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">By Department</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Living Guidelines</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2">Contact</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li>Indian Council of Medical Research</li>
                        <li>V. Ramalingaswami Bhawan</li>
                        <li>P.O. Box No. 4911</li>
                        <li>Ansari Nagar, New Delhi - 110029</li>
                    </ul>
                </div>
            </div>
            <div className="bg-navy-950 py-4 border-t border-white/10 text-xs text-center text-slate-400">
                <p>© {new Date().getFullYear()} Indian Council of Medical Research. All rights reserved.</p>
                <p className="mt-1">Designed by National Informatics Centre (NIC) | MeitY GIGW v3.0 Compliant</p>
            </div>
        </footer>
    );
}
