import styles from './Footer.module.css';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          Listing<span className={styles.logoAccent}>Pitch</span>
        </div>

        <nav className={styles.links}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p className={styles.copyright}>
        &copy; 2026 ListingPitch. Not affiliated with any MLS or brokerage.
      </p>
    </footer>
  );
}

export default Footer;
