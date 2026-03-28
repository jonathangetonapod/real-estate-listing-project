import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function InlineCTA({ heading }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-light-bg py-12 px-6">
      <motion.div
        className="mx-auto max-w-md"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-60px' }}
      >
        {heading && (
          <h3 className="font-heading text-2xl font-bold text-center text-charcoal mb-6">
            {heading}
          </h3>
        )}

        {submitted ? (
          <motion.p
            className="font-sans text-base font-semibold text-success text-center py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            You&apos;re on the list.
          </motion.p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                'flex-1 rounded-xl bg-white border border-gray-200 px-4 py-3',
                'font-sans text-sm text-charcoal placeholder:text-gray-400',
                'outline-none focus:border-orange focus:ring-2 focus:ring-orange/20',
                'transition-all duration-200'
              )}
            />
            <Button
              type="submit"
              className="h-auto rounded-xl bg-orange text-white font-sans text-sm font-semibold px-6 py-3 border-orange hover:bg-orange/90 transition-colors duration-200 whitespace-nowrap"
            >
              Join the Waitlist &rarr;
            </Button>
          </form>
        )}

        <p className="font-sans text-xs text-gray-400 text-center mt-4">
          No credit card. We&apos;ll notify you when your market opens.
        </p>
      </motion.div>
    </section>
  );
}

export default InlineCTA;
