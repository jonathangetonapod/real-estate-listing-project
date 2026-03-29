import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    title: 'Pick Your Market',
    description:
      'Choose your zip codes and lead types \u2014 expireds, FSBOs, pre-foreclosures, absentee owners, high equity, probate. We source from 160M+ property records and deliver within 12 hours.',
    detail: 'Zip + lead types',
  },
  {
    number: 2,
    title: 'Get Verified Seller Leads with Full Data',
    description:
      'Every lead comes with property type, sqft, year built, lot size, zoning, lender, loan amount, interest rate, tax bill, owner name, mailing address, phone numbers, and verified emails. Grouped by order batch and ready to work.',
    detail: 'Rich CREXI data',
  },
  {
    number: 3,
    title: 'Review 3-Step Sequences with A/B/C Variations',
    description:
      'For each lead, we generate a 3-step email sequence with A/B/C variations per step. Open the pitch slide-over to preview, pick your preferred variation, and adjust business-day timing between steps.',
    detail: '3 steps \u00d7 3 variations',
  },
  {
    number: 4,
    title: 'Approve and Auto-Deploy',
    description:
      'Hit approve and your sequences auto-deploy on business days. Every email goes out with your name and brand. We handle warm-up, rotation, and deliverability behind the scenes. Track delivery status on the sequence timeline.',
    detail: 'Business-day send',
  },
  {
    number: 5,
    title: 'Manage Replies and Close Deals',
    description:
      'Replies land in your Inbox as conversation threads. Tag each with a sentiment label \u2014 Interested, Warm, Not Interested, Meeting Set, Follow Up, or Closed. Move hot leads to your Deals pipeline and drag them through five stages: Positive Reply \u2192 Following Up \u2192 Meeting Scheduled \u2192 Nurturing \u2192 Closed.',
    detail: '5-stage pipeline',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function HowItWorks() {
  return (
    <section className="bg-light-bg py-12 px-4 md:py-20 md:px-5" id="how-it-works">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-block font-mono text-xs font-medium uppercase tracking-widest text-orange mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-3xl md:text-[44px] font-bold text-dark leading-tight">
            Farm Area to First Reply<br className="hidden md:block" /> in Under 30 Days
          </h2>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Vertical timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-charcoal/10 hidden md:block" />

          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="group relative flex gap-6 md:gap-8"
                variants={stepVariants}
              >
                {/* Number + connector */}
                <div className="relative flex flex-col items-center shrink-0">
                  <div className={cn(
                    'relative z-10 w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300',
                    'bg-charcoal text-white group-hover:bg-orange'
                  )}>
                    {step.number}
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 pb-6 md:pb-10">
                  <div className="rounded-xl border border-transparent bg-white p-4 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:border-orange/20 group-hover:shadow-[0_2px_8px_rgba(255,89,36,0.06)]">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-heading text-lg font-bold text-dark leading-snug">
                        {step.title}
                      </h3>
                      <span className="shrink-0 rounded-md bg-orange/8 px-2.5 py-1 font-mono text-[11px] font-medium text-orange">
                        {step.detail}
                      </span>
                    </div>
                    <p className="font-sans text-[15px] text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="ml-[-33px] mt-2 mb-[-8px] hidden md:flex items-center">
                      <div className="w-1 h-1 rounded-full bg-charcoal/20" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
