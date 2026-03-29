import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Log In', href: '#login' },
  ];

  return (
    <motion.div
      className="sticky top-3 z-[1000] flex justify-center px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav
        className={cn(
          'relative w-full max-w-5xl flex items-center justify-between px-6 py-3 bg-white border border-border rounded-xl transition-shadow duration-300',
          scrolled && 'shadow-sm'
        )}
      >
        {/* Logo */}
        <a href="/" className="font-heading text-[22px] font-bold leading-none cursor-pointer select-none no-underline">
          <span className="text-charcoal">Off</span>
          <span className="text-orange">Market</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                className="font-sans text-sm font-medium text-charcoal whitespace-nowrap transition-colors duration-200 hover:text-orange"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link to="/waitlist">
            <Button
              className="rounded-full bg-orange text-white font-sans text-sm font-semibold px-6 py-2.5 border-orange hover:bg-orange/90 transition-colors duration-200"
            >
              Join the Waitlist
            </Button>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col justify-center items-center gap-[5px] w-11 h-11 bg-transparent border-none cursor-pointer p-1"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              'block w-[22px] h-0.5 bg-charcoal rounded-sm transition-all duration-300',
              mobileOpen && 'translate-y-[7px] rotate-45'
            )}
          />
          <span
            className={cn(
              'block w-[22px] h-0.5 bg-charcoal rounded-sm transition-all duration-300',
              mobileOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block w-[22px] h-0.5 bg-charcoal rounded-sm transition-all duration-300',
              mobileOpen && '-translate-y-[7px] -rotate-45'
            )}
          />
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            'absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-border rounded-xl p-6 flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
            mobileOpen ? 'flex md:hidden' : 'hidden'
          )}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="font-sans text-base font-medium text-charcoal py-3 min-h-[44px] flex items-center transition-colors duration-200 hover:text-orange"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/waitlist" onClick={() => setMobileOpen(false)}>
            <Button
              className="w-full rounded-full bg-orange text-white font-sans text-sm font-semibold px-6 py-3 min-h-[44px] border-orange hover:bg-orange/90 transition-colors duration-200"
            >
              Join the Waitlist
            </Button>
          </Link>
        </div>
      </nav>
    </motion.div>
  );
}

export default Navbar;
