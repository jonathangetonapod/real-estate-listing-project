import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
];

const pendingRequests = [
  {
    id: 1,
    agentId: 1,
    agent: 'Sarah Johnson',
    market: 'Riverside Heights',
    zipCodes: ['92506', '92507'],
    leadTypes: ['Expired', 'FSBO', 'Pre-Foreclosure'],
    priceRange: '$200K-$800K',
    requested: '2h ago',
    status: 'Pending',
  },
  {
    id: 2,
    agentId: 2,
    agent: 'Mike Chen',
    market: 'Phoenix',
    zipCodes: ['85001', '85003', '85004'],
    leadTypes: ['All types'],
    priceRange: '$150K-$600K',
    requested: '1d ago',
    status: 'Pending',
  },
  {
    id: 3,
    agentId: 3,
    agent: 'Jessica Williams',
    market: 'Austin',
    zipCodes: ['78701', '78702'],
    leadTypes: ['Expired', 'High Equity'],
    priceRange: '$300K-$900K',
    requested: '3d ago',
    status: 'In Progress',
  },
];

const previewLeads = [
  { address: '4821 Oakwood Dr', owner: 'Michael Torres', type: 'Expired', price: '$485,000', equity: '$185,000', email: 'mtorres@email.com' },
  { address: '1203 Maple Ridge Ln', owner: 'Lisa Fernandez', type: 'FSBO', price: '$392,000', equity: '$240,000', email: 'lfernandez@email.com' },
  { address: '892 Sunset Blvd', owner: 'David Hernandez', type: 'Pre-Foreclosure', price: '$520,000', equity: '$310,000', email: 'dhernandez@email.com' },
  { address: '2710 Harbor View Dr', owner: 'Linda Chen', type: 'Absentee', price: '$415,000', equity: '$195,000', email: 'lchen@email.com' },
  { address: '558 Palm Ave', owner: 'Robert Williams', type: 'High Equity', price: '$349,000', equity: '$120,000', email: 'rwilliams@email.com' },
];

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'agents', label: 'Agents', icon: Users },
  { key: 'requests', label: 'Lead Requests', icon: ClipboardList },
  { key: 'upload', label: 'Upload Leads', icon: FileUp },
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
// View: Admin Overview
// ---------------------------------------------------------------------------

