import { useState, useEffect, useCallback } from 'react';
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
  MapPin,
  Plus,
  Check,
  Home,
  Info,
  Inbox,
  ChevronDown,
  ExternalLink,
  XCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const leads = [
  { name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', type: 'Expired', match: 94, price: '$485K', equity: '$185K', days: '47d expired', draft: 'Ready', stage: 'Drafted', email: 'mtorres@email.com', order: 'Mar 2026' },
  { name: 'Sarah Kim', address: '1203 Maple Ridge Ln, Canyon Crest', type: 'FSBO', match: 87, price: '$392K', equity: '$240K', days: '12d listed', draft: 'Ready', stage: 'Drafted', email: 'skim@email.com', order: 'Mar 2026' },
  { name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', type: 'Pre-Foreclosure', match: 91, price: '$520K', equity: '$310K', days: 'NOD 34d', draft: 'Sent', stage: 'Sent', email: 'dhernandez@email.com', order: 'Mar 2026' },
  { name: 'Linda Chen', address: '2710 Harbor View Dr, Eastlake', type: 'Expired', match: 82, price: '$415K', equity: '$195K', days: '21d expired', draft: 'Ready', stage: 'New', email: 'lchen@email.com', order: 'Mar 2026' },
  { name: 'Robert Williams', address: '558 Palm Ave, Northpark', type: 'FSBO', match: 78, price: '$349K', equity: '$120K', days: '45d listed', draft: 'Pending', stage: 'New', email: 'rwilliams@email.com', order: 'Feb 2026' },
  { name: 'Maria Gonzalez', address: '1847 Vista Del Mar, Oceanside', type: 'High Equity', match: 85, price: '$680K', equity: '$420K', days: '15yr owned', draft: 'Sent', stage: 'Opened', email: 'mgonzalez@email.com', order: 'Feb 2026' },
];

const navItems = [
  { key: 'dashboard', label: 'Home', subtitle: 'Your daily snapshot', icon: LayoutDashboard },
  { key: 'farm', label: 'Order New Leads', subtitle: 'Get fresh sellers delivered', icon: MapPin },
  { key: 'leads', label: 'Seller Leads', subtitle: 'People who may want to sell', icon: Users },
  { key: 'drafts', label: 'Email Pitches', subtitle: 'Review before we send', icon: FileEdit },
  { key: 'replies', label: 'Responses', subtitle: 'Sellers who replied', icon: MessageSquare },
  { key: 'pipeline', label: 'My Deals', subtitle: 'Track your progress', icon: GitBranch },
  { key: 'settings', label: 'Settings', subtitle: null, icon: Settings },
];

const tabMap = {
  dashboard: 'overview',
  farm: 'farm',
  leads: 'leads',
  drafts: 'drafts',
  replies: 'replies',
  pipeline: 'pipeline',
};

const leadTypes = [
  { id: 'expired', label: 'Expired Listings', desc: 'Homes that didn\'t sell. Owners ready for a new approach.' },
  { id: 'fsbo', label: 'FSBOs', desc: 'For-sale-by-owner listings struggling without professional help.' },
  { id: 'preforeclosure', label: 'Pre-Foreclosure', desc: 'Homeowners facing financial pressure who need to sell fast.' },
  { id: 'absentee', label: 'Absentee Owners', desc: 'Landlords and investors who may be ready to offload.' },
  { id: 'highequity', label: 'High Equity', desc: 'Long-time owners sitting on significant equity.' },
  { id: 'probate', label: 'Probate / Estate', desc: 'Inherited properties where heirs want a quick sale.' },
];

const activityFeed = [
  { text: '12 new email pitches ready for your Riverside Heights sellers', time: '2h ago', icon: FileEdit, highlight: false },
  { text: '3 emails delivered to Canyon Crest sellers', time: '4h ago', icon: Send, highlight: false },
  { text: 'New response from homeowner at 4821 Oakwood Dr', time: '6h ago', icon: MessageSquare, highlight: true },
  { text: 'Follow-up sent to 8 sellers who have not replied', time: '1d ago', icon: ArrowRight, highlight: false },
];

const pipelineColumns = [
  { key: 'New Leads', count: 12, color: 'border-t-gray-400' },
  { key: 'Emails Ready', count: 62, color: 'border-t-orange' },
  { key: 'Sent', count: 186, color: 'border-t-charcoal' },
  { key: 'Opened Your Email', count: 142, color: 'border-t-blue-500' },
  { key: 'Responded', count: 14, color: 'border-t-success' },
  { key: 'Meeting Set', count: 3, color: 'border-t-orange' },
  { key: 'Got the Listing!', count: 1, color: 'border-t-success' },
];

const pipelineLeads = {
  'New Leads': [
    { name: 'Linda Chen', address: '2710 Harbor View Dr', date: 'Mar 27' },
    { name: 'Robert Williams', address: '558 Palm Ave', date: 'Mar 26' },
  ],
  'Emails Ready': [
    { name: 'Michael Torres', address: '4821 Oakwood Dr', date: 'Mar 28' },
    { name: 'Sarah Kim', address: '1203 Maple Ridge Ln', date: 'Mar 28' },
    { name: 'Linda Chen', address: '2710 Harbor View Dr', date: 'Mar 27' },
  ],
  Sent: [
    { name: 'David Hernandez', address: '892 Sunset Blvd', date: 'Mar 26' },
    { name: 'James Park', address: '441 Cedar St', date: 'Mar 25' },
  ],
  'Opened Your Email': [
    { name: 'Maria Gonzalez', address: '1847 Vista Del Mar', date: 'Mar 27' },
    { name: 'Alex Nguyen', address: '320 Birch Ln', date: 'Mar 26' },
  ],
  'Responded': [
    { name: 'Karen White', address: '1100 Elm Dr', date: 'Mar 28' },
    { name: 'Tom Bradley', address: '923 Pine Crest', date: 'Mar 27' },
  ],
  'Meeting Set': [
    { name: 'Jennifer Adams', address: '560 Ocean Blvd', date: 'Mar 29' },
  ],
  'Got the Listing!': [
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
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Tab: Farm Area
// ---------------------------------------------------------------------------

// Tappable help card — tap/click to reveal explanation
function HelpCard({ value, label, tip }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowTip(!showTip)}
        className="w-full rounded-lg bg-white/60 p-3 text-left transition-all duration-200 hover:bg-white hover:shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-sm font-bold text-charcoal">{value}</div>
            <div className="font-sans text-xs text-gray-400">{label}</div>
          </div>
          <div className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors text-[10px] font-bold',
            showTip ? 'bg-orange text-white' : 'bg-gray-200 text-gray-400'
          )}>
            ?
          </div>
        </div>
      </button>
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 left-4 right-4 sm:absolute sm:left-0 sm:right-0 sm:top-full mt-2 rounded-xl bg-charcoal text-white p-4 shadow-xl"
            style={{ maxWidth: 'calc(100vw - 32px)' }}
          >
            <div className="font-sans text-sm leading-relaxed">{tip}</div>
            <div className="absolute -top-1.5 left-6 w-3 h-3 bg-charcoal rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FarmAreaTab() {
  // 'form' | 'pending' | 'delivered'
  const [farmState, setFarmState] = useState('delivered');
  const [zipCodes, setZipCodes] = useState(['92506', '92507']);
  const [newZip, setNewZip] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['expired', 'fsbo', 'preforeclosure']);
  const [priceMin, setPriceMin] = useState('200000');
  const [priceMax, setPriceMax] = useState('800000');

  const addZip = () => {
    if (newZip.length === 5 && !zipCodes.includes(newZip)) {
      setZipCodes([...zipCodes, newZip]);
      setNewZip('');
    }
  };

  const removeZip = (zip) => setZipCodes(zipCodes.filter(z => z !== zip));

  const toggleType = (id) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // State: Delivered — leads are in the system
  if (farmState === 'delivered') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">Order New Leads</h2>
          <p className="font-sans text-sm text-gray-500">Get fresh sellers delivered to your dashboard.</p>
        </div>

        {/* New Order CTA — the exciting part, FIRST */}
        <div className="mb-8">
          <Card className="rounded-xl overflow-visible border-2 border-orange/20">
            <CardContent className="p-0 overflow-visible">
              <div className="bg-gradient-to-r from-orange/[0.06] to-orange/[0.02] p-6 md:p-8 overflow-visible rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-orange/10 text-orange border-orange/20 rounded-full text-xs font-mono">
                        New batch available
                      </Badge>
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-charcoal mb-2">
                      Ready for your next 250 sellers?
                    </h3>
                    <p className="font-sans text-sm text-gray-500 mb-4 max-w-md">
                      Your last batch had a 7.5% reply rate. That&apos;s 3x the industry average. Request fresh leads to keep your pipeline full.
                    </p>

                    {/* Last batch stats */}
                    <div className="flex gap-6 mb-4">
                      <div>
                        <div className="font-mono text-2xl font-bold text-charcoal">248</div>
                        <div className="font-sans text-xs text-gray-400">leads last batch</div>
                      </div>
                      <div>
                        <div className="font-mono text-2xl font-bold text-orange">14</div>
                        <div className="font-sans text-xs text-gray-400">sellers responded</div>
                      </div>
                      <div>
                        <div className="font-mono text-2xl font-bold text-success">3</div>
                        <div className="font-sans text-xs text-gray-400">appointments booked</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-3">
                    <Button
                      onClick={() => setFarmState('form')}
                      className="h-14 rounded-xl bg-orange text-white font-sans text-base font-semibold px-8 hover:bg-orange/90 transition-colors w-full md:w-auto"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Order New Leads
                    </Button>
                    <p className="font-sans text-xs text-gray-400">250 leads included in your plan</p>
                  </div>
                </div>

                {/* What you'll get preview */}
                <div className="mt-6 pt-6 border-t border-orange/10 overflow-visible">
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wide mb-3">What you&apos;ll get</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-visible">
                    {[
                      { label: 'Verified seller leads', value: '250', tip: 'Expireds, FSBOs, pre-foreclosures, absentee owners, high equity, and probate leads in your zip codes. Every contact is verified against public records.' },
                      { label: 'Email pitches written', value: '250', tip: 'Our AI writes a unique email for every seller based on their property address, asking price, nearby comps, and how long they\'ve been on market. No templates.' },
                      { label: 'Skip-traced emails', value: 'Included', tip: 'We find the homeowner\'s real email address using skip-tracing databases. No extra charge — it\'s included with every lead.' },
                      { label: 'Delivered in', value: '12 hours', tip: 'After you place your order, our team pulls your leads, verifies the data, and generates all email pitches. Everything lands in your dashboard within 12 hours.' },
                    ].map((item, i) => (
                      <HelpCard key={i} value={item.value} label={item.label} tip={item.tip} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Past Orders — enriched report cards */}
        <h3 className="font-sans text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Past Orders</h3>
        <div className="space-y-4">
          {[
            { date: 'Mar 28, 2026', zips: '92506, 92507', count: 248, sent: 186, opened: 142, replied: 14, appointments: 3, replyRate: '7.5%', status: 'active' },
            { date: 'Feb 28, 2026', zips: '92506, 92507', count: 250, sent: 250, opened: 198, replied: 18, appointments: 4, replyRate: '7.2%', status: 'done' },
            { date: 'Jan 28, 2026', zips: '92506', count: 243, sent: 243, opened: 171, replied: 12, appointments: 2, replyRate: '4.9%', status: 'done' },
          ].map((order, i) => (
            <Card key={i} className="rounded-xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      order.status === 'active' ? 'bg-orange/10' : 'bg-gray-100'
                    )}>
                      <CheckCircle2 className={cn('w-4.5 h-4.5', order.status === 'active' ? 'text-orange' : 'text-gray-400')} />
                    </div>
                    <div>
                      <div className="font-sans text-sm font-semibold text-charcoal">{order.count} leads delivered</div>
                      <div className="font-sans text-xs text-gray-400">{order.date} · {order.zips}</div>
                    </div>
                  </div>
                  <Badge className={cn(
                    'rounded-full text-xs',
                    order.status === 'active'
                      ? 'bg-orange/10 text-orange border-orange/20'
                      : 'bg-gray-100 text-gray-500 border-transparent'
                  )}>
                    {order.status === 'active' ? 'In Progress' : 'Completed'}
                  </Badge>
                </div>

                {/* Mini funnel stats */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Sent', value: order.sent, color: 'text-charcoal' },
                    { label: 'Opened', value: order.opened, color: 'text-charcoal' },
                    { label: 'Replied', value: order.replied, color: 'text-orange' },
                    { label: 'Appointments', value: order.appointments, color: 'text-success' },
                    { label: 'Reply Rate', value: order.replyRate, color: 'text-orange' },
                  ].map((stat, j) => (
                    <div key={j} className="text-center rounded-lg bg-light-bg p-2">
                      <div className={cn('font-mono text-sm font-bold', stat.color)}>{stat.value}</div>
                      <div className="font-sans text-[10px] text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // State: Pending — request submitted, waiting for admin
  if (farmState === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-8 h-8 text-orange" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-charcoal mb-3">Order Confirmed</h2>
        <p className="font-sans text-lg text-gray-500 mb-2">
          We&apos;re sourcing {zipCodes.length * 80}+ motivated sellers across {zipCodes.length} zip code{zipCodes.length > 1 ? 's' : ''}.
        </p>
        <p className="font-sans text-base text-gray-400 mb-8">
          Your leads and email pitches will be in your dashboard within 12 hours.
        </p>
        <div className="inline-flex items-center gap-3 rounded-xl bg-light-bg border border-gray-200 px-6 py-4">
          <Clock className="w-5 h-5 text-orange" />
          <div className="text-left">
            <div className="font-sans text-sm font-semibold text-charcoal">Estimated delivery</div>
            <div className="font-mono text-xs text-gray-500">Tomorrow by 9:00 AM</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button onClick={() => setFarmState('delivered')} className="font-sans text-sm text-gray-400 hover:text-charcoal transition-colors mb-4 flex items-center gap-1">
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to Orders
        </button>
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Order New Leads</h2>
        <p className="font-sans text-base text-gray-500">
          Tell us your market. 250 verified sellers with email pitches, delivered in 12 hours.
        </p>
      </div>

      {/* Step 1: Zip Codes */}
      <Card className="rounded-xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-orange">1</span>
            </div>
            <div>
              <h3 className="font-sans text-base font-semibold text-charcoal">Your Zip Codes</h3>
              <p className="font-sans text-sm text-gray-400">Up to 3 zip codes per farm area</p>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <Input
              type="text"
              placeholder="Enter zip code"
              value={newZip}
              onChange={(e) => setNewZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
              onKeyDown={(e) => e.key === 'Enter' && addZip()}
              className="max-w-[200px] rounded-lg"
              maxLength={5}
            />
            <Button
              variant="outline"
              onClick={addZip}
              disabled={newZip.length !== 5 || zipCodes.length >= 3}
              className="rounded-lg"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {zipCodes.map(zip => (
              <div key={zip} className="inline-flex items-center gap-2 rounded-full bg-charcoal text-white px-4 py-1.5 text-sm font-mono">
                {zip}
                <button onClick={() => removeZip(zip)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {zipCodes.length === 0 && (
              <p className="font-sans text-sm text-gray-400">No zip codes added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Lead Types */}
      <Card className="rounded-xl mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-orange">2</span>
            </div>
            <div>
              <h3 className="font-sans text-base font-semibold text-charcoal">Lead Types</h3>
              <p className="font-sans text-sm text-gray-400">Select which seller types to include</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leadTypes.map(type => (
              <button
                key={type.id}
                onClick={() => toggleType(type.id)}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                  selectedTypes.includes(type.id)
                    ? 'border-orange bg-orange/[0.03]'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className={cn(
                  'mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                  selectedTypes.includes(type.id)
                    ? 'border-orange bg-orange'
                    : 'border-gray-300'
                )}>
                  {selectedTypes.includes(type.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <div className="font-sans text-sm font-semibold text-charcoal">{type.label}</div>
                  <div className="font-sans text-xs text-gray-400 mt-0.5">{type.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Price Range */}
      <Card className="rounded-xl mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-orange">3</span>
            </div>
            <div>
              <h3 className="font-sans text-base font-semibold text-charcoal">Price Range</h3>
              <p className="font-sans text-sm text-gray-400">Filter leads by estimated property value</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="font-sans text-xs text-gray-400 mb-1 block">Min Price</label>
              <Input
                type="text"
                value={`$${Number(priceMin).toLocaleString()}`}
                onChange={(e) => setPriceMin(e.target.value.replace(/\D/g, ''))}
                className="rounded-lg font-mono"
              />
            </div>
            <span className="text-gray-300 mt-5">—</span>
            <div className="flex-1">
              <label className="font-sans text-xs text-gray-400 mb-1 block">Max Price</label>
              <Input
                type="text"
                value={`$${Number(priceMax).toLocaleString()}`}
                onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ''))}
                className="rounded-lg font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary + Submit */}
      <div className="rounded-xl border border-orange/20 bg-orange/[0.02] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans text-base font-semibold text-charcoal">Request Summary</h3>
          <Badge className="bg-orange/10 text-orange border-orange/20 rounded-full font-mono text-xs">
            ~{zipCodes.length * 80} leads estimated
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-sans text-xs text-gray-400 mb-1">Zip Codes</div>
            <div className="font-mono text-charcoal font-semibold">{zipCodes.join(', ') || 'None'}</div>
          </div>
          <div>
            <div className="font-sans text-xs text-gray-400 mb-1">Lead Types</div>
            <div className="font-sans text-charcoal font-semibold">{selectedTypes.length} of 6 selected</div>
          </div>
          <div>
            <div className="font-sans text-xs text-gray-400 mb-1">Price Range</div>
            <div className="font-mono text-charcoal font-semibold">${Number(priceMin).toLocaleString()} — ${Number(priceMax).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setFarmState('pending')}
        disabled={zipCodes.length === 0 || selectedTypes.length === 0}
        className="w-full h-auto rounded-xl bg-orange text-white font-sans text-base font-semibold py-4 hover:bg-orange/90 transition-colors disabled:opacity-50"
      >
        Place My Order <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <p className="font-sans text-xs text-gray-400 text-center mt-3">
        Leads delivered within 12 hours. 250 verified leads included in your plan.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Overview
// ---------------------------------------------------------------------------

function OverviewTab({ onNavigate }) {
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const farmSetUp = true;
  const emailsReviewed = leads.some(l => l.draft === 'Sent');
  const hasResponses = (pipelineLeads['Responded'] || []).length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome banner for new users */}
      {!welcomeDismissed && (
        <div className="relative rounded-xl border border-orange/20 bg-orange/[0.03] p-6">
          <button
            onClick={() => setWelcomeDismissed(true)}
            className="absolute top-4 right-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dismiss
          </button>
          <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
            Welcome to OffMarket, Sarah! Here&apos;s how to get started:
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate?.('farm')}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                farmSetUp ? 'bg-success/10 text-success' : 'bg-orange/10 text-orange'
              )}>
                {farmSetUp ? <Check className="h-3.5 w-3.5" /> : '1'}
              </div>
              <span className={cn(
                'text-sm group-hover:text-orange transition-colors',
                farmSetUp ? 'text-muted-foreground line-through' : 'text-charcoal font-medium'
              )}>
                Set up your market area
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => onNavigate?.('drafts')}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                emailsReviewed ? 'bg-success/10 text-success' : 'bg-orange/10 text-orange'
              )}>
                {emailsReviewed ? <Check className="h-3.5 w-3.5" /> : '2'}
              </div>
              <span className={cn(
                'text-sm group-hover:text-orange transition-colors',
                emailsReviewed ? 'text-muted-foreground line-through' : 'text-charcoal font-medium'
              )}>
                Review your email pitches
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => onNavigate?.('replies')}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                hasResponses ? 'bg-success/10 text-success' : 'bg-orange/10 text-orange'
              )}>
                {hasResponses ? <Check className="h-3.5 w-3.5" /> : '3'}
              </div>
              <span className={cn(
                'text-sm group-hover:text-orange transition-colors',
                hasResponses ? 'text-muted-foreground line-through' : 'text-charcoal font-medium'
              )}>
                Check for seller responses
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}

      {/* Status story card */}
      <Card className="rounded-xl border-orange/20 bg-orange/[0.03]">
        <CardContent className="p-6 sm:p-8">
          <p className="font-sans text-lg sm:text-xl text-charcoal leading-relaxed mb-1">
            You have <span className="font-bold text-orange">62 email pitches</span> ready to review.
          </p>
          <p className="font-sans text-lg sm:text-xl text-charcoal leading-relaxed mb-6">
            <span className="font-bold text-success">14 sellers</span> have responded so far.
          </p>
          <Button
            onClick={() => onNavigate('drafts')}
            className="w-full sm:w-auto h-14 rounded-xl bg-orange text-white font-sans text-base font-semibold px-8 hover:bg-orange/90 transition-colors"
          >
            Review Email Pitches <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Responses nudge */}
      <Card className="rounded-xl">
        <CardContent className="p-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <MessageSquare className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal">3 sellers responded today</p>
              <p className="text-xs text-muted-foreground">See what they said and follow up</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => onNavigate('replies')}
            className="rounded-lg text-sm shrink-0"
          >
            View Responses <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Activity feed */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">What Happened Recently</h2>
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
  const [expandedLead, setExpandedLead] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState('All');
  const [contactedLeads, setContactedLeads] = useState({});
  const [skippedLeads, setSkippedLeads] = useState({});

  // Extended property data for each lead (keyed by index in the leads array)
  const extendedLeadData = [
    {
      insight: 'This home expired after 6 months on market. Properties on this block are selling in 20-30 days, suggesting a pricing issue, not a demand issue. $185K in equity means the seller has room to negotiate. A well-positioned pitch about recent comps could re-engage this seller.',
      estimatedValue: '$485K',
      estimatedEquity: '$185K',
      daysOnMarket: '47 days',
      leadType: 'Expired Listing',
      originalListPrice: '$459K',
      lastListed: 'Nov 2025',
    },
    {
      insight: 'Sarah Kim listed her Canyon Crest home as FSBO 12 days ago at $392K. Similar homes with agent representation sold for 8-12% more in this zip code last quarter. She has $240K in equity and likely wants to save on commission, but is leaving significant money on the table.',
      estimatedValue: '$392K',
      estimatedEquity: '$240K',
      daysOnMarket: '12 days',
      leadType: 'FSBO',
      originalListPrice: '$392K',
      lastListed: 'Mar 2026',
    },
    {
      insight: 'David Hernandez received a Notice of Default 34 days ago on his Palm Canyon property valued at $520K. With $310K in equity, he has significant motivation to sell before foreclosure proceedings advance. Time-sensitive outreach emphasizing a quick sale to protect his equity could be very effective.',
      estimatedValue: '$520K',
      estimatedEquity: '$310K',
      daysOnMarket: '34 days (NOD)',
      leadType: 'Pre-Foreclosure',
      originalListPrice: '$540K',
      lastListed: 'Sep 2025',
    },
    {
      insight: 'Linda Chen\'s Eastlake listing expired 21 days ago after being priced at $415K. Comparable homes in Eastlake closed at $400-430K in the last 60 days, suggesting the property was within range. A fresh marketing approach and updated staging could make the difference.',
      estimatedValue: '$415K',
      estimatedEquity: '$195K',
      daysOnMarket: '21 days',
      leadType: 'Expired Listing',
      originalListPrice: '$415K',
      lastListed: 'Feb 2026',
    },
    {
      insight: 'Robert Williams has been trying to sell his Northpark FSBO for 45 days at $349K with no traction. His equity is relatively modest at $120K, but the property sits in a high-demand area where agent-listed homes sell in under 3 weeks. He likely needs professional exposure to reach the right buyers.',
      estimatedValue: '$349K',
      estimatedEquity: '$120K',
      daysOnMarket: '45 days',
      leadType: 'FSBO',
      originalListPrice: '$349K',
      lastListed: 'Feb 2026',
    },
    {
      insight: 'Maria Gonzalez has owned her Oceanside property for 15 years and has built $420K in equity on a $680K home. Long-term owners in this bracket often consider downsizing or relocating. Her profile matches sellers who respond well to market-timing pitches showing peak equity realization.',
      estimatedValue: '$680K',
      estimatedEquity: '$420K',
      daysOnMarket: '15 years owned',
      leadType: 'High Equity',
      originalListPrice: 'N/A',
      lastListed: 'Never listed',
    },
  ];

  // Lead type filter tabs
  const typeFilters = [
    { key: 'All', count: leads.length },
    { key: 'Expired', count: leads.filter(l => l.type === 'Expired').length },
    { key: 'FSBO', count: leads.filter(l => l.type === 'FSBO').length },
    { key: 'Pre-Foreclosure', count: leads.filter(l => l.type === 'Pre-Foreclosure').length },
    { key: 'High Equity', count: leads.filter(l => l.type === 'High Equity').length },
  ];

  // Unique order months for grouping toggle
  const orderMonths = ['All', ...Array.from(new Set(leads.map(l => l.order)))];

  const typeDotColor = (type) => {
    switch (type) {
      case 'Expired': return 'bg-danger';
      case 'FSBO': return 'bg-orange';
      case 'Pre-Foreclosure': return 'bg-yellow-500';
      case 'High Equity': return 'bg-success';
      default: return 'bg-gray-400';
    }
  };

  const pipelineStages = ['New', 'Drafted', 'Sent', 'Opened', 'Replied'];

  const handleToggleExpand = useCallback((index) => {
    setExpandedLead(prev => prev === index ? null : index);
  }, []);

  const handleMarkContacted = useCallback((index, e) => {
    e.stopPropagation();
    setContactedLeads(prev => ({ ...prev, [index]: true }));
  }, []);

  const handleSkipLead = useCallback((index, e) => {
    e.stopPropagation();
    setSkippedLeads(prev => ({ ...prev, [index]: !prev[index] }));
  }, []);

  // Filter by lead type and search query
  const filtered = leads.map((l, i) => ({ ...l, _origIndex: i })).filter((l) => {
    const matchesType = activeFilter === 'All' || l.type === activeFilter;
    const matchesOrder = activeOrder === 'All' || l.order === activeOrder;
    const matchesSearch =
      searchQuery === '' ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesOrder && matchesSearch;
  });

  // Group filtered leads by order
  const groupedByOrder = filtered.reduce((groups, lead) => {
    const order = lead.order || 'Unknown';
    if (!groups[order]) groups[order] = [];
    groups[order].push(lead);
    return groups;
  }, {});
  const orderGroups = Object.entries(groupedByOrder);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Seller Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">People in your market who may be ready to sell.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, address, email..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-1 flex-wrap">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
                activeFilter === f.key
                  ? 'bg-charcoal text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {f.key}{f.key !== 'All' ? ` (${f.count})` : ''}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {orderMonths.map((month) => (
            <button
              key={month}
              onClick={() => setActiveOrder(month)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap border',
                activeOrder === month
                  ? 'border-charcoal bg-charcoal/5 text-charcoal'
                  : 'border-transparent text-muted-foreground hover:border-gray-200 hover:text-foreground'
              )}
            >
              {month === 'All' ? 'All Orders' : month}
            </button>
          ))}
        </div>
      </div>

      {/* Lead Cards */}
      <div className="space-y-6">
        {orderGroups.map(([orderName, orderLeads]) => (
          <div key={orderName}>
            {/* Order Group Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="font-mono text-[11px] font-medium text-gray-400 uppercase tracking-wider shrink-0">
                {orderName} Order — {orderLeads.length} {orderLeads.length === 1 ? 'lead' : 'leads'}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              {orderLeads.map((lead) => {
                const idx = lead._origIndex;
                const isExpanded = expandedLead === idx;
                const ext = extendedLeadData[idx];
                const isContacted = contactedLeads[idx];
                const isSkipped = skippedLeads[idx];
                const currentStageIndex = pipelineStages.indexOf(lead.stage);

                return (
                  <div key={idx} className={cn('rounded-xl border transition-all duration-200', isSkipped ? 'opacity-40' : '', isExpanded ? 'border-orange/30 ring-1 ring-orange/10' : 'border-border hover:border-orange/20')}>
                    {/* Main Row */}
                    <button
                      onClick={() => handleToggleExpand(idx)}
                      className="w-full text-left p-5 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Left: Identity */}
                        <div className="flex items-start gap-3 sm:w-[280px] shrink-0">
                          <div className={cn('w-2.5 h-2.5 rounded-full shrink-0 mt-1.5', typeDotColor(lead.type))} />
                          <div className="min-w-0">
                            <p className="font-sans text-base font-semibold text-charcoal truncate">{lead.name}</p>
                            <p className="font-sans text-sm text-gray-500 truncate">{lead.address}</p>
                            <p className="font-mono text-xs text-gray-400 truncate">{lead.email}</p>
                          </div>
                        </div>

                        {/* Middle: Property Stats */}
                        <div className="flex items-center gap-6 flex-1 flex-wrap">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</p>
                            <p className="font-mono font-bold text-charcoal">{lead.price}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Equity</p>
                            <p className="font-mono font-bold text-success">{lead.equity}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Time</p>
                            <p className="font-sans text-sm text-gray-600">{lead.days}</p>
                          </div>
                        </div>

                        {/* Right: Badges + Expand */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium', typeBadgeClass(lead.type))}>
                            {lead.type}
                          </span>
                          <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium', stageBadgeClass(lead.stage))}>
                            {isContacted ? 'Contacted' : lead.stage}
                          </span>
                          <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                        </div>
                      </div>
                    </button>

                    {/* Expandable Detail Panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && ext && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0">
                            <div className="border-t border-gray-100 pt-5">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Column 1: Property Details */}
                                <div className="space-y-3">
                                  <h4 className="font-heading text-sm font-semibold text-charcoal flex items-center gap-2">
                                    <Home className="h-4 w-4 text-gray-400" />
                                    Property Details
                                  </h4>
                                  <div className="space-y-2">
                                    {[
                                      { label: 'Estimated Value', value: ext.estimatedValue },
                                      { label: 'Estimated Equity', value: ext.estimatedEquity },
                                      { label: 'Days on Market', value: ext.daysOnMarket },
                                      { label: 'Lead Type', value: ext.leadType },
                                      { label: 'Original List Price', value: ext.originalListPrice },
                                      { label: 'Last Listed', value: ext.lastListed },
                                    ].map((item) => (
                                      <div key={item.label} className="flex justify-between items-center">
                                        <span className="text-xs text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-medium text-charcoal">{item.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Column 2: Why This Seller */}
                                <div className="space-y-3">
                                  <h4 className="font-heading text-sm font-semibold text-charcoal flex items-center gap-2">
                                    <Info className="h-4 w-4 text-orange" />
                                    Why This Seller
                                  </h4>
                                  <div className="rounded-xl bg-light-bg border border-gray-100 p-4">
                                    <p className="text-sm leading-relaxed text-gray-600">{ext.insight}</p>
                                  </div>
                                </div>

                                {/* Column 3: Quick Actions */}
                                <div className="space-y-3">
                                  <h4 className="font-heading text-sm font-semibold text-charcoal">Quick Actions</h4>
                                  <div className="space-y-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full justify-start rounded-lg text-sm"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 mr-2" />
                                      View Email Pitch
                                    </Button>
                                    <Button
                                      variant={isContacted ? 'default' : 'outline'}
                                      size="sm"
                                      className={cn(
                                        'w-full justify-start rounded-lg text-sm',
                                        isContacted && 'bg-success text-white hover:bg-success'
                                      )}
                                      onClick={(e) => handleMarkContacted(idx, e)}
                                    >
                                      {isContacted ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Contacted</>
                                      ) : (
                                        <><Check className="h-3.5 w-3.5 mr-2" /> Mark as Contacted</>
                                      )}
                                    </Button>
                                    <button
                                      onClick={(e) => handleSkipLead(idx, e)}
                                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                      <XCircle className="h-3.5 w-3.5 mr-2 inline" />
                                      {isSkipped ? 'Undo Skip' : 'Skip This Lead'}
                                    </button>
                                  </div>

                                  {/* Mini Pipeline Indicator */}
                                  <div className="pt-3 border-t border-gray-100">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Pipeline Stage</p>
                                    <div className="flex items-center gap-1">
                                      {pipelineStages.map((stage, sIdx) => (
                                        <div key={stage} className="flex items-center gap-1">
                                          <div
                                            className={cn(
                                              'w-2 h-2 rounded-full',
                                              sIdx <= currentStageIndex ? 'bg-orange' : 'bg-gray-200'
                                            )}
                                            title={stage}
                                          />
                                          {sIdx < pipelineStages.length - 1 && (
                                            <div className={cn('w-3 h-px', sIdx < currentStageIndex ? 'bg-orange' : 'bg-gray-200')} />
                                          )}
                                        </div>
                                      ))}
                                      <span className="text-[10px] text-muted-foreground ml-2">{isContacted ? 'Contacted' : lead.stage}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty States */}
        {filtered.length === 0 && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-orange" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">Leads are being prepared</p>
            <p className="text-sm text-muted-foreground">Check back in a few hours.</p>
          </div>
        )}
        {filtered.length === 0 && leads.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">No leads match your filters</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: AI Drafts
// ---------------------------------------------------------------------------

function DraftsTab() {
  const [selectedDraft, setSelectedDraft] = useState(0);
  const [approvedDrafts, setApprovedDrafts] = useState({});
  const selected = leads[selectedDraft];

  const handleDraftApprove = useCallback(() => {
    setApprovedDrafts(prev => ({ ...prev, [selectedDraft]: true }));
    setTimeout(() => {
      setApprovedDrafts(prev => ({ ...prev, [selectedDraft]: false }));
    }, 1500);
  }, [selectedDraft]);

  return (
    <div className="space-y-4">
      {/* Contextual help for new users */}
      <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-500">
          We wrote a personalized email for each seller based on their property details. Read it, edit if you want, then approve to send.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-16rem)]">
      {/* Left — lead list */}
      <div className="lg:w-1/3 rounded-xl border border-border bg-white overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-medium">Email Pitches</p>
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

        {/* Bottom action bar — desktop */}
        <div className="hidden md:flex px-6 py-3 border-t border-border items-center gap-2">
          <Button variant="outline" size="default">Skip</Button>
          <Button variant="outline" size="default">Edit</Button>
          <Button
            size="default"
            onClick={handleDraftApprove}
            className={cn(
              'ml-auto transition-all duration-300',
              approvedDrafts[selectedDraft]
                ? 'bg-success text-white hover:bg-success scale-105'
                : 'bg-orange text-white hover:bg-orange-hover'
            )}
          >
            {approvedDrafts[selectedDraft] ? (
              <><CheckCircle2 className="w-4 h-4 mr-1" /> Sent!</>
            ) : (
              'Approve & Send'
            )}
          </Button>
        </div>

        {/* Bottom action bar — mobile sticky */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-border px-4 py-3 flex items-center gap-2 shadow-lg">
          <Button variant="outline" size="default" className="flex-1">Skip</Button>
          <Button
            size="default"
            onClick={handleDraftApprove}
            className={cn(
              'flex-1 transition-all duration-300',
              approvedDrafts[selectedDraft]
                ? 'bg-success text-white hover:bg-success scale-105'
                : 'bg-orange text-white hover:bg-orange-hover'
            )}
          >
            {approvedDrafts[selectedDraft] ? (
              <><CheckCircle2 className="w-4 h-4 mr-1" /> Sent!</>
            ) : (
              'Approve & Send'
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Pipeline
// ---------------------------------------------------------------------------

function PipelineTab() {
  const totalPipelineItems = pipelineColumns.reduce((sum, col) => sum + col.count, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold">My Deals</h2>
        <p className="text-sm text-muted-foreground mt-1">Track every seller from first contact to signed listing.</p>
      </div>

      {/* Contextual help for new users */}
      <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-500">
          This shows where each seller is in your outreach process. As sellers open your emails and respond, they move forward automatically.
        </p>
      </div>

      {totalPipelineItems === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Inbox className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">Your deal pipeline is empty</p>
            <p className="text-sm text-muted-foreground">It&apos;ll fill up as you start sending emails.</p>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

// Leads Arrived Celebration Banner
function LeadsArrivedBanner({ onDismiss, onReview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl text-center"
      >
        {/* Celebration icon */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', damping: 10 }}
          >
            <CheckCircle2 className="w-10 h-10 text-success" />
          </motion.div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-heading text-3xl font-bold text-charcoal mb-3"
        >
          Your leads are here!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-sans text-lg text-gray-500 mb-6"
        >
          248 motivated sellers in Riverside Heights, ready to go.
        </motion.p>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Expired', count: 94 },
            { label: 'FSBO', count: 62 },
            { label: 'Pre-Foreclosure', count: 38 },
          ].map((t, i) => (
            <div key={i} className="rounded-xl bg-light-bg p-3">
              <div className="font-mono text-xl font-bold text-charcoal">{t.count}</div>
              <div className="font-sans text-xs text-gray-400">{t.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex items-center justify-center gap-3 mb-6 rounded-xl bg-orange/[0.04] border border-orange/10 p-4"
        >
          <FileEdit className="w-5 h-5 text-orange shrink-0" />
          <p className="font-sans text-sm text-charcoal">
            <span className="font-semibold">248 email pitches</span> have been written and are ready for your review.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={onReview}
            className="w-full h-14 rounded-xl bg-orange text-white font-sans text-base font-semibold hover:bg-orange/90 transition-colors"
          >
            Start Reviewing Pitches
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <button
            onClick={onDismiss}
            className="font-sans text-sm text-gray-400 hover:text-charcoal transition-colors"
          >
            I&apos;ll review later
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function AppDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLeadsArrived, setShowLeadsArrived] = useState(true);

  const activeTab = tabMap[activeNav] || 'overview';

  function handleNavClick(key) {
    setActiveNav(key);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen bg-light-bg">
      {/* Leads Arrived Celebration */}
      <AnimatePresence>
        {showLeadsArrived && (
          <LeadsArrivedBanner
            onDismiss={() => setShowLeadsArrived(false)}
            onReview={() => {
              setShowLeadsArrived(false);
              setActiveNav('drafts');
            }}
          />
        )}
      </AnimatePresence>

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
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-150',
                  isActive
                    ? 'bg-white/10 text-white border-l-[3px] border-l-orange pl-[9px]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80 border-l-[3px] border-l-transparent pl-[9px]'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-medium block leading-tight">{item.label}</span>
                  {item.subtitle && (
                    <span className="text-[11px] text-white/30 block leading-tight mt-0.5">{item.subtitle}</span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Setup progress indicator */}
        {(() => {
          const farmDone = true;
          const emailsDone = leads.some(l => l.draft === 'Sent');
          const repliesDone = (pipelineLeads['Responded'] || []).length > 0;
          const stepsComplete = [farmDone, emailsDone, repliesDone].filter(Boolean).length;
          const progressPct = (stepsComplete / 3) * 100;
          return stepsComplete < 3 ? (
            <div className="px-4 py-3 border-t border-white/10">
              <p className="text-xs text-white/50 mb-2">Setup: {stepsComplete} of 3 complete</p>
              <div className="h-1 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-orange transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          ) : null;
        })()}

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
            {/* Mobile hamburger — hidden, bottom tabs replace it */}
            <div>
              <h1 className="font-heading text-lg font-semibold">Good morning, Sarah</h1>
              <p className="text-xs text-muted-foreground">You have <span className="font-semibold text-orange">62 pitches</span> to review and <span className="font-semibold text-success">3 new responses</span>.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
              </span>
            </button>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">
              SJ
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          <FadePanel tabKey={activeTab}>
            {activeTab === 'overview' && <OverviewTab onNavigate={handleNavClick} />}
            {activeTab === 'farm' && <FarmAreaTab />}
            {activeTab === 'leads' && <LeadsTab />}
            {activeTab === 'drafts' && <DraftsTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
            {activeTab === 'replies' && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold">Responses</h2>
                <Card className="rounded-xl">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-orange" />
                    </div>
                    <p className="text-sm font-medium text-charcoal mb-1">No responses yet</p>
                    <p className="text-sm text-muted-foreground">Once sellers reply to your emails, they&apos;ll show up here.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </FadePanel>
        </main>
      </div>

      {/* ---- Mobile bottom tab bar ---- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg flex items-center justify-around h-14">
        {[
          { key: 'dashboard', label: 'Home', icon: Home },
          { key: 'leads', label: 'Leads', icon: Users },
          { key: 'drafts', label: 'Pitches', icon: FileEdit },
          { key: 'replies', label: 'Responses', icon: MessageSquare },
          { key: 'pipeline', label: 'Deals', icon: GitBranch },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNav === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleNavClick(tab.key)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors',
                isActive ? 'text-orange' : 'text-gray-400'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
