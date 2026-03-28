import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';

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
      className={styles.navWrapper}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
      >
        <div className={styles.logo}>
          <span className={styles.logoCharcoal}>Listing</span>
          <span className={styles.logoOrange}>Pitch</span>
        </div>

        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a className={styles.link} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={`${styles.actions} ${styles.desktopActions}`}>
          <button className={styles.btnOutline}>See a Sample List</button>
          <button className={styles.btnSolid}>Start Free Preview</button>
        </div>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              className={styles.link}
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className={styles.actions}>
            <button className={styles.btnOutline}>See a Sample List</button>
            <button className={styles.btnSolid}>Start Free Preview</button>
          </div>
        </div>
      </nav>
    </motion.div>
  );
}

export default Navbar;
