/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapPin, Search, Menu, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGES } from '../constants';
import { auth, signIn } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

export default function Header() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 md:px-12 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-whatsapp rounded-xl flex items-center justify-center glow-green overflow-hidden">
            <img 
              src={IMAGES.icon} 
              alt="HustleLink" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">HustleLink</span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium opacity-70">
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Marketplace</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Messages</span>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <MapPin className="w-4 h-4 text-whatsapp" />
            <span className="text-white">Harare, ZW</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.button
                key="signin"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => signIn()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold text-sm"
                id="header-signin-btn"
              >
                <LogIn className="w-4 h-4 text-whatsapp" />
                <span className="hidden sm:inline">Sign In</span>
              </motion.button>
            ) : (
              <div className="relative">
                <motion.button
                  key="userprofile"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-xl border-2 border-whatsapp/50 overflow-hidden glow-green"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-navy flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-whatsapp" />
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-48 glass rounded-2xl p-4 shadow-2xl border-white/10 z-[60]"
                    >
                      <div className="pb-3 border-b border-white/5 mb-3">
                        <p className="text-xs font-bold text-white truncate">{user.displayName || 'User'}</p>
                        <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full text-left text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>

          <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors" id="mobile-menu-btn">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
