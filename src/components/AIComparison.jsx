import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Data sources we actually have access to:
// - Owner name (public records / skip-trace)
// - Property address, lot size, bed/bath, sqft (public records)
// - Listing price, days on market, listing status (MLS)
// - Estimated equity (public records + AVM)
// - Nearby comps: address, sale price, date (MLS)
// - Neighborhood median price trends (MLS aggregates)
// We do NOT have: interior details, personal info, or anything requiring a visit

const examples = [
  {
    type: 'Expired Listing',
    property: '4821 Oakwood Dr, Riverside Heights',
    daysExpired: 47,
    dataUsed: ['MLS listing history', 'Days expired', 'Nearby sold comps', 'Original list price'],
    generic: {
      subject: 'Your Home at 4821 Oakwood Dr',
      body: 'Hi [First Name], I noticed your home at [Address] is no longer on the market. I\'d love to discuss how I can help you sell your home. Please call me at your convenience. Best regards, [Agent Name]',
    },
    ai: {
      subject: 'Oakwood Dr comp just closed at $485K',
      body: 'Hi there, your listing at 4821 Oakwood Dr came off the MLS about 47 days ago at $459K. I wanted to reach out because a 3-bed on the same block just closed at $485K last week, and another on Elm sold for $30K over asking. The market in Riverside Heights has shifted since your listing went up. I think there\'s a real pricing window right now. I put together a quick comp analysis. Want me to send it over?',
      highlights: ['47 days ago at $459K', 'just closed at $485K last week', '$30K over asking', 'pricing window right now', 'quick comp analysis'],
    },
  },
  {
    type: 'FSBO',
    property: '1203 Maple Ridge Ln, Canyon Crest',
    daysListed: 68,
    dataUsed: ['FSBO listing data', 'Days listed', 'Comparable sales', 'Asking price vs market'],
    generic: {
      subject: 'Interested in Helping You Sell',
      body: 'Hello, I saw that your property at [Address] is for sale by owner. I specialize in your area and would love the opportunity to help you get the best price. Let me know if you\'d like to schedule a call.',
    },
    ai: {
      subject: 'Canyon Crest 3-beds are moving fast. Yours hasn\'t.',
      body: 'Hi, I see your place at 1203 Maple Ridge has been listed FSBO for about 68 days now at $389K. Here\'s what caught my eye: three similar 3-bed homes in Canyon Crest closed in the last 30 days, all between $395-$415K, and all in under 2 weeks. The difference? Professional staging photos and MLS exposure. Your home is priced competitively but not getting the visibility it needs. I can show you what a full MLS listing strategy would look like. No commitment. Want me to run the numbers?',
      highlights: ['68 days now at $389K', '$395-$415K', 'under 2 weeks', 'staging photos and MLS exposure', 'run the numbers'],
    },
  },
  {
    type: 'Pre-Foreclosure',
    property: '892 Sunset Blvd, Palm Canyon',
    dataUsed: ['NOD filing date', 'Estimated equity', 'Property value (AVM)', 'Lot size'],
    generic: {
      subject: 'Can I Help With Your Property?',
      body: 'Dear Homeowner, I understand you may be going through a difficult time. I am a real estate professional who helps homeowners explore their options. Please don\'t hesitate to reach out if you\'d like to discuss your situation.',
    },
    ai: {
      subject: 'Options for 892 Sunset before the timeline runs out',
      body: 'Hi, I\'m reaching out about your property at 892 Sunset Blvd. I know this may be a sensitive time, so I\'ll keep it brief. Based on recent sales in Palm Canyon, your home is valued around $520-540K, and public records show significant equity. Homes on your street are selling in 20-30 days right now. There are a few paths forward: a traditional sale, a short sale, or a lease-back arrangement. I work with homeowners in this situation regularly and can walk you through your options in 15 minutes. Completely confidential, no pressure.',
      highlights: ['valued around $520-540K', 'significant equity', 'selling in 20-30 days', 'traditional sale, a short sale, or a lease-back', 'Completely confidential'],
    },
  },
  {
    type: 'Absentee Owner',
    property: '3347 Elm Street, Northpark',
    dataUsed: ['Owner mailing address (out-of-area)', 'Property type', 'Tax records', 'Area sale trends'],
    generic: {
      subject: 'Considering Selling Your Investment Property?',
      body: 'Hi [Name], Are you considering selling your investment property at [Address]? The market is favorable right now and I can provide a free market analysis. Please contact me at your earliest convenience.',
    },
    ai: {
      subject: 'Northpark multifamily is up 12% YoY. Your Elm St property.',
      body: 'Hi, I noticed from county records that you own the property at 3347 Elm St in Northpark. Multifamily properties in this zip code are trading at a 12% premium over last year. A comparable unit on Pine Street just closed at $620K. I work with several out-of-area owners in Northpark and wanted to flag the current market. Whether you\'re considering selling, exploring a 1031 exchange, or just want to know what the property is worth today, I can send over a no-obligation valuation. Takes 2 minutes to review.',
      highlights: ['county records', '12% premium over last year', 'just closed at $620K', '1031 exchange', 'no-obligation valuation'],
    },
  },
];

