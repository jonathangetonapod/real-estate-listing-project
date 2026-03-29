import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const metrics = [
  { label: 'Seller Leads', value: '248', color: 'orange', change: '250 limit', changeType: 'neutral' },
  { label: 'Sequences Sent', value: '186', color: 'green', change: '558 emails total', changeType: 'up' },
  { label: 'Inbox Replies', value: '14', color: 'orange', change: '7.5% reply rate', changeType: 'up' },
  { label: 'Deals in Pipeline', value: '6', color: 'default', change: '2 meetings set', changeType: 'up' },
];

const allLeads = [
  {
    name: 'Michael Torres',
    address: '4821 Oakwood Dr, Riverside Heights',
    match: 94,
    badge: 'Replied',
    badgeVariant: 'Green',
    price: '$485K',
    equity: 'SFR \u00b7 2,140 sqft \u00b7 2003',
    daysInfo: 'Expired 47d ago',
    avatar: 'MT',
    type: 'Expired',
  },
  {
    name: 'Sarah Kim',
    address: '1203 Maple Ridge Ln, Canyon Crest',
    match: 87,
    badge: 'Sequence Active',
    badgeVariant: 'Orange',
    price: '$392K',
    equity: 'Condo \u00b7 1,480 sqft \u00b7 2011',
    daysInfo: 'Step 2 of 3 sent',
    avatar: 'SK',
    type: 'FSBO',
  },
  {
    name: 'David Hernandez',
    address: '892 Sunset Blvd, Palm Canyon',
    match: 91,
    badge: 'Sent',
    badgeVariant: 'Green',
    price: '$520K',
    equity: 'SFR \u00b7 2,890 sqft \u00b7 1998',
    daysInfo: 'NOD filed 34d ago',
    avatar: 'DH',
    type: 'Pre-Foreclosure',
  },
  {
    name: 'Linda Chen',
    address: '2710 Harbor View Dr, Eastlake',
    match: 82,
    badge: 'Sequence Active',
    badgeVariant: 'Orange',
    price: '$415K',
    equity: 'SFR \u00b7 1,920 sqft \u00b7 2006',
    daysInfo: 'Step 1 of 3 sent',
    avatar: 'LC',
    type: 'Expired',
  },
  {
    name: 'Robert Williams',
    address: '558 Palm Ave, Northpark',
    match: 78,
    badge: 'Sent',
    badgeVariant: 'Green',
    price: '$349K',
    equity: 'Duplex \u00b7 1,650 sqft \u00b7 1985',
    daysInfo: 'All 3 steps complete',
    avatar: 'RW',
    type: 'FSBO',
  },
];

const tabFilters = ['All', 'Sequence Active', 'Sent', 'Replied'];

const sidebarItems = [
  { label: 'Home' },
  { label: 'Seller Leads' },
  { label: 'Pitches Sent' },
  { label: 'Inbox' },
  { label: 'My Deals' },
  { label: 'Settings' },
];

const metricValueColorMap = {
  orange: 'text-orange',
  green: 'text-success',
  default: 'text-charcoal',
};

const badgeStyleMap = {
  Green: 'bg-success/10 text-success border-success/20',
  Orange: 'bg-orange/10 text-orange border-orange/20',
  Red: 'bg-danger/10 text-danger border-danger/20',
};

const avatarColorMap = {
  Green: 'bg-success',
  Orange: 'bg-orange',
  Red: 'bg-danger',
};

