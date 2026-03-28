import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileEdit,
  Send,
  MessageSquare,
  GitBranch,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Clock,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const leads = [
  { name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', type: 'Expired', match: 94, price: '$485K', equity: '$185K', days: '47d expired', draft: 'Ready', stage: 'Drafted', email: 'mtorres@email.com' },
  { name: 'Sarah Kim', address: '1203 Maple Ridge Ln, Canyon Crest', type: 'FSBO', match: 87, price: '$392K', equity: '$240K', days: '12d listed', draft: 'Ready', stage: 'Drafted', email: 'skim@email.com' },
  { name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', type: 'Pre-Foreclosure', match: 91, price: '$520K', equity: '$310K', days: 'NOD 34d', draft: 'Sent', stage: 'Sent', email: 'dhernandez@email.com' },
  { name: 'Linda Chen', address: '2710 Harbor View Dr, Eastlake', type: 'Expired', match: 82, price: '$415K', equity: '$195K', days: '21d expired', draft: 'Ready', stage: 'New', email: 'lchen@email.com' },
  { name: 'Robert Williams', address: '558 Palm Ave, Northpark', type: 'FSBO', match: 78, price: '$349K', equity: '$120K', days: '45d listed', draft: 'Pending', stage: 'New', email: 'rwilliams@email.com' },
  { name: 'Maria Gonzalez', address: '1847 Vista Del Mar, Oceanside', type: 'High Equity', match: 85, price: '$680K', equity: '$420K', days: '15yr owned', draft: 'Sent', stage: 'Opened', email: 'mgonzalez@email.com' },
];

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'leads', label: 'My Leads', icon: Users },
  { key: 'drafts', label: 'AI Drafts', icon: FileEdit },
  { key: 'sent', label: 'Sent', icon: Send },
  { key: 'replies', label: 'Replies', icon: MessageSquare },
  { key: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const tabMap = {
  dashboard: 'overview',
  leads: 'leads',
  drafts: 'drafts',
  pipeline: 'pipeline',
};

const activityFeed = [
  { text: 'AI drafted 12 new pitches for your Riverside Heights leads', time: '2h ago', icon: FileEdit, highlight: false },
  { text: '3 emails delivered to Canyon Crest FSBOs', time: '4h ago', icon: Send, highlight: false },
  { text: 'New reply from homeowner at 4821 Oakwood Dr', time: '6h ago', icon: MessageSquare, highlight: true },
  { text: 'Follow-up sent to 8 leads with no response', time: '1d ago', icon: ArrowRight, highlight: false },
];

const pipelineColumns = [
  { key: 'New', count: 12, color: 'border-t-gray-400' },
  { key: 'Drafted', count: 62, color: 'border-t-orange' },
  { key: 'Sent', count: 186, color: 'border-t-charcoal' },
  { key: 'Opened', count: 142, color: 'border-t-blue-500' },
  { key: 'Replied', count: 14, color: 'border-t-success' },
  { key: 'Appointment', count: 3, color: 'border-t-orange' },
  { key: 'Listed', count: 1, color: 'border-t-success' },
];

const pipelineLeads = {
  New: [
    { name: 'Linda Chen', address: '2710 Harbor View Dr', date: 'Mar 27' },
    { name: 'Robert Williams', address: '558 Palm Ave', date: 'Mar 26' },
  ],
  Drafted: [
    { name: 'Michael Torres', address: '4821 Oakwood Dr', date: 'Mar 28' },
    { name: 'Sarah Kim', address: '1203 Maple Ridge Ln', date: 'Mar 28' },
    { name: 'Linda Chen', address: '2710 Harbor View Dr', date: 'Mar 27' },
  ],
  Sent: [
    { name: 'David Hernandez', address: '892 Sunset Blvd', date: 'Mar 26' },
    { name: 'James Park', address: '441 Cedar St', date: 'Mar 25' },
  ],
  Opened: [
    { name: 'Maria Gonzalez', address: '1847 Vista Del Mar', date: 'Mar 27' },
    { name: 'Alex Nguyen', address: '320 Birch Ln', date: 'Mar 26' },
  ],
  Replied: [
    { name: 'Karen White', address: '1100 Elm Dr', date: 'Mar 28' },
    { name: 'Tom Bradley', address: '923 Pine Crest', date: 'Mar 27' },
  ],
  Appointment: [
    { name: 'Jennifer Adams', address: '560 Ocean Blvd', date: 'Mar 29' },
  ],
  Listed: [
    { name: 'Chris Morales', address: '2200 Summit Way', date: 'Mar 25' },
  ],
};

const draftEmail = {
  subject: 'Your Oakwood Dr Home — a Confidential Buyer May Be Interested',
  body: `Hi Michael,

I noticed your home at 4821 Oakwood Dr came off the market after 47 days. That can be frustrating, and I wanted to reach out because I may be able to help.

I specialize in the Riverside Heights area and have been tracking comparable sales nearby. Homes similar to yours on Oakwood Dr have recently sold between $475K and $510K, which tells me there's genuine buyer demand in your price range.

I have a few strategies that have worked well for other homeowners in your situation — including off-market exposure to pre-qualified buyers — and I'd love to share them with you.

Would you be open to a quick 10-minute call this week? No pressure at all, just a conversation to see if I can help.

Best regards,
Sarah Johnson
Riverside Heights Specialist
OffMarket Real Estate`,
};

// ---------------------------------------------------------------------------
// Helper: lead type badge colour
// ---------------------------------------------------------------------------

function typeBadgeClass(type) {
  switch (type) {
    case 'Expired':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'FSBO':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Pre-Foreclosure':
      return 'bg-yellow/10 text-yellow-700 border-yellow/30';
    case 'High Equity':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function draftBadgeClass(draft) {
  switch (draft) {
    case 'Ready':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Sent':
      return 'bg-success/10 text-success border-success/20';
    case 'Pending':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function stageBadgeClass(stage) {
  switch (stage) {
    case 'New':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'Drafted':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Sent':
      return 'bg-charcoal/10 text-charcoal border-charcoal/20';
    case 'Opened':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Replied':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// ---------------------------------------------------------------------------
// Fade wrapper
// ---------------------------------------------------------------------------

function FadePanel({ children, tabKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Tab: Overview
// ---------------------------------------------------------------------------

function OverviewTab() {
  const metrics = [
    { label: 'Leads This Month', value: '248', sub: '/250', accent: 'text-orange', progress: 248 / 250 },
    { label: 'AI Drafts Ready', value: '62', sub: null, note: 'needs review', accent: 'text-charcoal' },
    { label: 'Sent This Week', value: '186', sub: null, accent: 'text-charcoal' },
    { label: 'Replies', value: '14', sub: null, badge: '3 new today', accent: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="relative overflow-visible">
            <CardContent className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</p>
              <div className="flex items-end gap-1">
                <span className={cn('text-3xl font-heading font-semibold leading-none', m.accent)}>
                  {m.value}
                </span>
                {m.sub && <span className="text-sm text-muted-foreground mb-0.5">{m.sub}</span>}
                {m.badge && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    {m.badge}
                  </span>
                )}
              </div>
              {m.note && (
                <p className="text-xs text-muted-foreground">{m.note}</p>
              )}
              {m.progress != null && (
                <div className="h-1.5 w-full rounded-full bg-orange/10">
                  <div
                    className="h-full rounded-full bg-orange transition-all"
                    style={{ width: `${m.progress * 100}%` }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity feed */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-1">
          {activityFeed.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-4 rounded-xl px-4 py-3 transition-colors',
                  item.highlight ? 'bg-orange/5 ring-1 ring-orange/15' : 'hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  item.highlight ? 'bg-orange/10 text-orange' : 'bg-muted text-muted-foreground'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', item.highlight && 'font-medium text-foreground')}>
                    {item.text}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground pt-0.5">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: My Leads
// ---------------------------------------------------------------------------

const filterOptions = ['All', 'Expired', 'FSBO', 'Pre-Foreclosure', 'High Equity'];

function LeadsTab() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  const filtered = leads.filter((l) => {
    const matchesFilter = activeFilter === 'All' || l.type === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                activeFilter === f
                  ? 'bg-charcoal text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[1.4fr_1.6fr_0.9fr_0.7fr_0.7fr_0.7fr_0.5fr] gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>Contact</span>
        <span>Property</span>
        <span>Type</span>
        <span>Match</span>
        <span>AI Draft</span>
        <span>Status</span>
        <span />
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {filtered.map((lead, i) => (
          <div key={i}>
            <div
              onClick={() => setSelectedLead(selectedLead === i ? null : i)}
              className={cn(
                'grid grid-cols-1 lg:grid-cols-[1.4fr_1.6fr_0.9fr_0.7fr_0.7fr_0.7fr_0.5fr] gap-2 lg:gap-4 items-center rounded-xl px-4 py-3 cursor-pointer transition-colors',
                selectedLead === i
                  ? 'bg-orange/5 ring-1 ring-orange/15'
                  : 'hover:bg-muted/50'
              )}
            >
              {/* Contact */}
              <div>
                <p className="text-sm font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.email}</p>
              </div>

              {/* Property */}
              <p className="text-sm text-muted-foreground truncate">{lead.address}</p>

              {/* Type */}
              <div>
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', typeBadgeClass(lead.type))}>
                  {lead.type}
                </span>
              </div>

              {/* Match */}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-12 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-orange transition-all"
                    style={{ width: `${lead.match}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-muted-foreground">{lead.match}%</span>
              </div>

              {/* Draft */}
              <div>
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', draftBadgeClass(lead.draft))}>
                  {lead.draft}
                </span>
              </div>

              {/* Stage */}
              <div>
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', stageBadgeClass(lead.stage))}>
                  {lead.stage}
                </span>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex justify-end">
                <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', selectedLead === i && 'rotate-90')} />
              </div>
            </div>

            {/* Expanded email preview */}
            <AnimatePresence>
              {selectedLead === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mx-4 mb-2 rounded-xl border border-border bg-white p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-base font-semibold">AI Draft Preview</h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLead(null); }}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground w-16 shrink-0">From:</span>
                        <span>Sarah Johnson via OffMarket</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground w-16 shrink-0">To:</span>
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-muted-foreground w-16 shrink-0">Subject:</span>
                        <span className="font-medium">Your {lead.address.split(',')[0]} Home</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-light-bg p-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                      {`Hi ${lead.name.split(' ')[0]},\n\nI noticed your listing at ${lead.address} and wanted to reach out. Based on recent comparable sales in your area, I believe there may be an opportunity to get you a strong result.\n\nWould you be open to a quick conversation this week?\n\nBest,\nSarah Johnson`}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">MLS listing</span>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Sold comps</span>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{lead.days}</span>
                      <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Equity: {lead.equity}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button variant="outline" size="sm">Skip</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button size="sm" className="bg-orange text-white hover:bg-orange-hover ml-auto">
                        Approve & Send
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No leads match your filters.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: AI Drafts
// ---------------------------------------------------------------------------

function DraftsTab() {
  const [selectedDraft, setSelectedDraft] = useState(0);
  const selected = leads[selectedDraft];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-12rem)]">
      {/* Left — lead list */}
      <div className="lg:w-1/3 rounded-xl border border-border bg-white overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Drafts Queue</p>
          <p className="text-xs text-muted-foreground">{leads.filter(l => l.draft === 'Ready').length} ready for review</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {leads.map((lead, i) => (
            <button
              key={i}
              onClick={() => setSelectedDraft(i)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-border transition-colors',
                selectedDraft === i ? 'bg-orange/5' : 'hover:bg-muted/50'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium truncate">{lead.name}</p>
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 ml-2', draftBadgeClass(lead.draft))}>
                  {lead.draft}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{lead.address}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right — email preview */}
      <div className="lg:w-2/3 rounded-xl border border-border bg-white overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-heading text-base font-semibold mb-3">Email Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2 items-center">
              <span className="font-medium text-muted-foreground w-16 shrink-0">From:</span>
              <span>Sarah Johnson via OffMarket</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-muted-foreground w-16 shrink-0">To:</span>
              <span>{selected.email}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-muted-foreground w-16 shrink-0">Subject:</span>
              <Input
                defaultValue={draftEmail.subject.replace('Oakwood Dr', selected.address.split(',')[0].split(' ').slice(1).join(' '))}
                className="flex-1 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <textarea
            className="w-full h-64 rounded-lg bg-light-bg p-4 text-sm leading-relaxed text-foreground resize-none border-0 outline-none focus:ring-1 focus:ring-orange/30"
            defaultValue={draftEmail.body.replace('Michael', selected.name.split(' ')[0]).replace('4821 Oakwood Dr', selected.address.split(',')[0]).replace('47 days', selected.days)}
          />

          {/* Data sources */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Data Sources</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">MLS listing</span>
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">Sold comps</span>
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">Days expired</span>
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">Equity estimate</span>
            </div>
          </div>

          {/* Property context */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Property Context</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="font-medium truncate">{selected.address.split(',')[0]}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-medium">{selected.price}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Equity</p>
                <p className="font-medium text-success">{selected.equity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">{selected.days}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="px-6 py-3 border-t border-border flex items-center gap-2">
          <Button variant="outline" size="default">Skip</Button>
          <Button variant="outline" size="default">Edit</Button>
          <Button size="default" className="bg-orange text-white hover:bg-orange-hover ml-auto">
            Approve & Send
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Pipeline
// ---------------------------------------------------------------------------

function PipelineTab() {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-lg font-semibold">Pipeline</h2>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipelineColumns.map((col) => (
          <div
            key={col.key}
            className={cn(
              'min-w-[180px] flex-1 rounded-xl border border-border bg-white border-t-[3px]',
              col.color
            )}
          >
            {/* Column header */}
            <div className="px-3 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium">{col.key}</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                {col.count}
              </span>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2">
              {(pipelineLeads[col.key] || []).map((lead, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-white p-3 hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm font-medium leading-tight">{lead.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{lead.address}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{lead.date}</p>
                </div>
              ))}
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

export default function AppDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTab = tabMap[activeNav] || 'overview';

  function handleNavClick(key) {
    setActiveNav(key);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen bg-light-bg">
      {/* ---- Sidebar ---- */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-charcoal text-white transition-transform duration-200 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-0.5 px-6 py-6">
          <span className="font-heading text-xl font-semibold text-white">Off</span>
          <span className="font-heading text-xl font-semibold text-orange">Market</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Agent card */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-semibold text-white">
              SJ
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Sarah Johnson</p>
              <p className="text-xs text-white/50 truncate">Riverside Heights, CA</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---- Main area ---- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1 justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-semibold">Good morning, Sarah</h1>
              <p className="text-xs text-muted-foreground">Friday, March 28, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange" />
            </button>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">
              SJ
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <FadePanel tabKey={activeTab}>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'leads' && <LeadsTab />}
            {activeTab === 'drafts' && <DraftsTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
          </FadePanel>
        </main>
      </div>
    </div>
  );
}
