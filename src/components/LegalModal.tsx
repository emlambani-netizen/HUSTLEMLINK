/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { X, HelpCircle, Shield, FileText, ExternalLink } from 'lucide-react';

interface LegalModalProps {
  type: 'help' | 'privacy' | 'terms';
  onClose: () => void;
}

export default function LegalModal({ type, onClose }: LegalModalProps) {
  const content = {
    help: {
      title: 'Help Center',
      icon: <HelpCircle className="w-6 h-6 text-whatsapp" />,
      text: (
        <div className="space-y-6">
          <section>
            <h4 className="font-bold text-white mb-2">How to Generate an Ad?</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Simply enter your product name, price, and location in the generator form. Our AI will craft a high-converting message tailored for WhatsApp status.
            </p>
          </section>
          <section>
            <h4 className="font-bold text-white mb-2">Posting to WhatsApp</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              You can click "Post to WhatsApp" to open your WhatsApp app directly, or use the "Scan for Web Preview" feature to see how it looks on mobile first.
            </p>
          </section>
          <section>
            <h4 className="font-bold text-white mb-2">Saving History</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Sign in with your Google account to save your generated ads for later use. You can access them anytime via the "Saved Ads" button.
            </p>
          </section>
        </div>
      )
    },
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="w-6 h-6 text-whatsapp" />,
      text: (
        <div className="space-y-6">
          <section>
            <h4 className="font-bold text-white mb-2">Data Collection</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              We collect your name, email, and photo URL when you sign in via Google to provide personalized history features.
            </p>
          </section>
          <section>
            <h4 className="font-bold text-white mb-2">AI Usage</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              The product details you enter are processed by Gemini AI to generate ad copy. This data is not used for training external models without your consent.
            </p>
          </section>
          <p className="text-[10px] text-white/30 italic">Last updated: May 1, 2026</p>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="w-6 h-6 text-whatsapp" />,
      text: (
        <div className="space-y-6">
          <section>
            <h4 className="font-bold text-white mb-2">User Responsibility</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Users are responsible for the accuracy of pricing and product descriptions in their generated ads.
            </p>
          </section>
          <section>
            <h4 className="font-bold text-white mb-2">Prohibited Content</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              HustleLink may not be used to generate ads for illegal goods, scams, or prohibited services.
            </p>
          </section>
          <p className="text-[10px] text-white/30 italic">By using HustleLink, you agree to these terms.</p>
        </div>
      )
    }
  }[type];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-lg w-full glass rounded-[32px] p-8 shadow-2xl relative border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              {content.icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
          {content.text}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-widest text-white/30">HustleLink Legal</p>
          <button onClick={onClose} className="text-xs font-bold text-whatsapp hover:underline flex items-center gap-1">
            Got it <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
