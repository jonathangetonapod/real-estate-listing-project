const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-dark px-4 py-8 md:px-5 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <div className="font-heading text-lg font-bold text-white">
          Off<span className="text-orange">Market</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-sm text-gray-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="mt-6 text-center font-sans text-[13px] text-[#666]">
        &copy; 2026 OffMarket. Not affiliated with any MLS or brokerage.
      </p>
    </footer>
  );
}

export default Footer;