function MatchBar({ value }) {
  return (
    <div className="h-1 w-full max-w-[80px] overflow-hidden rounded-sm bg-gray-100">
      <div
        className="h-full rounded-sm bg-orange transition-all duration-300 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Home');

  const filteredLeads = activeTab === 'All'
    ? allLeads
    : allLeads.filter(l => l.badge === activeTab);

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
            <span className="font-sans text-xs text-gray-500">app.offmarket.com/dashboard</span>
          </div>
          <div className="w-[50px] shrink-0" />
        </div>

        <div className="bg-gray-50">
          <div className="flex min-h-[420px]">
            {/* Sidebar */}
            <div className="hidden w-[200px] shrink-0 flex-col bg-charcoal py-4 md:flex">
              <div className="mb-4 flex items-center gap-2 border-b border-white/[0.08] px-4 pb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange text-[11px] font-bold text-white">
                  OM
                </span>
                <span className="font-heading text-sm font-bold text-white">
                  OffMarket
                </span>
              </div>

              <nav className="flex flex-1 flex-col gap-0.5 px-2">
                {sidebarItems.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-left font-sans text-[13px] transition-colors duration-150',
                      activeSidebarItem === item.label
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white/70'
                    )}
                    onClick={() => setActiveSidebarItem(item.label)}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.08] px-4 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange text-[11px] font-bold text-white">
                  SJ
                </div>
                <div className="font-sans text-xs text-white/70">Sarah Johnson</div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden p-4 md:p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="font-sans text-lg font-bold text-charcoal">
                    Good morning, Sarah
                  </div>
                  <div className="mt-0.5 font-sans text-[13px] text-gray-500">
                    186 sequences deployed. 14 replies in your Inbox. 6 deals in pipeline.
                  </div>
                </div>
                <div className="hidden gap-2 md:flex">
                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-sans text-xs font-semibold text-charcoal transition-colors duration-150 hover:bg-gray-50"
                  >
                    Export
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-orange px-4 py-2 font-sans text-xs font-semibold text-white transition-colors duration-150 hover:bg-orange/90"
                  >
                    + Request Leads
                  </button>
                </div>
              </div>

              {/* Metric cards */}
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-gray-100 bg-white p-3 md:p-4"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="font-sans text-[11px] font-medium uppercase tracking-wide text-gray-500">
                        {metric.label}
                      </div>
                      <div
                        className={cn(
                          'rounded px-1.5 py-0.5 font-mono text-[10px] font-medium',
                          metric.changeType === 'up'
                            ? 'bg-success/10 text-success'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {metric.changeType === 'up' && '^ '}{metric.change}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'font-mono text-xl md:text-[28px] font-bold leading-none',
                        metricValueColorMap[metric.color]
                      )}
                    >
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead table */}
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <div className="font-sans text-sm font-bold text-charcoal">
                    Recent Leads
                  </div>
                  <div className="flex gap-1 overflow-x-auto">
                    {tabFilters.map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={cn(
                          'rounded-md px-2.5 py-1 font-sans text-[11px] font-medium transition-colors duration-150',
                          activeTab === tab
                            ? 'bg-charcoal text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table head */}
                <div className="hidden grid-cols-[2fr_1.2fr_1fr_0.8fr] gap-3 border-b border-gray-50 px-4 py-2 md:grid">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Contact
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Property
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Match
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </span>
                </div>

                {/* Lead rows */}
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.name}
                    className={cn(
                      'grid cursor-pointer grid-cols-1 gap-2 border-b border-gray-50 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-gray-50/50 md:grid-cols-[2fr_1.2fr_1fr_0.8fr] md:items-center md:gap-3',
                      selectedLead === lead.name && 'border-l-[3px] border-l-orange bg-orange/[0.03]'
                    )}
                    onClick={() => setSelectedLead(selectedLead === lead.name ? null : lead.name)}
                  >
                    {/* Contact */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-sans text-[11px] font-bold text-white',
                          avatarColorMap[lead.badgeVariant]
                        )}
                      >
                        {lead.avatar}
                      </div>
                      <div className="flex min-w-0 flex-col gap-px">
                        <span className="truncate font-sans text-[13px] font-semibold text-charcoal">
                          {lead.name}
                        </span>
                        <span className="truncate font-sans text-[11px] text-gray-400">
                          {lead.address}
                        </span>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="flex flex-col gap-px">
                      <span className="font-mono text-[13px] font-semibold text-charcoal">
                        {lead.price}
                      </span>
                      <span className="font-sans text-[11px] text-gray-400">
                        {lead.equity}
                      </span>
                      <span className="font-sans text-[11px] text-gray-400">
                        {lead.daysInfo}
                      </span>
                    </div>

                    {/* Match */}
                    <div className="flex flex-row items-center gap-2 md:flex-col md:items-start md:gap-1">
                      <span className="font-mono text-sm font-bold text-orange">
                        {lead.match}%
                      </span>
                      <MatchBar value={lead.match} />
                    </div>

                    {/* Status */}
                    <div className="flex justify-start md:justify-end">
                      <Badge
                        className={cn(
                          'rounded-md border px-2.5 py-0.5 text-[11px] font-semibold',
                          badgeStyleMap[lead.badgeVariant]
                        )}
                      >
                        {lead.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMockup;
