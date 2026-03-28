# Pitch Generation Slide-Over Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an inline email pitch generator slide-over panel to the Seller Leads tab, rename "Email Pitches" to "Pitches Sent", and enrich lead data with CREXI-level property fields.

**Architecture:** A new `PitchSlideOver` component renders as a right-side drawer triggered from the lead card's Quick Actions. Draft state is managed via a `pitchDrafts` state object in `LeadsTab`, keyed by lead index. The existing `DraftsTab` is renamed to show only sent pitches. All changes are in `AppDashboard.jsx` — no new files needed.

**Tech Stack:** React, framer-motion (already in use), Tailwind CSS, shadcn/ui components (Button, Input), lucide-react icons.

---

### Task 1: Enrich Lead Data with CREXI Fields

**Files:**
- Modify: `src/components/AppDashboard.jsx:41-48` (leads array)
- Modify: `src/components/AppDashboard.jsx:798-853` (extendedLeadData array)

- [ ] **Step 1: Extend the `leads` array with CREXI-level fields**

Add `sqft`, `units`, `yearBuilt`, `lotSize`, `loanAmount`, `interestRate`, `taxBill`, `ownerName`, `contactEmails`, `contactPhones` to each lead object in the `leads` array at line 41:

```jsx
const leads = [
  { name: 'Michael Torres', address: '4821 Oakwood Dr, Riverside Heights', type: 'Expired', match: 94, price: '$485K', equity: '$185K', days: '47d expired', draft: 'Ready', stage: 'Drafted', email: 'mtorres@email.com', order: 'Mar 2026', sqft: '2,840', yearBuilt: 2004, lotSize: '0.18 acres', loanAmount: '$300K', interestRate: '5.25%', taxBill: '$5,820', ownerName: 'Michael Torres' },
  { name: 'Sarah Kim', address: '1203 Maple Ridge Ln, Canyon Crest', type: 'FSBO', match: 87, price: '$392K', equity: '$240K', days: '12d listed', draft: 'Ready', stage: 'Drafted', email: 'skim@email.com', order: 'Mar 2026', sqft: '1,960', yearBuilt: 2011, lotSize: '0.14 acres', loanAmount: '$152K', interestRate: '3.75%', taxBill: '$4,480', ownerName: 'Sarah Kim' },
  { name: 'David Hernandez', address: '892 Sunset Blvd, Palm Canyon', type: 'Pre-Foreclosure', match: 91, price: '$520K', equity: '$310K', days: 'NOD 34d', draft: 'Sent', stage: 'Sent', email: 'dhernandez@email.com', order: 'Mar 2026', sqft: '3,200', yearBuilt: 1998, lotSize: '0.22 acres', loanAmount: '$210K', interestRate: '4.50%', taxBill: '$6,240', ownerName: 'David Hernandez' },
  { name: 'Linda Chen', address: '2710 Harbor View Dr, Eastlake', type: 'Expired', match: 82, price: '$415K', equity: '$195K', days: '21d expired', draft: 'Ready', stage: 'New', email: 'lchen@email.com', order: 'Mar 2026', sqft: '2,100', yearBuilt: 2008, lotSize: '0.16 acres', loanAmount: '$220K', interestRate: '6.00%', taxBill: '$4,980', ownerName: 'Linda Chen' },
  { name: 'Robert Williams', address: '558 Palm Ave, Northpark', type: 'FSBO', match: 78, price: '$349K', equity: '$120K', days: '45d listed', draft: 'Pending', stage: 'New', email: 'rwilliams@email.com', order: 'Feb 2026', sqft: '1,540', yearBuilt: 1995, lotSize: '0.12 acres', loanAmount: '$229K', interestRate: '5.75%', taxBill: '$3,920', ownerName: 'Robert Williams' },
  { name: 'Maria Gonzalez', address: '1847 Vista Del Mar, Oceanside', type: 'High Equity', match: 85, price: '$680K', equity: '$420K', days: '15yr owned', draft: 'Sent', stage: 'Opened', email: 'mgonzalez@email.com', order: 'Feb 2026', sqft: '3,680', yearBuilt: 2001, lotSize: '0.31 acres', loanAmount: '$260K', interestRate: '3.25%', taxBill: '$8,160', ownerName: 'Maria Gonzalez' },
];
```

