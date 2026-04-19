import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Menu, X, Rocket, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { ProfileSettingsModal } from './ProfileSettingsModal';

import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onAuth: () => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = memo(({ onNavigate, onAuth, user, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        if (!scrolled) setScrolled(true);
      } else {
        if (scrolled) setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: 'Home', path: 'landing' },
    { name: 'Pricing', path: 'pricing' },
    { name: 'About', path: 'about' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const getUserInitial = () => {
    if (!user) return '?';
    const name = user.displayName || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-colors duration-200",
        scrolled ? "bg-zinc-950 px-0 py-3 border-b border-zinc-900" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white cursor-pointer group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="bg-rose-600 p-1.5 rounded-lg group-active:scale-95 transition-transform shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            ViralMeets
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest outline-none">Home</Link>
            <button onClick={() => handleNavClick('pricing')} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest outline-none">Pricing</button>
            <button onClick={() => handleNavClick('about')} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest outline-none">About</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-800"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-xs font-black text-white ring-2 ring-rose-900/20">
                      {getUserInitial()}
                    </div>
                  )}
                  <div 
                    className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsProfileSettingsOpen(true)}
                  >
                    <span className="text-[10px] font-black text-zinc-100 leading-none truncate max-w-[100px]">{user.displayName || 'Creator'}</span>
                    <span className="text-[8px] font-bold text-zinc-500 truncate max-w-[100px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-[10px] font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none flex items-center gap-1.5"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
                <button
                  onClick={() => handleNavClick('home')}
                  className="px-6 py-2 bg-white text-black text-xs font-black rounded-full uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition-all"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onAuth}
                  className="text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors outline-none"
                >
                  Login
                </button>
                <button
                  onClick={onAuth}
                  className="px-6 py-2.5 bg-rose-600 text-white text-xs font-black rounded-full uppercase tracking-widest hover:bg-rose-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)]"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-zinc-950 border-l border-zinc-900 p-8 z-[80] md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black text-white tracking-tighter uppercase tracking-widest text-xs opacity-50">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Section in Menu */}
              {user && (
                <div className="mb-10 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4 overflow-hidden">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg shadow-rose-900/20">
                        {getUserInitial()}
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-black text-white truncate">{user.displayName || 'Creator'}</span>
                      <span className="text-[10px] font-bold text-zinc-500 truncate">{user.email}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsProfileSettingsOpen(true); setIsMenuOpen(false); }}
                    className="p-2 bg-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-all flex items-center justify-center shrink-0"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-lg font-bold text-zinc-400 hover:text-white text-left uppercase tracking-widest outline-none pb-2 border-b border-zinc-900/50"
                  >
                    {item.name}
                  </button>
                ))}
                
                <div className="h-px bg-zinc-900 my-2" />

                {user ? (
                  <>
                    <button
                      onClick={() => handleNavClick('home')}
                      className="text-lg font-bold text-rose-500 text-left uppercase tracking-widest outline-none flex items-center justify-between"
                    >
                      Dashboard
                      <Rocket className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="text-lg font-bold text-zinc-500 text-left uppercase tracking-widest outline-none flex items-center justify-between mt-4"
                    >
                      Logout
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { onAuth(); setIsMenuOpen(false); }}
                      className="text-lg font-bold text-zinc-400 hover:text-white text-left uppercase tracking-widest outline-none"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { onAuth(); setIsMenuOpen(false); }}
                      className="text-lg font-bold text-rose-500 text-left uppercase tracking-widest outline-none"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>

              <div className="mt-auto pb-4">
                 <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] text-center">
                    © 2026 ViralMeets
                 </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ProfileSettingsModal 
        isOpen={isProfileSettingsOpen} 
        onClose={() => setIsProfileSettingsOpen(false)} 
        user={user}
      />
    </>
  );
});

Navbar.displayName = 'Navbar';
