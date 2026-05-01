/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import AdGenerator from './components/AdGenerator';
import ProductCard from './components/ProductCard';
import LegalModal from './components/LegalModal';
import { MOCK_PRODUCTS, IMAGES } from './constants';
import { ArrowRight, Flame, Plus, MessageCircle, X, Send } from 'lucide-react';

export default function App() {
  const [previewAd, setPreviewAd] = useState<string | null>(null);
  const [legalType, setLegalType] = useState<'help' | 'privacy' | 'terms' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    if (v) {
      setPreviewAd(v);
    }
  }, []);

  const closePreview = () => {
    setPreviewAd(null);
    window.history.replaceState({}, '', '/');
  };

  if (previewAd) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1B3A2D] rounded-full blur-[120px] opacity-40 pointer-events-none" />
        <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#25D366] rounded-full blur-[150px] opacity-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full glass rounded-[40px] p-8 shadow-2xl relative z-10 flex flex-col gap-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-whatsapp rounded-xl flex items-center justify-center glow-green">
                  <img src={IMAGES.icon} alt="HustleLink" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
               </div>
               <span className="font-bold tracking-tight">HustleLink Preview</span>
            </div>
            <button onClick={closePreview} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-2 text-[10px] text-whatsapp font-bold uppercase tracking-[0.2em]">
              <MessageCircle className="w-3 h-3" />
              WhatsApp Visual
            </div>
            
            <div className="bg-[#056162] text-white p-6 rounded-[32px] rounded-tr-none relative shadow-2xl border border-white/5">
              <p className="text-base italic leading-relaxed whitespace-pre-wrap">{previewAd}</p>
              <div className="absolute top-0 right-[-10px] w-0 h-0 border-t-[12px] border-t-[#056162] border-r-[12px] border-r-transparent" />
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(previewAd)}`}
              target="_blank"
              className="w-full py-5 bg-whatsapp hover:bg-whatsapp-dark text-navy font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-whatsapp/20"
            >
              <Send className="w-5 h-5" />
              Post this Hustle
            </a>
            <p className="text-center text-[10px] text-white/30 uppercase tracking-[0.1em]">Instant Marketing by HustleLink</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Decorative Blobs */}
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#1B3A2D] rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#25D366] rounded-full blur-[150px] opacity-10 pointer-events-none" />

      <Header />

      <main className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Artistic Flair Hero Section */}
        <section className="py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <span className="text-accent uppercase tracking-[0.2em] text-xs font-bold block">
                Instant Marketplace Magic
              </span>
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
                Sell on WhatsApp<br/>
                <span className="text-whatsapp">in one click.</span>
              </h1>
              <p className="text-lg opacity-60 max-w-md leading-relaxed">
                Turn your product details into professional, high-conversion WhatsApp ads instantly using HustleLink.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-10 py-5 bg-accent hover:bg-orange-600 text-white font-bold rounded-2xl glow-orange transition-all active:scale-95 flex items-center gap-2" id="hero-cta-sell">
                Start Selling
              </button>
              <button className="px-10 py-5 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2" id="hero-cta-browse">
                Browse Deals
              </button>
            </div>
          </motion.div>

          {/* Right Side: Floating Mockup / Visual */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center">
            {/* Floating items inspired by theme */}
            <div className="absolute -left-4 flex flex-col gap-12 pointer-events-none z-20">
              <div className="glass w-20 h-20 rounded-3xl flex items-center justify-center floating shadow-2xl" style={{ animationDelay: '0s' }}>
                <span className="text-3xl">👟</span>
              </div>
              <div className="glass w-20 h-20 rounded-3xl flex items-center justify-center floating shadow-2xl" style={{ animationDelay: '1s' }}>
                <span className="text-3xl">📱</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10"
            >
              <div className="bg-whatsapp p-1.5 rounded-[50px] glow-green tilt-25 shadow-2xl max-w-[320px]">
                <img 
                  src={IMAGES.icon} 
                  alt="HustleLink Icon" 
                  className="rounded-[40px] bg-navy w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* AI Ad Generator Feature */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <AdGenerator />
          </motion.div>
        </section>

        {/* Product Feed */}
        <section className="py-16 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recent Hustles</h2>
              <p className="text-sm text-white/40">Fresh deals from Harare CBD & surroundings</p>
            </div>
            <div className="flex gap-2">
              <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-whatsapp">
                <option>All Areas</option>
                <option>CBD</option>
                <option>Avondale</option>
                <option>Borrowdale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center pt-8">
             <button className="px-6 py-3 glass rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors" id="load-more-btn">
                Load More
             </button>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest opacity-30 border-t border-white/5 mt-20">
        <div>&copy; 2026 HustleLink Harare</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <button onClick={() => setLegalType('terms')} className="hover:opacity-100 cursor-pointer">Terms of Service</button>
          <button onClick={() => setLegalType('privacy')} className="hover:opacity-100 cursor-pointer">Privacy Policy</button>
          <button onClick={() => setLegalType('help')} className="hover:opacity-100 cursor-pointer">Help Center</button>
        </div>
      </footer>

      <AnimatePresence>
        {legalType && (
          <LegalModal 
            type={legalType} 
            onClose={() => setLegalType(null)} 
          />
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 z-50 md:hidden"
        id="mobile-fab"
      >
        <Plus className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
