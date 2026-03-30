import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAllOrders,
  updateOrderStatus,
  logRequestEvent,
  insertLeads,
  logCsvUpload,
} from '@/lib/leads';
import { supabase } from '@/lib/supabase';
import {
  getUsage,
  listDomains,
  listEmailUsers,
  deleteEmailUser,
  updateEmailUser,
} from '@/lib/winnr';
import {
  LayoutDashboard,
  Users,
  FileUp,
  ClipboardList,
  CreditCard,
  Settings,
  Bell,
  Upload,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Wrench,
  Clock,
  FileSpreadsheet,
  X,
  Search,
  UserCheck,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Activity,
  Power,
  Mail,
  XCircle,
  Send,
  ExternalLink,
  MapPin,
  Tag,
  Calendar,
  MessageSquare,
  Globe,
  Trash2,
  Edit3,
  Server,
  Shield,
  RefreshCw,
  Loader2,
  Check,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const agents = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    email: 'sarah.johnson@email.com',
    market: 'Riverside Heights',
    plan: 'Pro',
    leadsPerMonth: 250,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Mike Chen',
    initials: 'MC',
    email: 'mike.chen@email.com',
    market: 'Phoenix',
    plan: 'Starter',
    leadsPerMonth: 100,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Jessica Williams',
    initials: 'JW',
    email: 'jessica.w@email.com',
    market: 'Austin',
    plan: 'Pro',
    leadsPerMonth: 250,
    status: 'Trial',
  },
  {
    id: 4,
    name: 'David Park',
    initials: 'DP',
    email: 'david.park@email.com',
    market: 'San Diego',
    plan: 'Starter',
    leadsPerMonth: 100,
    status: 'Expired',
  },
  {
    id: 5,
    name: 'Amanda Foster',
    initials: 'AF',
    email: 'amanda.foster@email.com',
    market: 'Denver',
    plan: 'Pro',
    leadsPerMonth: 250,
    status: 'Active',
  },
  {
    id: 6,
    name: 'Carlos Rivera',
    initials: 'CR',
    email: 'carlos.r@email.com',
    market: 'Tampa',
    plan: 'Starter',
    leadsPerMonth: 100,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Emily Watson',
    initials: 'EW',
    email: 'emily.watson@email.com',
    market: 'Atlanta',
    plan: 'Pro',
    leadsPerMonth: 250,
    status: 'Active',
  },
  {
    id: 8,
    name: 'Ryan Patel',
    initials: 'RP',
    email: 'ryan.patel@email.com',
    market: 'Charlotte',
    plan: 'Starter',
    leadsPerMonth: 100,
    status: 'Active',
  },
];

const pendingRequests = [
  {
    id: 1,
    agentId: 1,
    agent: 'Sarah Johnson',
    initials: 'SJ',
    market: 'Riverside Heights',
    zipCodes: ['92506', '92507'],
    leadTypes: ['Expired', 'FSBO', 'Pre-Foreclosure'],
    priceRange: '$200K-$800K',
    requested: '2h ago',
    status: 'Pending',
    statusHistory: [
      { status: 'Submitted', date: 'Mar 28, 10:15 AM', detail: 'Request submitted by Sarah Johnson' },
      { status: 'Zip codes requested', date: 'Mar 28, 10:15 AM', detail: 'Zip codes: 92506, 92507' },
    ],
    notes: 'Looking for high-equity properties near UC Riverside. Prefers expired listings 60+ days.',
  },
  {
    id: 2,
    agentId: 2,
    agent: 'Mike Chen',
    initials: 'MC',
    market: 'Phoenix',
    zipCodes: ['85001', '85003', '85004'],
    leadTypes: ['All types'],
    priceRange: '$150K-$600K',
    requested: '1d ago',
    status: 'Pending',
    statusHistory: [
      { status: 'Submitted', date: 'Mar 27, 3:42 PM', detail: 'Request submitted by Mike Chen' },
      { status: 'Zip codes requested', date: 'Mar 27, 3:42 PM', detail: 'Zip codes: 85001, 85003, 85004' },
    ],
    notes: 'Expanding into downtown Phoenix area. First bulk request.',
  },
  {
    id: 3,
    agentId: 3,
    agent: 'Jessica Williams',
    initials: 'JW',
    market: 'Austin',
    zipCodes: ['78701', '78702'],
    leadTypes: ['Expired', 'High Equity'],
    priceRange: '$300K-$900K',
    requested: '3d ago',
    status: 'In Progress',
    statusHistory: [
      { status: 'Submitted', date: 'Mar 25, 9:30 AM', detail: 'Request submitted by Jessica Williams' },
      { status: 'Zip codes requested', date: 'Mar 25, 9:30 AM', detail: 'Zip codes: 78701, 78702' },
      { status: 'Processing', date: 'Mar 26, 11:00 AM', detail: 'Admin began processing request' },
    ],
    notes: 'Trial agent, high-value market. Prioritize quality over quantity.',
  },
  {
    id: 4,
    agentId: 5,
    agent: 'Amanda Foster',
    initials: 'AF',
    market: 'Denver',
    zipCodes: ['80202', '80203', '80205'],
    leadTypes: ['Pre-Foreclosure', 'Absentee'],
    priceRange: '$250K-$700K',
    requested: '5d ago',
    status: 'Completed',
    statusHistory: [
      { status: 'Submitted', date: 'Mar 23, 2:15 PM', detail: 'Request submitted by Amanda Foster' },
      { status: 'Processing', date: 'Mar 24, 9:00 AM', detail: 'Admin began processing request' },
      { status: 'Leads Uploaded', date: 'Mar 24, 10:30 AM', detail: '312 leads uploaded and assigned' },
      { status: 'Agent Notified', date: 'Mar 24, 10:31 AM', detail: 'Amanda Foster notified via email' },
    ],
    notes: 'Pro agent, monthly recurring order.',
  },
  {
    id: 5,
    agentId: 4,
    agent: 'David Park',
    initials: 'DP',
    market: 'San Diego',
    zipCodes: ['92101'],
    leadTypes: ['FSBO'],
    priceRange: '$400K-$1.2M',
    requested: '7d ago',
    status: 'Rejected',
    statusHistory: [
      { status: 'Submitted', date: 'Mar 21, 4:00 PM', detail: 'Request submitted by David Park' },
      { status: 'Rejected', date: 'Mar 22, 8:45 AM', detail: 'Rejected: Account subscription expired. Renew to continue.' },
    ],
    notes: '',
  },
];

const previewLeads = [
  { address: '4821 Oakwood Dr', owner: 'Michael Torres', type: 'Expired', price: '$485,000', equity: '$185,000', email: 'mtorres@email.com' },
  { address: '1203 Maple Ridge Ln', owner: 'Lisa Fernandez', type: 'FSBO', price: '$392,000', equity: '$240,000', email: 'lfernandez@email.com' },
  { address: '892 Sunset Blvd', owner: 'David Hernandez', type: 'Pre-Foreclosure', price: '$520,000', equity: '$310,000', email: 'dhernandez@email.com' },
  { address: '2710 Harbor View Dr', owner: 'Linda Chen', type: 'Absentee', price: '$415,000', equity: '$195,000', email: 'lchen@email.com' },
  { address: '558 Palm Ave', owner: 'Robert Williams', type: 'High Equity', price: '$349,000', equity: '$120,000', email: 'rwilliams@email.com' },
];

