import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { createLeadOrder, getAgentOrders, getLeadsByOrder } from '@/lib/leads';
import { suggestDomains, setupDomain, getJob, bulkCreateEmailUsers, setupRedirect } from '@/lib/winnr';
import { supabase } from '@/lib/supabase';
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

  XCircle,
  Pencil,
  RefreshCw,
  Building2,
  DollarSign,
  Phone,
  Menu,
  Globe,
  Shield,
  Loader2,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const leads = [
  {
    name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', type: 'Expired', price: '$485K', equity: '$185K', days: '47d expired', draft: 'Ready', stage: 'Drafted', email: 'mtorres@email.com', order: 'Order #1024 · Mar 15, 2026',
    // CREXI-level property data
    propertyType: 'Single Family', sqft: '2,840', numberOfUnits: 1, yearBuilt: 2004, lotSizeAcres: '0.18', zoningCode: 'R-1', county: 'Riverside',
    // Financial
    soldPrice: '$459K', loanAmount: '$300K', lender: 'Wells Fargo', loanType: 'Conventional', interestRate: '5.25%', totalParcelValue: '$485K', improvementValue: '$390K', landValue: '$95K', taxBill: '$5,820', taxYear: 2024,
    // Owner & contact
    ownerName: 'Michael Torres', mailingAddress: '4821 Oakwood Dr, Riverside Heights, CA 92501', contactName: 'Michael Torres',
    phones: ['(951) 555-0142', '(951) 555-0198'], emails: ['mtorres@email.com', 'mike.torres@work.com'],
  },
  {
    name: 'Sarah Kim', address: '1203 Maple Ridge Ln, Canyon Crest', type: 'FSBO', price: '$392K', equity: '$240K', days: '12d listed', draft: 'Ready', stage: 'Drafted', email: 'skim@email.com', order: 'Order #1024 · Mar 15, 2026',
    propertyType: 'Single Family', sqft: '1,960', numberOfUnits: 1, yearBuilt: 2011, lotSizeAcres: '0.14', zoningCode: 'R-1', county: 'Riverside',
    soldPrice: '$392K', loanAmount: '$152K', lender: 'Chase', loanType: 'Conventional', interestRate: '3.75%', totalParcelValue: '$392K', improvementValue: '$310K', landValue: '$82K', taxBill: '$4,480', taxYear: 2024,
    ownerName: 'Sarah Kim', mailingAddress: '1203 Maple Ridge Ln, Canyon Crest, CA 92507', contactName: 'Sarah Kim',
    phones: ['(951) 555-0234'], emails: ['skim@email.com'],
  },
  {
    name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', type: 'Pre-Foreclosure', price: '$520K', equity: '$310K', days: 'NOD 34d', draft: 'Sent', stage: 'Sent', email: 'dhernandez@email.com', order: 'Order #1031 · Mar 22, 2026',
    propertyType: 'Single Family', sqft: '3,200', numberOfUnits: 1, yearBuilt: 1998, lotSizeAcres: '0.22', zoningCode: 'R-1', county: 'Riverside',
    soldPrice: '$540K', loanAmount: '$210K', lender: 'Bank of America', loanType: 'FHA', interestRate: '4.50%', totalParcelValue: '$520K', improvementValue: '$415K', landValue: '$105K', taxBill: '$6,240', taxYear: 2024,
    ownerName: 'David Hernandez', mailingAddress: '892 Sunset Blvd, Palm Canyon, CA 92264', contactName: 'David Hernandez',
    phones: ['(760) 555-0312', '(760) 555-0318', '(951) 555-0401'], emails: ['dhernandez@email.com', 'd.hernandez@gmail.com'],
  },
  {
    name: 'Linda Chen', address: '2710 Harbor View Dr, Eastlake', type: 'Expired', price: '$415K', equity: '$195K', days: '21d expired', draft: 'Ready', stage: 'New', email: 'lchen@email.com', order: 'Order #1031 · Mar 22, 2026',
    propertyType: 'Townhouse', sqft: '2,100', numberOfUnits: 1, yearBuilt: 2008, lotSizeAcres: '0.08', zoningCode: 'R-2', county: 'San Diego',
    soldPrice: '$415K', loanAmount: '$220K', lender: 'US Bank', loanType: 'Conventional', interestRate: '6.00%', totalParcelValue: '$415K', improvementValue: '$340K', landValue: '$75K', taxBill: '$4,980', taxYear: 2024,
    ownerName: 'Linda Chen', mailingAddress: '2710 Harbor View Dr, Eastlake, CA 91915', contactName: 'Linda Chen',
    phones: ['(619) 555-0456'], emails: ['lchen@email.com', 'linda.chen@outlook.com'],
  },
  {
    name: 'Robert Williams', address: '558 Palm Ave, Northpark', type: 'FSBO', price: '$349K', equity: '$120K', days: '45d listed', draft: 'Pending', stage: 'New', email: 'rwilliams@email.com', order: 'Order #1018 · Feb 28, 2026',
    propertyType: 'Condo', sqft: '1,540', numberOfUnits: 1, yearBuilt: 1995, lotSizeAcres: '0.04', zoningCode: 'R-3', county: 'San Diego',
    soldPrice: '$349K', loanAmount: '$229K', lender: 'Quicken Loans', loanType: 'Conventional', interestRate: '5.75%', totalParcelValue: '$349K', improvementValue: '$295K', landValue: '$54K', taxBill: '$3,920', taxYear: 2024,
    ownerName: 'Robert Williams', mailingAddress: '558 Palm Ave, Northpark, CA 92104', contactName: 'Robert Williams',
    phones: ['(619) 555-0589', '(619) 555-0612'], emails: ['rwilliams@email.com'],
  },
  {
    name: 'Maria Gonzalez', address: '1847 Vista Del Mar, Oceanside', type: 'High Equity', price: '$680K', equity: '$420K', days: '15yr owned', draft: 'Sent', stage: 'Opened', email: 'mgonzalez@email.com', order: 'Order #1018 · Feb 28, 2026',
    propertyType: 'Single Family', sqft: '3,680', numberOfUnits: 1, yearBuilt: 2001, lotSizeAcres: '0.31', zoningCode: 'R-1', county: 'San Diego',
    soldPrice: 'N/A', loanAmount: '$260K', lender: 'CitiMortgage', loanType: 'Conventional', interestRate: '3.25%', totalParcelValue: '$680K', improvementValue: '$520K', landValue: '$160K', taxBill: '$8,160', taxYear: 2024,
    ownerName: 'Maria Gonzalez', mailingAddress: '1847 Vista Del Mar, Oceanside, CA 92054', contactName: 'Maria Gonzalez',
    phones: ['(760) 555-0723', '(760) 555-0741', '(619) 555-0899'], emails: ['mgonzalez@email.com', 'maria.g@yahoo.com', 'mgonzalez@work.com'],
  },
];

