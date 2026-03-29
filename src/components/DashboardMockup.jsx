import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const metrics = [
  { label: 'Seller Leads', value: '248', color: 'orange', change: '250 limit', changeType: 'neutral' },
  { label: 'Pitches Sent', value: '186', color: 'green', change: '558 emails total', changeType: 'up' },
  { label: 'Inbox Replies', value: '14', color: 'orange', change: '7.5% reply rate', changeType: 'up' },
  { label: 'Active Deals', value: '6', color: 'default', change: '2 meetings set', changeType: 'up' },
];

const allLeads = [
  { name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', value: '$485K', sqft: '2,840 ft²', year: '2004', typeBadge: 'Expired', statusBadge: 'Sent', statusVariant: 'Green', avatar: 'MT' },
  { name: 'Sarah Kim', address: '1203 Maple Ridge Ln, Canyon Crest', value: '$392K', sqft: '1,480 ft²', year: '2011', typeBadge: 'FSBO', statusBadge: 'Sent', statusVariant: 'Green', avatar: 'SK' },
  { name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', value: '$520K', sqft: '2,890 ft²', year: '1998', typeBadge: 'Expired', statusBadge: 'Draft', statusVariant: 'Orange', avatar: 'DH' },
  { name: 'Linda Chen', address: '2710 Harbor View Dr, Eastlake', value: '$415K', sqft: '1,920 ft²', year: '2006', typeBadge: 'FSBO', statusBadge: 'Not Contacted', statusVariant: 'neutral', avatar: 'LC' },
];

const sampleInbox = [
  { name: 'Michael Torres', preview: 'Hi Sarah, thanks for reaching out. I have been thinking about relisting...', label: 'Interested', labelColor: 'bg-success/10 text-success border-success/20', unread: true, date: 'Mar 28' },
  { name: 'Maria Gonzalez', preview: 'Thank you for the information. My husband and I have been discussing...', label: 'Interested', labelColor: 'bg-success/10 text-success border-success/20', unread: true, date: 'Mar 27' },
  { name: 'David Hernandez', preview: 'Can we talk on the phone instead of email?', label: 'Warm Lead', labelColor: 'bg-orange/10 text-orange border-orange/20', unread: false, date: 'Mar 26' },
  { name: 'Robert Williams', preview: 'Not interested at this time.', label: 'Not Interested', labelColor: 'bg-gray-100 text-gray-400 border-gray-200', unread: false, date: 'Mar 25' },
];

const sampleDeals = [
  { stage: 'Positive Reply', deals: [{ name: 'Michael Torres', value: '$485K' }, { name: 'Maria Gonzalez', value: '$680K' }] },
  { stage: 'Following Up', deals: [{ name: 'David Hernandez', value: '$520K' }] },
  { stage: 'Meeting Scheduled', deals: [{ name: 'Jennifer Adams', value: '$445K' }] },
  { stage: 'Nurturing', deals: [{ name: 'Alex Nguyen', value: '$390K' }] },
  { stage: 'Closed', deals: [{ name: 'Chris Morales', value: '$510K' }] },
];

const stageColors = ['bg-success', 'bg-orange', 'bg-blue-500', 'bg-charcoal', 'bg-success'];

const sidebarItems = [
  { key: 'home', label: 'Home' },
  { key: 'leads', label: 'Seller Leads' },
  { key: 'sent', label: 'Pitches Sent' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'deals', label: 'My Deals' },
];

const typeFilters = ['All Types', 'Expired', 'FSBO'];
const statusFilters = ['All Status', 'Sent', 'Draft', 'Not Contacted'];

const metricValueColorMap = { orange: 'text-orange', green: 'text-success', default: 'text-charcoal' };
const badgeStyleMap = { Green: 'bg-success/10 text-success border-success/20', Orange: 'bg-orange/10 text-orange border-orange/20', neutral: 'bg-gray-100 text-gray-500 border-gray-200' };
const typeBadgeStyleMap = { Expired: 'bg-danger/10 text-danger border-danger/20', FSBO: 'bg-blue-50 text-blue-600 border-blue-200' };
const avatarColorMap = { Green: 'bg-success', Orange: 'bg-orange', neutral: 'bg-gray-400' };

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function HomeView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-gray-100 bg-white p-3 md:p-4">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="font-sans text-[11px] font-medium uppercase tracking-wide text-gray-500">{m.label}</div>
              <div className={cn('rounded px-1.5 py-0.5 font-mono text-[10px] font-medium', m.changeType === 'up' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500')}>
                {m.changeType === 'up' && '^ '}{m.change}
              </div>
            </div>
            <div className={cn('font-mono text-xl md:text-[28px] font-bold leading-none', metricValueColorMap[m.color])}>{m.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-gray-400">Needs Your Attention</p>
        <div className="rounded-xl border border-success/20 bg-success/[0.03] p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <span className="text-success text-xs font-bold">2</span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-charcoal">2 new replies from sellers</p>
            <p className="text-[11px] text-gray-500">Respond to keep the conversation going</p>
          </div>
        </div>
        <div className="rounded-xl border border-orange/20 bg-orange/[0.03] p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
            <span className="text-orange text-xs font-bold">62</span>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-charcoal">62 leads not yet contacted</p>
            <p className="text-[11px] text-gray-500">Generate pitches to reach these sellers</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-gray-400">Recent Activity</p>
        <div className="rounded-xl border border-gray-100 bg-white divide-y divide-gray-50">
          {[
            { text: '12 new email sequences ready for Riverside Heights sellers', time: '2h ago' },
            { text: '3 sequences delivered to Canyon Crest sellers', time: '4h ago' },
            { text: 'New response from homeowner at 4821 Oakwood Dr', time: '6h ago', highlight: true },
          ].map((a, i) => (
            <div key={i} className={cn('px-3 py-2.5 flex items-center justify-between', a.highlight && 'bg-orange/[0.02]')}>
              <p className={cn('text-[12px]', a.highlight ? 'font-medium text-charcoal' : 'text-gray-600')}>{a.text}</p>
              <span className="text-[10px] text-gray-400 shrink-0 ml-3 font-mono">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const leadDetails = {
  'Michael Torres': { type: 'Single Family', sqft: '2,840', built: '2004', lot: '0.18 ac', zoning: 'R-1', county: 'Riverside', lender: 'Wells Fargo', loan: '$300K', rate: '5.25%', tax: '$5,820/yr', insight: 'This home expired after 6 months on market. Properties on this block are selling in 20-30 days, suggesting a pricing issue, not a demand issue. A well-positioned pitch about recent comps could re-engage this seller.', phones: ['(951) 555-0142'], emails: ['mtorres@email.com'] },
  'Sarah Kim': { type: 'Single Family', sqft: '1,960', built: '2011', lot: '0.14 ac', zoning: 'R-1', county: 'Riverside', lender: 'Chase', loan: '$152K', rate: '3.75%', tax: '$4,480/yr', insight: 'Sarah listed her Canyon Crest home as FSBO 12 days ago. Similar homes with agent representation sold for 8-12% more in this zip code last quarter. She likely wants to save on commission but is leaving money on the table.', phones: ['(951) 555-0234'], emails: ['skim@email.com'] },
  'David Hernandez': { type: 'Single Family', sqft: '3,200', built: '1998', lot: '0.22 ac', zoning: 'R-1', county: 'Riverside', lender: 'Bank of America', loan: '$210K', rate: '4.50%', tax: '$6,240/yr', insight: 'David received a Notice of Default 34 days ago on his Palm Canyon property. With significant equity, he has motivation to sell before foreclosure proceedings advance. Time-sensitive outreach could be very effective.', phones: ['(760) 555-0312'], emails: ['dhernandez@email.com'] },
  'Linda Chen': { type: 'Townhouse', sqft: '2,100', built: '2008', lot: '0.08 ac', zoning: 'R-2', county: 'San Diego', lender: 'US Bank', loan: '$220K', rate: '6.00%', tax: '$4,980/yr', insight: 'Linda\'s Eastlake listing expired 21 days ago after being priced at $415K. Comparable homes closed at $400-430K in the last 60 days. A fresh marketing approach and updated staging could make the difference.', phones: ['(619) 555-0456'], emails: ['lchen@email.com'] },
};

function LeadsView() {
  const [activeTypeFilter, setActiveTypeFilter] = useState('All Types');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Status');
  const [selectedLead, setSelectedLead] = useState(null);

  const filteredLeads = allLeads.filter(l => {
    const typeMatch = activeTypeFilter === 'All Types' || l.typeBadge === activeTypeFilter;
    const statusMatch = activeStatusFilter === 'All Status' || l.statusBadge === activeStatusFilter;
    return typeMatch && statusMatch;
  });

  const detail = selectedLead ? leadDetails[selectedLead] : null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-orange" />
            <span className="font-sans text-[13px] font-bold text-charcoal">Order #1024</span>
            <span className="text-[11px] text-gray-400">· Mar 15, 2026</span>
            <span className="font-mono text-[11px] font-medium text-orange">248 leads</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1">
            {typeFilters.map(tab => (
              <button key={tab} type="button" className={cn('rounded-md px-2 py-1 text-[11px] font-medium transition-colors', activeTypeFilter === tab ? 'bg-charcoal text-white' : 'text-gray-500 hover:text-gray-700')} onClick={() => setActiveTypeFilter(tab)}>{tab}</button>
            ))}
          </div>
          <div className="h-3.5 w-px bg-gray-200" />
          <div className="flex gap-1">
            {statusFilters.map(tab => (
              <button key={tab} type="button" className={cn('rounded-md px-2 py-1 text-[11px] font-medium transition-colors', activeStatusFilter === tab ? 'bg-charcoal text-white' : 'text-gray-500 hover:text-gray-700')} onClick={() => setActiveStatusFilter(tab)}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredLeads.map((lead) => (
            <div key={lead.name}>
              <div className={cn('flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-gray-50/50', selectedLead === lead.name && 'bg-orange/[0.03]')} onClick={() => setSelectedLead(selectedLead === lead.name ? null : lead.name)}>
                <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white', avatarColorMap[lead.statusVariant])}>{lead.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-charcoal truncate">{lead.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{lead.address}</p>
                </div>
                <span className="font-mono text-[12px] font-bold text-charcoal hidden sm:block">{lead.value}</span>
                <span className="text-[11px] text-gray-500 hidden md:block">{lead.sqft}</span>
                <Badge className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-semibold hidden sm:inline-flex', typeBadgeStyleMap[lead.typeBadge])}>{lead.typeBadge}</Badge>
                <Badge className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-semibold', badgeStyleMap[lead.statusVariant])}>{lead.statusBadge}</Badge>
                <svg className={cn('w-3 h-3 text-gray-400 transition-transform shrink-0', selectedLead === lead.name && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Expanded detail panel */}
              <AnimatePresence initial={false}>
                {selectedLead === lead.name && detail && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 pt-0">
                      <div className="border-t border-gray-100 pt-3">
                        {/* CTA + Insight */}
                        <div className="flex flex-col md:flex-row gap-3 mb-3">
                          <div className="md:w-[140px] shrink-0">
                            <button type="button" className="w-full rounded-lg bg-orange px-3 py-2 text-[11px] font-semibold text-white hover:bg-orange/90 transition-colors">
                              {lead.statusBadge === 'Sent' ? 'View Sent Pitch' : 'Generate Pitch'}
                            </button>
                          </div>
                          <div className="flex-1 rounded-lg border-l-[2px] border-l-orange bg-orange/[0.03] px-3 py-2">
                            <p className="text-[9px] uppercase tracking-wider text-orange font-semibold mb-1">Why This Seller</p>
                            <p className="text-[10px] leading-relaxed text-gray-600">{detail.insight}</p>
                          </div>
                        </div>

                        {/* Data columns */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-lg border border-gray-100 p-2.5">
                            <p className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Property</p>
                            {[['Type', detail.type], ['Sq Ft', detail.sqft], ['Built', detail.built], ['Lot', detail.lot], ['Zoning', detail.zoning]].map(([k, v]) => (
                              <div key={k} className="flex justify-between mb-0.5">
                                <span className="text-[9px] text-gray-400">{k}</span>
                                <span className="text-[9px] font-medium text-charcoal font-mono">{v}</span>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-lg border border-gray-100 p-2.5">
                            <p className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Financial</p>
                            {[['Value', lead.value], ['Lender', detail.lender], ['Loan', detail.loan], ['Rate', detail.rate], ['Tax', detail.tax]].map(([k, v]) => (
                              <div key={k} className="flex justify-between mb-0.5">
                                <span className="text-[9px] text-gray-400">{k}</span>
                                <span className={cn('text-[9px] font-mono', k === 'Value' ? 'font-bold text-charcoal' : 'font-medium text-charcoal')}>{v}</span>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-lg border border-gray-100 p-2.5">
                            <p className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Contact</p>
                            <div className="mb-1">
                              <span className="text-[9px] text-gray-400">Owner</span>
                              <p className="text-[9px] font-medium text-charcoal">{lead.name}</p>
                            </div>
                            <div className="mb-1">
                              <span className="text-[9px] text-gray-400">Phone</span>
                              <p className="text-[9px] font-mono text-charcoal">{detail.phones[0]}</p>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400">Email</span>
                              <p className="text-[9px] font-mono text-charcoal truncate">{detail.emails[0]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div className="py-8 text-center text-[11px] text-gray-400">No leads match your filters</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SentView() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="space-y-4">
      <p className="font-sans text-[13px] font-bold text-charcoal">Pitches Sent <span className="font-normal text-gray-400">· 186 sequences delivered</span></p>
      <div className="space-y-1.5">
        {allLeads.filter(l => l.statusBadge === 'Sent').map((lead) => (
          <div key={lead.name} className="rounded-lg border border-gray-100 bg-white overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpanded(expanded === lead.name ? null : lead.name)}>
              <div className="w-2 h-2 rounded-full bg-success shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-charcoal truncate">{lead.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{lead.address}</p>
              </div>
              <span className="font-mono text-[11px] font-bold text-charcoal">{lead.value}</span>
              <Badge className="rounded-md border px-1.5 py-0.5 text-[9px] font-semibold bg-success/10 text-success border-success/20">Sent</Badge>
              <span className="text-[10px] text-gray-400">Mar 28</span>
            </div>
            {expanded === lead.name && (
              <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                <div className="flex items-center gap-2 py-2">
                  {['Delivered', 'Day 3', 'Day 7'].map((s, i) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold', i === 0 ? 'bg-success text-white' : 'bg-gray-100 text-gray-400')}>{i === 0 ? '✓' : i + 1}</div>
                      <span className="text-[10px] text-gray-500">{s}</span>
                      {i < 2 && <div className={cn('w-4 h-px', i === 0 ? 'bg-success' : 'bg-gray-200')} />}
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 text-[11px] text-gray-600 leading-relaxed">
                  Hi {lead.name.split(' ')[0]}, I noticed your home at {lead.address.split(',')[0]} and wanted to reach out...
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inboxThreads = {
  'Michael Torres': [
    { from: 'agent', name: 'Sarah Johnson', body: 'Hi Michael, I noticed your home at 4821 Oakwood Dr came off the market after 47 days. I specialize in Riverside Heights and have been tracking comparable sales nearby...', date: 'Mar 26' },
    { from: 'seller', name: 'Michael Torres', body: 'Hi Sarah, thanks for reaching out. I have been thinking about relisting and would be open to hearing what you have in mind. What does your schedule look like next week?', date: 'Mar 28' },
  ],
  'Maria Gonzalez': [
    { from: 'agent', name: 'Sarah Johnson', body: 'Hi Maria, I\'ve been tracking the Oceanside market closely, and homeowners like you with significant equity are in an exceptional position right now...', date: 'Mar 24' },
    { from: 'seller', name: 'Maria Gonzalez', body: 'Thank you for the information. My husband and I have been discussing downsizing. Could you send over those comparable sales you mentioned?', date: 'Mar 27' },
  ],
  'David Hernandez': [
    { from: 'agent', name: 'Sarah Johnson', body: 'Hi David, I understand you may be navigating a difficult situation with your property at 892 Sunset Blvd...', date: 'Mar 22' },
    { from: 'seller', name: 'David Hernandez', body: 'Can we talk on the phone instead? My number is (760) 555-0312, best time after 5pm.', date: 'Mar 26' },
  ],
  'Robert Williams': [
    { from: 'agent', name: 'Sarah Johnson', body: 'Hi Robert, I saw your listing at 558 Palm Ave and wanted to share some data...', date: 'Mar 20' },
    { from: 'seller', name: 'Robert Williams', body: 'Not interested at this time. Please remove me from your list.', date: 'Mar 25' },
  ],
};

function InboxView() {
  const [expandedThread, setExpandedThread] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? sampleInbox : sampleInbox.filter(t => t.label === activeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="font-sans text-[13px] font-bold text-charcoal">Inbox</p>
        <span className="inline-flex items-center rounded-full bg-orange px-1.5 py-0.5 text-[9px] font-bold text-white">2 new</span>
      </div>
      <div className="flex gap-1 flex-wrap">
        {['All', 'Interested', 'Warm Lead', 'Not Interested'].map(f => (
          <button key={f} type="button" className={cn('rounded-md px-2 py-1 text-[11px] font-medium transition-colors', activeFilter === f ? 'bg-charcoal text-white' : 'text-gray-500 hover:text-gray-700')} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="space-y-1.5">
        {filtered.map((thread) => (
          <div key={thread.name} className={cn('rounded-lg border bg-white overflow-hidden', thread.unread ? 'border-orange/20 bg-orange/[0.02]' : 'border-gray-100', expandedThread === thread.name && 'ring-1 ring-orange/10')}>
            <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedThread(expandedThread === thread.name ? null : thread.name)}>
              <div className={cn('w-2 h-2 rounded-full shrink-0', thread.unread ? 'bg-orange' : 'bg-transparent')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={cn('text-[12px] truncate', thread.unread ? 'font-bold text-charcoal' : 'font-semibold text-charcoal')}>{thread.name}</p>
                  <span className="text-[9px] text-gray-400">{thread.date}</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate">{thread.preview}</p>
              </div>
              <Badge className={cn('rounded-md border px-1.5 py-0.5 text-[9px] font-semibold shrink-0', thread.labelColor)}>{thread.label}</Badge>
              <svg className={cn('w-3 h-3 text-gray-400 transition-transform shrink-0', expandedThread === thread.name && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>

            <AnimatePresence initial={false}>
              {expandedThread === thread.name && inboxThreads[thread.name] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                    <div className="space-y-2 mt-2">
                      {inboxThreads[thread.name].map((msg, mi) => (
                        <div key={mi} className="flex gap-2">
                          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5', msg.from === 'agent' ? 'bg-orange text-white' : 'bg-charcoal text-white')}>
                            {msg.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-semibold text-charcoal">{msg.name}</span>
                              <span className={cn('text-[8px] px-1 py-0.5 rounded font-medium', msg.from === 'agent' ? 'bg-orange/10 text-orange' : 'bg-charcoal/10 text-charcoal')}>{msg.from === 'agent' ? 'You' : 'Seller'}</span>
                              <span className="text-[8px] text-gray-400">{msg.date}</span>
                            </div>
                            <div className={cn('rounded-lg p-2 text-[10px] leading-relaxed', msg.from === 'agent' ? 'bg-gray-50 text-gray-600' : 'bg-orange/[0.04] text-charcoal border border-orange/10')}>
                              {msg.body}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 rounded-lg border border-dashed border-gray-200 p-2 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange text-white flex items-center justify-center text-[8px] font-bold shrink-0">SJ</div>
                      <span className="text-[9px] text-gray-400 flex-1">Write a reply...</span>
                      <button type="button" className="rounded-md bg-orange px-2 py-1 text-[9px] font-semibold text-white">Reply</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealsView() {
  const [dealStages, setDealStages] = useState(sampleDeals);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const moveDeal = (fromStage, dealName) => {
    const fromIdx = dealStages.findIndex(s => s.stage === fromStage);
    if (fromIdx < 0 || fromIdx >= dealStages.length - 1) return;
    setDealStages(prev => {
      const next = prev.map(s => ({ ...s, deals: [...s.deals] }));
      const deal = next[fromIdx].deals.find(d => d.name === dealName);
      if (!deal) return prev;
      next[fromIdx].deals = next[fromIdx].deals.filter(d => d.name !== dealName);
      next[fromIdx + 1].deals.push(deal);
      return next;
    });
    setSelectedDeal(null);
  };

  const totalDeals = dealStages.reduce((sum, s) => sum + s.deals.length, 0);

  return (
    <div className="space-y-4">
      <p className="font-sans text-[13px] font-bold text-charcoal">My Deals <span className="font-normal text-gray-400">· {totalDeals} in pipeline</span></p>
      {/* Stage tracker */}
      <div className="flex items-center rounded-lg border border-gray-100 bg-white p-2.5">
        {dealStages.map((col, i) => (
          <div key={col.stage} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold', col.deals.length > 0 ? stageColors[i].replace('bg-', 'bg-') + '/10 ' + stageColors[i].replace('bg-', 'text-').replace('/10', '') : 'bg-gray-50 text-gray-300')}>{col.deals.length}</div>
              <span className="text-[8px] text-gray-500 mt-1 text-center leading-tight">{col.stage}</span>
            </div>
            {i < dealStages.length - 1 && <div className="h-px w-4 bg-gray-200 mt-[-12px]" />}
          </div>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dealStages.map((col, i) => (
          <div key={col.stage} className="min-w-[130px] flex-1 rounded-lg border border-gray-100 bg-white overflow-hidden">
            <div className="px-2.5 py-2 border-b border-gray-100 flex items-center gap-1.5">
              <div className={cn('w-1 h-3 rounded-full', stageColors[i])} />
              <span className="text-[10px] font-semibold text-charcoal">{col.stage}</span>
              <span className="ml-auto text-[9px] font-mono text-gray-400 font-bold">{col.deals.length}</span>
            </div>
            <div className="p-1.5 space-y-1 min-h-[50px]">
              {col.deals.map((d) => (
                <div key={d.name} className={cn('rounded border p-2 transition-all cursor-pointer', selectedDeal === d.name ? 'border-orange/30 bg-orange/[0.03] shadow-sm' : 'border-gray-100 hover:shadow-sm')} onClick={() => setSelectedDeal(selectedDeal === d.name ? null : d.name)}>
                  <p className="text-[10px] font-semibold text-charcoal leading-tight">{d.name}</p>
                  <p className="text-[9px] font-mono text-gray-500 mt-0.5">{d.value}</p>
                  {selectedDeal === d.name && i < dealStages.length - 1 && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); moveDeal(col.stage, d.name); }} className="mt-1.5 w-full text-[8px] text-orange hover:text-orange-hover font-medium flex items-center justify-center gap-0.5 py-1 rounded bg-orange/[0.05] hover:bg-orange/10 transition-colors">
                      Move to {dealStages[i + 1].stage} →
                    </button>
                  )}
                  {selectedDeal === d.name && col.stage === 'Closed' && (
                    <p className="mt-1.5 text-[8px] text-success font-medium text-center">✓ Deal closed</p>
                  )}
                </div>
              ))}
              {col.deals.length === 0 && <div className="py-4 text-center text-[9px] text-gray-300">No deals</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DashboardMockup() {
  const [activeView, setActiveView] = useState('leads');

  const urlMap = { home: '/home', leads: '/seller-leads', sent: '/pitches-sent', inbox: '/inbox', deals: '/my-deals' };

  return (
    <div className="flex justify-center px-4 py-12 md:px-6 md:py-16">
      <motion.div
        className="w-full max-w-[1000px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
            <span className="block h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
            <span className="block h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mx-auto flex max-w-[400px] flex-1 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1">
            <span className="text-[11px] text-gray-400">https://</span>
            <span className="font-sans text-xs text-gray-500">app.offmarket.com{urlMap[activeView]}</span>
          </div>
          <div className="w-[50px] shrink-0" />
        </div>

        <div className="bg-light-bg">
          <div className="flex min-h-[440px]">
            {/* Sidebar */}
            <div className="hidden w-[180px] shrink-0 flex-col bg-charcoal py-4 md:flex">
              <div className="mb-4 flex items-center gap-2 border-b border-white/[0.08] px-4 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange text-[11px] font-bold text-white">OM</span>
                <span className="font-heading text-sm font-bold text-white">OffMarket</span>
              </div>
              <nav className="flex flex-1 flex-col gap-0.5 px-2">
                {sidebarItems.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-left font-sans text-[12px] transition-colors duration-150',
                      activeView === item.key
                        ? 'bg-white/10 text-white font-medium border-l-[2px] border-l-orange pl-[10px]'
                        : 'text-white/50 hover:text-white/70 border-l-[2px] border-l-transparent pl-[10px]'
                    )}
                    onClick={() => setActiveView(item.key)}
                  >
                    {item.label}
                    {item.key === 'inbox' && <span className="ml-auto inline-flex items-center rounded-full bg-orange px-1 py-0.5 text-[8px] font-bold text-white">2</span>}
                  </button>
                ))}
              </nav>
              <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.08] px-4 pt-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">SJ</div>
                <div className="font-sans text-[11px] text-white/70">Sarah Johnson</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden p-4 md:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeView === 'home' && <HomeView />}
                  {activeView === 'leads' && <LeadsView />}
                  {activeView === 'sent' && <SentView />}
                  {activeView === 'inbox' && <InboxView />}
                  {activeView === 'deals' && <DealsView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMockup;
