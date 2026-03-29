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
    a: 'No. We handle all data sourcing, skip-tracing, and email verification. No exporting CSVs, no manual lookups, no separate subscriptions. You open your dashboard and 3-step sequences with A/B/C variations are ready to review and approve.',
  },
  {
    q: "Can homeowners tell it's AI-written?",
    a: 'Our AI generates 3-step sequences with A/B/C variations per step, each referencing property-specific details: the address, asking price, days on market, nearby comps, and equity data. You pick the variation that sounds most like you. Every email reads like you spent 5 minutes writing it personally. No [First Name] merge tags, no generic scripts.',
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
    a: 'We set up a protected sending domain for you, which takes 14-21 days to warm up. This is non-negotiable \u2014 it\u2019s what keeps your emails out of spam. Once warm-up is done, your 3-step sequences auto-deploy on business days. Most agents see their first replies within 3-4 weeks, and you can track every step on the sequence timeline.',
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
    a: 'Their reply shows up in your Inbox as a conversation thread. Tag it with a sentiment label \u2014 Interested, Warm, Not Interested, Meeting Set, Follow Up, or Closed \u2014 and respond directly from the platform. Move hot leads into your Deals pipeline with five drag-and-drop stages: Positive Reply \u2192 Following Up \u2192 Meeting Scheduled \u2192 Nurturing \u2192 Closed.',
  },
  {
    q: "I\u2019ve tried lead gen services before and they didn\u2019t work.",
    a: 'Most lead gen gives you a name and a phone number and says \u201Cgo call them.\u201D OffMarket is different \u2014 we give you verified emails, full property and financial data, and 3-step email sequences with A/B/C variations that reference real comps. Replies land in your Inbox as threaded conversations, and your Deals pipeline tracks every lead from Positive Reply through Closed. You\u2019re not cold-prospecting. You\u2019re running a system.',
  },
  {
    q: 'What if I want to cancel?',
    a: 'Cancel anytime from your dashboard. No calls, no retention team, no hoops. Your data and conversation history stay available for 30 days after cancellation.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-white px-4 py-12 md:px-5 md:py-20">
      <motion.h2
        className="mx-auto mb-8 md:mb-12 text-center font-heading text-3xl md:text-4xl font-bold leading-tight text-dark"
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
                <AccordionTrigger className="py-4 md:py-5 min-h-[44px] font-heading text-base md:text-lg font-bold leading-snug text-dark hover:no-underline text-left">
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