function OverviewView({ onProcessRequest }) {
  const metrics = [
    { label: 'Active Agents', value: '8', accent: 'text-charcoal' },
    { label: 'Pending Requests', value: '3', accent: 'text-orange', badge: 'needs action', badgeColor: 'bg-orange/10 text-orange' },
    { label: 'Leads Delivered This Month', value: '1,847', accent: 'text-charcoal' },
    { label: 'Monthly Revenue', value: '$632', accent: 'text-charcoal', mono: true },
  ];

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="relative overflow-visible">
            <CardContent className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {m.label}
              </p>
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
        ))}
      </div>

      {/* Pending Lead Requests table */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Pending Lead Requests</h2>
        <Card className="rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Agent</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Market</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Zip Codes</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Lead Types</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Price Range</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Requested</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-white">
                          {req.agent.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">{req.agent}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{req.market}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden lg:table-cell">
                      {req.zipCodes.join(', ')}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {req.leadTypes.map((t) => (
                          <span key={t} className="inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">
                      {req.priceRange}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {req.requested}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          statusBadgeClass(req.status)
                        )}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {req.status === 'Pending' ? (
                        <Button
                          size="sm"
                          className="rounded-lg bg-orange text-white hover:bg-orange/90 text-xs"
                          onClick={() => onProcessRequest(req)}
                        >
                          Process
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-xs"
                          onClick={() => onProcessRequest(req)}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View: Upload Leads
// ---------------------------------------------------------------------------

function UploadLeadsView({ preselectedAgent }) {
  const [selectedAgentId, setSelectedAgentId] = useState(
    preselectedAgent ? preselectedAgent.agentId : null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

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

  // Success state
  if (uploaded && selectedAgent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20"
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
          {selectedAgent.name} will see these leads in her dashboard on next login.
        </p>
        <div className="inline-flex items-center gap-3 rounded-xl bg-light-bg border border-gray-200 px-6 py-4">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <div className="text-left">
            <div className="font-sans text-sm font-semibold text-charcoal">Upload complete</div>
            <div className="font-mono text-xs text-gray-500">248 leads, {selectedAgent.market}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Preview state
  if (showPreview && selectedAgent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Lead type breakdown */}
        <div className="flex flex-wrap gap-3">
          {[
            { type: 'Expired', count: 94 },
            { type: 'FSBO', count: 62 },
            { type: 'Pre-Foreclosure', count: 38 },
            { type: 'Absentee', count: 28 },
            { type: 'High Equity', count: 26 },
          ].map((item) => (
            <div
              key={item.type}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium',
                typeBadgeClass(item.type)
              )}
            >
              {item.type}: <span className="font-mono">{item.count}</span>
            </div>
          ))}
        </div>

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
                  <tr key={lead.address} className="border-b border-border last:border-0">
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
              onClick={() => setUploaded(true)}
            >
              Upload &amp; Assign
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: agent selector + file upload
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Upload Leads</h2>
        <p className="font-sans text-base text-gray-500">
          Upload a PropStream CSV and assign leads to an agent.
        </p>
      </div>

      {/* Agent selector */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
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
                  className="absolute top-full left-0 right-0 z-20 mt-1 rounded-lg border border-border bg-white shadow-lg"
                >
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        setSelectedAgentId(agent.id);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg',
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
                  ))}
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
              'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors',
              !selectedAgent && 'opacity-50 cursor-not-allowed',
              selectedAgent && 'cursor-pointer',
              isDragging
                ? 'border-orange bg-orange/5'
                : 'border-gray-300 hover:border-gray-400'
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
              Drop your PropStream CSV here
            </p>
            <p className="font-sans text-sm text-gray-400">
              or{' '}
              <span className="text-orange font-medium">click to browse</span>
            </p>
            <p className="font-sans text-xs text-gray-300 mt-3">Accepted format: .csv</p>
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

function AgentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-1">Agents</h2>
          <p className="font-sans text-base text-gray-500">Manage all registered agents.</p>
        </div>
        <Button className="rounded-lg bg-orange text-white hover:bg-orange/90">
          Add Agent
        </Button>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Market</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Plan</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Leads/Month</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-white">
                        {agent.initials}
                      </div>
                      <span className="font-medium text-foreground whitespace-nowrap">
                        {agent.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {agent.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {agent.market}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {agent.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden xl:table-cell">
                    {agent.leadsPerMonth}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
                        statusBadgeClass(agent.status)
                      )}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg text-xs">
                        <Wrench className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main: AdminDashboard
// ---------------------------------------------------------------------------

export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preselectedAgent, setPreselectedAgent] = useState(null);

  function handleNavClick(key) {
    setActiveNav(key);
    setMobileMenuOpen(false);
    if (key !== 'upload') {
      setPreselectedAgent(null);
    }
  }

  function handleProcessRequest(request) {
    setPreselectedAgent(request);
    setActiveNav('upload');
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
              JG
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Jonathan G</p>
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
              <h1 className="font-heading text-lg font-semibold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Friday, March 28, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange" />
            </button>
            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-orange text-xs font-semibold text-white">
              JG
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <FadePanel tabKey={activeNav}>
            {activeNav === 'dashboard' && (
              <OverviewView onProcessRequest={handleProcessRequest} />
            )}
            {activeNav === 'agents' && <AgentsView />}
            {activeNav === 'requests' && (
              <OverviewView onProcessRequest={handleProcessRequest} />
            )}
            {activeNav === 'upload' && (
              <UploadLeadsView
                key={preselectedAgent?.agentId || 'default'}
                preselectedAgent={preselectedAgent}
              />
            )}
            {activeNav === 'payments' && (
              <div className="max-w-2xl mx-auto text-center py-20">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Payments</h2>
                <p className="font-sans text-base text-gray-400">
                  Payment management and billing history will appear here.
                </p>
              </div>
            )}
            {activeNav === 'settings' && (
              <div className="max-w-2xl mx-auto text-center py-20">
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