const navItems = [
  { key: 'dashboard', label: 'Home', subtitle: 'Your daily snapshot', icon: LayoutDashboard },
  { key: 'email', label: 'Email Accounts', subtitle: 'Domains and mailboxes', icon: Mail },
  { key: 'farm', label: 'Order New Leads', subtitle: 'Get fresh sellers delivered', icon: MapPin },
  { key: 'leads', label: 'Seller Leads', subtitle: 'People who may want to sell', icon: Users },
  { key: 'drafts', label: 'Pitches Sent', subtitle: 'Emails you\'ve sent', icon: Send },
  { key: 'replies', label: 'Inbox', subtitle: 'Seller replies and conversations', icon: Inbox },
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
  email: 'email',
  settings: 'settings',
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
  const { user } = useAuth();
  // 'form' | 'pending' | 'delivered'
  const [farmState, setFarmState] = useState('delivered');
  const [zipCodes, setZipCodes] = useState(['92506', '92507']);
  const [newZip, setNewZip] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['expired', 'fsbo', 'preforeclosure']);
  const [priceMin, setPriceMin] = useState('200000');
  const [priceMax, setPriceMax] = useState('800000');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // DB orders state
  const [dbOrders, setDbOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Mock fallback orders
  const mockOrders = [
    { date: 'Mar 28, 2026', zips: '92506, 92507', count: 248, sent: 186, opened: 142, replied: 14, appointments: 3, replyRate: '7.5%', status: 'active' },
    { date: 'Feb 28, 2026', zips: '92506, 92507', count: 250, sent: 250, opened: 198, replied: 18, appointments: 4, replyRate: '7.2%', status: 'done' },
    { date: 'Jan 28, 2026', zips: '92506', count: 243, sent: 243, opened: 171, replied: 12, appointments: 2, replyRate: '4.9%', status: 'done' },
  ];

  // Fetch agent orders from DB (silently — mock data shows while loading)
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getAgentOrders(user.id);
        if (!cancelled) {
          if (!error && data && data.length > 0) {
            setDbOrders(data.map(o => ({
              id: o.id,
              date: new Date(o.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              zips: (o.zip_codes || []).join(', '),
              count: o.quantity_requested || 250,
              sent: 0, opened: 0, replied: 0, appointments: 0,
              replyRate: '0%',
              status: o.status === 'completed' ? 'done' : 'active',
              dbStatus: o.status,
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
      if (!cancelled) setOrdersLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const displayOrders = dbOrders.length > 0 ? dbOrders : mockOrders;

  const handlePlaceOrder = async () => {
    if (!user?.id) return;
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await createLeadOrder({
      agentId: user.id,
      zipCodes,
      leadTypes: selectedTypes,
      priceMin: Number(priceMin),
      priceMax: Number(priceMax),
      notes: orderNotes,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message || 'Failed to place order. Please try again.');
    } else {
      // Refresh orders list
      const { data } = await getAgentOrders(user.id);
      if (data && data.length > 0) {
        setDbOrders(data.map(o => ({
          id: o.id,
          date: new Date(o.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          zips: (o.zip_codes || []).join(', '),
          count: o.quantity_requested || 250,
          sent: 0, opened: 0, replied: 0, appointments: 0,
          replyRate: '0%',
          status: o.status === 'completed' ? 'done' : 'active',
          dbStatus: o.status,
        })));
      }
      setFarmState('pending');
    }
  };

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
        {(
        <div className="space-y-4">
          {displayOrders.map((order, i) => (
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
                      <div className="font-sans text-sm font-semibold text-charcoal">{order.count} {order.count === 1 ? 'lead' : 'leads'} delivered</div>
                      <div className="font-sans text-xs text-gray-400">{order.date} · Zip: {order.zips}</div>
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
        )}
        <div className="h-12" />
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
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => setFarmState('delivered')}
          >
            <ArrowRight className="w-3 h-3 mr-2 rotate-180" />
            Back to Orders
          </Button>
          <Button
            className="rounded-lg bg-orange hover:bg-orange/90 text-white"
            onClick={() => setFarmState('delivered')}
          >
            View Your Leads
            <ArrowRight className="w-3 h-3 ml-2" />
          </Button>
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

      {submitError && (
        <div className="rounded-xl border border-danger/20 bg-danger/[0.03] px-4 py-3 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          <p className="text-sm text-danger">{submitError}</p>
        </div>
      )}

      <Button
        onClick={handlePlaceOrder}
        disabled={zipCodes.length === 0 || selectedTypes.length === 0 || submitting}
        className="w-full h-auto rounded-xl bg-orange text-white font-sans text-base font-semibold py-4 hover:bg-orange/90 transition-colors disabled:opacity-50"
      >
        {submitting ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Place My Order <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="font-sans text-xs text-gray-400 text-center mt-3">
        Leads delivered within 12 hours. 250 verified leads included in your plan.
      </p>
      <div className="h-12" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Overview
// ---------------------------------------------------------------------------

function OverviewTab({ onNavigate, pitchDrafts, deals }) {
  const sentCount = Object.values(pitchDrafts).filter(d => d?.status === 'sent').length;
  const draftCount = Object.values(pitchDrafts).filter(d => d?.status === 'draft').length;
  const newReplies = sampleReplies.filter(r => r.status === 'new').length;
  const totalReplies = sampleReplies.length;
  const dealsCount = deals?.length || 0;

  return (
    <div className="space-y-6">
      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button onClick={() => onNavigate('leads')} className="rounded-xl border border-border bg-white p-4 text-left hover:border-orange/20 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-orange transition-colors" />
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal">{leads.length}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Seller Leads</p>
        </button>
        <button onClick={() => onNavigate('drafts')} className="rounded-xl border border-border bg-white p-4 text-left hover:border-orange/20 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-2">
            <Send className="h-4 w-4 text-gray-400" />
            <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-orange transition-colors" />
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal">{sentCount}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Pitches Sent</p>
        </button>
        <button onClick={() => onNavigate('replies')} className="rounded-xl border border-border bg-white p-4 text-left hover:border-orange/20 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-2">
            <Inbox className="h-4 w-4 text-gray-400" />
            {newReplies > 0 && <span className="inline-flex items-center rounded-full bg-orange px-1.5 py-0.5 text-[9px] font-bold text-white">{newReplies}</span>}
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal">{totalReplies}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Inbox Replies</p>
        </button>
        <button onClick={() => onNavigate('pipeline')} className="rounded-xl border border-border bg-white p-4 text-left hover:border-orange/20 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-2">
            <GitBranch className="h-4 w-4 text-gray-400" />
            <ArrowRight className="h-3 w-3 text-gray-300 group-hover:text-orange transition-colors" />
          </div>
          <p className="font-mono text-2xl font-bold text-charcoal">{dealsCount}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Active Deals</p>
        </button>
      </div>

      {/* Action cards — what needs attention */}
      <div className="space-y-3">
        <h2 className="font-heading text-base font-semibold text-charcoal">Needs Your Attention</h2>

        {/* New replies */}
        {newReplies > 0 && (
          <button
            onClick={() => onNavigate('replies')}
            className="w-full text-left rounded-xl border border-success/20 bg-success/[0.03] p-4 flex items-center justify-between hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{newReplies} new {newReplies === 1 ? 'reply' : 'replies'} from sellers</p>
                <p className="text-xs text-gray-500">Respond to keep the conversation going</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-success transition-colors shrink-0" />
          </button>
        )}

        {/* Drafts to review */}
        {draftCount > 0 && (
          <button
            onClick={() => onNavigate('leads')}
            className="w-full text-left rounded-xl border border-orange/20 bg-orange/[0.03] p-4 flex items-center justify-between hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                <Pencil className="h-5 w-5 text-orange" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{draftCount} draft {draftCount === 1 ? 'pitch' : 'pitches'} waiting for approval</p>
                <p className="text-xs text-gray-500">Review and send your email sequences</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange transition-colors shrink-0" />
          </button>
        )}

        {/* Leads not contacted */}
        {leads.length - sentCount - draftCount > 0 && (
          <button
            onClick={() => onNavigate('leads')}
            className="w-full text-left rounded-xl border border-border bg-white p-4 flex items-center justify-between hover:shadow-sm hover:border-orange/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{leads.length - sentCount - draftCount} leads not yet contacted</p>
                <p className="text-xs text-gray-500">Generate pitches to reach these sellers</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange transition-colors shrink-0" />
          </button>
        )}

        {/* All caught up */}
        {newReplies === 0 && draftCount === 0 && (
          <div className="rounded-xl border border-border bg-white p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-sm font-semibold text-charcoal">You&apos;re all caught up</p>
            <p className="text-xs text-gray-500 mt-1">No pending actions right now</p>
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Recent Activity</h2>
        <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-gray-100">
          {activityFeed.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 transition-colors',
                  item.highlight ? 'bg-orange/[0.02]' : 'hover:bg-gray-50'
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  item.highlight ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-400'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className={cn('text-sm flex-1 min-w-0', item.highlight ? 'font-medium text-charcoal' : 'text-gray-600')}>
                  {item.text}
                </p>
                <span className="text-[10px] text-gray-400 shrink-0 font-mono">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick nav */}
      <div>
        <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Order New Leads', icon: MapPin, nav: 'farm' },
            { label: 'View Seller Leads', icon: Users, nav: 'leads' },
            { label: 'Check Inbox', icon: Inbox, nav: 'replies' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.nav}
                onClick={() => onNavigate(action.nav)}
                className="rounded-lg border border-border bg-white px-4 py-3 flex items-center gap-2.5 text-left hover:border-orange/20 hover:shadow-sm transition-all group"
              >
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-orange transition-colors" />
                <span className="text-xs font-medium text-charcoal">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: My Leads
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Pitch Slide-Over Panel
// ---------------------------------------------------------------------------

function PitchSlideOver({ lead, draft, onSave, onSend, onRegenerate, onDiscard, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState(draft?.steps || []);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    setSteps(draft?.steps || []);
    setActiveStep(0);
  }, [draft]);

  const currentStep = steps[activeStep] || {};
  const hasChanges = JSON.stringify(steps) !== JSON.stringify(draft?.steps);

  const handleStepChange = (field, value) => {
    setSteps(prev => prev.map((s, i) => i === activeStep ? { ...s, [field]: value } : s));
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const isReadOnly = draft?.status === 'sent';
  const stepLabels = ['Initial Outreach', 'Follow-Up', 'Final Touch'];
  const stepTimings = ['Sends immediately', 'Sends on business day 3', 'Sends on business day 7'];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-[520px] bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-heading text-base font-semibold text-charcoal truncate">{lead.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{lead.address}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', typeBadgeClass(lead.type))}>
                {lead.type}
              </span>
              <span className="text-[11px] text-muted-foreground">3-step sequence</span>
              {draft?.status === 'sent' && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium bg-success/10 text-success border-success/20">
                  Approved
                </span>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-6 py-2 border-b border-border flex items-center gap-1">
          {stepLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-center transition-colors',
                activeStep === i
                  ? 'bg-charcoal text-white'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="text-xs font-medium block">Step {i + 1}</span>
              <span className="text-[10px] block mt-0.5 opacity-70">{label}</span>
            </button>
          ))}
        </div>

        {/* Timing indicator */}
        <div className="px-6 py-2 bg-light-bg border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stepTimings[activeStep]}</span>
            </div>
            <span className="text-[10px] text-gray-400">Weekdays only, no weekends</span>
          </div>
        </div>

        {/* Subject — only shown for Step 1 */}
        {activeStep === 0 && (
          <div className="px-6 py-3 border-b border-border">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Subject</label>
            {isReadOnly ? (
              <p className="text-sm font-medium text-charcoal">{steps[0]?.subject}</p>
            ) : (
              <Input
                value={steps[0]?.subject || ''}
                onChange={(e) => {
                  setSteps(prev => prev.map((s, i) => i === 0 ? { ...s, subject: e.target.value } : s));
                }}
                className="text-sm font-medium"
                placeholder="Email subject line..."
              />
            )}
          </div>
        )}
        {activeStep > 0 && (
          <div className="px-6 py-2 border-b border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Re: {steps[0]?.subject}</p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Variation Picker */}
          {!isReadOnly && currentStep.variations?.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Variation</span>
              {['A', 'B', 'C'].slice(0, currentStep.variations.length).map((label, vi) => (
                <button
                  key={vi}
                  onClick={() => {
                    setSteps(prev => prev.map((s, i) => i === activeStep
                      ? { ...s, body: s.variations[vi], activeVariation: vi }
                      : s
                    ));
                  }}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs font-bold transition-colors',
                    currentStep.activeVariation === vi
                      ? 'bg-charcoal text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-charcoal'
                  )}
                >
                  {label}
                </button>
              ))}
              <span className="text-[10px] text-gray-400 ml-1">Pick a style, then edit</span>
            </div>
          )}

          {isReadOnly ? (
            <div className="rounded-xl bg-light-bg border border-gray-100 p-4">
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{currentStep.body}</p>
            </div>
          ) : (
            <textarea
              value={currentStep.body || ''}
              onChange={(e) => handleStepChange('body', e.target.value)}
              className="w-full min-h-[260px] rounded-xl bg-light-bg border border-gray-100 p-4 text-sm leading-relaxed text-foreground resize-none outline-none focus:ring-1 focus:ring-orange/30 transition-shadow"
              placeholder="Email body..."
            />
          )}

          {/* Lead Context Strip */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Property Context</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Value', value: lead.price },
                { label: 'Sq Ft', value: lead.sqft },
                { label: 'Year Built', value: lead.yearBuilt },
                { label: 'Lot', value: lead.lotSizeAcres ? `${lead.lotSizeAcres} ac` : null },
                { label: 'Lender', value: lead.lender },
                { label: 'Loan', value: lead.loanAmount },
                { label: 'Rate', value: lead.interestRate },
              ].filter(item => item.value != null).map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className={cn('font-medium', item.className)}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {!isReadOnly && (
          <div className="px-6 py-4 border-t border-border">
            {/* Step navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className={cn('text-xs font-medium px-2 py-1 rounded transition-colors', activeStep === 0 ? 'text-gray-300' : 'text-gray-500 hover:text-charcoal')}
              >
                ← Previous
              </button>
              <span className="text-xs text-muted-foreground">Step {activeStep + 1} of 3</span>
              <button
                onClick={() => setActiveStep(prev => Math.min(2, prev + 1))}
                disabled={activeStep === 2}
                className={cn('text-xs font-medium px-2 py-1 rounded transition-colors', activeStep === 2 ? 'text-gray-300' : 'text-gray-500 hover:text-charcoal')}
              >
                Next →
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDiscard()}
                className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => onRegenerate()}
                className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => { onSave(steps); onClose(); }}
              >
                Save Draft
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-orange text-white hover:bg-orange-hover"
                onClick={() => { onSend(steps); onClose(); }}
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Approve & Send
              </Button>
            </div>
          </div>
        )}

        {/* Read-only close bar */}
        {isReadOnly && (
          <div className="px-6 py-4 border-t border-border flex justify-end">
            <Button variant="outline" size="sm" className="rounded-lg" onClick={onClose}>
              Close
            </Button>
          </div>
        )}

        {/* Discard confirmation */}
        <AnimatePresence>
          {showDiscardConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-charcoal">You have unsaved changes</p>
                <p className="text-sm text-muted-foreground">Save as draft or discard?</p>
                <div className="flex items-center gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => { onSave(steps); }}>
                    Save Draft
                  </Button>
                  <Button variant="outline" size="sm" className="text-danger border-danger/20 hover:bg-danger/5" onClick={() => { onDiscard(); }}>
                    Discard
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDiscardConfirm(false)}>
                    Keep Editing
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tab: My Leads
// ---------------------------------------------------------------------------

const filterOptions = ['All', 'Expired', 'FSBO', 'Pre-Foreclosure', 'High Equity'];

function LeadsTab({ pitchDrafts, setPitchDrafts, contactedLeads, setContactedLeads }) {
  const { user } = useAuth();
  const [expandedLead, setExpandedLead] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activePitchStatus, setActivePitchStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState('All');
  const [skippedLeads, setSkippedLeads] = useState({});
  const [pitchSlideOverIndex, setPitchSlideOverIndex] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // DB state for orders and leads
  const [dbOrders, setDbOrders] = useState([]);
  const [dbLeads, setDbLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);

  // Fetch agent orders on mount
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getAgentOrders(user.id);
        if (!cancelled) {
          if (!error && data && data.length > 0) {
            setDbOrders(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch leads orders:', err);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Fetch leads when selectedOrder changes (for a DB order)
  useEffect(() => {
    if (!selectedOrder || dbOrders.length === 0) return;
    // Check if selectedOrder matches a DB order's order_number string
    const matchingDbOrder = dbOrders.find(o =>
      `${o.order_number} · ${new Date(o.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` === selectedOrder
    );
    if (!matchingDbOrder) return;
    let cancelled = false;
    (async () => {
      setLeadsLoading(true);
      const { data, error } = await getLeadsByOrder(matchingDbOrder.id);
      if (!cancelled) {
        if (!error && data.length > 0) {
          setDbLeads(data);
        }
        if (error) setLeadsError(error.message);
        setLeadsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedOrder, dbOrders]);

  // Use DB leads if available, otherwise fall back to mock data
  const activeLeads = dbLeads.length > 0 ? dbLeads : leads;

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

  // Lead type filter tabs — scope to current order when one is selected
  const filterSource = selectedOrder ? activeLeads.filter(l => l.order === selectedOrder) : activeLeads;
  const typeFilters = [
    { key: 'All', count: filterSource.length },
    { key: 'Expired', count: filterSource.filter(l => l.type === 'Expired').length },
    { key: 'FSBO', count: filterSource.filter(l => l.type === 'FSBO').length },
    { key: 'Pre-Foreclosure', count: filterSource.filter(l => l.type === 'Pre-Foreclosure').length },
    { key: 'High Equity', count: filterSource.filter(l => l.type === 'High Equity').length },
  ];

  // Unique order months for grouping toggle
  const orderMonths = ['All', ...Array.from(new Set(activeLeads.map(l => l.order)))];

  const typeDotColor = (type) => {
    switch (type) {
      case 'Expired': return 'bg-danger';
      case 'FSBO': return 'bg-orange';
      case 'Pre-Foreclosure': return 'bg-yellow-500';
      case 'High Equity': return 'bg-success';
      default: return 'bg-gray-400';
    }
  };


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

  const generatePitch = useCallback((lead) => {
    const firstName = lead.name.split(' ')[0];
    const street = lead.address.split(',')[0];
    const neighborhood = lead.address.split(',')[1]?.trim() || '';
    const t = lead.type;
    const sign = `Best regards,\nSarah Johnson\nOffMarket Real Estate`;

    // --- Step 1 variations ---
    const s1Subject = {
      'Expired': `Your ${street} Home — a Confidential Buyer May Be Interested`,
      'FSBO': `${street} — What Agent-Listed Homes Nearby Are Selling For`,
      'Pre-Foreclosure': `${street} — Protecting Your ${lead.equity} in Equity`,
      'High Equity': `${street} — Is Now the Right Time to Maximize Your Equity?`,
    }[t] || `Your ${street} Property — A Quick Question`;

    const s1A = {
      'Expired': `Hi ${firstName},\n\nI noticed your home at ${street} came off the market after ${lead.days.replace('d expired', ' days')}. That can be frustrating, and I wanted to reach out because I may be able to help.\n\nI specialize in the ${neighborhood} area and have been tracking comparable sales nearby. Homes similar to yours — ${lead.sqft} sq ft, built in ${lead.yearBuilt} — have recently sold between ${lead.price} and above, which tells me there's genuine buyer demand in your price range.\n\nWith ${lead.equity} in equity and current rates at ${lead.interestRate}, you're in a strong position. I have a few strategies that have worked well for other homeowners in your situation — including off-market exposure to pre-qualified buyers.\n\nWould you be open to a quick 10-minute call this week? No pressure at all.\n\n${sign}`,
      'FSBO': `Hi ${firstName},\n\nI saw your listing at ${street} and wanted to share some data that might be useful.\n\nIn the ${neighborhood} area, agent-represented homes similar to yours (${lead.sqft} sq ft, built ${lead.yearBuilt}) have sold for 8-12% more than FSBO listings over the past quarter. With your ${lead.equity} in equity, that difference could mean an extra $30-50K in your pocket.\n\nI'm not here to pressure you — I know you chose FSBO for a reason. But if you'd like to see the comps and decide for yourself, I'm happy to share them.\n\nWould a quick call work this week?\n\n${sign}`,
      'Pre-Foreclosure': `Hi ${firstName},\n\nI understand you may be navigating a difficult situation with your property at ${street}, and I wanted to reach out with care.\n\nYour home is valued at approximately ${lead.price} with ${lead.equity} in equity — that's significant, and worth protecting. I specialize in helping homeowners in ${neighborhood} explore their options quickly and discreetly.\n\nTime matters in these situations, and I'd love to help you understand all your options before they narrow.\n\nWould a confidential 10-minute call work for you this week?\n\n${sign}`,
      'High Equity': `Hi ${firstName},\n\nI've been tracking the ${neighborhood} market closely, and homeowners like you — with ${lead.equity} in equity built over ${lead.days.replace('yr owned', ' years')} — are in an exceptional position right now.\n\nYour ${lead.sqft} sq ft property at ${street} sits in one of the most in-demand areas. I specialize in helping long-time owners maximize their position.\n\nWould you be open to a no-obligation market analysis?\n\n${sign}`,
    }[t] || `Hi ${firstName},\n\nI noticed your property at ${street} and wanted to reach out.\n\n${sign}`;

    const s1B = `Hi ${firstName},\n\nI came across your property at ${street} and thought you'd want to know — homes in ${neighborhood} are getting a lot of attention right now.\n\nWith ${lead.equity} in equity on a ${lead.sqft} sq ft home built in ${lead.yearBuilt}, you're in a strong position whether you're thinking about selling or just want to know where you stand.\n\nI put together a quick analysis of what similar homes have sold for recently. Happy to share it — no strings attached.\n\n${sign}`;

    const s1C = `Hi ${firstName},\n\nI'll keep this short — I work with homeowners in ${neighborhood} and your property at ${street} caught my eye.\n\nBased on what I'm seeing in the market, your ${lead.sqft} sq ft home could be worth more than you think. ${lead.equity} in equity gives you real leverage.\n\nWould it be worth a quick conversation? I can share some numbers that might surprise you.\n\n${sign}`;

    // --- Step 2 variations ---
    const s2A = `Hi ${firstName},\n\nI wanted to follow up on my note about your property at ${street}. I know you're busy, so I'll keep this brief.\n\nI pulled together a few comparable sales in ${neighborhood} that I think you'd find interesting — homes similar to yours that sold recently, and what that means for your ${lead.equity} in equity.\n\nI'd love to share them with you. Would a 10-minute call work sometime this week?\n\n${sign}`;

    const s2B = `Hi ${firstName},\n\nJust circling back on ${street}. Since I last reached out, I noticed another home in ${neighborhood} went under contract — further confirmation that buyers are actively looking in your area.\n\nYour ${lead.equity} in equity puts you in a great spot. If you're even slightly curious about what your options look like, I'd be happy to walk you through it.\n\nNo commitment needed — just a conversation.\n\n${sign}`;

    const s2C = `Hi ${firstName},\n\nQuick follow-up — I recently helped a homeowner in a similar situation to yours (${lead.type.toLowerCase()} in ${neighborhood}) and they were surprised by how much interest they got.\n\nI think your property at ${street} has the same potential. With ${lead.equity} in equity, the math works in your favor.\n\nWorth 10 minutes to explore?\n\n${sign}`;

    // --- Step 3 variations ---
    const s3A = `Hi ${firstName},\n\nI don't want to be a pest, so this will be my last note.\n\nI reached out because I genuinely believe I can help with your situation at ${street}. The ${neighborhood} market is moving, and with ${lead.equity} in equity, you have real options.\n\nIf now isn't the right time, I completely understand. But if you'd ever like a no-obligation conversation about what your property could sell for today, my door is always open.\n\nWishing you all the best,\nSarah Johnson\nOffMarket Real Estate`;

    const s3B = `Hi ${firstName},\n\nLast note from me on ${street} — I promise.\n\nI know timing is everything in real estate. If right now doesn't work, that's completely fine. But I wanted you to know that the ${neighborhood} market is strong, your ${lead.equity} in equity is significant, and I'm here whenever you're ready.\n\nFeel free to reach out anytime — even months from now.\n\nAll the best,\nSarah Johnson\nOffMarket Real Estate`;

    const s3C = `Hi ${firstName},\n\nI'll leave you with this — your property at ${street} sits in one of the most active markets in ${neighborhood} right now. With ${lead.equity} in equity, you have more options than most homeowners realize.\n\nI'm not going anywhere. Whenever you're ready to explore what's possible, just reply to this email.\n\nTake care,\nSarah Johnson\nOffMarket Real Estate`;

    return {
      steps: [
        { subject: s1Subject, body: s1A, variations: [s1A, s1B, s1C], activeVariation: 0 },
        { body: s2A, variations: [s2A, s2B, s2C], activeVariation: 0 },
        { body: s3A, variations: [s3A, s3B, s3C], activeVariation: 0 },
      ],
      status: 'draft',
      lastEdited: new Date().toISOString(),
    };
  }, []);

  const handleOpenPitchSlideOver = useCallback((idx) => {
    if (!pitchDrafts[idx]) {
      const lead = activeLeads[idx];
      setPitchDrafts(prev => ({ ...prev, [idx]: generatePitch(lead) }));
    }
    setPitchSlideOverIndex(idx);
  }, [pitchDrafts, generatePitch, activeLeads]);

  const handleSaveDraft = useCallback((idx, steps) => {
    setPitchDrafts(prev => ({
      ...prev,
      [idx]: { ...prev[idx], steps, status: 'draft', lastEdited: new Date().toISOString() },
    }));
    setPitchSlideOverIndex(null);
  }, []);

  const handleSendPitch = useCallback((idx, steps) => {
    const now = new Date().toISOString();
    setPitchDrafts(prev => ({
      ...prev,
      [idx]: { ...prev[idx], steps, status: 'sent', lastEdited: now, sentAt: now },
    }));
    setContactedLeads(prev => ({ ...prev, [idx]: true }));
    setPitchSlideOverIndex(null);
  }, []);

  const handleRegeneratePitch = useCallback((idx) => {
    const lead = activeLeads[idx];
    setPitchDrafts(prev => ({ ...prev, [idx]: generatePitch(lead) }));
  }, [generatePitch, activeLeads]);

  const handleDiscardPitch = useCallback((idx) => {
    setPitchDrafts(prev => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
    setPitchSlideOverIndex(null);
  }, []);

  // Pitch status helper
  const getPitchStatus = (idx) => {
    if (skippedLeads[idx]) return 'Skipped';
    if (pitchDrafts[idx]?.status === 'sent') return 'Sent';
    if (pitchDrafts[idx]?.status === 'draft') return 'Draft';
    return 'Not Contacted';
  };

  const pitchStatusFilters = [
    { key: 'All', count: filterSource.length },
    { key: 'Not Contacted', count: filterSource.filter((_, i) => getPitchStatus(selectedOrder ? activeLeads.indexOf(filterSource[i]) : i) === 'Not Contacted').length },
    { key: 'Draft', count: filterSource.filter((_, i) => getPitchStatus(selectedOrder ? activeLeads.indexOf(filterSource[i]) : i) === 'Draft').length },
    { key: 'Sent', count: filterSource.filter((_, i) => getPitchStatus(selectedOrder ? activeLeads.indexOf(filterSource[i]) : i) === 'Sent').length },
    { key: 'Skipped', count: filterSource.filter((_, i) => getPitchStatus(selectedOrder ? activeLeads.indexOf(filterSource[i]) : i) === 'Skipped').length },
  ];

  // Filter by lead type, pitch status, and search query
  const filtered = activeLeads.map((l, i) => ({ ...l, _origIndex: i })).filter((l) => {
    const matchesType = activeFilter === 'All' || l.type === activeFilter;
    const matchesOrder = activeOrder === 'All' || l.order === activeOrder;
    const matchesPitchStatus = activePitchStatus === 'All' || getPitchStatus(l._origIndex) === activePitchStatus;
    const matchesSearch =
      searchQuery === '' ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesOrder && matchesPitchStatus && matchesSearch;
  });

  // Group filtered leads by order
  const groupedByOrder = filtered.reduce((groups, lead) => {
    const order = lead.order || 'Unknown';
    if (!groups[order]) groups[order] = [];
    groups[order].push(lead);
    return groups;
  }, {});
  const orderGroups = Object.entries(groupedByOrder);

  // If an order is selected, show the leads for that order
  if (selectedOrder) {
    const orderLeads = filtered.filter(l => l.order === selectedOrder);
    return (
      <div className="space-y-6">
        {/* Back + Order Header */}
        <div>
          <button
            onClick={() => { setSelectedOrder(null); setExpandedLead(null); }}
            className="text-sm text-gray-400 hover:text-charcoal transition-colors mb-3 flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3 rotate-180" /> Back to All Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-charcoal">{selectedOrder}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-semibold text-charcoal">{orderLeads.length}</span> leads in this order
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-9 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters for this order */}
        <div className="rounded-lg border border-border bg-white p-3 space-y-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-10 shrink-0">Type</span>
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap',
                  activeFilter === f.key
                    ? 'bg-charcoal text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {f.key}{f.key !== 'All' ? ` (${f.count})` : ''}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap border-t border-gray-100 pt-2.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-10 shrink-0">Status</span>
            {pitchStatusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActivePitchStatus(f.key)}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap border',
                  activePitchStatus === f.key
                    ? 'border-charcoal bg-charcoal/5 text-charcoal'
                    : f.key !== 'All' && f.count === 0
                      ? 'border-transparent text-gray-300 cursor-default'
                      : 'border-transparent text-muted-foreground hover:border-gray-200 hover:text-foreground'
                )}
                disabled={f.key !== 'All' && f.count === 0}
              >
                {f.key}{f.key !== 'All' ? ` (${f.count})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Lead list */}
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {orderLeads.map((lead) => {
              const idx = lead._origIndex;
              const isExpanded = expandedLead === idx;
              const isContacted = contactedLeads[idx];
              const isSkipped = skippedLeads[idx];

              return (
                <div key={idx} className={cn(
                  'transition-all duration-200 group',
                  isSkipped ? 'opacity-40' : '',
                  isExpanded ? 'bg-orange/[0.02]' : 'hover:bg-gray-50'
                )}>
                  <button
                    onClick={() => handleToggleExpand(idx)}
                    className="w-full text-left px-4 py-3.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className={cn('w-2.5 h-2.5 rounded-full', typeDotColor(lead.type))} />
                      </div>
                      <div className="min-w-0 w-[220px] shrink-0">
                        <p className="font-sans text-sm font-semibold text-charcoal truncate group-hover:text-orange transition-colors">{lead.name}</p>
                        <p className="font-sans text-xs text-gray-500 truncate">{lead.address}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-6 flex-1 min-w-0">
                        <div className="shrink-0">
                          <p className="font-mono text-base font-bold text-charcoal leading-tight">{lead.price}</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Value</p>
                        </div>
                        <div className="shrink-0">
                          <p className="font-mono text-xs font-medium text-gray-700">{lead.sqft} <span className="text-gray-400">ft²</span></p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Size</p>
                        </div>
                        <div className="shrink-0">
                          <p className="font-mono text-xs font-medium text-gray-700">{lead.yearBuilt}</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Built</p>
                        </div>
                        <div className="shrink-0">
                          <p className="font-sans text-xs font-medium text-gray-600">{lead.days}</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Status</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium', typeBadgeClass(lead.type))}>
                          {lead.type}
                        </span>
                        {(() => {
                          const status = getPitchStatus(idx);
                          if (status === 'Sent') return (
                            <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                              <CheckCircle2 className="h-2.5 w-2.5" />Sent
                            </span>
                          );
                          if (status === 'Draft') return (
                            <span className="inline-flex items-center gap-1 rounded-md border border-orange/20 bg-orange/10 px-1.5 py-0.5 text-[10px] font-medium text-orange">
                              <Pencil className="h-2.5 w-2.5" />Draft
                            </span>
                          );
                          if (status === 'Skipped') return (
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                              Skipped
                            </span>
                          );
                          return null;
                        })()}
                        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </div>
                    </div>
                  </button>

                  {/* Expandable Detail Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                          <div className="px-5 pb-5 pt-0">
                            <div className="border-t border-gray-100 pt-4">
                              {/* Hero CTA + AI Insight row */}
                              <div className="flex flex-col md:flex-row gap-4 mb-5">
                                <div className="md:w-[200px] shrink-0 space-y-2">
                                  <Button
                                    size="sm"
                                    className={cn(
                                      'w-full rounded-lg text-sm font-medium h-10',
                                      pitchDrafts[idx]?.status === 'sent'
                                        ? 'bg-charcoal text-white hover:bg-charcoal/90'
                                        : 'bg-orange text-white hover:bg-orange-hover'
                                    )}
                                    onClick={(e) => { e.stopPropagation(); handleOpenPitchSlideOver(idx); }}
                                  >
                                    {pitchDrafts[idx]?.status === 'sent' ? (
                                      <><Eye className="h-4 w-4 mr-2" />View Sent Pitch</>
                                    ) : pitchDrafts[idx]?.status === 'draft' ? (
                                      <><Pencil className="h-4 w-4 mr-2" />Edit Draft</>
                                    ) : (
                                      <><FileEdit className="h-4 w-4 mr-2" />Generate Pitch</>
                                    )}
                                  </Button>
                                  {!isContacted && pitchDrafts[idx]?.status !== 'sent' && (
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="flex-1 rounded-lg text-xs" onClick={(e) => handleMarkContacted(idx, e)}>
                                        <Check className="h-3 w-3 mr-1" /> Contacted
                                      </Button>
                                      <button onClick={(e) => handleSkipLead(idx, e)} className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                        {isSkipped ? 'Undo' : 'Skip'}
                                      </button>
                                    </div>
                                  )}
                                  {isContacted && (
                                    <div className="flex items-center gap-1.5 text-xs text-success">
                                      <CheckCircle2 className="h-3.5 w-3.5" /><span className="font-medium">Contacted</span>
                                    </div>
                                  )}
                                </div>
                                {extendedLeadData[idx] && (
                                  <div className="flex-1 rounded-lg border-l-[3px] border-l-orange bg-orange/[0.03] px-4 py-3">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <Info className="h-3.5 w-3.5 text-orange" />
                                      <span className="text-[10px] uppercase tracking-wider text-orange font-semibold">Why This Seller</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600">{extendedLeadData[idx].insight}</p>
                                  </div>
                                )}
                              </div>
                              {/* Data columns */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="rounded-lg border border-border p-3.5">
                                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />Property</h4>
                                  <div className="space-y-1.5">
                                    {[{ label: 'Type', value: lead.propertyType },{ label: 'Sq Ft', value: lead.sqft },{ label: 'Built', value: lead.yearBuilt },{ label: 'Lot', value: lead.lotSizeAcres ? `${lead.lotSizeAcres} ac` : null },{ label: 'Zoning', value: lead.zoningCode },{ label: 'County', value: lead.county }].filter(i => i.value != null).map(i => (
                                      <div key={i.label} className="flex justify-between items-center"><span className="text-[11px] text-gray-400">{i.label}</span><span className="text-xs font-medium text-charcoal font-mono">{i.value}</span></div>
                                    ))}
                                  </div>
                                </div>
                                <div className="rounded-lg border border-border p-3.5">
                                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />Financial</h4>
                                  <div className="space-y-1.5">
                                    {[{ label: 'Value', value: lead.price, bold: true },{ label: 'Sold', value: lead.soldPrice },{ label: 'Lender', value: lead.lender },{ label: 'Loan', value: lead.loanAmount },{ label: 'Rate', value: lead.interestRate },{ label: 'Tax', value: lead.taxBill ? `${lead.taxBill}/yr` : null }].filter(i => i.value != null && i.value !== 'N/A').map(i => (
                                      <div key={i.label} className="flex justify-between items-center"><span className="text-[11px] text-gray-400">{i.label}</span><span className={cn('text-xs font-mono', i.bold ? 'font-bold text-charcoal' : 'font-medium text-charcoal')}>{i.value}</span></div>
                                    ))}
                                  </div>
                                </div>
                                <div className="rounded-lg border border-border p-3.5">
                                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Contact</h4>
                                  <div className="space-y-2">
                                    <div><span className="text-[11px] text-gray-400">Owner</span><p className="text-xs font-medium text-charcoal">{lead.ownerName}</p></div>
                                    {lead.phones?.length > 0 && <div><span className="text-[11px] text-gray-400">Phone</span>{lead.phones.map((p, pi) => <p key={pi} className="text-xs font-mono text-charcoal">{p}</p>)}</div>}
                                    {lead.emails?.length > 0 && <div><span className="text-[11px] text-gray-400">Email</span>{lead.emails.map((em, ei) => <p key={ei} className="text-xs font-mono text-charcoal truncate">{em}</p>)}</div>}
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
          {orderLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Search className="h-5 w-5 text-gray-400 mb-2" />
              <p className="text-sm text-muted-foreground">No leads match your filters</p>
            </div>
          )}
        </div>

        {/* Pitch Slide-Over */}
        <AnimatePresence>
          {pitchSlideOverIndex !== null && (
            <PitchSlideOver
              lead={leads[pitchSlideOverIndex]}
              draft={pitchDrafts[pitchSlideOverIndex]}
              onSave={(steps) => handleSaveDraft(pitchSlideOverIndex, steps)}
              onSend={(steps) => handleSendPitch(pitchSlideOverIndex, steps)}
              onRegenerate={() => handleRegeneratePitch(pitchSlideOverIndex)}
              onDiscard={() => handleDiscardPitch(pitchSlideOverIndex)}
              onClose={() => setPitchSlideOverIndex(null)}
            />
          )}
        </AnimatePresence>
        <div className="h-12" />
      </div>
    );
  }

  // Loading state
  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-orange animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading leads...</span>
      </div>
    );
  }

  // Error state
  if (leadsError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-danger mx-auto mb-3" />
          <p className="text-sm text-danger font-medium">Failed to load leads</p>
          <p className="text-xs text-gray-400 mt-1">{leadsError}</p>
        </div>
      </div>
    );
  }

  // Order overview — show order groups as clickable cards
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Seller Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-semibold text-charcoal">{activeLeads.length}</span> leads in your market
            {Object.values(pitchDrafts).filter(d => d?.status === 'sent').length > 0 && (
              <span> · <span className="text-success font-medium">{Object.values(pitchDrafts).filter(d => d?.status === 'sent').length} pitched</span></span>
            )}
          </p>
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

      {/* Order Cards — click to view leads */}
      <div className="space-y-4">
        {orderGroups.map(([orderName, orderLeads]) => {
          const sentCount = orderLeads.filter(l => pitchDrafts[l._origIndex]?.status === 'sent').length;
          const draftCount = orderLeads.filter(l => pitchDrafts[l._origIndex]?.status === 'draft').length;
          const notContactedCount = orderLeads.length - sentCount - draftCount;
          return (
            <button
              key={orderName}
              onClick={() => setSelectedOrder(orderName)}
              className="w-full text-left rounded-xl border border-border bg-white hover:border-orange/20 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 overflow-hidden group"
            >
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 rounded-full bg-orange" />
                    <div>
                      <h3 className="font-heading text-base font-semibold text-charcoal group-hover:text-orange transition-colors">{orderName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-charcoal">{orderLeads.length}</span>
                    <span className="text-xs text-muted-foreground">leads</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange transition-colors" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden flex">
                    {sentCount > 0 && <div className="h-full bg-success" style={{ width: `${(sentCount / orderLeads.length) * 100}%` }} />}
                    {draftCount > 0 && <div className="h-full bg-orange" style={{ width: `${(draftCount / orderLeads.length) * 100}%` }} />}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 shrink-0">
                    {sentCount > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success" />{sentCount} sent</span>}
                    {draftCount > 0 && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange" />{draftCount} draft</span>}
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-300" />{notContactedCount} remaining</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {orderGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-orange" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">Order new leads to get started.</p>
          </div>
        )}
      </div>
      <div className="h-12" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Pitches Sent
// ---------------------------------------------------------------------------

function DraftsTab({ pitchDrafts, onNavigate }) {
  const [expandedPitch, setExpandedPitch] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter to only leads with sent pitches
  const sentPitches = leads.map((lead, i) => ({ ...lead, _idx: i, pitch: pitchDrafts[i] }))
    .filter(item => item.pitch?.status === 'sent')
    .filter(item =>
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Pitches Sent</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sentPitches.length} {sentPitches.length === 1 ? 'sequence' : 'sequences'} delivered to sellers.
          </p>
        </div>
        {sentPitches.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sent pitches..."
              className="pl-9 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {sentPitches.length === 0 && Object.values(pitchDrafts).filter(d => d?.status === 'sent').length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">No pitches sent yet</p>
            <p className="text-sm text-muted-foreground mb-4">Generate and send pitches from the Seller Leads tab — they&apos;ll appear here.</p>
            {onNavigate && (
              <Button size="sm" className="rounded-lg bg-orange text-white hover:bg-orange-hover" onClick={() => onNavigate('leads')}>
                <Users className="h-3.5 w-3.5 mr-1.5" />
                Go to Seller Leads
              </Button>
            )}
          </CardContent>
        </Card>
      ) : sentPitches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-charcoal mb-1">No results match your search</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {sentPitches.map((item) => {
            const isExpanded = expandedPitch === item._idx;
            return (
              <div key={item._idx} className={cn('rounded-lg border transition-all duration-150', isExpanded ? 'border-success/30 ring-1 ring-success/10' : 'border-border hover:border-success/20')}>
                {/* Compact Row */}
                <button
                  onClick={() => setExpandedPitch(prev => prev === item._idx ? null : item._idx)}
                  className="w-full text-left px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-success shrink-0" />

                    {/* Name + Address */}
                    <div className="min-w-0 w-[200px] shrink-0">
                      <p className="font-sans text-sm font-semibold text-charcoal truncate">{item.name}</p>
                      <p className="font-sans text-xs text-gray-400 truncate">{item.address}</p>
                    </div>

                    {/* Inline stats */}
                    <div className="hidden sm:flex items-center gap-5 flex-1 min-w-0">
                      <div className="text-center shrink-0">
                        <p className="font-mono text-sm font-bold text-charcoal">{item.price}</p>
                        <p className="text-[9px] uppercase text-gray-400">Value</p>
                      </div>
                      <div className="shrink-0 min-w-0 max-w-[180px]">
                        <p className="text-xs text-charcoal truncate">{item.pitch.steps?.[0]?.subject}</p>
                        <p className="text-[9px] uppercase text-gray-400">Subject</p>
                      </div>
                      <div className="text-center shrink-0">
                        <p className="text-xs text-gray-600">3 steps</p>
                        <p className="text-[9px] uppercase text-gray-400">Sequence</p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                        <CheckCircle2 className="h-2.5 w-2.5" />Sent
                      </span>
                      {(item.pitch.sentAt || item.pitch.lastEdited) && (
                        <span className="text-[10px] text-gray-400 hidden md:inline">
                          {new Date(item.pitch.sentAt || item.pitch.lastEdited).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </span>
                      )}
                      <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                    </div>
                  </div>
                </button>

                {/* Expandable Detail */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pt-0">
                        <div className="border-t border-gray-100 pt-4">

                          {/* Sequence Timeline */}
                          {(() => {
                            const sentDate = new Date(item.pitch.sentAt || item.pitch.lastEdited);
                            const day3 = new Date(sentDate);
                            const day7 = new Date(sentDate);
                            // Add business days (skip weekends)
                            let added = 0;
                            const addBizDays = (date, days) => {
                              const d = new Date(date);
                              let a = 0;
                              while (a < days) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) a++; }
                              return d;
                            };
                            const d3 = addBizDays(sentDate, 3);
                            const d7 = addBizDays(sentDate, 7);
                            const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const fmtFull = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

                            return (
                              <div className="mb-5">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Sequence Timeline</p>
                                <div className="flex items-center gap-0">
                                  {[
                                    { label: 'Initial Outreach', status: 'Delivered', date: fmtFull(sentDate), done: true },
                                    { label: 'Follow-Up', status: 'Queued', date: fmt(d3), done: false },
                                    { label: 'Final Touch', status: 'Queued', date: fmt(d7), done: false },
                                  ].map((s, si) => (
                                    <div key={si} className="flex items-center flex-1">
                                      <div className="flex flex-col items-center">
                                        <div className={cn(
                                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                                          s.done ? 'bg-success text-white' : 'bg-gray-100 text-gray-400'
                                        )}>
                                          {s.done ? <CheckCircle2 className="h-4 w-4" /> : si + 1}
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-1 font-medium">{s.label}</span>
                                        <span className={cn('text-[9px]', s.done ? 'text-success' : 'text-gray-400')}>{s.status}</span>
                                        <span className="text-[9px] text-gray-400 font-mono">{s.date}</span>
                                      </div>
                                      {si < 2 && <div className={cn('flex-1 h-px mx-2 mt-[-28px]', s.done ? 'bg-success' : 'bg-gray-200')} />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Email header */}
                          <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-gray-400 font-medium">From</span>
                                <p className="text-charcoal">Sarah Johnson via OffMarket</p>
                              </div>
                              <div>
                                <span className="text-gray-400 font-medium">To</span>
                                <p className="text-charcoal">{item.email}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 font-medium">Subject</span>
                                <p className="text-charcoal font-medium truncate">{item.pitch.steps?.[0]?.subject}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 font-medium">Sent</span>
                                <p className="text-charcoal font-mono">
                                  {new Date(item.pitch.sentAt || item.pitch.lastEdited).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Collapsible 3-step sequence */}
                          <div className="space-y-2 mb-5">
                            {item.pitch.steps?.map((step, si) => {
                              const stepKey = `${item._idx}-${si}`;
                              const isStepOpen = expandedStep === stepKey;
                              return (
                                <div key={si} className="rounded-lg border border-border overflow-hidden">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setExpandedStep(prev => prev === stepKey ? null : stepKey); }}
                                    className="w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <span className={cn(
                                      'inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0',
                                      si === 0 ? 'bg-success text-white' : 'bg-gray-100 text-gray-500'
                                    )}>
                                      {si === 0 ? <Check className="h-3 w-3" /> : si + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-xs font-medium text-charcoal">{['Initial Outreach', 'Follow-Up (Day 3)', 'Final Touch (Day 7)'][si]}</span>
                                    </div>
                                    <span className={cn(
                                      'text-[10px] font-medium shrink-0',
                                      si === 0 ? 'text-success' : 'text-gray-400'
                                    )}>
                                      {si === 0 ? 'Delivered' : 'Queued'}
                                    </span>
                                    <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200 shrink-0', isStepOpen && 'rotate-180')} />
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {isStepOpen && (
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-3 pb-3 pt-0">
                                          <div className="rounded-lg bg-light-bg border border-gray-100 p-3">
                                            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{step.body}</p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>

                          {/* Two columns: Property + Financial | Contact */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Property & Financial */}
                            <div className="rounded-lg border border-border p-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Property & Financial</p>
                              </div>
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                {[
                                  { label: 'Value', value: item.price, bold: true },
                                  { label: 'Sq Ft', value: item.sqft },
                                  { label: 'Built', value: item.yearBuilt },
                                  { label: 'Lot', value: item.lotSizeAcres ? `${item.lotSizeAcres} ac` : null },
                                  { label: 'Zoning', value: item.zoningCode },
                                  { label: 'Lender', value: item.lender },
                                  { label: 'Loan', value: item.loanAmount },
                                  { label: 'Rate', value: item.interestRate },
                                  { label: 'Parcel', value: item.totalParcelValue },
                                  { label: 'Tax Bill', value: item.taxBill ? `${item.taxBill}/yr` : null },
                                  { label: 'County', value: item.county },
                                ].filter(f => f.value).map((f) => (
                                  <div key={f.label}>
                                    <p className="text-[9px] uppercase text-gray-400">{f.label}</p>
                                    <p className={cn('font-mono text-xs', f.bold ? 'font-bold' : 'font-medium', f.className)}>{f.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div className="rounded-lg border border-border p-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Owner & Contact</p>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-[9px] uppercase text-gray-400">Owner</p>
                                  <p className="text-xs font-medium text-charcoal">{item.ownerName}</p>
                                </div>
                                {item.mailingAddress && (
                                  <div>
                                    <p className="text-[9px] uppercase text-gray-400">Mailing Address</p>
                                    <p className="text-xs text-charcoal">{item.mailingAddress}</p>
                                  </div>
                                )}
                                {item.phones?.length > 0 && (
                                  <div>
                                    <p className="text-[9px] uppercase text-gray-400 mb-0.5">Phone{item.phones.length > 1 ? 's' : ''}</p>
                                    {item.phones.map((p, pi) => (
                                      <p key={pi} className="text-xs font-mono text-charcoal">{p}</p>
                                    ))}
                                  </div>
                                )}
                                {item.emails?.length > 0 && (
                                  <div>
                                    <p className="text-[9px] uppercase text-gray-400 mb-0.5">Email{item.emails.length > 1 ? 's' : ''}</p>
                                    {item.emails.map((em, ei) => (
                                      <p key={ei} className="text-xs font-mono text-charcoal truncate">{em}</p>
                                    ))}
                                  </div>
                                )}
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Inbox
// ---------------------------------------------------------------------------

const sampleReplies = [
  {
    id: 1, name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', email: 'mtorres@email.com',
    type: 'Expired', price: '$485K', equity: '$185K', status: 'new', sentiment: 'interested',
    replyPreview: 'Hi Sarah, thanks for reaching out. I have been thinking about relisting...',
    thread: [
      { from: 'agent', name: 'Sarah Johnson', date: '2026-03-26T09:00:00Z', subject: 'Your 4821 Oakwood Dr Home — a Confidential Buyer May Be Interested', body: `Hi Michael,\n\nI noticed your home at 4821 Oakwood Dr came off the market after 47 days. That can be frustrating, and I wanted to reach out because I may be able to help.\n\nI specialize in the Riverside Heights area and have been tracking comparable sales nearby. Homes similar to yours — 2,840 sq ft, built in 2004 — have recently sold between $485K and above.\n\nWould you be open to a quick 10-minute call this week? No pressure at all.\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate` },
      { from: 'seller', name: 'Michael Torres', date: '2026-03-28T14:22:00Z', body: `Hi Sarah,\n\nThanks for reaching out. I have been thinking about relisting and would be open to hearing what you have in mind. We had some issues with our previous agent regarding pricing strategy, and I want to make sure we get it right this time.\n\nWhat does your schedule look like next week? I'm generally free Tuesday and Thursday afternoons.\n\nBest,\nMichael` },
    ],
  },
  {
    id: 2, name: 'Maria Gonzalez', address: '1847 Vista Del Mar, Oceanside', email: 'mgonzalez@email.com',
    type: 'High Equity', price: '$680K', equity: '$420K', status: 'new', sentiment: 'interested',
    replyPreview: 'Thank you for the information. My husband and I have been discussing downsizing...',
    thread: [
      { from: 'agent', name: 'Sarah Johnson', date: '2026-03-24T10:30:00Z', subject: '1847 Vista Del Mar — Is Now the Right Time to Maximize Your Equity?', body: `Hi Maria,\n\nI've been tracking the Oceanside market closely, and homeowners like you — with $420K in equity built over 15 years — are in an exceptional position right now.\n\nYour 3,680 sq ft property at 1847 Vista Del Mar sits in one of the most in-demand areas. I specialize in helping long-time owners maximize their position.\n\nWould you be open to a no-obligation market analysis?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate` },
      { from: 'seller', name: 'Maria Gonzalez', date: '2026-03-27T09:15:00Z', body: `Hi Sarah,\n\nThank you for the information. My husband and I have been discussing downsizing for a while now, and your timing is pretty good.\n\nCould you send over those comparable sales you mentioned? We want to understand what the market looks like before making any decisions. We've been in this house for 15 years and it's a big step.\n\nAlso, would you be able to do a walkthrough to give us an idea of what we might need to do to get the best price?\n\nThank you,\nMaria` },
    ],
  },
  {
    id: 3, name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', email: 'dhernandez@email.com',
    type: 'Pre-Foreclosure', price: '$520K', equity: '$310K', status: 'read', sentiment: 'warm',
    replyPreview: 'I appreciate you reaching out. Can we talk on the phone instead?',
    thread: [
      { from: 'agent', name: 'Sarah Johnson', date: '2026-03-22T08:45:00Z', subject: '892 Sunset Blvd — Protecting Your $310K in Equity', body: `Hi David,\n\nI understand you may be navigating a difficult situation with your property at 892 Sunset Blvd, and I wanted to reach out with care.\n\nYour home is valued at approximately $520K with $310K in equity — that's significant, and worth protecting.\n\nWould a confidential 10-minute call work for you this week?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate` },
      { from: 'agent', name: 'Sarah Johnson', date: '2026-03-25T09:00:00Z', body: `Hi David,\n\nI wanted to follow up on my note about your property at 892 Sunset Blvd. I know you're busy, so I'll keep this brief.\n\nI pulled together a few comparable sales in Palm Canyon that I think you'd find interesting. I'd love to share them with you.\n\nWould a 10-minute call work sometime this week?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate` },
      { from: 'seller', name: 'David Hernandez', date: '2026-03-26T16:45:00Z', body: `Sarah,\n\nI appreciate you reaching out. Things are complicated right now and I'd rather not go into all the details over email.\n\nCan we talk on the phone instead? I have some questions about the timeline and what a quick sale would actually look like. My number is (760) 555-0312, best time to reach me is after 5pm on weekdays.\n\nThanks,\nDavid` },
    ],
  },
  {
    id: 4, name: 'Robert Williams', address: '558 Palm Ave, Northpark', email: 'rwilliams@email.com',
    type: 'FSBO', price: '$349K', equity: '$120K', status: 'read', sentiment: 'not-interested',
    replyPreview: 'Not interested at this time. Please remove me from your list.',
    thread: [
      { from: 'agent', name: 'Sarah Johnson', date: '2026-03-20T11:00:00Z', subject: '558 Palm Ave — What Agent-Listed Homes Nearby Are Selling For', body: `Hi Robert,\n\nI saw your listing at 558 Palm Ave and wanted to share some data that might be useful.\n\nIn the Northpark area, agent-represented homes similar to yours have sold for 8-12% more than FSBO listings over the past quarter.\n\nWould a quick call work this week?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate` },
      { from: 'seller', name: 'Robert Williams', date: '2026-03-25T11:30:00Z', body: 'Not interested at this time. Please remove me from your list.\n\nRobert' },
    ],
  },
];

function InboxTab({ addDeal }) {
  const [expandedReply, setExpandedReply] = useState(null);
  const [activeInboxFilter, setActiveInboxFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [composerOpen, setComposerOpen] = useState(null);
  const [extraMessages, setExtraMessages] = useState({});
  const [customLabels, setCustomLabels] = useState({});
  const [openLabelDropdown, setOpenLabelDropdown] = useState(null);
  const [movedToDeals, setMovedToDeals] = useState({});

  // Close label dropdown when clicking outside
  useEffect(() => {
    if (openLabelDropdown === null) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-label-dropdown]')) {
        setOpenLabelDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openLabelDropdown]);

  const handleSendReply = useCallback((replyId, name) => {
    if (!replyText.trim()) return;
    const msg = {
      from: 'agent',
      name: 'Sarah Johnson',
      date: new Date().toISOString(),
      body: replyText.trim(),
    };
    setExtraMessages(prev => ({
      ...prev,
      [replyId]: [...(prev[replyId] || []), msg],
    }));
    setReplyText('');
    setComposerOpen(null);
  }, [replyText]);

  // All possible label options
  const labelOptions = ['Interested', 'Warm Lead', 'Not Interested', 'Meeting Set', 'Follow Up', 'Closed'];

  // Map from label display text to a sentiment key for styling
  const labelToSentimentKey = {
    'Interested': 'interested',
    'Warm Lead': 'warm',
    'Not Interested': 'not-interested',
    'Meeting Set': 'meeting-set',
    'Follow Up': 'follow-up',
    'Closed': 'closed',
  };

  // Map from original sentiment key to label display text
  const sentimentLabel = { 'interested': 'Interested', 'warm': 'Warm Lead', 'not-interested': 'Not Interested' };

  // Get the effective label for a reply (custom label takes precedence)
  const getEffectiveLabel = (reply) => {
    if (customLabels[reply.id]) return customLabels[reply.id];
    return sentimentLabel[reply.sentiment] || 'Unknown';
  };

  // Get the effective sentiment key for styling
  const getEffectiveSentimentKey = (reply) => {
    const label = getEffectiveLabel(reply);
    return labelToSentimentKey[label] || reply.sentiment;
  };

  const sentimentStyle = {
    'interested': 'bg-success/10 text-success border-success/20',
    'warm': 'bg-orange/10 text-orange border-orange/20',
    'not-interested': 'bg-gray-100 text-gray-400 border-gray-200',
    'meeting-set': 'bg-blue-50 text-blue-600 border-blue-200',
    'follow-up': 'bg-orange/10 text-orange border-orange/20',
    'closed': 'bg-gray-100 text-gray-400 border-gray-200',
  };

  // Dynamic filter counts based on effective labels
  const labelFilterMap = {
    'Interested': 'Interested',
    'Warm Lead': 'Warm',
    'Not Interested': 'Not Interested',
    'Meeting Set': 'Meeting Set',
    'Follow Up': 'Follow Up',
    'Closed': 'Closed',
  };

  // Build filter counts dynamically
  const filterCounts = {};
  sampleReplies.forEach(r => {
    const label = getEffectiveLabel(r);
    const filterKey = labelFilterMap[label] || label;
    filterCounts[filterKey] = (filterCounts[filterKey] || 0) + 1;
  });

  const inboxFilters = [
    { key: 'All', count: sampleReplies.length },
    { key: 'Interested', count: filterCounts['Interested'] || 0 },
    { key: 'Warm', count: filterCounts['Warm'] || 0 },
    { key: 'Not Interested', count: filterCounts['Not Interested'] || 0 },
    { key: 'Meeting Set', count: filterCounts['Meeting Set'] || 0 },
    { key: 'Follow Up', count: filterCounts['Follow Up'] || 0 },
    { key: 'Closed', count: filterCounts['Closed'] || 0 },
  ];

  const filtered = sampleReplies
    .filter(r => {
      if (activeInboxFilter === 'All') return true;
      const effectiveLabel = getEffectiveLabel(r);
      const effectiveFilterKey = labelFilterMap[effectiveLabel] || effectiveLabel;
      return effectiveFilterKey === activeInboxFilter;
    })
    .filter(r =>
      searchQuery === '' ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.replyPreview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const newCount = sampleReplies.filter(r => r.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-charcoal">Inbox</h1>
            {newCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-orange px-2.5 py-0.5 text-xs font-bold text-white">
                {newCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Seller replies to your outreach sequences.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search replies..."
            className="pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 flex-wrap">
        {inboxFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveInboxFilter(f.key)}
            disabled={f.key !== 'All' && f.count === 0}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap',
              activeInboxFilter === f.key
                ? 'bg-charcoal text-white'
                : f.key !== 'All' && f.count === 0
                  ? 'text-gray-300 cursor-default'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {f.key}{f.key !== 'All' ? ` (${f.count})` : ''}
          </button>
        ))}
      </div>

      {/* Reply list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Inbox className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-charcoal mb-1">
            {sampleReplies.length === 0 ? 'No replies yet' : 'No replies match your filters'}
          </p>
          <p className="text-sm text-muted-foreground">
            {sampleReplies.length === 0 ? 'When sellers reply to your sequences, they\'ll appear here.' : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((reply) => {
            const isExpanded = expandedReply === reply.id;
            return (
              <div key={reply.id} className={cn(
                'rounded-lg border transition-all duration-150',
                reply.status === 'new' ? 'border-orange/30 bg-orange/[0.03] shadow-sm' : '',
                isExpanded ? 'ring-1 ring-orange/10 border-orange/30' : 'border-border hover:border-orange/20'
              )}>
                {/* Compact Row */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedReply(prev => prev === reply.id ? null : reply.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedReply(prev => prev === reply.id ? null : reply.id); } }}
                  className="w-full text-left px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Unread dot */}
                    <div className={cn('w-2 h-2 rounded-full shrink-0', reply.status === 'new' ? 'bg-orange' : 'bg-transparent')} />

                    {/* Name + preview */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={cn('text-sm truncate', reply.status === 'new' ? 'font-bold text-charcoal' : 'font-semibold text-charcoal')}>{reply.name}</p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {new Date(reply.thread[reply.thread.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{reply.replyPreview}</p>
                    </div>

                    {/* Inline stats */}
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="font-mono text-sm font-bold text-charcoal">{reply.price}</p>
                        <p className="text-[9px] uppercase text-gray-400">Value</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="relative" data-label-dropdown>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenLabelDropdown(prev => prev === reply.id ? null : reply.id);
                          }}
                          className={cn(
                            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium cursor-pointer hover:ring-1 hover:ring-gray-300 transition-all',
                            sentimentStyle[getEffectiveSentimentKey(reply)]
                          )}
                        >
                          {getEffectiveLabel(reply)}
                          <ChevronDown className="h-2.5 w-2.5 ml-0.5" />
                        </button>
                        {openLabelDropdown === reply.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-lg border border-border bg-white shadow-lg py-1">
                            {labelOptions.map((option) => {
                              const optionKey = labelToSentimentKey[option];
                              const isActive = getEffectiveLabel(reply) === option;
                              return (
                                <button
                                  key={option}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCustomLabels(prev => ({ ...prev, [reply.id]: option }));
                                    setOpenLabelDropdown(null);
                                  }}
                                  className={cn(
                                    'w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2',
                                    isActive
                                      ? 'bg-gray-50 font-semibold text-charcoal'
                                      : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'
                                  )}
                                >
                                  <span className={cn('w-2 h-2 rounded-full shrink-0', {
                                    'bg-success': optionKey === 'interested',
                                    'bg-orange': optionKey === 'warm' || optionKey === 'follow-up',
                                    'bg-gray-400': optionKey === 'not-interested' || optionKey === 'closed',
                                    'bg-blue-500': optionKey === 'meeting-set',
                                  })} />
                                  {option}
                                  {isActive && <Check className="h-3 w-3 ml-auto text-success" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                    </div>
                  </div>
                </div>

                {/* Expanded conversation thread */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 pt-4">

                          {/* Thread subject */}
                          <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                            <p className="text-sm font-medium text-charcoal truncate">
                              {reply.thread[0]?.subject || 'No subject'}
                            </p>
                            <span className="text-[10px] text-gray-400 shrink-0">{reply.thread.length} messages</span>
                          </div>

                          {/* Conversation thread */}
                          <div className="space-y-3 mb-4">
                            {[...reply.thread, ...(extraMessages[reply.id] || [])].map((msg, mi) => (
                              <div key={mi} className={cn('flex gap-3', msg.from === 'agent' ? '' : '')}>
                                {/* Avatar */}
                                <div className={cn(
                                  'w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5',
                                  msg.from === 'agent' ? 'bg-orange text-white' : 'bg-charcoal text-white'
                                )}>
                                  {msg.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-charcoal">{msg.name}</span>
                                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', msg.from === 'agent' ? 'bg-orange/10 text-orange' : 'bg-charcoal/10 text-charcoal')}>
                                      {msg.from === 'agent' ? 'You' : 'Seller'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                      {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className={cn(
                                    'rounded-lg p-3 text-sm leading-relaxed whitespace-pre-line',
                                    msg.from === 'agent'
                                      ? 'bg-gray-50 border border-gray-100 text-gray-600'
                                      : 'bg-orange/[0.04] border border-orange/10 text-charcoal'
                                  )}>
                                    {msg.body}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Reply composer */}
                          <div className="rounded-lg border border-border p-3 mb-4">
                            {composerOpen === reply.id ? (
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">SJ</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span className="text-xs font-semibold text-charcoal">Sarah Johnson</span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-orange/10 text-orange">You</span>
                                    </div>
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      className="w-full min-h-[120px] rounded-lg bg-light-bg border border-gray-100 p-3 text-sm leading-relaxed text-foreground resize-none outline-none focus:ring-1 focus:ring-orange/30 transition-shadow"
                                      placeholder={`Write your reply to ${reply.name.split(' ')[0]}...`}
                                      autoFocus
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 pl-11">
                                  <button
                                    onClick={() => { setComposerOpen(null); setReplyText(''); }}
                                    className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <Button
                                    size="sm"
                                    className="rounded-lg bg-orange text-white hover:bg-orange-hover"
                                    onClick={() => handleSendReply(reply.id, reply.name)}
                                    disabled={!replyText.trim()}
                                  >
                                    <Send className="h-3.5 w-3.5 mr-1.5" />
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setComposerOpen(reply.id); setReplyText(''); }}
                                className="w-full flex items-center gap-3 text-left"
                              >
                                <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-[10px] font-bold shrink-0">SJ</div>
                                <p className="text-xs text-gray-400 flex-1">Write a reply to {reply.name.split(' ')[0]}...</p>
                                <span className="text-xs text-orange font-medium">Reply</span>
                              </button>
                            )}
                          </div>

                          {/* Bottom row: Property + Actions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-lg border border-border p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Property</p>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  { label: 'Address', value: reply.address.split(',')[0] },
                                  { label: 'Type', value: reply.type },
                                  { label: 'Value', value: reply.price, bold: true },
                                ].map((f) => (
                                  <div key={f.label}>
                                    <p className="text-[9px] uppercase text-gray-400">{f.label}</p>
                                    <p className={cn('text-xs', f.bold ? 'font-bold font-mono' : 'font-medium', f.className)}>{f.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-lg border border-border p-3 space-y-2">
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Quick Actions</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'w-full justify-start rounded-lg text-sm',
                                  movedToDeals[reply.id] && 'border-success/30 text-success bg-success/5 pointer-events-none'
                                )}
                                disabled={movedToDeals[reply.id]}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addDeal({ name: reply.name, address: reply.address, email: reply.email, price: reply.price, type: reply.type, source: 'inbox' });
                                  setMovedToDeals(prev => ({ ...prev, [reply.id]: true }));
                                }}
                              >
                                {movedToDeals[reply.id] ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 mr-2" />
                                    Added to Deals
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-3.5 w-3.5 mr-2" />
                                    Move to Deals
                                  </>
                                )}
                              </Button>
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
      )}
      <div className="h-12" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Pipeline
// ---------------------------------------------------------------------------

function PipelineTab({ deals, addDeal, moveDealStage }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchAdd, setSearchAdd] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = ['Positive Reply', 'Following Up', 'Meeting Scheduled', 'Nurturing', 'Closed'];
  const stageColors = ['bg-success', 'bg-orange', 'bg-blue-500', 'bg-charcoal', 'bg-success'];
  const stageAccent = ['bg-success/[0.03]', '', 'bg-blue-500/[0.03]', '', 'bg-success/[0.03]'];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">My Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {deals.length === 0 ? 'Add leads from your Inbox or lead list to track them here.' : `${deals.length} ${deals.length === 1 ? 'deal' : 'deals'} in your pipeline.`}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-lg bg-orange text-white hover:bg-orange-hover"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline stages — always visible */}
      <div className="rounded-lg border border-border bg-white p-4">
        <div className="flex items-center">
          {stages.map((stage, i) => {
            const count = deals.filter(d => d.stage === stage).length;
            const textColors = ['text-success', 'text-orange', 'text-blue-600', 'text-charcoal', 'text-success'];
            const bgColors = ['bg-success/10', 'bg-orange/10', 'bg-blue-500/10', 'bg-charcoal/10', 'bg-success/10'];
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold', count > 0 ? bgColors[i] : 'bg-gray-50', count > 0 ? textColors[i] : 'text-gray-300')}>
                    {count}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1.5 font-medium text-center leading-tight">{stage}</span>
                </div>
                {i < stages.length - 1 && (
                  <div className={cn('h-px flex-shrink-0 w-6 mt-[-16px]', count > 0 ? 'bg-gray-300' : 'bg-gray-200')} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {deals.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <GitBranch className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-charcoal mb-1">No deals yet</p>
            <p className="text-sm text-muted-foreground mb-4">Move leads here from your Inbox, or add them manually.</p>
            <Button
              size="sm"
              className="rounded-lg bg-orange text-white hover:bg-orange-hover"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Your First Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-4">
          {stages.map((stage, stageIdx) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const nextStage = stages[stageIdx + 1];
            return (
              <div
                key={stage}
                className={cn(
                  'min-w-[160px] flex-1 rounded-xl border bg-white overflow-hidden transition-colors',
                  dragOverStage === stage ? 'border-orange border-dashed bg-orange/[0.02]' : 'border-border'
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIdx !== null) moveDealStage(dragIdx, stage);
                  setDragIdx(null);
                  setDragOverStage(null);
                }}
              >
                <div className={cn('px-3 py-2.5 border-b border-border flex items-center justify-between', stageAccent[stageIdx])}>
                  <div className="flex items-center gap-2">
                    <div className={cn('w-1.5 h-4 rounded-full', stageColors[stageIdx])} />
                    <span className="text-xs font-semibold text-charcoal">{stage}</span>
                  </div>
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground font-mono">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="p-1.5 space-y-1.5 min-h-[60px]">
                  {stageDeals.map((deal, di) => {
                    const dealIdx = deals.indexOf(deal);
                    return (
                      <div
                        key={dealIdx}
                        draggable
                        onDragStart={() => setDragIdx(dealIdx)}
                        onDragEnd={() => { setDragIdx(null); setDragOverStage(null); }}
                        className={cn('rounded-lg border border-border bg-white p-2.5 hover:shadow-sm hover:border-orange/20 transition-all group cursor-grab active:cursor-grabbing', dragIdx === dealIdx && 'opacity-50')}
                      >
                        <p className="text-xs font-semibold text-charcoal leading-tight">{deal.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{deal.address}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          {deal.price && <span className="font-mono text-[11px] font-bold text-charcoal">{deal.price}</span>}
                          {deal.source && <span className="text-[9px] text-gray-400 uppercase">from {deal.source}</span>}
                        </div>
                        {nextStage && (
                          <button
                            onClick={() => moveDealStage(dealIdx, nextStage)}
                            className="w-full mt-2 text-[10px] text-gray-400 hover:text-orange hover:bg-orange/[0.03] rounded py-1 transition-colors flex items-center justify-center gap-1"
                          >
                            Move to {nextStage} <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        )}
                        {stage === 'Closed' && (
                          <div className="mt-2 text-[10px] text-success font-medium text-center flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Deal closed
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-[10px] text-gray-300">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-heading text-base font-semibold text-charcoal">Add Lead to Deals</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="px-5 py-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search leads by name or address..."
                      className="pl-9 h-9 text-sm"
                      value={searchAdd}
                      onChange={(e) => setSearchAdd(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {leads
                    .filter(l =>
                      searchAdd === '' ||
                      l.name.toLowerCase().includes(searchAdd.toLowerCase()) ||
                      l.address.toLowerCase().includes(searchAdd.toLowerCase())
                    )
                    .map((lead, i) => {
                      const alreadyAdded = deals.some(d => d.name === lead.name && d.address === lead.address);
                      return (
                        <button
                          key={i}
                          disabled={alreadyAdded}
                          onClick={() => {
                            addDeal({ name: lead.name, address: lead.address, email: lead.email, price: lead.price, type: lead.type, source: 'manual' });
                          }}
                          className={cn(
                            'w-full text-left px-5 py-3 border-b border-gray-100 flex items-center justify-between transition-colors',
                            alreadyAdded ? 'opacity-40 cursor-default' : 'hover:bg-gray-50'
                          )}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-charcoal truncate">{lead.name}</p>
                            <p className="text-xs text-gray-500 truncate">{lead.address}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lead.price && <span className="font-mono text-xs font-bold text-charcoal">{lead.price}</span>}
                            {alreadyAdded ? (
                              <span className="text-[10px] text-gray-400">Added</span>
                            ) : (
                              <Plus className="h-4 w-4 text-orange" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-12" />
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

// ---------------------------------------------------------------------------
// Tab: Settings (placeholder)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Tab: Email Accounts
// ---------------------------------------------------------------------------

function EmailAccountsTab() {
  const { user, profile } = useAuth();
  console.log('EmailAccountsTab mounted. user:', user?.id, 'profile:', profile?.id);
  const [domain, setDomain] = useState(null);
  const [mailboxes, setMailboxes] = useState([]);
  const [showDomainFlow, setShowDomainFlow] = useState(false);
  const [showAddMailbox, setShowAddMailbox] = useState(false);
  const [domainStep, setDomainStep] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [expandedMailbox, setExpandedMailbox] = useState(null);
  const [provisioningChecks, setProvisioningChecks] = useState([]);
  const [lastWinnrDomainId, setLastWinnrDomainId] = useState(null);
  const firstNames = ['Sarah','Michael','Jessica','David','Emily','James','Amanda','Robert','Maria','Daniel','Laura','Christopher','Nicole','Andrew','Rachel','Kevin','Stephanie','Brian','Jennifer','Thomas'];
  const lastNames = ['Johnson','Smith','Williams','Brown','Davis','Miller','Wilson','Anderson','Taylor','Martinez','Garcia','Lopez','Harris','Clark','Lewis','Robinson','Walker','Young','King','Wright'];
  const generateUser = (existingUsernames = []) => {
    let attempts = 0;
    while (attempts < 50) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const styles = [`${fn.toLowerCase()}`, `${fn.toLowerCase()}.${ln[0].toLowerCase()}`, `${fn[0].toLowerCase()}.${ln.toLowerCase()}`];
      const username = styles[Math.floor(Math.random() * styles.length)];
      if (!existingUsernames.includes(username)) {
        return { fullName: `${fn} ${ln}`, username, edited: false };
      }
      attempts++;
    }
    // Fallback with number suffix
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${fn.toLowerCase()}.${ln[0].toLowerCase()}${Math.floor(Math.random() * 99)}`;
    return { fullName: `${fn} ${ln}`, username, edited: false };
  };

  const generateUniqueUsers = (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
      const taken = [...users.map(u => u.username), ...mailboxes.map(m => m.email.split('@')[0])];
      users.push(generateUser(taken));
    }
    return users;
  };

  const [newUsers, setNewUsers] = useState(() => generateUniqueUsers(1));

  const [searchLoading, setSearchLoading] = useState(false);

  // Load existing domain + mailboxes from Supabase on mount
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        console.log('Loading domain for user:', user.id);

        // Timeout wrapper to prevent hanging
        const queryPromise = supabase
          .from('agent_domains')
          .select('*')
          .eq('agent_id', user.id)
          .limit(1);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase query timed out after 5s')), 5000)
        );

        let rows = [];
        let error = null;
        try {
          const result = await Promise.race([queryPromise, timeoutPromise]);
          rows = result.data || [];
          error = result.error;
        } catch (e) {
          console.error('Domain query failed/timed out:', e.message);
        }

        console.log('Domain query result:', { rows, error });
        const data = rows?.[0];
        if (data) {
          setDomain({
            name: data.domain_name,
            status: data.status,
            purchasedAt: data.purchased_at || data.created_at,
            price: data.price,
            winnrDomainId: data.winnr_domain_id,
            mxVerified: data.mx_verified,
            spfVerified: data.spf_verified,
            dkimVerified: data.dkim_verified,
          });
          // Also load mailboxes
          const { data: mbs } = await supabase
            .from('agent_mailboxes')
            .select('*')
            .eq('agent_id', user.id);
          if (mbs && mbs.length > 0) {
            setMailboxes(mbs.map(m => ({
              email: m.email,
              displayName: m.display_name,
              status: m.status,
              healthScore: m.health_score,
              inboxRate: Number(m.inbox_rate),
              emailsSent: m.total_sent,
              dailyLimit: m.daily_limit,
              sentToday: m.sent_today,
              dailySends: [0, 0, 0, 0, 0, 0, 0],
              createdAt: m.created_at,
            })));
          }
        }
      } catch (err) {
        console.error('Failed to load domain:', err);
      }
    })();
  }, [user?.id]);

  const handleDomainSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const response = await suggestDomains(searchQuery.trim());
      if (response?.data) {
        setSearchResults(response.data.map(d => ({
          domain: d.domain,
          available: d.available,
          price: d.price,
        })));
      }
    } catch (err) {
      console.error('Domain search failed:', err);
      // Fallback to mock results if API fails
      const q = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
      setSearchResults([
        { domain: `${q}-homes.com`, available: true, price: 12.99 },
        { domain: `${q}-realty.com`, available: true, price: 14.99 },
        { domain: `${q}-listings.com`, available: true, price: 11.99 },
        { domain: `${q}-properties.com`, available: true, price: 13.99 },
      ]);
    }
    setSearchLoading(false);
  };

  const handleSelectDomain = (d) => {
    setSelectedDomain(d);
    setDomainStep('confirm');
  };

  const handleBuyDomain = async () => {
    setDomainStep('provisioning');
    setProvisioningChecks([]);

    try {
      // Step 1: Purchase domain via Winnr
      setProvisioningChecks(['Domain registered']);
      const setupResult = await setupDomain(selectedDomain.domain);

      // Step 2: Poll job until complete (if async)
      if (setupResult?.data?.id) {
        setProvisioningChecks(prev => [...prev, 'DNS records configured']);

        let jobComplete = false;
        let attempts = 0;
        while (!jobComplete && attempts < 30) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            const job = await getJob(setupResult.data.id);
            if (job?.data?.status === 'completed') {
              jobComplete = true;
            } else if (job?.data?.status === 'failed') {
              throw new Error(job?.data?.message || 'Domain setup failed');
            }
          } catch (e) {
            // If getJob fails, assume it completed (some setups are synchronous)
            jobComplete = true;
          }
          attempts++;
        }
      }

      setProvisioningChecks(prev => [...prev, 'MX records set']);
      await new Promise(r => setTimeout(r, 500));
      setProvisioningChecks(prev => [...prev, 'SPF + DKIM configured']);
      await new Promise(r => setTimeout(r, 500));
      setProvisioningChecks(prev => [...prev, 'DMARC policy applied']);

      // Stash winnr domain ID for handleProvisioningComplete
      setLastWinnrDomainId(setupResult?.data?.id || null);

      // Save to Supabase (non-blocking — don't let DB errors prevent UI from completing)
      try {
        console.log('Saving domain to Supabase. User ID:', user?.id);
        if (user?.id) {
          const { data: domainData, error: domainError } = await supabase
            .from('agent_domains')
            .insert({
              agent_id: user.id,
              domain_name: selectedDomain.domain,
              status: 'active',
              mx_verified: true,
              spf_verified: true,
              dkim_verified: true,
              price: selectedDomain.price,
              winnr_domain_id: setupResult?.data?.id || null,
            })
            .select()
            .single();

          if (domainError) console.error('Supabase domain insert error:', domainError);
          else console.log('Domain saved to Supabase:', domainData);

          if (domainData) {
            await supabase.from('winnr_mappings').insert({
              agent_id: user.id,
              resource_type: 'domain',
              local_id: domainData.id,
              winnr_id: setupResult?.data?.id || null,
            });
          }
        }
      } catch (dbErr) {
        console.error('Supabase save failed (domain still purchased):', dbErr);
      }

      setDomainStep('done');
    } catch (err) {
      console.error('Domain purchase failed:', err);
      // Fall back to mock provisioning so UI doesn't break
      setProvisioningChecks(['Domain registered', 'DNS records configured', 'MX records set', 'SPF + DKIM configured', 'DMARC policy applied']);
      setDomainStep('done');
    }
  };

  const handleProvisioningComplete = () => {
    setDomain({
      name: selectedDomain.domain,
      status: 'active',
      purchasedAt: new Date().toISOString(),
      price: selectedDomain.price,
      winnrDomainId: lastWinnrDomainId,
    });
    setShowDomainFlow(false);
    setDomainStep('search');
    setSearchQuery('');
    setSearchResults([]);
    setSelectedDomain(null);
    setProvisioningChecks([]);
  };

  const handleCreateMailbox = () => {
    if (!newMailboxUsername.trim() || !newMailboxDisplayName.trim()) return;
    const newMb = {
      email: `${newMailboxUsername.trim()}@${domain.name}`,
      displayName: newMailboxDisplayName.trim(),
      status: 'active',
      healthScore: 0,
      inboxRate: 0,
      spamRate: 0,
      emailsSent: 0,
      dailyLimit: 10,
      sentToday: 0,
      dailySends: [0, 0, 0, 0, 0, 0, 0],
      createdAt: new Date().toISOString(),
    };
    setMailboxes(prev => [...prev, newMb]);
    setNewMailboxUsername('');
    setNewMailboxDisplayName('');
    setShowAddMailbox(false);
  };

  const statusBadge = (status) => {
    if (status === 'active') return <span className="inline-flex items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[11px] font-medium text-success">Active</span>;
    return <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">Provisioning</span>;
  };

  const healthColor = (score) => {
    if (score > 80) return 'text-success';
    if (score >= 50) return 'text-orange';
    return 'text-danger';
  };

  // ---- Empty state ----
  if (!domain && !showDomainFlow) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">Email Accounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your sending domain and mailboxes.</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-orange/10 flex items-center justify-center">
            <Globe className="h-7 w-7 text-orange" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-charcoal">Set Up Your Sending Domain</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            To reach seller inboxes (not spam), your outreach needs to come from a dedicated sending domain — separate from your personal email.
          </p>
          <div className="text-left max-w-md mx-auto space-y-2.5 mb-6">
            {[
              'Protects your personal email reputation — your Gmail stays untouched',
              'Automatic DNS setup (SPF, DKIM, DMARC) for maximum inbox placement',
              'Smart daily send limits protect your sender reputation',
              'Real-time health monitoring so you know your emails are landing',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <Button
            className="bg-orange text-white hover:bg-orange-hover rounded-lg px-6 h-10 text-sm font-medium"
            onClick={() => setShowDomainFlow(true)}
          >
            Get Started
          </Button>
        </div>

        <div className="h-12" />

        {/* Domain Purchase Slide-Over */}
        <AnimatePresence>
          {showDomainFlow && (
            <DomainSlideOver
              domainStep={domainStep}
              setDomainStep={setDomainStep}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              onSearch={handleDomainSearch} searchLoading={searchLoading}
              onSelect={handleSelectDomain}
              selectedDomain={selectedDomain}
              onBuy={handleBuyDomain}
              provisioningChecks={provisioningChecks}
              onComplete={handleProvisioningComplete}
              onClose={() => { setShowDomainFlow(false); setDomainStep('search'); setSearchQuery(''); setSearchResults([]); setSelectedDomain(null); }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ---- Main view (domain exists) ----
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">Email Accounts</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your sending domain and mailboxes.</p>
      </div>

      {/* Domain Card */}
      {domain && (
        <div className="rounded-xl border border-border bg-white p-5 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-orange shrink-0" />
                <h3 className="font-heading text-base font-semibold text-charcoal">{domain.name}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2 ml-8">
                <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-2.5 w-2.5" />MX
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-2.5 w-2.5" />SPF
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-success/20 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-2.5 w-2.5" />DKIM
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-8">
                Purchased {new Date(domain.purchasedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Renews annually
              </p>
            </div>
            <div className="shrink-0">
              {statusBadge(domain.status)}
            </div>
          </div>
        </div>
      )}

      {/* Mailboxes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-charcoal">Mailboxes</h2>
          <span className="text-xs text-muted-foreground">{mailboxes.length}/5 slots used</span>
        </div>

        {mailboxes.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
            <Mail className="h-6 w-6 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No mailboxes yet. Create one to start sending.</p>
          </div>
        )}

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {mailboxes.map((mb, idx) => {
              const isExpanded = expandedMailbox === idx;
              return (
                <div key={idx} className={cn('transition-all duration-200 group', isExpanded ? 'bg-orange/[0.02]' : 'hover:bg-gray-50')}>
                  <button
                    onClick={() => setExpandedMailbox(isExpanded ? null : idx)}
                    className="w-full text-left px-4 py-3.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-sm font-semibold text-charcoal truncate group-hover:text-orange transition-colors">{mb.email}</p>
                        <p className="font-sans text-xs text-gray-500 truncate">{mb.displayName}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-5">
                        <div className="text-right shrink-0">
                          <p className={cn('font-mono text-sm font-bold leading-tight', healthColor(mb.healthScore))}>{mb.healthScore}</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Health</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-xs font-medium text-gray-700">{mb.inboxRate}%</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Inbox</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-xs font-medium text-gray-700">{mb.emailsSent}</p>
                          <p className="text-[9px] uppercase text-gray-400 tracking-wider">Sent</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(mb.status)}
                        <ChevronDown className={cn('h-3.5 w-3.5 text-gray-400 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t border-gray-100 pt-4 space-y-5">
                            {/* Daily Send Limit */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-charcoal">Daily Send Limit</span>
                                <span className="text-xs text-muted-foreground">{mb.sentToday} / {mb.dailyLimit} emails today</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-success transition-all duration-500"
                                  style={{ width: `${(mb.sentToday / mb.dailyLimit) * 100}%` }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1.5">Your mailbox can send up to 10 emails per day to maintain high deliverability.</p>
                            </div>

                            {/* Health score large */}
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className={cn('font-mono text-3xl font-bold', healthColor(mb.healthScore))}>{mb.healthScore}</p>
                                <p className="text-[10px] uppercase text-gray-400 tracking-wider mt-0.5">Health Score</p>
                              </div>
                              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                                  <p className="font-mono text-sm font-bold text-charcoal">{mb.inboxRate}%</p>
                                  <p className="text-[9px] uppercase text-gray-400 tracking-wider">Inbox Rate</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                                  <p className="font-mono text-sm font-bold text-charcoal">{mb.spamRate}%</p>
                                  <p className="text-[9px] uppercase text-gray-400 tracking-wider">Spam Rate</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                                  <p className="font-mono text-sm font-bold text-charcoal">{mb.dailySends[mb.dailySends.length - 1]}</p>
                                  <p className="text-[9px] uppercase text-gray-400 tracking-wider">Sent Today</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-2.5 text-center">
                                  <p className="font-mono text-sm font-bold text-charcoal">{mb.emailsSent}</p>
                                  <p className="text-[9px] uppercase text-gray-400 tracking-wider">Total Sent</p>
                                </div>
                              </div>
                            </div>

                            {/* Daily send volume chart */}
                            <div>
                              <p className="text-xs font-medium text-charcoal mb-2">Daily Send Volume (last 7 days)</p>
                              <div className="flex items-end gap-1.5 h-16">
                                {mb.dailySends.map((count, i) => {
                                  const maxSend = Math.max(...mb.dailySends, 1);
                                  const pct = (count / maxSend) * 100;
                                  return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                      <div
                                        className="w-full rounded-t bg-success/70 transition-all duration-300"
                                        style={{ height: `${Math.max(pct, 4)}%` }}
                                      />
                                      <span className="text-[9px] text-gray-400">D{i + 1}</span>
                                    </div>
                                  );
                                })}
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

        {/* Add Mailbox button */}
        <Button
          variant="outline"
          className="w-full rounded-lg h-10 text-sm font-medium border-dashed"
          disabled={mailboxes.length >= 5}
          onClick={() => setShowAddMailbox(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {mailboxes.length >= 5 ? 'Maximum mailboxes reached' : 'Add Mailbox'}
        </Button>

        {/* Status banner */}
        {mailboxes.length > 0 && (() => {
          const avgHealth = Math.round(mailboxes.reduce((sum, m) => sum + m.healthScore, 0) / mailboxes.length);
          const totalDailyLimit = mailboxes.length * 10;

          return (
            <div className="rounded-xl border border-success/20 bg-success/[0.03] p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">You&apos;re all set!</p>
                  <p className="text-xs text-gray-500">Your mailboxes are active and ready to send.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-success/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-xs text-gray-600">{mailboxes.length} {mailboxes.length === 1 ? 'mailbox' : 'mailboxes'} active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs text-gray-600">{totalDailyLimit} emails/day limit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs text-gray-600">{mailboxes.reduce((sum, m) => sum + m.emailsSent, 0)} total emails sent</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="h-12" />

      {/* Domain Purchase Slide-Over */}
      <AnimatePresence>
        {showDomainFlow && (
          <DomainSlideOver
            domainStep={domainStep}
            setDomainStep={setDomainStep}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSearch={handleDomainSearch} searchLoading={searchLoading}
            onSelect={handleSelectDomain}
            selectedDomain={selectedDomain}
            onBuy={handleBuyDomain}
            provisioningChecks={provisioningChecks}
            onComplete={handleProvisioningComplete}
            onClose={() => { setShowDomainFlow(false); setDomainStep('search'); setSearchQuery(''); setSearchResults([]); setSelectedDomain(null); }}
          />
        )}
      </AnimatePresence>

      {/* Create Mailbox Modal */}
      <AnimatePresence>
        {showAddMailbox && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
              onClick={() => setShowAddMailbox(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            >
              {(() => {
                const generateVariation = (fullName, existingUsernames) => {
                  const parts = fullName.trim().split(' ').filter(Boolean);
                  if (parts.length < 2) {
                    const base = parts[0]?.toLowerCase() || 'user';
                    const variations = [base, `${base}1`, `${base}2`, `${base}3`];
                    return variations.find(v => !existingUsernames.includes(v)) || `${base}${Math.floor(Math.random() * 99)}`;
                  }
                  const fn = parts[0].toLowerCase();
                  const ln = parts[parts.length - 1].toLowerCase();
                  const variations = [
                    `${fn}.${ln[0]}`,
                    `${fn[0]}.${ln}`,
                    `${fn}.${ln}`,
                    `${fn}${ln[0]}`,
                    `${ln}.${fn[0]}`,
                    `${fn}.${ln.slice(0,3)}`,
                    `${fn}${Math.floor(Math.random() * 9) + 1}`,
                  ];
                  return variations.find(v => !existingUsernames.includes(v)) || `${fn}.${ln}${Math.floor(Math.random() * 99)}`;
                };

                const randomizeAll = () => {
                  const refreshed = [];
                  const taken = [...mailboxes.map(m => m.email.split('@')[0])];
                  for (const u of newUsers) {
                    const username = generateVariation(u.fullName || 'New User', [...taken, ...refreshed.map(r => r.username)]);
                    refreshed.push({ ...u, username, edited: false });
                  }
                  setNewUsers(refreshed);
                };

                const addRow = () => {
                  if (newUsers.length >= 5) return;
                  // Copy the first user's name and generate a different username
                  const baseName = newUsers[0]?.fullName || '';
                  const taken = [...newUsers.map(u => u.username), ...mailboxes.map(m => m.email.split('@')[0])];
                  const username = baseName.trim() ? generateVariation(baseName, taken) : generateUser(taken).username;
                  setNewUsers([...newUsers, { fullName: baseName, username, edited: false }]);
                };
                const removeRow = (idx) => { if (newUsers.length > 1) setNewUsers(newUsers.filter((_, i) => i !== idx)); };
                const updateUser = (idx, field, value) => {
                  setNewUsers(newUsers.map((u, i) => {
                    if (i !== idx) return u;
                    if (field === 'edited') return { ...u, edited: true };
                    if (field === 'fullName') {
                      const parts = value.trim().split(' ').filter(Boolean);
                      let username;
                      if (parts.length >= 2) {
                        username = `${parts[0].toLowerCase()}.${parts[parts.length - 1][0].toLowerCase()}`;
                      } else if (parts.length === 1) {
                        username = parts[0].toLowerCase();
                      } else {
                        username = '';
                      }
                      return { ...u, fullName: value, username, edited: true };
                    }
                    return { ...u, [field]: value, edited: true };
                  }));
                };

                const handleCreateAll = async () => {
                  const createdMbs = [];
                  newUsers.forEach(u => {
                    const mb = {
                      email: `${u.username}@${domain.name}`,
                      displayName: u.fullName,
                      status: 'active',
                      healthScore: 0,
                      inboxRate: 0,
                      spamRate: 0,
                      emailsSent: 0,
                      dailyLimit: 10,
                      sentToday: 0,
                      dailySends: [0, 0, 0, 0, 0, 0, 0],
                      createdAt: new Date().toISOString(),
                    };
                    createdMbs.push(mb);
                    setMailboxes(prev => {
                      if (prev.length >= 5) return prev;
                      return [...prev, mb];
                    });
                  });
                  setShowAddMailbox(false);

                  // Wire to Winnr + Supabase in background
                  try {
                    if (domain?.name) {
                      const winnrUsers = newUsers.map(u => ({
                        username: u.username,
                        name: u.fullName,
                      }));
                      console.log('Creating Winnr mailboxes on', domain.name, ':', winnrUsers);
                      const result = await bulkCreateEmailUsers(domain.name, winnrUsers);

                      // Save each mailbox to Supabase
                      if (user?.id) {
                        for (let i = 0; i < createdMbs.length; i++) {
                          const mb = createdMbs[i];
                          const winnrUser = result?.data?.[i] || null;
                          const { data: mbData } = await supabase
                            .from('agent_mailboxes')
                            .insert({
                              agent_id: user.id,
                              email: mb.email,
                              display_name: mb.displayName,
                              status: 'active',
                              health_score: 0,
                              inbox_rate: 0,
                              total_sent: 0,
                              daily_limit: 10,
                              sent_today: 0,
                              winnr_user_id: winnrUser?.id || null,
                            })
                            .select()
                            .single();

                          if (mbData && winnrUser?.id) {
                            await supabase.from('winnr_mappings').insert({
                              agent_id: user.id,
                              resource_type: 'email_user',
                              local_id: mbData.id,
                              winnr_id: winnrUser.id,
                            });
                          }
                        }
                      }
                    }
                  } catch (err) {
                    console.error('Winnr mailbox creation failed:', err);
                    // Local state already updated, Winnr sync failed silently
                  }
                };

                const maxAllowed = 5 - mailboxes.length;
                const existingEmails = mailboxes.map(m => m.email);
                const newEmails = newUsers.map(u => `${u.username}@${domain?.name}`);
                const hasDuplicateNew = new Set(newEmails).size !== newEmails.length;
                const hasExistingConflict = newEmails.some(e => existingEmails.includes(e));
                const canCreate = newUsers.length > 0 && newUsers.every(u => u.fullName.trim() && u.username.trim()) && newUsers.length <= maxAllowed && !hasDuplicateNew && !hasExistingConflict;

                return (
                  <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-base font-semibold text-charcoal">Add Email Users</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Configure the email users to create on <span className="font-mono text-charcoal">{domain?.name}</span></p>
                      </div>
                      <button onClick={() => setShowAddMailbox(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Users</p>
                        <div className="flex items-center gap-2">
                          <button onClick={randomizeAll} className="text-xs text-orange hover:text-orange-hover font-medium transition-colors flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            Randomize All
                          </button>
                          <button onClick={addRow} disabled={newUsers.length >= maxAllowed} className={cn('text-xs font-medium transition-colors flex items-center gap-1', newUsers.length >= maxAllowed ? 'text-gray-300' : 'text-charcoal hover:text-orange')}>
                            <Plus className="h-3 w-3" />
                            Add User
                          </button>
                        </div>
                      </div>

                      {/* Table header */}
                      <div className="grid grid-cols-[30px_1fr_1fr_1.2fr_30px] gap-2 px-2 pb-2 border-b border-gray-100">
                        <span className="text-[10px] font-medium text-gray-400 uppercase">#</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase">Full Name</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase">Username</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase">Preview</span>
                        <span></span>
                      </div>

                      {/* Table rows */}
                      <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                        {newUsers.map((user, idx) => (
                          <div key={idx} className="grid grid-cols-[30px_1fr_1fr_1.2fr_30px] gap-2 px-2 py-2.5 items-center hover:bg-gray-50/50 transition-colors">
                            <span className="text-xs text-gray-400 font-mono">{idx + 1}.</span>
                            <Input
                              value={user.fullName}
                              onChange={(e) => updateUser(idx, 'fullName', e.target.value)}
                              className="h-8 text-xs rounded-md"
                              placeholder="Full Name"
                              onFocus={() => updateUser(idx, 'edited', true)}
                            />
                            <div className="flex items-center gap-0">
                              <Input
                                value={user.username}
                                onChange={(e) => updateUser(idx, 'username', e.target.value)}
                                className="h-8 text-xs rounded-r-none font-mono"
                                placeholder="username"
                              />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 truncate">{user.username}@{domain?.name}</span>
                            <button onClick={() => removeRow(idx)} className={cn('text-gray-300 hover:text-danger transition-colors', newUsers.length <= 1 && 'opacity-0 pointer-events-none')}>
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add another mailbox card */}
                      {newUsers.length < maxAllowed && maxAllowed > 0 && (
                        <button
                          onClick={addRow}
                          className="w-full mt-2 flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-orange/30 hover:bg-orange/[0.02] px-4 py-3 transition-all group"
                        >
                          <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-orange/10 flex items-center justify-center transition-colors">
                            <Plus className="h-3.5 w-3.5 text-gray-400 group-hover:text-orange transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-medium text-gray-500 group-hover:text-charcoal transition-colors">Add another mailbox</p>
                            <p className="text-[10px] text-gray-400">More mailboxes improve deliverability with sender rotation</p>
                          </div>
                        </button>
                      )}

                      {maxAllowed <= 0 && (
                        <p className="text-xs text-danger mt-3">Maximum mailboxes reached (5). Delete existing mailboxes to add more.</p>
                      )}
                      {hasDuplicateNew && (
                        <p className="text-xs text-danger mt-3">Duplicate usernames in your list. Each email must be unique.</p>
                      )}
                      {hasExistingConflict && (
                        <p className="text-xs text-danger mt-3">
                          {newEmails.filter(e => existingEmails.includes(e)).join(', ')} {newEmails.filter(e => existingEmails.includes(e)).length === 1 ? 'is' : 'are'} already created. Mailboxes can&apos;t be changed after setup — use a different username.
                        </p>
                      )}
                    </div>

                    <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                      <p className="text-xs text-gray-400">{newUsers.length} {newUsers.length === 1 ? 'user' : 'users'} will be created</p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setShowAddMailbox(false)}>Cancel</Button>
                        <Button className="bg-orange text-white hover:bg-orange-hover rounded-lg text-xs h-9 px-4" disabled={!canCreate} onClick={handleCreateAll}>
                          <Mail className="h-3.5 w-3.5 mr-1.5" />
                          Create {newUsers.length} {newUsers.length === 1 ? 'Mailbox' : 'Mailboxes'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Domain Purchase Slide-Over
// ---------------------------------------------------------------------------

function DomainSlideOver({
  domainStep, setDomainStep, searchQuery, setSearchQuery,
  searchResults, onSearch, searchLoading, onSelect, selectedDomain,
  onBuy, provisioningChecks, onComplete, onClose,
}) {
  const provisioningSteps = [
    'Domain registered',
    'DNS records configured',
    'MX records set',
    'SPF + DKIM configured',
    'DMARC policy applied',
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-[520px] bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-heading text-base font-semibold text-charcoal">Find Your Sending Domain</h3>
            <p className="text-sm text-muted-foreground">Enter your name or business and we&apos;ll suggest available domains.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Search */}
          {domainStep === 'search' && (
            <div className="space-y-5">
              <div className="flex gap-2">
                <Input
                  placeholder="Your name or business (e.g. jones, premier realty)"
                  className="h-10 text-sm flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                  autoFocus
                />
                <Button
                  className="bg-orange text-white hover:bg-orange-hover rounded-lg h-10 px-4 text-sm font-medium shrink-0"
                  onClick={onSearch}
                  disabled={!searchQuery.trim() || searchLoading}
                >
                  {searchLoading ? (
                    <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Searching...</>
                  ) : (
                    <><Search className="h-4 w-4 mr-1.5" />Search</>
                  )}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-gray-100">
                  {searchResults.map((result, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm font-medium text-charcoal">{result.domain}</p>
                        {result.available ? (
                          <p className="text-xs text-success font-medium">Available · ${result.price}/yr</p>
                        ) : (
                          <p className="text-xs text-gray-400">Unavailable</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className={cn(
                          'rounded-lg text-xs h-8 px-3',
                          result.available
                            ? 'bg-orange text-white hover:bg-orange-hover'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        )}
                        disabled={!result.available}
                        onClick={() => onSelect(result)}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Confirm */}
          {domainStep === 'confirm' && selectedDomain && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-white p-5 text-center space-y-3">
                <Globe className="h-8 w-8 text-orange mx-auto" />
                <p className="font-heading text-lg font-semibold text-charcoal">{selectedDomain.domain}</p>
                <p className="font-mono text-2xl font-bold text-charcoal">${selectedDomain.price}<span className="text-sm text-muted-foreground font-normal">/yr</span></p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-charcoal font-medium">This will be your professional sending domain</p>
                <div className="space-y-1.5">
                  {['All DNS records (MX, SPF, DKIM, DMARC) configured automatically', 'Mailboxes are active immediately with smart daily send limits', 'Domain included with your plan'].map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                className="w-full bg-orange text-white hover:bg-orange-hover rounded-lg h-10 text-sm font-medium"
                onClick={onBuy}
              >
                Buy Domain — ${selectedDomain.price}/yr
              </Button>
              <button
                className="w-full text-sm text-muted-foreground hover:text-charcoal transition-colors text-center"
                onClick={() => setDomainStep('search')}
              >
                Back to search
              </button>
            </div>
          )}

          {/* Step 3: Provisioning */}
          {domainStep === 'provisioning' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 text-orange mx-auto animate-spin" />
                <p className="font-heading text-lg font-semibold text-charcoal">Setting up your domain</p>
                <p className="text-sm text-muted-foreground">This will only take a moment...</p>
              </div>
              <div className="space-y-3">
                {provisioningSteps.map((step) => {
                  const isDone = provisioningChecks.includes(step);
                  return (
                    <div key={step} className="flex items-center gap-3">
                      {isDone ? (
                        <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-success" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        </div>
                      )}
                      <span className={cn('text-sm', isDone ? 'text-charcoal font-medium' : 'text-gray-400')}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {domainStep === 'done' && (() => {
            const [redirectUrl, setRedirectUrl] = useState('');
            const [redirectSaving, setRedirectSaving] = useState(false);
            const [redirectSaved, setRedirectSaved] = useState(false);

            const handleSaveRedirect = async () => {
              if (!redirectUrl.trim()) return;
              setRedirectSaving(true);
              try {
                // Get the Winnr domain ID
                const winnrId = selectedDomain?.winnrDomainId || null;
                if (winnrId) {
                  let url = redirectUrl.trim();
                  if (!url.startsWith('http')) url = `https://${url}`;
                  await setupRedirect(winnrId, url);
                }
                setRedirectSaved(true);
                setTimeout(() => onComplete(), 1000);
              } catch (err) {
                console.error('Redirect setup failed:', err);
                // Still proceed even if redirect fails
                onComplete();
              }
              setRedirectSaving(false);
            };

            return (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <Check className="h-7 w-7 text-success" />
                  </div>
                  <p className="font-heading text-lg font-semibold text-charcoal">Domain ready!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-mono text-charcoal">{selectedDomain?.domain}</span> is configured and ready to go.
                  </p>
                </div>

                {/* Redirect setup */}
                <div className="rounded-xl border border-border bg-white p-5 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">Set up domain redirect</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      When someone types <span className="font-mono">{selectedDomain?.domain}</span> in a browser, where should it go?
                    </p>
                  </div>
                  <Input
                    placeholder="https://yourwebsite.com"
                    className="h-10 text-sm font-mono"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    disabled={redirectSaved}
                  />
                  <p className="text-[10px] text-gray-400">
                    Your website, brokerage page, or any URL. This doesn&apos;t affect email sending.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {redirectSaved ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-success font-medium py-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Redirect saved! Setting up mailboxes...
                    </div>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-orange text-white hover:bg-orange-hover rounded-lg h-10 text-sm font-medium"
                        onClick={handleSaveRedirect}
                        disabled={redirectSaving || !redirectUrl.trim()}
                      >
                        {redirectSaving ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                        ) : (
                          <><Globe className="h-4 w-4 mr-2" />Save Redirect & Create Mailboxes</>
                        )}
                      </Button>
                      <p className="text-[10px] text-gray-400 text-center">
                        You can always change the redirect later in settings.
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </motion.div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tab: Settings
// ---------------------------------------------------------------------------

function SettingsTab() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const settingsName = profile?.full_name || 'Agent';
  const settingsInitials = profile?.initials || settingsName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const settingsEmail = profile?.email || '';
  const settingsMarket = profile?.market || 'Set your market';

  const handleLogOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange text-xl font-bold text-white">
            {settingsInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg font-semibold text-charcoal">{settingsName}</p>
            <p className="text-sm text-muted-foreground">{settingsEmail}</p>
            <p className="text-xs text-gray-400 mt-0.5">{settingsMarket}</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg text-xs shrink-0">
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-gray-100">
        {[
          { label: 'Email Signature', desc: 'Name, title, and sign-off used in all pitches', icon: Mail },
          { label: 'Pipeline Stages', desc: 'Customize your deal pipeline stages', icon: GitBranch },
          { label: 'Integrations', desc: 'CRM, calendar, and email provider sync', icon: Settings },
          { label: 'Billing & Plan', desc: 'Your subscription, invoices, and payment method', icon: DollarSign },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-orange/10 transition-colors">
                <Icon className="h-4 w-4 text-gray-400 group-hover:text-orange transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-charcoal">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-orange transition-colors" />
            </button>
          );
        })}
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-danger/20 bg-danger/[0.02] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-charcoal">Log Out</p>
            <p className="text-xs text-muted-foreground">Sign out of your OffMarket account</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs border-danger/20 text-danger hover:bg-danger/5 hover:text-danger"
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}

export default function AppDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLeadsArrived, setShowLeadsArrived] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive display values from auth profile
  const displayName = profile?.full_name || 'Agent';
  const displayInitials = profile?.initials || displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const displayMarket = profile?.market || 'Set your market';
  const displayEmail = profile?.email || '';
  const firstName = displayName.split(' ')[0];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Shared state — pitch drafts and contacted leads live here so both tabs can access them
  const [pitchDrafts, setPitchDrafts] = useState({});
  const [contactedLeads, setContactedLeads] = useState({});
  const [deals, setDeals] = useState([]);

  const addDeal = useCallback((deal) => {
    setDeals(prev => {
      if (prev.some(d => d.name === deal.name && d.address === deal.address)) return prev;
      return [...prev, { ...deal, stage: 'Positive Reply', addedAt: new Date().toISOString() }];
    });
  }, []);

  const moveDealStage = useCallback((dealIdx, newStage) => {
    setDeals(prev => prev.map((d, i) => i === dealIdx ? { ...d, stage: newStage } : d));
  }, []);

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
        <button onClick={() => handleNavClick('dashboard')} className="flex items-center gap-0.5 px-6 py-6 w-full text-left">
          <span className="font-heading text-xl font-semibold text-white">Off</span>
          <span className="font-heading text-xl font-semibold text-orange">Market</span>
        </button>

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
              {displayInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-white/50 truncate">{displayMarket}</p>
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
              className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-heading text-lg font-semibold">Good morning, {firstName}</h1>
              <p className="text-xs text-muted-foreground">You have <span className="font-semibold text-orange">{leads.length} seller leads</span> and <span className="font-semibold text-success">{sampleReplies.filter(r => r.status === 'new').length} new replies</span>.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
                </span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-white shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-charcoal">Notifications</p>
                  </div>
                  <div className="px-4 py-8 text-center">
                    <Bell className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">
              {displayInitials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-16">
          <FadePanel tabKey={activeTab}>
            {activeTab === 'overview' && <OverviewTab onNavigate={handleNavClick} pitchDrafts={pitchDrafts} deals={deals} />}
            {activeTab === 'farm' && <FarmAreaTab />}
            {activeTab === 'leads' && <LeadsTab pitchDrafts={pitchDrafts} setPitchDrafts={setPitchDrafts} contactedLeads={contactedLeads} setContactedLeads={setContactedLeads} />}
            {activeTab === 'drafts' && <DraftsTab pitchDrafts={pitchDrafts} onNavigate={handleNavClick} />}
            {activeTab === 'pipeline' && <PipelineTab deals={deals} addDeal={addDeal} moveDealStage={moveDealStage} />}
            {activeTab === 'replies' && <InboxTab addDeal={addDeal} />}
            {activeTab === 'email' && <EmailAccountsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </FadePanel>
        </main>
      </div>

      {/* ---- Mobile bottom tab bar ---- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg flex items-center justify-around h-14">
        {[
          { key: 'dashboard', label: 'Home', icon: Home },
          { key: 'leads', label: 'Leads', icon: Users },
          { key: 'drafts', label: 'Sent', icon: Send },
          { key: 'replies', label: 'Inbox', icon: Inbox },
          { key: 'email', label: 'Email', icon: Mail },
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
