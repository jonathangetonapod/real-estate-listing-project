import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    title: 'Tell Us Your Farm Area',
    description:
      'Pick your zip codes. Within 12 hours, we deliver a curated list of motivated sellers \u2014 expireds, FSBOs, pre-foreclosures, absentee owners \u2014 sourced from 155M+ property records.',
    detail: '12hr turnaround',
  },
  {
    number: 2,
    title: 'Skip-Traced and Verified',
    description:
      'Every lead comes with skip-traced email addresses, property details, equity estimates, days on market, and original listing price. Data that would take hours to compile yourself \u2014 delivered ready to go.',
    detail: 'Verified emails',
  },
  {
    number: 3,
    title: 'Sends From Your Brand',
    description:
      'Every email goes out from a protected domain with your name and brand. Warm-up, rotation, and deliverability are handled automatically. Homeowners see you, not us.',
    detail: '94% inbox rate',
  },
  {
    number: 4,
    title: 'Pitch Them in Your Voice',
    description:
      'Our AI references the property address, asking price, nearby comps, and days on market to draft a pitch that sounds like you. Review it, tweak it, and hit send.',
    detail: 'AI-assisted',
  },
  {
    number: 5,
    title: 'Replies Land in Your Dashboard',
    description:
      'When a seller responds, it shows up in your pipeline instantly. Track conversations, set follow-ups, and move leads from reply to listing appointment \u2014 all in one place.',
    detail: 'Full pipeline',
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
    <section className="bg-light-bg py-20 px-5" id="how-it-works">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="inline-block font-mono text-xs font-medium uppercase tracking-widest text-orange mb-4">
            How It Works
          </span>
          <h2 className="font-heading text-4xl md:text-[44px] font-bold text-dark leading-tight">
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
                <div className="flex-1 pb-8 md:pb-10">
                  <div className="rounded-xl border border-transparent bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:border-orange/20 group-hover:shadow-[0_2px_8px_rgba(255,89,36,0.06)]">
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