- [ ] **Step 2: Verify the app still renders**

Run: `npm run dev` and navigate to `/app`, click "Seller Leads" tab.
Expected: All leads render with no errors. Existing UI unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: enrich lead data with CREXI-level property fields"
```

---

### Task 2: Add Pitch Draft State Management to LeadsTab

**Files:**
- Modify: `src/components/AppDashboard.jsx:789-797` (LeadsTab state)

- [ ] **Step 1: Add pitch draft state and helper functions**

Inside `LeadsTab()`, after the existing `useState` declarations (line 795), add:

```jsx
const [pitchDrafts, setPitchDrafts] = useState({});
const [pitchSlideOverIndex, setPitchSlideOverIndex] = useState(null);

const generatePitch = useCallback((lead, ext) => {
  const firstName = lead.name.split(' ')[0];
  const street = lead.address.split(',')[0];
  const neighborhood = lead.address.split(',')[1]?.trim() || '';

  const subjectLines = {
    'Expired': `Your ${street} Home — a Confidential Buyer May Be Interested`,
    'FSBO': `${street} — What Agent-Listed Homes Nearby Are Selling For`,
    'Pre-Foreclosure': `${street} — Protecting Your ${lead.equity} in Equity`,
    'High Equity': `${street} — Is Now the Right Time to Maximize Your Equity?`,
  };

  const bodies = {
    'Expired': `Hi ${firstName},\n\nI noticed your home at ${street} came off the market after ${lead.days.replace('d expired', ' days')}. That can be frustrating, and I wanted to reach out because I may be able to help.\n\nI specialize in the ${neighborhood} area and have been tracking comparable sales nearby. Homes similar to yours — ${lead.sqft} sq ft, built in ${lead.yearBuilt} — have recently sold between ${lead.price} and above, which tells me there's genuine buyer demand in your price range.\n\nWith ${lead.equity} in equity and current rates at ${lead.interestRate}, you're in a strong position. I have a few strategies that have worked well for other homeowners in your situation — including off-market exposure to pre-qualified buyers.\n\nWould you be open to a quick 10-minute call this week? No pressure at all.\n\nBest regards,\nSarah Johnson\nRiverside Heights Specialist\nOffMarket Real Estate`,

    'FSBO': `Hi ${firstName},\n\nI saw your listing at ${street} and wanted to share some data that might be useful.\n\nIn the ${neighborhood} area, agent-represented homes similar to yours (${lead.sqft} sq ft, built ${lead.yearBuilt}) have sold for 8-12% more than FSBO listings over the past quarter. With your ${lead.equity} in equity, that difference could mean an extra $30-50K in your pocket.\n\nI'm not here to pressure you — I know you chose FSBO for a reason. But if you'd like to see the comps and decide for yourself, I'm happy to share them.\n\nWould a quick call work this week?\n\nBest regards,\nSarah Johnson\n${neighborhood} Specialist\nOffMarket Real Estate`,

    'Pre-Foreclosure': `Hi ${firstName},\n\nI understand you may be navigating a difficult situation with your property at ${street}, and I wanted to reach out with care.\n\nYour home is valued at approximately ${lead.price} with ${lead.equity} in equity — that's significant, and worth protecting. I specialize in helping homeowners in ${neighborhood} explore their options quickly and discreetly, whether that's a fast sale, a short sale, or another path forward.\n\nTime matters in these situations, and I'd love to help you understand all your options before they narrow.\n\nWould a confidential 10-minute call work for you this week?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate`,

    'High Equity': `Hi ${firstName},\n\nI've been tracking the ${neighborhood} market closely, and homeowners like you — with ${lead.equity} in equity built over ${lead.days.replace('yr owned', ' years')} — are in an exceptional position right now.\n\nYour ${lead.sqft} sq ft property at ${street} sits in one of the most in-demand areas. Recent sales suggest you could realize a strong return, especially with current market conditions favoring sellers with established equity.\n\nI specialize in helping long-time owners maximize their position, whether you're considering downsizing, relocating, or simply exploring what your home is worth today.\n\nWould you be open to a no-obligation market analysis?\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate`,
  };

  return {
    subject: subjectLines[lead.type] || `Your ${street} Property — A Quick Question`,
    body: bodies[lead.type] || `Hi ${firstName},\n\nI noticed your property at ${street} and wanted to reach out...\n\nBest regards,\nSarah Johnson\nOffMarket Real Estate`,
    status: 'draft',
    lastEdited: new Date().toISOString(),
  };
}, []);

