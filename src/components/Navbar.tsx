import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Menu, X, Rocket } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onAuth: () => void;
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = memo(({ onNavigate, onAuth, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: 'landing' },
    { name: 'Pricing', path: 'pricing' },
    { name: 'About', path: 'about' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-300 transform-gpu",
        scrolled ? "bg-zinc-950/80 backdrop-blur-lg py-4 border-b border-zinc-900" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white cursor-pointer group"
            onClick={() => handleNavClick('landing')}
          >
            <div className="bg-rose-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            ViralMeets
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest outline-none"
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <button
                  onClick={onLogout}
                  className="text-xs font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
                >
                  Logout
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick('home')}
                  className="px-6 py-2 bg-white text-black text-xs font-black rounded-full uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform-gpu"
                >
                  Dashboard
                </motion.button>
              </div>
            ) : (
              <>
                <button
                  onClick={onAuth}
                  className="text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors outline-none"
                >
                  Login
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onAuth}
                  className="px-6 py-2.5 bg-rose-600 text-white text-xs font-black rounded-full uppercase tracking-widest hover:shadow-[0_0_20px_rgba(225,29,72,0.2)] hover:bg-rose-500 transition-all transform-gpu"
                >
                  Register
                </motion.button>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] md:hidden transform-gpu"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-zinc-950 border-l border-zinc-900 p-8 z-[80] md:hidden flex flex-col transform-gpu will-change-transform"
            >
              <div className="flex items-center justify-between mb-12">
                <span className="text-xl font-black text-white tracking-tighter">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className="text-lg font-bold text-zinc-400 hover:text-white text-left uppercase tracking-widest outline-none"
                  >
                    {item.name}
                  </button>
                ))}
                
                <div className="h-px bg-zinc-900 my-4" />

                {user ? (
                  <>
                    <button
                      onClick={() => handleNavClick('home')}
                      className="text-lg font-bold text-rose-500 text-left uppercase tracking-widest outline-none"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { onLogout(); setIsMenuOpen(false); }}
                      className="text-lg font-bold text-zinc-500 text-left uppercase tracking-widest outline-none"
                    >
                      Logout
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';
