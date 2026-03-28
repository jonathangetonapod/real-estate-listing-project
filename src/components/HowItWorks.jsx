import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    title: 'Tell Us Your Farm Area',
    description:
      'Pick your zip codes. Within 12 hours, we deliver a curated list of motivated sellers \u2014 expireds, FSBOs, pre-foreclosures, absentee owners \u2014 sourced from 155M+ property records.',
  },
  {
    number: 2,
    title: 'Skip-Traced and Verified',
    description:
      'Every lead comes with skip-traced email addresses, property details, equity estimates, days on market, and original listing price. The same data that costs $99/month on PropStream \u2014 included free.',
  },
  {
    number: 3,
    title: 'Connect Your Gmail',
    description:
      'Link your email account in one click. Replies land in your real inbox. Homeowners see you, not us.',
  },
  {
    number: 4,
    title: 'Pitch Them in Your Voice',
    description:
      'Our AI references the property address, asking price, nearby comps, and days on market to draft a pitch that sounds like you. Review it, tweak it, and hit send.',
  },
  {
    number: 5,
    title: 'Replies Land in Your Dashboard',
    description:
      'When a seller responds, it shows up in your pipeline instantly. Track conversations, set follow-ups, and move leads from reply to listing appointment \u2014 all in one place.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function HowItWorks() {
  return (
    <section className="bg-light-bg py-20 px-5 sm:py-[60px]" id="how-it-works">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          className="font-heading text-4xl sm:text-[28px] md:text-[34px] lg:text-[44px] font-bold text-dark text-center mb-14 sm:mb-10 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Farm Area to First Reply in Under 30 Days
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className="flex flex-col items-center text-center p-5 sm:p-6"
              variants={stepVariants}
            >
              <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center font-sans text-lg font-bold mb-5 shrink-0">
                {step.number}
              </div>
              <h3 className="font-heading text-lg font-bold text-dark mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-sm text-[#555555] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
