import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Laptop, Code, Mail } from 'lucide-react';
import { apiService } from '../../Service/api';
import { useSettings } from '../../context/SettingsContext';

const Header = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleEngagement = (action: string) => {
    try {
      apiService.post('/api/stats/engage', { action });
    } catch(e) {}
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4 bg-background/60 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Laptop className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            {settings.logoDisplay === 'image' && settings.logoImageUrl ? (
              <img src={settings.logoImageUrl} alt={settings.siteName} className="h-8 object-contain" />
            ) : (
              settings.siteName.split(' ').map((word, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-primary italic">{word}</span> : word + ' '}
                </React.Fragment>
              ))
            )}
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </motion.a>
          ))}
      </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black tracking-tighter text-white hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <a href={settings.socialGithub || '#'} target="_blank" rel="noopener noreferrer" onClick={() => handleEngagement('header_github')}>
                    <Code className="w-6 h-6 text-secondary hover:text-white transition-colors" />
                  </a>
                  <a href={settings.socialX || '#'} target="_blank" rel="noopener noreferrer" onClick={() => handleEngagement('header_x')}>
                    <X className="w-6 h-6 text-secondary hover:text-white transition-colors" />
                  </a>
                  <a href={`mailto:${settings.contactEmail || 'admin@fintechpoint.com'}`} onClick={() => handleEngagement('header_email')}>
                    <Mail className="w-6 h-6 text-secondary hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;