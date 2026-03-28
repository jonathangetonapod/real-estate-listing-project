import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const starterFeatures = [
  '1 farm area (up to 3 zip codes)',
  '500 emails/month',
  'AI writes in your voice',
  'All lead types included',
  'Automated email warm-up (94% inbox rate)',
  'Reply notifications in real time',
];

const growthFeatures = [
  'Unlimited farm areas',
  '1,500 emails/month',
  'AI writes in your voice + automated follow-ups',
  'All lead types included',
  'Visual pipeline: lead → pitch → reply → appointment',
  'Priority support',
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

function PricingCard({ planName, price, features, featured = false }) {
  return (
    <Card
      className={cn(
        'flex-1 rounded-xl bg-white py-0 ring-0',
        featured && 'ring-2 ring-orange'
      )}
    >
      <CardContent className="flex flex-col p-8">
        <span
          className={cn(
            'font-sans text-sm font-semibold uppercase tracking-wide text-gray-400',
            featured && 'text-orange'
          )}
        >
          {planName}
        </span>

        <div className="mt-3 mb-7 flex items-baseline gap-1">
          <span className="font-heading text-5xl font-bold leading-none text-charcoal">
            {price}
          </span>
          <span className="font-sans text-lg text-gray-400">/month</span>
        </div>

        <ul className="mb-8 flex-1 list-none space-y-0">
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
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-light-bg px-5 py-20">
      <motion.h2
        className="mx-auto mb-12 text-center font-heading text-4xl font-bold leading-tight text-dark md:text-[44px]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        One Listing Pays for 2+ Years of ListingPitch
      </motion.h2>

      {/* Zillow vs ListingPitch anchor */}
      <motion.div
        className="-mt-6 mx-auto mb-10 flex max-w-xl items-center overflow-hidden rounded-xl border border-gray-300 bg-white"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className="flex-1 bg-red-50 px-6 py-5 text-center">
          <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-gray-400">
            Zillow
          </span>
          <span className="block font-mono text-2xl font-bold text-red-700 line-through">
            $1,200+/mo
          </span>
          <span className="mt-1 block font-sans text-xs text-gray-400">
            Shared with 47 agents
          </span>
        </div>

        <div className="px-4 font-sans text-sm font-semibold text-gray-400">
          vs
        </div>

        <div className="flex-1 bg-green-50 px-6 py-5 text-center">
          <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-gray-400">
            ListingPitch
          </span>
          <span className="block font-mono text-2xl font-bold text-green-600">
            $199/mo
          </span>
          <span className="mt-1 block font-sans text-xs text-gray-400">
            Exclusive to your zip code
          </span>
        </div>
      </motion.div>

      {/* Pricing cards */}
      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-stretch gap-6 md:flex-row"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <PricingCard
          planName="Starter"
          price="$199"
          features={starterFeatures}
        />
        <PricingCard
          planName="Growth — Most Popular"
          price="$299"
          features={growthFeatures}
          featured
        />
      </motion.div>

      <motion.p
        className="mt-5 text-center font-sans text-sm text-gray-400"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        14-day free trial. No contracts. Cancel in one click. If you don&apos;t book a conversation, we&apos;ll refund every penny.
      </motion.p>

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-center font-sans text-base leading-relaxed text-gray-500"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        The average agent spends $1,200/month on Zillow leads that 47 other
        agents also get. ListingPitch gives you exclusive, direct access to
        motivated sellers for a fraction of the cost.
      </motion.p>
    </section>
  );
}

export default Pricing;