const handleOpenPitchSlideOver = useCallback((idx) => {
  if (!pitchDrafts[idx]) {
    const lead = leads[idx];
    const ext = extendedLeadData[idx];
    setPitchDrafts(prev => ({ ...prev, [idx]: generatePitch(lead, ext) }));
  }
  setPitchSlideOverIndex(idx);
}, [pitchDrafts, generatePitch]);

const handleSaveDraft = useCallback((idx, subject, body) => {
  setPitchDrafts(prev => ({
    ...prev,
    [idx]: { ...prev[idx], subject, body, status: 'draft', lastEdited: new Date().toISOString() },
  }));
  setPitchSlideOverIndex(null);
}, []);

const handleSendPitch = useCallback((idx, subject, body) => {
  setPitchDrafts(prev => ({
    ...prev,
    [idx]: { ...prev[idx], subject, body, status: 'sent', lastEdited: new Date().toISOString() },
  }));
  setPitchSlideOverIndex(null);
}, []);

const handleRegeneratePitch = useCallback((idx) => {
  const lead = leads[idx];
  const ext = extendedLeadData[idx];
  setPitchDrafts(prev => ({ ...prev, [idx]: generatePitch(lead, ext) }));
}, [generatePitch]);

const handleDiscardPitch = useCallback((idx) => {
  setPitchDrafts(prev => {
    const next = { ...prev };
    delete next[idx];
    return next;
  });
  setPitchSlideOverIndex(null);
}, []);
```

- [ ] **Step 2: Verify no runtime errors**

Run: `npm run dev` and navigate to `/app` → Seller Leads.
Expected: Tab renders exactly as before (no visible change yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: add pitch draft state management to LeadsTab"
```

---

### Task 3: Build the PitchSlideOver Component

**Files:**
- Modify: `src/components/AppDashboard.jsx` — add new component before `LeadsTab`

- [ ] **Step 1: Add new imports**

At the top of AppDashboard.jsx, add `Pencil` and `RefreshCw` to the lucide-react import:

```jsx
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
  Pencil,
  RefreshCw,
} from 'lucide-react';
```

- [ ] **Step 2: Create the PitchSlideOver component**

Add this component above the `LeadsTab` function (before line 789):