function highlightText(text, highlights) {
  if (!highlights || highlights.length === 0) return text;
  let result = text;
  const parts = [];
  let lastIndex = 0;

  const sortedHighlights = [...highlights].sort((a, b) => {
    const indexA = result.indexOf(a);
    const indexB = result.indexOf(b);
    return indexA - indexB;
  });

  for (const highlight of sortedHighlights) {
    const index = result.indexOf(highlight, lastIndex);
    if (index === -1) continue;
    if (index > lastIndex) {
      parts.push({ text: result.slice(lastIndex, index), highlighted: false });
    }
    parts.push({ text: highlight, highlighted: true });
    lastIndex = index + highlight.length;
  }
  if (lastIndex < result.length) {
    parts.push({ text: result.slice(lastIndex), highlighted: false });
  }

  return parts.map((part, i) =>
    part.highlighted ? (
      <mark key={i} className="bg-orange/12 text-charcoal italic px-0.5 rounded-sm">{part.text}</mark>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

export function AIComparison() {
  const [activeIndex, setActiveIndex] = useState(0);
  const example = examples[activeIndex];

  return (
    <section className="bg-lime py-12 px-4 md:py-20 md:px-5">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          className="font-heading text-[26px] md:text-[30px] lg:text-[44px] font-bold text-charcoal text-center mb-3 leading-tight"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          Not Another Template Tool.<br />
          <span className="text-charcoal/60 italic">This Actually Sounds Like You.</span>
        </motion.h2>

        {/* Carousel tabs */}
        <motion.div
          className="flex justify-center gap-2 mb-6 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {examples.map((ex, i) => (
            <button
              key={i}
              className={cn(
                'rounded-3xl px-3.5 py-1.5 font-sans text-[13px] md:px-5 md:py-2 md:text-sm font-semibold cursor-pointer transition-all duration-200 border min-h-[44px] flex items-center',
                i === activeIndex
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-charcoal/8 border-charcoal/12 text-charcoal hover:bg-charcoal/15'
              )}
              onClick={() => setActiveIndex(i)}
            >
              {ex.type}
            </button>
          ))}
        </motion.div>

        {/* Property context bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`context-${activeIndex}`}
            className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 mb-5 flex-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-base">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-charcoal/40 mr-1" />
            </span>
            <span className="font-sans text-[15px] font-semibold text-charcoal">
              {example.property}
            </span>
            {example.daysExpired && (
              <Badge variant="outline" className="font-mono text-xs font-medium px-3 py-1 rounded-full bg-[#FFE8E8] text-danger border-transparent">
                Expired {example.daysExpired}d ago
              </Badge>
            )}
            {example.daysListed && (
              <Badge variant="outline" className="font-mono text-xs font-medium px-3 py-1 rounded-full bg-[#FFF3E0] text-orange border-transparent">
                Listed {example.daysListed}d (FSBO)
              </Badge>
            )}
            <Badge variant="outline" className="font-mono text-xs font-medium px-3 py-1 rounded-full bg-charcoal/8 text-charcoal border-transparent">
              {example.type}
            </Badge>
          </motion.div>
        </AnimatePresence>

        {/* Email comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 max-w-[960px] mx-auto mb-6">
          <AnimatePresence mode="wait">
            {/* Generic */}
            <motion.div
              key={`generic-${activeIndex}`}
              className="bg-white rounded-xl overflow-hidden border-2 border-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 border-b border-[#eee]">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFE8E8] text-danger text-sm font-bold leading-none">
                  ✕
                </span>
                <span className="font-sans text-[15px] font-semibold text-charcoal">
                  Generic template
                </span>
                <Badge variant="outline" className="ml-auto font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FFE8E8] text-danger border-transparent">
                  Low response rate
                </Badge>
              </div>
              <div className="p-4 md:p-5 md:px-6">
                <div className="font-sans text-sm font-semibold text-charcoal mb-3">
                  <span className="font-normal text-muted-foreground mr-1.5">Subject:</span>
                  {example.generic.subject}
                </div>
                <div className="h-px bg-[#eee] mb-3.5" />
                <p className="font-sans text-sm italic text-[#555555] leading-7">
                  &ldquo;{example.generic.body}&rdquo;
                </p>
              </div>
              <div className="flex flex-col gap-1 md:flex-wrap md:flex-row md:gap-2 px-4 py-3 md:px-6 md:py-3.5 bg-[#FFF8F6] border-t border-[#FFE8E8] font-sans text-xs font-medium text-danger">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger" /> No personalization
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger" /> No property data
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger" /> Feels like spam
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* AI */}
            <motion.div
              key={`ai-${activeIndex}`}
              className="bg-white rounded-xl overflow-hidden border-2 border-success shadow-[0_4px_24px_rgba(1,159,17,0.1)]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 border-b border-[#eee]">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f9e9] text-success text-sm font-bold leading-none">
                  ✓
                </span>
                <span className="font-sans text-[15px] font-semibold text-charcoal">
                  OffMarket AI
                </span>
                <Badge variant="outline" className="ml-auto font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#e6f9e9] text-success border-transparent">
                  3-5x higher reply rate
                </Badge>
              </div>
              <div className="p-4 md:p-5 md:px-6">
                <div className="font-sans text-sm font-semibold text-charcoal mb-3">
                  <span className="font-normal text-muted-foreground mr-1.5">Subject:</span>
                  {example.ai.subject}
                </div>
                <div className="h-px bg-[#eee] mb-3.5" />
                <p className="font-sans text-sm italic text-[#555555] leading-7">
                  &ldquo;{highlightText(example.ai.body, example.ai.highlights)}&rdquo;
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 md:px-6 border-t border-[#eee]">
                <span className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-wide">
                  Data used:
                </span>
                {example.dataUsed.map((src, i) => (
                  <Badge key={i} variant="outline" className="font-mono text-[10px] font-medium px-2 py-0.5 rounded bg-success/6 text-success border-success/15">
                    {src}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col gap-1 md:flex-wrap md:flex-row md:gap-2 px-4 py-3 md:px-6 md:py-3.5 bg-[#F0FDF4] border-t border-[#d1fae5] font-sans text-xs font-medium text-success">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" /> 3-step sequence with A/B/C variations
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" /> Uses real MLS comps & public records
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" /> Replies land in your Inbox as threads
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel dots */}
        <div className="flex justify-center gap-2 mb-8">
          {examples.map((_, i) => (
            <button
              key={i}
              className={cn(
                'h-2.5 rounded-full border-none cursor-pointer transition-all duration-200 p-0',
                i === activeIndex
                  ? 'bg-charcoal w-7 rounded-[5px]'
                  : 'bg-charcoal/15 w-2.5 hover:bg-charcoal/30'
              )}
              onClick={() => setActiveIndex(i)}
              aria-label={`Example ${i + 1}`}
            />
          ))}
        </div>

        <motion.p
          className="font-sans text-base text-charcoal text-center max-w-[700px] mx-auto leading-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Every 3-step sequence is built from real MLS data, public records, and recent comps. No fake details. No placeholders.
          When they reply, the conversation thread lands in your Inbox. Tag it, respond, and move hot leads into your Deals pipeline.
        </motion.p>
      </div>
    </section>
  );
}

export default AIComparison;
