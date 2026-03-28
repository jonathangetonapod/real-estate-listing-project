import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  '250 verified leads per month',
  '1 farm area (up to 3 zip codes)',
  'AI-drafted email pitches for every lead',
  'All lead types: expireds, FSBOs, pre-foreclosure, absentee, high equity, probate',
  'We send on your behalf with your name and brand',
  'Automated warm-up and deliverability (94% inbox rate)',
  'Reply management in-platform',
  'Follow-up sequences',
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Pricing() {
  return (
    <section id="pricing" className="bg-light-bg px-5 py-20">
      <motion.h2
        className="mx-auto mb-4 text-center font-heading text-4xl font-bold leading-tight text-dark md:text-[44px]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        One Listing Covers the Entire Year
      </motion.h2>

      <motion.p
        className="mx-auto mb-12 max-w-xl text-center font-sans text-lg text-gray-500"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        One plan. Everything included. No upsells, no feature gates.
      </motion.p>

      {/* Zillow vs ListSignal anchor */}
      <motion.div
        className="mx-auto mb-10 flex max-w-xl items-center overflow-hidden rounded-xl border border-gray-300 bg-white"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex-1 bg-red-50 px-6 py-5 text-center">
          <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-gray-400">
            Zillow Leads
          </span>
          <span className="block font-mono text-2xl font-bold text-red-700 line-through">
            $1,200+/mo
          </span>
          <span className="mt-1 block font-sans text-xs text-gray-400">
            Shared with dozens of agents
          </span>
        </div>

        <div className="px-4 font-sans text-sm font-semibold text-gray-400">
          vs
        </div>

        <div className="flex-1 bg-green-50 px-6 py-5 text-center">
          <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-gray-400">
            ListSignal
          </span>
          <span className="block font-mono text-2xl font-bold text-green-600">
            $99/mo
          </span>
          <span className="mt-1 block font-sans text-xs text-gray-400">
            Exclusive to your zip code
          </span>
        </div>
      </motion.div>

      {/* Single pricing card */}
      <motion.div
        className="mx-auto max-w-lg"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <Card className="rounded-xl bg-white py-0 ring-2 ring-orange">
          <CardContent className="flex flex-col p-8">
            <span className="font-sans text-sm font-semibold uppercase tracking-wide text-orange">
              ListSignal
            </span>

            <div className="mt-3 mb-2 flex items-baseline gap-1">
              <span className="font-heading text-6xl font-bold leading-none text-charcoal">
                $99
              </span>
              <span className="font-sans text-lg text-gray-400">/month</span>
            </div>

            <p className="mb-8 font-sans text-sm text-gray-500">
              At a 6% commission on a $400K home, one closed deal is $12,000 in GCI. This pays for itself 10x over.
            </p>

            <ul className="mb-8 list-none space-y-0">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 py-2 font-sans text-[15px] leading-relaxed text-charcoal"
                >
                  <span className="mt-0.5 shrink-0 text-base text-success">
                    &#10003;
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="h-auto w-full rounded-lg bg-orange px-6 py-4 font-sans text-base font-semibold text-white transition-colors hover:bg-orange/90"
            >
              Start Free Preview
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.p
        className="mt-5 text-center font-sans text-sm text-gray-400"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        No contracts. Cancel anytime. See your first leads before you pay.
      </motion.p>

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-center font-sans text-base leading-relaxed text-gray-500"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        The average agent spends $1,200/month on shared Zillow leads.
        ListSignal delivers exclusive, verified seller data with AI-drafted pitches
        for less than one showing&apos;s worth of gas money.
      </motion.p>
    </section>
  );
}

export default Pricing;