```jsx
// ---------------------------------------------------------------------------
// Pitch Slide-Over Panel
// ---------------------------------------------------------------------------

function PitchSlideOver({ lead, ext, draft, onSave, onSend, onRegenerate, onDiscard, onClose }) {
  const [subject, setSubject] = useState(draft?.subject || '');
  const [body, setBody] = useState(draft?.body || '');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    setSubject(draft?.subject || '');
    setBody(draft?.body || '');
  }, [draft]);

  const hasChanges = subject !== draft?.subject || body !== draft?.body;

  const handleClose = () => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const isReadOnly = draft?.status === 'sent';

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
        className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-[480px] bg-white shadow-2xl flex flex-col"
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
              {draft?.status === 'sent' && (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium bg-success/10 text-success border-success/20">
                  Sent
                </span>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subject */}
        <div className="px-6 py-3 border-b border-border">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Subject</label>
          {isReadOnly ? (
            <p className="text-sm font-medium text-charcoal">{subject}</p>
          ) : (
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm font-medium"
              placeholder="Email subject line..."
            />
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isReadOnly ? (
            <div className="rounded-xl bg-light-bg border border-gray-100 p-4">
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{body}</p>
            </div>
          ) : (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full min-h-[320px] rounded-xl bg-light-bg border border-gray-100 p-4 text-sm leading-relaxed text-foreground resize-none outline-none focus:ring-1 focus:ring-orange/30 transition-shadow"
              placeholder="Email body..."
            />
          )}

          {/* Lead Context Strip */}
          <div className="rounded-xl border border-border p-4 space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Property Context</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Price', value: lead.price },
                { label: 'Equity', value: lead.equity, className: 'text-success' },
                { label: 'Sq Ft', value: lead.sqft },
                { label: 'Year Built', value: lead.yearBuilt },
                { label: 'Lot Size', value: lead.lotSize },
                { label: 'Loan', value: lead.loanAmount },
                { label: 'Rate', value: lead.interestRate },
                { label: 'Tax Bill', value: lead.taxBill },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className={cn('font-medium', item.className)}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">Data Sources</p>
            <div className="flex items-center gap-2 flex-wrap">
              {['MLS listing', 'Sold comps', 'Days expired', 'Equity estimate', 'Tax records', 'Loan data'].map((src) => (
                <span key={src} className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">{src}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {!isReadOnly && (
          <div className="px-6 py-4 border-t border-border flex items-center gap-2">
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
              onClick={() => onSave(subject, body)}
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              className="rounded-lg bg-orange text-white hover:bg-orange-hover"
              onClick={() => onSend(subject, body)}
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Send Now
            </Button>
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
                  <Button variant="outline" size="sm" onClick={() => { onSave(subject, body); }}>
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
```

- [ ] **Step 3: Verify file has no syntax errors**

Run: `npm run dev`
Expected: Compiles without errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: add PitchSlideOver component"
```

---

### Task 4: Wire Slide-Over into LeadsTab Quick Actions

**Files:**
- Modify: `src/components/AppDashboard.jsx` — LeadsTab Quick Actions section (~line 1086-1119) and bottom of LeadsTab return

- [ ] **Step 1: Replace "View Email Pitch" button with context-aware pitch button**

In the Quick Actions section of the expanded lead detail panel, replace the "View Email Pitch" button (the `<Button>` with `<ExternalLink>`) with:

```jsx
<Button
  variant="outline"
  size="sm"
  className="w-full justify-start rounded-lg text-sm"
  onClick={(e) => {
    e.stopPropagation();
    handleOpenPitchSlideOver(idx);
  }}
>
  {pitchDrafts[idx]?.status === 'sent' ? (
    <><Eye className="h-3.5 w-3.5 mr-2" />View Sent Pitch</>
  ) : pitchDrafts[idx]?.status === 'draft' ? (
    <><Pencil className="h-3.5 w-3.5 mr-2" />Edit Draft</>
  ) : (
    <><FileEdit className="h-3.5 w-3.5 mr-2" />Generate Email Pitch</>
  )}
