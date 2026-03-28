import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const faqData = [
  {
    q: 'Will this hurt my email reputation?',
    a: 'We never touch your personal email. Every email goes out from our managed infrastructure with your name and brand in the from field. We handle warm-up, rotation, and deliverability. Replies come into your OffMarket dashboard.',
  },
  {
    q: 'How is this different from buying Zillow leads?',
    a: 'Zillow leads are shared with up to 50 agents. OffMarket emails go directly from you to the homeowner. No competition, no bidding, no sharing. And at $99/mo vs $1,200+/mo, the math speaks for itself.',
  },
  {
    q: 'Do I need any other tools?',
    a: 'No. We handle all data sourcing, skip-tracing, and email verification. No exporting CSVs, no manual lookups, no separate subscriptions. You open your dashboard and the pitches are ready.',
  },
  {
    q: "Can homeowners tell it's AI-written?",
    a: 'Our AI references property-specific details: the address, asking price, days on market, nearby comps, and equity data. Every email reads like you spent 5 minutes writing it personally. No [First Name] merge tags, no generic scripts.',
  },
  {
    q: 'Is cold emailing homeowners legal?',
    a: 'Yes, when done properly under CAN-SPAM. Every email includes your real identity, physical address, and one-click unsubscribe. We handle compliance automatically.',
  },
  {
    q: 'How many listings can I expect?',
    a: 'Our benchmark is 3-5 listing conversations per month from 250 leads. At a 6% commission on a $400K home, one closed deal is $12,000 in GCI. A single listing from OffMarket pays for the entire year.',
  },
  {
    q: 'How long until I see results?',
    a: 'We set up a protected sending domain for you, which takes 14-21 days to warm up. This is non-negotiable \u2014 it\u2019s what keeps your emails out of spam. Most agents see their first replies within 3-4 weeks. Once warm-up is done, you have a reliable outreach channel that works month after month.',
  },
  {
    q: 'Can I customize which lead types I target?',
    a: 'Yes. You choose which lead types to include, set filters for price range, equity level, days expired, and more. You control who gets pitched.',
  },
  {
    q: 'Is my farm area exclusive?',
    a: 'We limit the number of agents per zip code to avoid overlap. When your farm area is full, new agents are waitlisted until a slot opens. This keeps your outreach effective and your competition low.',
  },
  {
    q: 'What happens after a homeowner replies?',
    a: 'Their reply shows up in your OffMarket dashboard instantly. You respond directly from the platform. Your $99/mo plan includes a visual pipeline to track every conversation from first reply to listing signed.',
  },
  {
    q: "I\u2019ve tried lead gen services before and they didn\u2019t work.",
    a: 'Most lead gen gives you a name and a phone number and says \u201Cgo call them.\u201D OffMarket is different \u2014 we give you verified emails, property-specific data, and AI-drafted pitches that reference real comps. You\u2019re not cold-prospecting. You\u2019re reaching out with market intel they don\u2019t have.',
  },
  {
    q: 'What if I want to cancel?',
    a: 'Cancel anytime from your dashboard. No calls, no retention team, no hoops. Your data and conversation history stay available for 30 days after cancellation.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-white px-5 py-20">
      <motion.h2
        className="mx-auto mb-12 text-center font-heading text-4xl font-bold leading-tight text-dark"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Questions Agents Ask Before Signing Up
      </motion.h2>

      <div className="mx-auto max-w-2xl">
        <Accordion>
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: 'easeOut',
              }}
            >
              <AccordionItem value={`faq-${index}`}>
                <AccordionTrigger className="py-5 font-heading text-lg font-bold leading-snug text-dark hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-5 font-sans text-[15px] leading-relaxed text-gray-500">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
