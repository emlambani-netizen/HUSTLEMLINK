/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, ArrowRight, Share2, Copy, Check, QrCode as QrIcon, Send, MessageCircle, Save, History, Trash2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { IMAGES, COLORS } from '../constants';
import { auth, db, signIn, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function AdGenerator() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [savedAds, setSavedAds] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    const trimmed = value.trim();
    if (!trimmed) {
      const label = name === 'name' ? 'Product name' : name.charAt(0).toUpperCase() + name.slice(1);
      error = `${label} is required`;
    } else if (name === 'price') {
      // Allow only numbers and a decimal point
      if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
        error = 'Price must be a valid number (e.g. 45 or 45.99)';
      } else if (parseFloat(trimmed) <= 0) {
        error = 'Price must be greater than zero';
      }
    } else if (name === 'name' && trimmed.length > 100) {
      error = 'Name too long (max 100)';
    } else if (name === 'location' && trimmed.length > 100) {
      error = 'Location too long (max 100)';
    }
    return error;
  };

  const updateField = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedAds([]);
      return;
    }

    const q = query(
      collection(db, 'saved_ads'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedAds(ads);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'saved_ads');
    });

    return () => unsubscribe();
  }, [user]);

  const generateAd = async () => {
    const newErrors: Record<string, string> = {
      name: validateField('name', formData.name),
      price: validateField('price', formData.price),
      location: validateField('location', formData.location),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, price: true, location: true });

    if (Object.values(newErrors).some(e => e)) return;

    setIsGenerating(true);
    setShowQR(false);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create short, energetic, and emoji-rich WhatsApp marketplace ad for:
        Product: ${formData.name}
        Price: $${formData.price}
        Location: ${formData.location}
        Description: ${formData.description || 'N/A'}
        
        The ad should start with a bold headline, use bullet points if needed, and end with a "Contact me now on WhatsApp" call to action. Keep it under 60 words.`,
      });

      setGeneratedAd(response.text || '');
    } catch (error) {
      console.error('Generation failed:', error);
      setGeneratedAd('🔥 HustleLink Deal: ' + formData.name + ' for only $' + formData.price + ' in ' + formData.location + '! Contact me now.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAd = async () => {
    if (!user || !generatedAd) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'saved_ads'), {
        name: formData.name,
        price: formData.price,
        location: formData.location,
        text: generatedAd,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'saved_ads');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'saved_ads', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `saved_ads/${id}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webPreviewUrl = `${window.location.origin}?v=${encodeURIComponent(generatedAd)}`;
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedAd)}`;

  return (
    <div className="max-w-4xl mx-auto glass rounded-[40px] overflow-hidden shadow-2xl border-white/5 relative bg-gradient-to-br from-navy to-[#1B3A2D]/50 p-8 md:p-12">
      <div className="flex justify-end mb-6">
        {!user ? (
          <button 
            onClick={() => signIn()}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all"
          >
            <LogIn className="w-4 h-4" />
            Sign in to Save
          </button>
        ) : (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${showHistory ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'}`}
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Close History' : 'Saved Ads'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 min-h-[500px]"
          >
            <h2 className="text-3xl font-bold tracking-tight">Your Saved Ads</h2>
            {savedAds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/30 space-y-4">
                <History className="w-12 h-12" />
                <p>No saved ads yet. Start generating!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedAds.map((ad) => (
                  <div key={ad.id} className="glass p-4 rounded-2xl flex items-center justify-between gap-4 group">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{ad.name} • ${ad.price}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{ad.location}</p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => {
                          setGeneratedAd(ad.text);
                          setFormData({ name: ad.name, price: ad.price, location: ad.location, description: '' });
                          setShowHistory(false);
                        }}
                        className="p-2 hover:bg-whatsapp/10 rounded-lg text-whatsapp transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteAd(ad.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Form */}
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-accent uppercase tracking-[0.2em] text-[10px] font-bold">Smart Status Creation</span>
                <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
                  Generate Your <br/><span className="text-whatsapp">WhatsApp Ad</span>
                </h2>
                <p className="text-sm text-white/40">AI-powered status ads that sell in seconds.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase opacity-50 font-bold tracking-wider">Product Name <span className="text-red-500">*</span></label>
                    {touched.name && errors.name && <span className="text-[10px] text-red-500 font-bold">{errors.name}</span>}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Nike Air Force 1"
                    className={`w-full bg-white/5 border rounded-xl py-3 px-4 focus:outline-none focus:ring-1 transition-all text-sm ${
                      touched.name && errors.name ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-whatsapp/50'
                    }`}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase opacity-50 font-bold tracking-wider">Price (USD) <span className="text-red-500">*</span></label>
                      {touched.price && errors.price && <span className="text-[8px] text-red-500 font-bold">{errors.price}</span>}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 45"
                      className={`w-full bg-white/5 border rounded-xl py-3 px-4 focus:outline-none focus:ring-1 transition-all text-sm italic opacity-80 ${
                        touched.price && errors.price ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-whatsapp/50'
                      }`}
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      onBlur={() => handleBlur('price')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase opacity-50 font-bold tracking-wider">Location <span className="text-red-500">*</span></label>
                      {touched.location && errors.location && <span className="text-[8px] text-red-500 font-bold">{errors.location}</span>}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Harare CBD"
                      className={`w-full bg-white/5 border rounded-xl py-3 px-4 focus:outline-none focus:ring-1 transition-all text-sm ${
                        touched.location && errors.location ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-whatsapp/50'
                      }`}
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                    />
                  </div>
                </div>

                <button
                  onClick={generateAd}
                  disabled={isGenerating}
                  className="w-full py-4 bg-accent hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 glow-orange group mt-4 relative overflow-hidden"
                  id="generate-ad-btn"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Generate Ad Text
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side: Display/Result */}
            <div className="relative h-full min-h-[400px]">
              <AnimatePresence mode="wait">
                {!generatedAd ? (
                  <motion.div
                    key="hero-img"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="rounded-3xl overflow-hidden border border-white/5 aspect-square relative"
                  >
                    <img
                      src={IMAGES.heroAd}
                      alt="Ad Generation"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ad-result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4 h-full"
                  >
                    {/* Mode Toggle Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                      <button 
                        onClick={() => setShowQR(false)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${!showQR ? 'bg-whatsapp text-navy shadow-lg' : 'text-white/60 hover:text-white'}`}
                      >
                        Chat Preview
                      </button>
                      <button 
                        onClick={() => setShowQR(true)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${showQR ? 'bg-orange-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                      >
                        Scan to Post
                      </button>
                    </div>

                    <div className="flex-1 glass rounded-3xl p-6 border-whatsapp/20 relative overflow-hidden flex flex-col items-center justify-center gap-6">
                      {!showQR ? (
                        <>
                          <div className="w-full flex items-center justify-between opacity-40">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                <div className="h-2 w-16 bg-white/20 rounded-full" />
                             </div>
                             <div className="flex gap-2">
                                {!user ? (
                                  <button 
                                    onClick={() => signIn()}
                                    title="Sign in to save"
                                    className="p-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2 group/login"
                                  >
                                    <span className="text-[10px] font-bold opacity-0 group-hover/login:opacity-100 transition-opacity">Save to History</span>
                                    <LogIn className="w-4 h-4 text-accent" />
                                  </button>
                                ) : (
                                  <button 
                                    onClick={saveAd}
                                    disabled={isSaving}
                                    title="Save to History"
                                    className={`p-2 rounded-lg transition-all ${isSaving ? 'opacity-50' : 'hover:bg-white/10'}`}
                                  >
                                    <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
                                  </button>
                                )}
                                <MessageCircle className="w-4 h-4" />
                             </div>
                          </div>
                          
                          {/* WhatsApp Bubble */}
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#056162] text-white p-4 rounded-2xl rounded-tr-none relative shadow-xl max-w-[90%] self-end"
                          >
                             <div className="text-sm italic leading-relaxed whitespace-pre-wrap">
                                {generatedAd}
                             </div>
                             <div className="text-[9px] text-white/40 mt-1 text-right">
                               {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                             {/* Bubble tail */}
                             <div className="absolute top-0 right-[-8px] w-0 h-0 border-t-[10px] border-t-[#056162] border-r-[10px] border-r-transparent" />
                          </motion.div>

                          <div className="flex flex-col gap-2 w-full mt-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={handleCopy}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                              >
                                {copied ? <Check className="w-4 h-4 text-whatsapp" /> : <Copy className="w-4 h-4 opacity-60" />}
                                {copied ? 'Copied' : 'Copy'}
                              </button>
                              <button 
                                onClick={() => {
                                  if (navigator.share) {
                                    navigator.share({
                                      title: `HustleLink Ad: ${formData.name}`,
                                      text: generatedAd,
                                    }).catch(console.error);
                                  } else {
                                    handleCopy();
                                  }
                                }}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                              >
                                <Share2 className="w-4 h-4 opacity-60" />
                                Share
                              </button>
                            </div>
                            <a 
                              href={whatsappShareLink}
                              target="_blank"
                              className="w-full py-3 bg-whatsapp hover:bg-whatsapp-dark text-navy rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg shadow-whatsapp/20"
                            >
                              <Send className="w-4 h-4" />
                              Post to WhatsApp
                            </a>
                          </div>
                        </>
                      ) : (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <div className="p-4 bg-white rounded-[24px] shadow-2xl glow-orange">
                             <QRCodeSVG 
                                value={webPreviewUrl} 
                                size={160}
                                level="H"
                                fgColor="#0D1B2A"
                                imageSettings={{
                                  src: IMAGES.icon,
                                  x: undefined,
                                  y: undefined,
                                  height: 30,
                                  width: 30,
                                  excavate: true,
                                }}
                             />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm font-bold text-navy">Scan for Web Preview</p>
                            <p className="text-[10px] text-navy/40 uppercase tracking-widest leading-relaxed">
                              Scan to see exactly how your <br/> ad looks on mobile
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold uppercase tracking-tight">
                            <QrIcon className="w-3 h-3" />
                            HustleLink Smart Preview
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-2">
                       <p className="text-[10px] text-white/30 uppercase tracking-tighter">AI-Generated Status</p>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
