import { motion } from 'framer-motion';

const cards = [
  {
    indicator: 'bg-orange',
    title: 'Zillow leads cost $1,200+/mo. You share them with 47 agents.',
    body: "You\u2019re paying for a phone number that 47 other agents also bought. By the time you call, the homeowner is annoyed and you\u2019re competing on speed, not value.",
  },
  {
    indicator: 'bg-charcoal',
    title: 'Cold calling works. It just eats your whole morning.',
    body: "You can dial 100 numbers for 3 conversations, or email 500 verified sellers this week. Same hustle, 25x the reach. ListSignal warms up your pipeline so every call is to someone who already knows your name.",
  },
  {
    indicator: 'bg-danger',
    title: 'Generic templates get deleted.',
    body: "Homeowners can smell a mass email from a mile away. If it doesn\u2019t feel personal, it\u2019s spam. If it references their actual property data and nearby comps, it\u2019s a conversation.",
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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function ProblemSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="mx-auto mb-14 max-w-2xl text-center font-heading text-4xl font-bold leading-tight text-charcoal md:text-[44px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          You Know Who Wants to Sell. You Just Can&rsquo;t Reach Them All.
        </motion.h2>

        <motion.div
          className="mx-auto grid max-w-[500px] grid-cols-1 gap-6 md:max-w-none md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-8"
              variants={cardVariants}
            >
              <span className={`mb-4 block h-2.5 w-2.5 rounded-full ${card.indicator}`} />
              <h3 className="mb-3 font-heading text-xl font-bold leading-snug text-charcoal">
                {card.title}
              </h3>
              <p className="font-sans text-[15px] leading-relaxed text-gray-600">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ProblemSection;