</Button>
```

- [ ] **Step 2: Add draft indicator to the lead card badges**

In the "Right: Badges + Expand" section (~line 1026), after the stage badge `<span>`, add a draft-ready indicator:

```jsx
{pitchDrafts[idx]?.status === 'draft' && (
  <span className="inline-flex items-center gap-1 rounded-full border border-orange/20 bg-orange/10 px-2 py-0.5 text-[11px] font-medium text-orange">
    <Pencil className="h-3 w-3" />
    Draft
  </span>
)}
```

- [ ] **Step 3: Render the PitchSlideOver at the bottom of LeadsTab return**

Just before the closing `</div>` of the LeadsTab return (before `</div>` at ~line 1176), add:

```jsx
{/* Pitch Slide-Over */}
<AnimatePresence>
  {pitchSlideOverIndex !== null && (
    <PitchSlideOver
      lead={leads[pitchSlideOverIndex]}
      ext={extendedLeadData[pitchSlideOverIndex]}
      draft={pitchDrafts[pitchSlideOverIndex]}
      onSave={(subject, body) => handleSaveDraft(pitchSlideOverIndex, subject, body)}
      onSend={(subject, body) => handleSendPitch(pitchSlideOverIndex, subject, body)}
      onRegenerate={() => handleRegeneratePitch(pitchSlideOverIndex)}
      onDiscard={() => handleDiscardPitch(pitchSlideOverIndex)}
      onClose={() => setPitchSlideOverIndex(null)}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 4: Verify the full flow works**

Run: `npm run dev` → navigate to `/app` → Seller Leads → expand a lead → click "Generate Email Pitch"
Expected: Slide-over opens from right with personalized email. Can edit subject/body. "Save Draft" closes and shows draft badge. "Send Now" closes and updates stage. "Discard" closes with no changes. Re-opening a saved draft shows the saved content.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: wire pitch slide-over into lead card Quick Actions"
```

---

### Task 5: Rename Email Pitches to Pitches Sent

**Files:**
- Modify: `src/components/AppDashboard.jsx:50-57` (navItems)
- Modify: `src/components/AppDashboard.jsx:1184-1345` (DraftsTab)
- Modify: `src/components/AppDashboard.jsx:1690-1714` (mobile bottom tabs)

- [ ] **Step 1: Update navItems**

Change the `drafts` nav item at line 54:

```jsx
{ key: 'drafts', label: 'Pitches Sent', subtitle: 'Emails you\'ve sent', icon: Send },
```

Note: icon changes from `FileEdit` to `Send`.

- [ ] **Step 2: Update DraftsTab header text**

In DraftsTab, update the contextual help text (line 1202):

```jsx
<p className="text-sm text-gray-500">
  A record of personalized emails sent to sellers. Track delivery and engagement from here.
</p>
```

Update the left panel header (line 1210-1211):

```jsx
<p className="text-sm font-medium">Pitches Sent</p>
<p className="text-xs text-muted-foreground">{leads.filter(l => l.draft === 'Sent').length} emails delivered</p>
```

- [ ] **Step 3: Update mobile bottom tab bar**

Change the drafts tab entry (~line 1694):

```jsx
{ key: 'drafts', label: 'Sent', icon: Send },
```

- [ ] **Step 4: Verify nav and tab changes**

Run: `npm run dev` → navigate to `/app`
Expected: Sidebar shows "Pitches Sent" with "Emails you've sent" subtitle. Mobile bottom bar shows "Sent" with Send icon. Tab content loads correctly.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: rename Email Pitches to Pitches Sent"
```

---

### Task 6: Add Match Score to Lead Cards

**Files:**
- Modify: `src/components/AppDashboard.jsx` — lead card middle section (~line 1010-1023)

- [ ] **Step 1: Add match score display**

In the "Middle: Property Stats" section of the lead card, add a match score indicator after the Time stat:

```jsx
<div>
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Match</p>
  <div className="flex items-center gap-1.5">
    <div className="w-8 h-1.5 rounded-full bg-gray-200 overflow-hidden">
      <div
        className={cn('h-full rounded-full', lead.match >= 90 ? 'bg-success' : lead.match >= 80 ? 'bg-orange' : 'bg-yellow-500')}
        style={{ width: `${lead.match}%` }}
      />
    </div>
    <span className="font-mono text-sm font-bold text-charcoal">{lead.match}</span>
  </div>
</div>
```

- [ ] **Step 2: Verify match score renders**

Run: `npm run dev` → navigate to `/app` → Seller Leads
Expected: Each lead card shows a colored bar + number for match score (94 green, 87 orange, etc.)

- [ ] **Step 3: Commit**

```bash
git add src/components/AppDashboard.jsx
git commit -m "feat: display match score on lead cards"
```
