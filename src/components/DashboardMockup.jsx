import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const metrics = [
  { label: 'Seller Leads', value: '248', color: 'orange', change: '250 limit', changeType: 'neutral' },
  { label: 'Pitches Sent', value: '186', color: 'green', change: '558 emails total', changeType: 'up' },
  { label: 'Inbox Replies', value: '14', color: 'orange', change: '7.5% reply rate', changeType: 'up' },
  { label: 'Active Deals', value: '6', color: 'default', change: '2 meetings set', changeType: 'up' },
];

const allLeads = [
  {
    name: 'Michael Torres',
    address: '4821 Oakwood Dr, Riverside Heights',
    value: '$485K',
    sqft: '2,840 ft²',
    year: '2004',
    typeBadge: 'Expired',
    statusBadge: 'Sent',
    statusVariant: 'Green',
    avatar: 'MT',
  },
  {
    name: 'Sarah Kim',
    address: '1203 Maple Ridge Ln, Canyon Crest',
    value: '$392K',
    sqft: '1,480 ft²',
    year: '2011',
    typeBadge: 'FSBO',
    statusBadge: 'Sent',
    statusVariant: 'Green',
    avatar: 'SK',
  },
  {
    name: 'David Hernandez',
    address: '892 Sunset Blvd, Palm Canyon',
    value: '$520K',
    sqft: '2,890 ft²',
    year: '1998',
    typeBadge: 'Expired',
    statusBadge: 'Draft',
    statusVariant: 'Orange',
    avatar: 'DH',
  },
  {
    name: 'Linda Chen',
    address: '2710 Harbor View Dr, Eastlake',
    value: '$415K',
    sqft: '1,920 ft²',
    year: '2006',
    typeBadge: 'FSBO',
    statusBadge: 'Not Contacted',
    statusVariant: 'neutral',
    avatar: 'LC',
  },
];

const typeFilters = ['All Types', 'Expired', 'FSBO'];
const statusFilters = ['All Status', 'Sent', 'Draft', 'Not Contacted'];

const sidebarItems = [
  { label: 'Home' },
  { label: 'Order New Leads' },
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
  neutral: 'bg-gray-100 text-gray-500 border-gray-200',
};

const typeBadgeStyleMap = {
  Expired: 'bg-danger/10 text-danger border-danger/20',
  FSBO: 'bg-blue-50 text-blue-600 border-blue-200',
};

const avatarColorMap = {
  Green: 'bg-success',
  Orange: 'bg-orange',
  neutral: 'bg-gray-400',
};

export function DashboardMockup() {
  const [activeTypeFilter, setActiveTypeFilter] = useState('All Types');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Status');
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Seller Leads');

  const filteredLeads = allLeads.filter(l => {
    const typeMatch = activeTypeFilter === 'All Types' || l.typeBadge === activeTypeFilter;
    const statusMatch = activeStatusFilter === 'All Status' || l.statusBadge === activeStatusFilter;
    return typeMatch && statusMatch;
  });

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
            <span className="font-sans text-xs text-gray-500">app.offmarket.com/seller-leads</span>
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
              {/* Header metrics bar */}
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

              {/* Seller Leads view */}
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                {/* Order group header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="font-sans text-sm font-bold text-charcoal">
                      Order #1024
                    </div>
                    <span className="font-sans text-[12px] text-gray-400">·</span>
                    <span className="font-sans text-[12px] text-gray-400">Mar 15, 2026</span>
                    <span className="font-sans text-[12px] text-gray-400">—</span>
                    <span className="font-mono text-[12px] font-medium text-orange">248 leads</span>
                  </div>
                  <div className="hidden gap-2 md:flex">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-charcoal transition-colors duration-150 hover:bg-gray-50"
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-orange px-3 py-1.5 font-sans text-[11px] font-semibold text-white transition-colors duration-150 hover:bg-orange/90"
                    >
                      + Pitch All
                    </button>
                  </div>
                </div>

                {/* Filter bar */}
                <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-2.5">
                  <div className="flex gap-1">
                    {typeFilters.map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={cn(
                          'rounded-md px-2.5 py-1 font-sans text-[11px] font-medium transition-colors duration-150',
                          activeTypeFilter === tab
                            ? 'bg-charcoal text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                        onClick={() => setActiveTypeFilter(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <div className="flex gap-1 overflow-x-auto">
                    {statusFilters.map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={cn(
                          'rounded-md px-2.5 py-1 font-sans text-[11px] font-medium transition-colors duration-150',
                          activeStatusFilter === tab
                            ? 'bg-charcoal text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                        onClick={() => setActiveStatusFilter(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table head */}
                <div className="hidden grid-cols-[2fr_0.8fr_0.7fr_0.6fr_0.6fr_0.7fr] gap-3 border-b border-gray-50 px-4 py-2 md:grid">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Owner / Address
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Value
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Size
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Year
                  </span>
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Type
                  </span>
                  <span className="text-right font-sans text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </span>
                </div>

                {/* Lead rows */}
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.name}
                    className={cn(
                      'grid cursor-pointer grid-cols-1 gap-2 border-b border-gray-50 px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-gray-50/50 md:grid-cols-[2fr_0.8fr_0.7fr_0.6fr_0.6fr_0.7fr] md:items-center md:gap-3',
                      selectedLead === lead.name && 'border-l-[3px] border-l-orange bg-orange/[0.03]'
                    )}
                    onClick={() => setSelectedLead(selectedLead === lead.name ? null : lead.name)}
                  >
                    {/* Owner / Address */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg font-sans text-[11px] font-bold text-white',
                          avatarColorMap[lead.statusVariant]
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

                    {/* Value */}
                    <div>
                      <span className="font-mono text-[13px] font-semibold text-charcoal">
                        {lead.value}
                      </span>
                    </div>

                    {/* Size */}
                    <div>
                      <span className="font-sans text-[12px] text-gray-600">
                        {lead.sqft}
                      </span>
                    </div>

                    {/* Year */}
                    <div>
                      <span className="font-sans text-[12px] text-gray-600">
                        {lead.year}
                      </span>
                    </div>

                    {/* Type badge */}
                    <div>
                      <Badge
                        className={cn(
                          'rounded-md border px-2 py-0.5 text-[10px] font-semibold',
                          typeBadgeStyleMap[lead.typeBadge]
                        )}
                      >
                        {lead.typeBadge}
                      </Badge>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-start md:justify-end">
                      <Badge
                        className={cn(
                          'rounded-md border px-2.5 py-0.5 text-[11px] font-semibold',
                          badgeStyleMap[lead.statusVariant]
                        )}
                      >
                        {lead.statusBadge}
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