const recentActivity = [
  { text: '248 leads uploaded for Sarah Johnson', time: '2h ago', highlight: true },
  { text: 'Mike Chen requested 3 zip codes in Phoenix', time: '1d ago' },
  { text: 'Jessica Williams activated trial account', time: '3d ago' },
  { text: 'David Park subscription expired', time: '5d ago', warn: true },
  { text: 'Amanda Foster upgraded to Pro plan', time: '6d ago' },
];

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'agents', label: 'Agents', icon: Users },
  { key: 'requests', label: 'Lead Requests', icon: ClipboardList },
  { key: 'upload', label: 'Upload Leads', icon: FileUp },
  { key: 'email-infra', label: 'Email Infra', icon: Mail },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// ---------------------------------------------------------------------------
// Helper: badge colours
// ---------------------------------------------------------------------------

function statusBadgeClass(status) {
  switch (status) {
    case 'Active':
      return 'bg-success/10 text-success border-success/20';
    case 'Trial':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Expired':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'Pending':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'In Progress':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Completed':
      return 'bg-success/10 text-success border-success/20';
    case 'Rejected':
      return 'bg-danger/10 text-danger border-danger/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function typeBadgeClass(type) {
  switch (type) {
    case 'Expired':
      return 'bg-danger/10 text-danger border-danger/20';
    case 'FSBO':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Pre-Foreclosure':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Absentee':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'High Equity':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function planBadgeClass(plan) {
  switch (plan) {
    case 'Pro':
      return 'bg-orange/10 text-orange border-orange/20';
    case 'Starter':
      return 'bg-gray-100 text-gray-500 border-gray-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// ---------------------------------------------------------------------------
// Helper: timeline dot colour
// ---------------------------------------------------------------------------

function timelineDotClass(status) {
  if (status === 'Rejected') return 'bg-danger';
  if (status === 'Leads Uploaded' || status === 'Agent Notified' || status === 'Completed') return 'bg-success';
  if (status === 'Processing') return 'bg-blue-500';
  return 'bg-orange';
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
// Mini timeline component (reusable)
// ---------------------------------------------------------------------------

function StatusTimeline({ history, compact = false }) {
  return (
    <div className={cn('relative', compact ? 'space-y-2' : 'space-y-3')}>
      {history.map((entry, i) => {
        const isLast = i === history.length - 1;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'rounded-full shrink-0',
                  compact ? 'w-2 h-2 mt-1.5' : 'w-2.5 h-2.5 mt-1',
                  timelineDotClass(entry.status)
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-gray-200 mt-1" />
              )}
            </div>
            <div className={cn('pb-1 min-w-0', !isLast && (compact ? 'pb-0' : 'pb-1'))}>
              <p className={cn('font-medium text-foreground', compact ? 'text-[11px]' : 'text-xs')}>
                {entry.detail || entry.status}
              </p>
              <p className={cn('text-muted-foreground font-mono', compact ? 'text-[10px]' : 'text-[11px]')}>
                {entry.date}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Request Detail Slide-over Panel
// ---------------------------------------------------------------------------

function RequestDetailPanel({ request, onClose, onUploadLeads, onReject }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Look up agent from mock data, or fall back to DB user data from the request
  const agent = agents.find((a) => a.id === request.agentId) || (request.dbRecord?.users ? {
    email: request.dbRecord.users.email,
    status: request.dbRecord.users.status || 'Active',
    plan: request.dbRecord.users.plan || 'Starter',
    leadsPerMonth: 250,
  } : null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="border-t border-border bg-white"
    >
      <div className="px-4 py-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold text-charcoal">Request Details</h3>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agent Info Card */}
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Agent Profile</p>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-[11px] font-semibold text-white">
              {request.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{request.agent}</p>
              <p className="text-xs text-muted-foreground">{agent?.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', statusBadgeClass(agent?.status || 'Active'))}>
                  {agent?.status}
                </span>
                <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', planBadgeClass(agent?.plan || 'Starter'))}>
                  {agent?.plan}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">{agent?.leadsPerMonth}/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Request Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Market</p>
            </div>
            <p className="text-sm font-medium text-foreground">{request.market}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Zip Codes</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {request.zipCodes.map((z) => (
                <span key={z} className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                  {z}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Tag className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Lead Types</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {request.leadTypes.map((t) => (
                <span key={t} className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium', typeBadgeClass(t))}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Price Range</p>
            </div>
            <p className="text-sm font-mono text-foreground">{request.priceRange}</p>
          </div>
        </div>

        {/* Agent Notes */}
        {request.notes && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Agent Notes</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/10 px-3 py-2.5">
              <p className="text-xs text-gray-600 leading-relaxed">{request.notes}</p>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Request History</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-3">
            <StatusTimeline history={request.statusHistory} compact />
          </div>
        </div>

        {/* Reject reason input */}
        <AnimatePresence>
          {showRejectInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="rounded-lg border border-danger/20 bg-danger/[0.02] p-3 space-y-2">
                <label className="text-xs font-medium text-danger">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., Account subscription expired. Renew to continue."
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-danger/30 resize-none"
                  rows={2}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-lg bg-danger text-white hover:bg-danger/90 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (rejectReason.trim()) {
                        onReject(request.id, rejectReason);
                        setShowRejectInput(false);
                        setRejectReason('');
                      }
                    }}
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-xs"
                    onClick={(e) => { e.stopPropagation(); setShowRejectInput(false); setRejectReason(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {(request.status === 'Pending' || request.status === 'In Progress') && !showRejectInput && (
          <div className="flex items-center gap-2 pt-1">
            <Button
              className="rounded-lg bg-orange text-white hover:bg-orange/90 text-sm flex-1"
              onClick={(e) => { e.stopPropagation(); onUploadLeads(request); }}
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Upload Leads for This Request
            </Button>
            <Button
              variant="outline"
              className="rounded-lg text-sm text-danger border-danger/20 hover:bg-danger/5"
              onClick={(e) => { e.stopPropagation(); setShowRejectInput(true); }}
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Reject
            </Button>
          </div>
        )}

        {request.status === 'Completed' && (
          <div className="rounded-lg border border-success/20 bg-success/[0.03] px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <p className="text-xs text-success font-medium">This request has been fulfilled and the agent has been notified.</p>
          </div>
        )}

        {request.status === 'Rejected' && (
          <div className="rounded-lg border border-danger/20 bg-danger/[0.03] px-4 py-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-danger shrink-0" />
            <p className="text-xs text-danger font-medium">This request was rejected.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Helpers for DB data mapping
// ---------------------------------------------------------------------------

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function capitalizeStatus(s) {
  if (!s) return 'Pending';
  const map = {
    pending: 'Pending',
    'in_progress': 'In Progress',
    'in progress': 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
  };
  return map[s.toLowerCase()] || s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// View: Admin Overview (Command Center)
// ---------------------------------------------------------------------------

function OverviewView({ onProcessRequest, showRequestsOnly = false, onNavigate }) {
  const { user } = useAuth();
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [detailRequest, setDetailRequest] = useState(null);
  const [requestFilter, setRequestFilter] = useState('All');
  const [requests, setRequests] = useState(pendingRequests);
  const [toast, setToast] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch orders from DB, fall back to mock data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      const { data, error } = await getAllOrders();
      if (!cancelled) {
        if (!error && data && data.length > 0) {
          // Map DB orders to the shape expected by the UI
          const mapped = data.map((o) => {
            const agentProfile = o.users;
            return {
              id: o.id,
              agentId: o.agent_id,
              agent: agentProfile?.full_name || 'Unknown Agent',
              initials: agentProfile?.initials || (agentProfile?.full_name || 'UA').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
              market: agentProfile?.market || 'Unknown',
              zipCodes: o.zip_codes || [],
              leadTypes: o.lead_types || [],
              priceRange: `$${(o.price_min || 0).toLocaleString()}-$${(o.price_max || 0).toLocaleString()}`,
              requested: formatTimeAgo(o.requested_at),
              status: capitalizeStatus(o.status),
              statusHistory: [
                { status: 'Submitted', date: new Date(o.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + new Date(o.requested_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), detail: `Request submitted by ${agentProfile?.full_name || 'agent'}` },
              ],
              notes: o.notes || '',
              dbRecord: o,
            };
          });
          setRequests(mapped);
        }
        // If DB is empty or errors, keep the mock data that was set as initial state
        setOrdersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filterTabs = [
    { key: 'All', count: requests.length },
    { key: 'Pending', count: requests.filter((r) => r.status === 'Pending').length },
    { key: 'In Progress', count: requests.filter((r) => r.status === 'In Progress').length },
    { key: 'Completed', count: requests.filter((r) => r.status === 'Completed').length },
    { key: 'Rejected', count: requests.filter((r) => r.status === 'Rejected').length },
  ];

  const filteredRequests = useMemo(() => {
    if (requestFilter === 'All') return requests;
    return requests.filter((r) => r.status === requestFilter);
  }, [requests, requestFilter]);

  async function handleRejectRequest(requestId, reason) {
    // Optimistic UI update
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected',
              statusHistory: [
                ...r.statusHistory,
                { status: 'Rejected', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), detail: `Rejected: ${reason}` },
              ],
            }
          : r
      )
    );
    setDetailRequest(null);
    setExpandedRequest(null);

    // Persist to DB (non-blocking — UI already updated)
    const { error } = await updateOrderStatus(requestId, 'rejected', reason);
    if (!error && user?.id) {
      await logRequestEvent(requestId, user.id, 'Rejected', `Rejected: ${reason}`, reason);
    }
    if (error) {
      setToast({ message: 'Failed to save rejection to database', type: 'danger' });
    } else {
      setToast({ message: 'Request rejected', type: 'danger' });
    }
    setTimeout(() => setToast(null), 3000);
  }

  function handleClickProcess(req) {
    setExpandedRequest(req.id);
    setDetailRequest(req.id);
  }

  const metrics = [
    { label: 'Active Agents', value: '8', icon: UserCheck, accent: 'text-charcoal', iconBg: 'bg-charcoal/5', iconColor: 'text-charcoal', nav: 'agents' },
    { label: 'Pending Requests', value: String(requests.filter((r) => r.status === 'Pending').length), icon: AlertCircle, accent: 'text-orange', badge: 'needs action', badgeColor: 'bg-orange/10 text-orange', iconBg: 'bg-orange/5', iconColor: 'text-orange', nav: 'requests' },
    { label: 'Leads Delivered', value: '1,847', icon: TrendingUp, accent: 'text-charcoal', iconBg: 'bg-success/5', iconColor: 'text-success', nav: 'upload' },
    { label: 'Monthly Revenue', value: '$632', icon: DollarSign, accent: 'text-charcoal', mono: true, iconBg: 'bg-charcoal/5', iconColor: 'text-charcoal', nav: 'payments' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={cn(
              'rounded-xl border px-4 py-3 shadow-lg flex items-center gap-2',
              toast.type === 'danger' ? 'bg-white border-danger/20 text-danger' : 'bg-white border-success/20 text-success'
            )}>
              {toast.type === 'danger' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric cards (hide on requests-only view) */}
      {!showRequestsOnly && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.label}
                className="relative overflow-visible group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => onNavigate && onNavigate(m.nav)}
              >
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {m.label}
                    </p>
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', m.iconBg)}>
                      <Icon className={cn('w-4 h-4', m.iconColor)} />
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span
                      className={cn(
                        'text-3xl font-heading font-semibold leading-none',
                        m.accent,
                        m.mono && 'font-mono'
                      )}
                    >
                      {m.value}
                    </span>
                    {m.badge && (
                      <span
                        className={cn(
                          'ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                          m.badgeColor
                        )}
                      >
                        {m.badge}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lead Requests with filter tabs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-semibold">
            {showRequestsOnly ? 'Lead Requests' : 'Pending Lead Requests'}
          </h2>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRequestFilter(tab.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0',
                requestFilter === tab.key
                  ? 'bg-charcoal text-white shadow-sm'
                  : 'bg-white text-muted-foreground border border-border hover:bg-muted/30 hover:text-foreground'
              )}
            >
              {tab.key}
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full min-w-[18px] h-[18px] px-1 text-[10px] font-semibold',
                  requestFilter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Request cards */}
        <div className="space-y-3">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Activity className="w-5 h-5 text-orange animate-spin" />
              <span className="ml-2 text-sm text-gray-400">Loading requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No requests match this filter.</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((req) => {
              const isExpanded = expandedRequest === req.id;
              const showDetail = detailRequest === req.id;
              return (
                <Card
                  key={req.id}
                  className={cn(
                    'rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group',
                    'hover:shadow-md hover:-translate-y-0.5',
                    isExpanded && 'ring-1 ring-orange/20 shadow-md'
                  )}
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedRequest(null);
                      setDetailRequest(null);
                    } else {
                      setExpandedRequest(req.id);
                      setDetailRequest(null);
                    }
                  }}
                >
                  <CardContent className="p-0">
                    {/* Collapsed row */}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal text-[11px] font-semibold text-white">
                        {req.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-foreground">{req.agent}</span>
                          <span className="text-xs text-muted-foreground">{req.market}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {req.zipCodes.join(', ')}
                          </span>
                          <span className="text-[11px] text-muted-foreground/50">|</span>
                          <span className="text-[11px] text-muted-foreground">
                            {req.leadTypes.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {req.requested}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                            statusBadgeClass(req.status)
                          )}
                        >
                          {req.status}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-muted-foreground transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded: summary row with Process button */}
                    <AnimatePresence>
                      {isExpanded && !showDetail && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border px-4 py-4 bg-muted/10">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Market</p>
                                <p className="text-sm font-medium text-foreground">{req.market}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Zip Codes</p>
                                <p className="text-sm font-mono text-foreground">{req.zipCodes.join(', ')}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Price Range</p>
                                <p className="text-sm font-mono text-foreground">{req.priceRange}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Lead Types</p>
                                <div className="flex flex-wrap gap-1">
                                  {req.leadTypes.map((t) => (
                                    <span key={t} className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              {/* Mini timeline preview */}
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {req.statusHistory.length} event{req.statusHistory.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {(req.status === 'Pending' || req.status === 'In Progress') && (
                                  <Button
                                    size="sm"
                                    className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClickProcess(req);
                                    }}
                                  >
                                    Process Request
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                  </Button>
                                )}
                                {req.status === 'Completed' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg text-xs text-success border-success/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDetailRequest(req.id);
                                    }}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    View Details
                                  </Button>
                                )}
                                {req.status === 'Rejected' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg text-xs text-danger border-danger/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDetailRequest(req.id);
                                    }}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View Details
                                  </Button>
                                )}
                                {/* Full Details button removed — Process Request handles expansion */}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Request Detail Panel (slide-over replacement) */}
                    <AnimatePresence>
                      {isExpanded && showDetail && (
                        <RequestDetailPanel
                          request={req}
                          onClose={() => setDetailRequest(null)}
                          onUploadLeads={(r) => {
                            onProcessRequest(r);
                          }}
                          onReject={handleRejectRequest}
                        />
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Activity Feed (hide on requests-only view) */}
      {!showRequestsOnly && (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">Recent Activity</h2>
          <Card className="rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/30',
                    item.highlight && 'bg-orange/[0.02]',
                    item.warn && 'bg-danger/[0.02]'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        item.highlight ? 'bg-orange' : item.warn ? 'bg-danger' : 'bg-gray-300'
                      )}
                    />
                    <p className={cn('text-[13px]', item.highlight ? 'font-medium text-charcoal' : 'text-gray-600')}>
                      {item.text}
                    </p>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-3 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// View: Upload Leads
// ---------------------------------------------------------------------------

function UploadLeadsView({ preselectedAgent, sourceRequest, agentsList }) {
  const { user } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState(
    preselectedAgent ? preselectedAgent.agentId : null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [notified, setNotified] = useState(false);
  const [showNotifyConfirm, setShowNotifyConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const selectedAgent = agentsList.find((a) => a.id === selectedAgentId);

  const filteredAgents = useMemo(() => {
    if (!agentSearch.trim()) return agentsList;
    const q = agentSearch.toLowerCase();
    return agentsList.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.market.toLowerCase().includes(q)
    );
  }, [agentSearch, agentsList]);

  // Compute current step
  const currentStep = uploaded ? 3 : showPreview ? 3 : selectedAgentId && !file ? 2 : selectedAgentId && file ? 3 : 1;

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setShowPreview(true);
    }
  }

  function handleFileSelect(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowPreview(true);
    }
  }

  function handleSimulateUpload() {
    setFile({ name: 'riverside_heights_leads.csv' });
    setShowPreview(true);
  }

  // Step indicator component
  const steps = [
    { num: 1, label: 'Select Agent' },
    { num: 2, label: 'Upload CSV' },
    { num: 3, label: 'Preview & Assign' },
  ];

  function StepIndicator() {
    return (
      <div className="flex items-center justify-center gap-0 mb-8">
        {steps.map((step, i) => {
          const isActive = currentStep === step.num;
          const isComplete = currentStep > step.num;
          return (
            <div key={step.num} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                    isComplete
                      ? 'bg-success text-white'
                      : isActive
                      ? 'bg-orange text-white'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block',
                    isActive ? 'text-charcoal' : isComplete ? 'text-success' : 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 sm:w-12 h-px mx-2',
                    isComplete ? 'bg-success' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Lead type breakdown data for bar chart
  const leadBreakdown = [
    { type: 'Expired', count: 94, total: 248 },
    { type: 'FSBO', count: 62, total: 248 },
    { type: 'Pre-Foreclosure', count: 38, total: 248 },
    { type: 'Absentee', count: 28, total: 248 },
    { type: 'High Equity', count: 26, total: 248 },
  ];

  function barColor(type) {
    switch (type) {
      case 'Expired': return 'bg-danger';
      case 'FSBO': return 'bg-orange';
      case 'Pre-Foreclosure': return 'bg-yellow-500';
      case 'Absentee': return 'bg-blue-500';
      case 'High Equity': return 'bg-success';
      default: return 'bg-gray-400';
    }
  }

  // Request-aware status timeline
  function RequestStatusTimeline() {
    const timelineSteps = [
      { label: 'Request Submitted', done: true },
      { label: 'Leads Uploaded', done: uploaded },
      { label: 'Agent Notified', done: notified },
    ];

    return (
      <div className="flex items-center justify-center gap-0 mb-2">
        {timelineSteps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center transition-all',
                  step.done ? 'bg-success' : 'bg-gray-200'
                )}
              >
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </div>
              <span className={cn('text-[11px] font-medium', step.done ? 'text-success' : 'text-gray-400')}>
                {step.label}
              </span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div className={cn('w-6 sm:w-10 h-px mx-1.5', step.done ? 'bg-success' : 'bg-gray-200')} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Success state
  if (uploaded && selectedAgent) {
    return (
      <div className="pb-12">
        <StepIndicator />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-3">
            248 leads assigned to {selectedAgent.name}
          </h2>
          <p className="font-sans text-lg text-gray-500 mb-2">
            AI drafts will be generated automatically
          </p>
          <p className="font-sans text-base text-gray-400 mb-8">
            {selectedAgent.name} will see these leads in their dashboard on next login.
          </p>

          {/* Request workflow status timeline */}
          {sourceRequest && (
            <div className="mb-8">
              <RequestStatusTimeline />
            </div>
          )}

          <div className="inline-flex items-center gap-3 rounded-xl bg-light-bg border border-gray-200 px-6 py-4 mb-8">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <div className="text-left">
              <div className="font-sans text-sm font-semibold text-charcoal">Upload complete</div>
              <div className="font-mono text-xs text-gray-500">248 leads, {selectedAgent.market}</div>
            </div>
          </div>

          {/* Post-upload action buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {!notified ? (
              <>
                {!showNotifyConfirm ? (
                  <Button
                    className="rounded-xl bg-orange text-white font-sans font-semibold hover:bg-orange/90 transition-colors"
                    onClick={() => setShowNotifyConfirm(true)}
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    Notify Agent
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-orange/20 bg-orange/[0.03] px-5 py-4 text-center"
                  >
                    <p className="text-sm text-charcoal mb-3">
                      <span className="font-semibold">{selectedAgent.name}</span> will be notified that{' '}
                      <span className="font-mono font-semibold">248 leads</span> are ready
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs"
                        onClick={() => {
                          setNotified(true);
                          setShowNotifyConfirm(false);
                        }}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Confirm & Send
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs"
                        onClick={() => setShowNotifyConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-xl bg-success/5 border border-success/20 px-4 py-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">
                  {selectedAgent.name} has been notified
                </span>
              </motion.div>
            )}

            <Button
              variant="outline"
              className="rounded-xl text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              View Agent Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Preview state
  if (showPreview && selectedAgent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <StepIndicator />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">Upload Preview</h2>
            <p className="font-sans text-base text-gray-500">
              248 leads parsed from{' '}
              <span className="font-mono text-sm text-charcoal">
                {file?.name || 'riverside_heights_leads.csv'}
              </span>
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={() => {
              setFile(null);
              setShowPreview(false);
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>

        {/* Data quality indicator */}
        <Card className="rounded-xl">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal">98% complete</span>
                  <span className="text-xs text-muted-foreground">5 leads missing email</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="bg-success h-1.5 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead type breakdown -- horizontal bar chart */}
        <Card className="rounded-xl">
          <CardContent className="py-4 px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Lead Type Breakdown</p>
            <div className="space-y-2.5">
              {leadBreakdown.map((item) => (
                <div key={item.type} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground w-28 shrink-0">{item.type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', barColor(item.type))}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview table */}
        <Card className="rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Address</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Equity</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Email</th>
                </tr>
              </thead>
              <tbody>
                {previewLeads.map((lead) => (
                  <tr key={lead.address} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{lead.address}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{lead.owner}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          typeBadgeClass(lead.type)
                        )}
                      >
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                      {lead.price}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">
                      {lead.equity}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden xl:table-cell">
                      {lead.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">Showing 5 of 248 leads</p>
          </div>
        </Card>

        {/* Assignment confirmation */}
        <div className="rounded-xl border border-orange/20 bg-orange/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-semibold text-white">
                {selectedAgent.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-charcoal">
                  Assign to: {selectedAgent.name}
                </p>
                <p className="font-sans text-xs text-gray-400">{selectedAgent.market}</p>
              </div>
            </div>
            <Button
              className="rounded-xl bg-orange text-white font-sans font-semibold hover:bg-orange/90 transition-colors"
              disabled={uploading}
              onClick={async () => {
                setUploading(true);
                setUploadError(null);

                // Build mock lead objects from previewLeads (simulated CSV parsing)
                const parsedLeads = previewLeads.map((pl) => ({
                  order_id: sourceRequest?.id || null,
                  agent_id: selectedAgentId,
                  name: pl.owner,
                  address: pl.address,
                  type: pl.type,
                  price: pl.price,
                  equity: pl.equity,
                  email: pl.email,
                  stage: 'New',
                }));

                // Insert leads into DB
                const { error: insertErr } = await insertLeads(parsedLeads);
                if (insertErr) {
                  setUploadError(insertErr.message || 'Failed to insert leads');
                  setUploading(false);
                  return;
                }

                // Mark order as completed if we have a source request
                if (sourceRequest?.id) {
                  await updateOrderStatus(sourceRequest.id, 'completed');
                  if (user?.id) {
                    await logCsvUpload(sourceRequest.id, user.id, file?.name || 'leads.csv', previewLeads.length);
                    await logRequestEvent(sourceRequest.id, user.id, 'Leads Uploaded', `${previewLeads.length} leads uploaded and assigned`);
                  }
                }

                setUploading(false);
                setUploaded(true);
              }}
            >
              {uploading ? (
                <>
                  <Activity className="w-4 h-4 mr-1 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  Upload &amp; Assign
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Upload error message */}
        {uploadError && (
          <div className="rounded-xl border border-danger/20 bg-danger/[0.03] px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            <p className="text-sm text-danger">{uploadError}</p>
          </div>
        )}
      </div>
    );
  }

  // Default: agent selector + file upload
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <StepIndicator />
      <div>
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Upload Leads</h2>
        <p className="font-sans text-base text-gray-500">
          Upload a CSV and assign leads to an agent.
        </p>
      </div>

      {/* Source request context banner */}
      {sourceRequest && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-orange/20 bg-orange/[0.02] px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal">
                Fulfilling request from {sourceRequest.agent}
              </p>
              <p className="text-xs text-muted-foreground">
                {sourceRequest.zipCodes.join(', ')} | {sourceRequest.leadTypes.join(', ')} | {sourceRequest.priceRange}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Agent selector */}
      <Card className="rounded-xl overflow-visible">
        <CardContent className="p-6 overflow-visible">
          <label className="font-sans text-sm font-semibold text-charcoal mb-3 block">
            Select Agent
          </label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-sm transition-colors hover:border-gray-300',
                selectedAgent ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {selectedAgent ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-white">
                    {selectedAgent.initials}
                  </div>
                  <span className="font-medium">{selectedAgent.name}</span>
                  <span className="text-muted-foreground">
                    {selectedAgent.market}
                  </span>
                </div>
              ) : (
                'Choose an agent...'
              )}
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', dropdownOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-border bg-white shadow-lg"
                >
                  {/* Search input inside dropdown */}
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search agents..."
                        value={agentSearch}
                        onChange={(e) => setAgentSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-border bg-muted/20 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-orange/30"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredAgents.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">No agents found</div>
                    ) : (
                      filteredAgents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => {
                            setSelectedAgentId(agent.id);
                            setDropdownOpen(false);
                            setAgentSearch('');
                          }}
                          className={cn(
                            'flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50',
                            selectedAgentId === agent.id && 'bg-muted/30'
                          )}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-white">
                            {agent.initials}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-foreground">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.market}</p>
                          </div>
                          <span
                            className={cn(
                              'ml-auto inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                              statusBadgeClass(agent.status)
                            )}
                          >
                            {agent.status}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* File upload zone */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <label className="font-sans text-sm font-semibold text-charcoal mb-3 block">
            Lead File
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (selectedAgent) {
                fileInputRef.current?.click();
              }
            }}
            className={cn(
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200',
              !selectedAgent && 'opacity-50 cursor-not-allowed',
              selectedAgent && 'cursor-pointer',
              isDragging
                ? 'border-orange bg-orange/5'
                : 'border-gray-300 hover:border-gray-400 hover:bg-muted/20'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
              disabled={!selectedAgent}
            />
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-sans text-base font-medium text-charcoal mb-1">
              Drop your CSV here
            </p>
            <p className="font-sans text-sm text-gray-400">
              or{' '}
              <span className="text-orange font-medium">click to browse</span>
            </p>
            <p className="font-sans text-xs text-gray-400 mt-3">
              Supports CREXI, PropStream, and custom CSV formats
            </p>
          </div>

          {!selectedAgent && (
            <p className="font-sans text-xs text-gray-400 mt-3">
              Select an agent above before uploading.
            </p>
          )}

          {/* Simulate upload button for demo purposes */}
          {selectedAgent && !showPreview && (
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                className="rounded-lg text-xs"
                onClick={handleSimulateUpload}
              >
                Simulate CSV Upload (Demo)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View: Agents Management
// ---------------------------------------------------------------------------

function AgentsView({ onUploadForAgent, agentsList, setAgentsList }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', market: '' });
  const [deactivatingAgent, setDeactivatingAgent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', market: '', plan: 'Starter' });

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agentsList;
    const q = searchQuery.toLowerCase();
    return agentsList.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.market.toLowerCase().includes(q)
    );
  }, [searchQuery, agentsList]);

  const totalAgents = agentsList.length;
  const activeCount = agentsList.filter((a) => a.status === 'Active').length;
  const trialCount = agentsList.filter((a) => a.status === 'Trial').length;
  const expiredCount = agentsList.filter((a) => a.status === 'Expired').length;

  function handleStartEdit(agent, e) {
    e.stopPropagation();
    setEditingAgent(agent.id);
    setEditForm({ name: agent.name, email: agent.email, market: agent.market });
  }

  function handleSaveEdit(agentId, e) {
    e.stopPropagation();
    setAgentsList((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, name: editForm.name, email: editForm.email, market: editForm.market, initials: editForm.name.split(' ').map((n) => n[0]).join('').toUpperCase() }
          : a
      )
    );
    setEditingAgent(null);
  }

  function handleDeactivate(agentId, e) {
    e.stopPropagation();
    setAgentsList((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'Expired' } : a))
    );
    setDeactivatingAgent(null);
  }

  function handleAddAgent(e) {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const initials = addForm.name.split(' ').map((n) => n[0]).join('').toUpperCase();
    const newAgent = {
      id: Math.max(...agentsList.map((a) => a.id)) + 1,
      name: addForm.name,
      initials,
      email: addForm.email,
      market: addForm.market || 'Unassigned',
      plan: addForm.plan,
      leadsPerMonth: addForm.plan === 'Pro' ? 250 : 100,
      status: 'Active',
    };
    setAgentsList((prev) => [...prev, newAgent]);
    setShowAddModal(false);
    setAddForm({ name: '', email: '', market: '', plan: 'Starter' });
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">Agents</h2>
          <p className="font-sans text-base text-gray-500">Manage all registered agents.</p>
        </div>
        <Button className="rounded-lg bg-orange text-white hover:bg-orange/90" onClick={() => setShowAddModal(true)}>
          Add Agent
        </Button>
      </div>

      {/* Add Agent Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-lg font-semibold text-charcoal">Add New Agent</h3>
                <button onClick={() => setShowAddModal(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddAgent} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/40"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="agent@email.com"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/40"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Market</label>
                  <input
                    type="text"
                    value={addForm.market}
                    onChange={(e) => setAddForm({ ...addForm, market: e.target.value })}
                    placeholder="e.g., Miami"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Plan</label>
                  <select
                    value={addForm.plan}
                    onChange={(e) => setAddForm({ ...addForm, plan: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/40"
                  >
                    <option value="Starter">Starter</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button type="submit" className="rounded-lg bg-orange text-white hover:bg-orange/90 flex-1">
                    Add Agent
                  </Button>
                  <Button type="button" variant="outline" className="rounded-lg" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: totalAgents, color: 'text-charcoal', bg: 'bg-charcoal/5' },
          { label: 'Active', value: activeCount, color: 'text-success', bg: 'bg-success/5' },
          { label: 'Trial', value: trialCount, color: 'text-orange', bg: 'bg-orange/5' },
          { label: 'Expired', value: expiredCount, color: 'text-danger', bg: 'bg-danger/5' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn('rounded-xl border border-gray-100 bg-white p-3', stat.bg)}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {stat.label}
            </p>
            <p className={cn('text-2xl font-heading font-bold leading-none', stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, or market..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/40 transition-all"
        />
      </div>

      {/* Agent cards */}
      <div className="space-y-2">
        {filteredAgents.length === 0 ? (
          <Card className="rounded-xl">
            <CardContent className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No agents match your search.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAgents.map((agent) => {
            const isExpanded = expandedAgent === agent.id;
            return (
              <Card
                key={agent.id}
                className={cn(
                  'rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group',
                  'hover:shadow-md hover:-translate-y-0.5',
                  isExpanded && 'ring-1 ring-orange/20 shadow-md'
                )}
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
              >
                <CardContent className="p-0">
                  {/* Collapsed row */}
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal text-[11px] font-semibold text-white">
                      {agent.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">{agent.name}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{agent.market}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium hidden md:inline-flex',
                          planBadgeClass(agent.plan)
                        )}
                      >
                        {agent.plan}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground hidden lg:block">
                        {agent.leadsPerMonth}/mo
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          statusBadgeClass(agent.status)
                        )}
                      >
                        {agent.status}
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-muted-foreground transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-4 py-4 bg-muted/10">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                              <p className="text-sm text-foreground truncate">{agent.email}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Market</p>
                              <p className="text-sm font-medium text-foreground">{agent.market}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Plan</p>
                              <span
                                className={cn(
                                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                                  planBadgeClass(agent.plan)
                                )}
                              >
                                {agent.plan}
                              </span>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Leads/Month</p>
                              <p className="text-sm font-mono text-foreground">{agent.leadsPerMonth}</p>
                            </div>
                          </div>

                          {/* Recent activity for this agent */}
                          <div className="mb-4">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Recent Activity</p>
                            <div className="rounded-lg border border-border bg-white divide-y divide-border">
                              <div className="px-3 py-2 flex items-center justify-between">
                                <span className="text-xs text-gray-600">Last lead upload</span>
                                <span className="text-[11px] font-mono text-muted-foreground">3d ago</span>
                              </div>
                              <div className="px-3 py-2 flex items-center justify-between">
                                <span className="text-xs text-gray-600">Last login</span>
                                <span className="text-[11px] font-mono text-muted-foreground">1d ago</span>
                              </div>
                            </div>
                          </div>

                          {/* Inline edit form */}
                          <AnimatePresence>
                            {editingAgent === agent.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden mb-4"
                              >
                                <div className="rounded-lg border border-border bg-white p-3 space-y-3" onClick={(e) => e.stopPropagation()}>
                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Edit Agent</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Name</label>
                                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange/30" />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Email</label>
                                      <input type="text" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange/30" />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Market</label>
                                      <input type="text" value={editForm.market} onChange={(e) => setEditForm({ ...editForm, market: e.target.value })} className="w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange/30" />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs" onClick={(e) => handleSaveEdit(agent.id, e)}>
                                      Save Changes
                                    </Button>
                                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); setEditingAgent(null); }}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Deactivate confirmation */}
                          <AnimatePresence>
                            {deactivatingAgent === agent.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="overflow-hidden mb-4"
                              >
                                <div className="rounded-lg border border-danger/20 bg-danger/[0.02] p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                                  <p className="text-sm text-charcoal">
                                    Are you sure you want to deactivate <span className="font-semibold">{agent.name}</span>?
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" className="rounded-lg bg-danger text-white hover:bg-danger/90 text-xs" onClick={(e) => handleDeactivate(agent.id, e)}>
                                      Confirm Deactivate
                                    </Button>
                                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={(e) => { e.stopPropagation(); setDeactivatingAgent(null); }}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Quick actions */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              size="sm"
                              className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs"
                              onClick={(e) => { e.stopPropagation(); onUploadForAgent(agent); }}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Upload Leads
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg text-xs"
                              onClick={(e) => handleStartEdit(agent, e)}
                            >
                              <Wrench className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            {agent.status !== 'Expired' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg text-xs text-danger border-danger/20 hover:bg-danger/5"
                                onClick={(e) => { e.stopPropagation(); setDeactivatingAgent(agent.id); }}
                              >
                                <Power className="w-3 h-3 mr-1" />
                                Deactivate
                              </Button>
                            ) : (
                              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium bg-danger/10 text-danger border-danger/20">
                                Deactivated
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Email Infrastructure View
// ---------------------------------------------------------------------------

function EmailInfraView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(null);
  const [domains, setDomains] = useState([]);
  const [emailUsers, setEmailUsers] = useState([]);
  const [agentDomains, setAgentDomains] = useState([]);
  const [agentMap, setAgentMap] = useState({});
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingLimit, setEditingLimit] = useState(null);
  const [editLimitValue, setEditLimitValue] = useState('');
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [usageRes, domainsRes, usersRes] = await Promise.all([
        getUsage(),
        listDomains(100),
        listEmailUsers(null, 100),
      ]);

      // Winnr wraps responses as { data: { data: [...] } } or { data: [...] }
      const unwrap = (res) => {
        const d = res?.data ?? res;
        if (Array.isArray(d)) return d;
        if (d?.data && Array.isArray(d.data)) return d.data;
        return [];
      };

      setUsage(usageRes?.data?.data || usageRes?.data || usageRes);
      setDomains(unwrap(domainsRes));
      setEmailUsers(unwrap(usersRes));

      // Load agent_domains from Supabase to map domains to agents
      const { data: adData } = await supabase
        .from('agent_domains')
        .select('domain_name, agent_id, winnr_domain_id');

      setAgentDomains(adData || []);

      // Get unique agent IDs and fetch their names
      const agentIds = [...new Set((adData || []).map((d) => d.agent_id).filter(Boolean))];
      if (agentIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, full_name')
          .in('id', agentIds);

        const map = {};
        (usersData || []).forEach((u) => {
          map[u.id] = u.full_name;
        });
        setAgentMap(map);
      }
    } catch (err) {
      setError(err.message || 'Failed to load email infrastructure data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getAgentForDomain(domainName) {
    const ad = agentDomains.find((d) => d.domain_name === domainName);
    if (!ad) return null;
    return agentMap[ad.agent_id] || null;
  }

  function getMailboxesForDomain(domainName) {
    return emailUsers.filter((u) => {
      const userDomain = u.email?.split('@')[1] || u.domain;
      return userDomain === domainName;
    });
  }

  async function handleDeleteUser(user) {
    const winnrId = user.id;
    setActionLoading(winnrId);
    try {
      await deleteEmailUser(winnrId);

      // Also delete from Supabase agent_mailboxes
      const email = user.email || `${user.username}@${user.domain}`;
      await supabase
        .from('agent_mailboxes')
        .delete()
        .eq('email', email);

      // Remove from local state
      setEmailUsers((prev) => prev.filter((u) => u.id !== winnrId));
      setDeletingUser(null);
      showToast(`Deleted ${email}`);
    } catch (err) {
      showToast(err.message || 'Failed to delete mailbox', 'danger');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdateLimit(user) {
    const winnrId = user.id;
    const newLimit = parseInt(editLimitValue, 10);
    if (isNaN(newLimit) || newLimit < 0) {
      showToast('Please enter a valid number', 'danger');
      return;
    }
    setActionLoading(winnrId);
    try {
      await updateEmailUser(winnrId, { daily_send_limit: newLimit });

      // Update local state
      setEmailUsers((prev) =>
        prev.map((u) =>
          u.id === winnrId ? { ...u, daily_send_limit: newLimit } : u
        )
      );
      setEditingLimit(null);
      setEditLimitValue('');
      showToast(`Updated daily limit to ${newLimit}`);
    } catch (err) {
      showToast(err.message || 'Failed to update limit', 'danger');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange animate-spin mb-3" />
        <p className="text-sm text-muted-foreground">Loading email infrastructure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 pb-12">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Failed to Load</h2>
        <p className="font-sans text-base text-gray-400 mb-4">{error}</p>
        <Button
          className="rounded-lg bg-orange text-white hover:bg-orange/90"
          onClick={loadData}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const totalDomains = usage?.domains_count ?? domains.length;
  const totalMailboxes = usage?.email_users_count ?? emailUsers.length;
  const domainsLimit = usage?.domains_limit ?? '—';
  const mailboxesLimit = usage?.email_users_limit ?? '—';

  return (
    <div className="space-y-6 pb-12">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className={cn(
              'rounded-xl border px-4 py-3 shadow-lg flex items-center gap-2',
              toast.type === 'danger' ? 'bg-white border-danger/20 text-danger' : 'bg-white border-success/20 text-success'
            )}>
              {toast.type === 'danger' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">Email Infrastructure</h2>
          <p className="font-sans text-base text-gray-500">Manage domains, mailboxes, and Winnr account usage.</p>
        </div>
        <Button
          className="rounded-lg bg-orange text-white hover:bg-orange/90"
          onClick={loadData}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Domains', value: totalDomains, icon: Globe, color: 'text-charcoal', bg: 'bg-charcoal/5' },
          { label: 'Mailboxes', value: totalMailboxes, icon: Mail, color: 'text-orange', bg: 'bg-orange/5' },
          { label: 'Domain Limit', value: domainsLimit, icon: Server, color: 'text-charcoal', bg: 'bg-charcoal/5' },
          { label: 'Mailbox Limit', value: mailboxesLimit, icon: Shield, color: 'text-charcoal', bg: 'bg-charcoal/5' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={cn('rounded-xl border border-gray-100 bg-white p-3', stat.bg)}
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
            <p className={cn('text-2xl font-heading font-bold leading-none', stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Domains list */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-3">Domains</h3>
        {domains.length === 0 ? (
          <Card className="rounded-xl">
            <CardContent className="py-12 text-center">
              <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No domains found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {domains.map((domain) => {
              const domainName = domain.name || domain.domain;
              const isExpanded = expandedDomain === domain.id;
              const mailboxes = getMailboxesForDomain(domainName);
              const agentName = getAgentForDomain(domainName);
              const dnsStatus = domain.dns_status || domain.dns || {};

              return (
                <Card
                  key={domain.id}
                  className={cn(
                    'rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group',
                    'hover:shadow-md hover:-translate-y-0.5',
                    isExpanded && 'ring-1 ring-orange/20 shadow-md'
                  )}
                  onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                >
                  <CardContent className="p-0">
                    {/* Domain row */}
                    <div className="flex items-center gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal/5">
                        <Globe className="w-4 h-4 text-charcoal" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-foreground">{domainName}</span>
                          {agentName && (
                            <span className="text-xs text-muted-foreground">
                              Agent: {agentName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {mailboxes.length} mailbox{mailboxes.length !== 1 ? 'es' : ''}
                          </span>
                          {domain.created_at && (
                            <span className="text-xs text-muted-foreground">
                              Created {new Date(domain.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* DNS indicators */}
                        <div className="hidden sm:flex items-center gap-1">
                          <span className={cn(
                            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                            dnsStatus.mx || dnsStatus.mx_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                          )}>
                            MX
                          </span>
                          <span className={cn(
                            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                            dnsStatus.spf || dnsStatus.spf_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                          )}>
                            SPF
                          </span>
                          <span className={cn(
                            'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                            dnsStatus.dkim || dnsStatus.dkim_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                          )}>
                            DKIM
                          </span>
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                            domain.status === 'active' || domain.status === 'verified'
                              ? 'bg-success/10 text-success border-success/20'
                              : domain.status === 'pending'
                              ? 'bg-orange/10 text-orange border-orange/20'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                          )}
                        >
                          {domain.status || 'unknown'}
                        </span>
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 text-muted-foreground transition-transform duration-200',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded: mailboxes */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border px-4 py-4 bg-muted/10">
                            {/* DNS badges for mobile */}
                            <div className="flex sm:hidden items-center gap-1 mb-3">
                              <span className={cn(
                                'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                                dnsStatus.mx || dnsStatus.mx_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                              )}>
                                MX
                              </span>
                              <span className={cn(
                                'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                                dnsStatus.spf || dnsStatus.spf_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                              )}>
                                SPF
                              </span>
                              <span className={cn(
                                'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                                dnsStatus.dkim || dnsStatus.dkim_verified ? 'bg-success/10 text-success border-success/20' : 'bg-gray-50 text-gray-400 border-gray-200'
                              )}>
                                DKIM
                              </span>
                            </div>

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Mailboxes ({mailboxes.length})
                            </p>

                            {mailboxes.length === 0 ? (
                              <div className="rounded-lg border border-border bg-white px-3 py-4 text-center">
                                <p className="text-xs text-muted-foreground">No mailboxes on this domain.</p>
                              </div>
                            ) : (
                              <div className="rounded-lg border border-border bg-white divide-y divide-border">
                                {mailboxes.map((user) => {
                                  const email = user.email || `${user.username}@${user.domain}`;
                                  const displayName = user.name || user.display_name || '—';
                                  const dailyLimit = user.daily_send_limit ?? '—';
                                  const isDeleting = deletingUser === user.id;
                                  const isEditingLim = editingLimit === user.id;
                                  const isActionLoading = actionLoading === user.id;

                                  return (
                                    <div key={user.id} className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm font-medium text-foreground truncate">{email}</p>
                                          <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-muted-foreground">{displayName}</span>
                                            <span className="text-xs text-muted-foreground">
                                              Limit: {isEditingLim ? '' : dailyLimit}/day
                                            </span>
                                            {user.status && (
                                              <span className={cn(
                                                'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                                                user.status === 'active'
                                                  ? 'bg-success/10 text-success border-success/20'
                                                  : 'bg-gray-50 text-gray-500 border-gray-200'
                                              )}>
                                                {user.status}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {/* Edit limit button */}
                                          {!isEditingLim && !isDeleting && (
                                            <button
                                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                              title="Edit daily limit"
                                              onClick={() => {
                                                setEditingLimit(user.id);
                                                setEditLimitValue(String(dailyLimit === '—' ? '' : dailyLimit));
                                                setDeletingUser(null);
                                              }}
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                          {/* Delete button */}
                                          {!isDeleting && !isEditingLim && (
                                            <button
                                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-danger/5 hover:text-danger transition-colors"
                                              title="Delete mailbox"
                                              onClick={() => {
                                                setDeletingUser(user.id);
                                                setEditingLimit(null);
                                              }}
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      {/* Inline edit limit */}
                                      <AnimatePresence>
                                        {isEditingLim && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                              <label className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">Daily Limit:</label>
                                              <input
                                                type="number"
                                                min="0"
                                                value={editLimitValue}
                                                onChange={(e) => setEditLimitValue(e.target.value)}
                                                className="w-20 rounded-md border border-border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange/30"
                                                autoFocus
                                              />
                                              <Button
                                                size="sm"
                                                className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs h-7 px-2"
                                                disabled={isActionLoading}
                                                onClick={() => handleUpdateLimit(user)}
                                              >
                                                {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="rounded-lg text-xs h-7 px-2"
                                                onClick={() => { setEditingLimit(null); setEditLimitValue(''); }}
                                              >
                                                <X className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>

                                      {/* Delete confirmation */}
                                      <AnimatePresence>
                                        {isDeleting && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="rounded-lg border border-danger/20 bg-danger/[0.02] p-2.5 mt-2 space-y-2">
                                              <p className="text-xs text-charcoal">
                                                Delete <span className="font-semibold">{email}</span> from Winnr? This cannot be undone.
                                              </p>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  size="sm"
                                                  className="rounded-lg bg-danger text-white hover:bg-danger/90 text-xs h-7"
                                                  disabled={isActionLoading}
                                                  onClick={() => handleDeleteUser(user)}
                                                >
                                                  {isActionLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Trash2 className="w-3 h-3 mr-1" />}
                                                  Delete
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="rounded-lg text-xs h-7"
                                                  onClick={() => setDeletingUser(null)}
                                                >
                                                  Cancel
                                                </Button>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main: AdminDashboard
// ---------------------------------------------------------------------------

export function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preselectedAgent, setPreselectedAgent] = useState(null);
  const [sourceRequest, setSourceRequest] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [agentsList, setAgentsList] = useState(agents);

  const adminName = profile?.full_name || 'Admin';
  const adminInitials = profile?.initials || adminName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  function handleNavClick(key) {
    setActiveNav(key);
    setMobileMenuOpen(false);
    if (key !== 'upload') {
      setPreselectedAgent(null);
      setSourceRequest(null);
    }
  }

  function handleProcessRequest(request) {
    setPreselectedAgent(request);
    setSourceRequest(request);
    setActiveNav('upload');
  }

  const headerTitles = {
    dashboard: 'Admin Dashboard',
    agents: 'Agents',
    requests: 'Lead Requests',
    upload: 'Upload Leads',
    payments: 'Payments',
    settings: 'Settings',
  };

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
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-dark text-white transition-transform duration-200 md:static md:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-1 px-6 py-6">
          <span className="font-heading text-xl font-semibold text-white">Off</span>
          <span className="font-heading text-xl font-semibold text-orange">Market</span>
          <span className="ml-1.5 inline-flex items-center rounded-md bg-orange/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;
            const showBadge = item.key === 'requests';
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
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-white">
                    3
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin card */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-semibold text-white">
              {adminInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{adminName}</p>
              <p className="text-xs text-white/50 truncate">Admin</p>
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
              <h1 className="font-heading text-lg font-semibold">{headerTitles[activeNav] || 'Admin Dashboard'}</h1>
              <p className="text-xs text-muted-foreground">Friday, March 28, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange" />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-white shadow-xl z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-charcoal">Notifications</p>
                    </div>
                    <div className="divide-y divide-border">
                      {[
                        { text: 'Sarah Johnson requested leads for Riverside Heights', time: '2h ago', unread: true },
                        { text: "Mike Chen's trial expires in 3 days", time: '5h ago', unread: true },
                        { text: 'Amanda Foster upgraded to Pro plan', time: '1d ago', unread: false },
                      ].map((n, i) => (
                        <button
                          key={i}
                          className={cn(
                            'w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors flex items-start gap-3',
                            n.unread && 'bg-orange/[0.02]'
                          )}
                          onClick={() => setNotifOpen(false)}
                        >
                          {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-orange shrink-0" />}
                          {!n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-gray-200 shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-xs leading-relaxed', n.unread ? 'text-charcoal font-medium' : 'text-gray-500')}>
                              {n.text}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{n.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border">
                      <button className="text-xs font-medium text-orange hover:text-orange/80 transition-colors" onClick={() => setNotifOpen(false)}>
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">
              JG
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-16">
          <FadePanel tabKey={activeNav}>
            {activeNav === 'dashboard' && (
              <OverviewView onProcessRequest={handleProcessRequest} onNavigate={handleNavClick} />
            )}
            {activeNav === 'agents' && (
              <AgentsView
                agentsList={agentsList}
                setAgentsList={setAgentsList}
                onUploadForAgent={(agent) => {
                  setPreselectedAgent({ agentId: agent.id, agent: agent.name });
                  setSourceRequest(null);
                  setActiveNav('upload');
                }}
              />
            )}
            {activeNav === 'requests' && (
              <OverviewView onProcessRequest={handleProcessRequest} showRequestsOnly onNavigate={handleNavClick} />
            )}
            {activeNav === 'upload' && (
              <UploadLeadsView
                key={preselectedAgent?.agentId || 'default'}
                preselectedAgent={preselectedAgent}
                sourceRequest={sourceRequest}
                agentsList={agentsList}
              />
            )}
            {activeNav === 'email-infra' && (
              <EmailInfraView />
            )}
            {activeNav === 'payments' && (
              <div className="max-w-2xl mx-auto text-center py-20 pb-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Payments</h2>
                <p className="font-sans text-base text-gray-400">
                  Payment management and billing history will appear here.
                </p>
              </div>
            )}
            {activeNav === 'settings' && (
              <div className="max-w-2xl mx-auto text-center py-20 pb-12">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Settings</h2>
                <p className="font-sans text-base text-gray-400">
                  Admin configuration and platform settings will appear here.
                </p>
              </div>
            )}
          </FadePanel>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
