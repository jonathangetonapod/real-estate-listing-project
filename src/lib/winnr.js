// ============================================================================
// Winnr API Service Layer
// Email infrastructure: domains, mailboxes, inbox, warming
// Agent never sees this — OffMarket is the only brand
// ============================================================================

const WINNR_API_URL = 'https://api.winnr.app'
const WINNR_TOKEN = 'wnr_tUE3La3uxRUpFDsdLF9s_wtOfT9yYnBGKXRE6PcToJFoA'

const headers = {
  Authorization: `Bearer ${WINNR_TOKEN}`,
  'Content-Type': 'application/json',
}

async function winnrFetch(path, options = {}) {
  const res = await fetch(`${WINNR_API_URL}${path}`, { headers, ...options })
  const json = await res.json()
  if (!res.ok) {
    const msg = json?.error?.message || `Winnr API error: ${res.status}`
    throw new Error(msg)
  }
  return json
}

// ============================================================================
// ACCOUNT
// ============================================================================

export async function getAccount() {
  return winnrFetch('/v1/account')
}

export async function getUsage() {
  return winnrFetch('/v1/account/usage')
}

// ============================================================================
// DOMAINS
// ============================================================================

// List all domains
export async function listDomains(limit = 25, cursor) {
  const params = new URLSearchParams({ limit })
  if (cursor) params.set('cursor', cursor)
  return winnrFetch(`/v1/domains?${params}`)
}

// Get domain details
export async function getDomain(domainId) {
  return winnrFetch(`/v1/domains/${domainId}`)
}

// Search single domain availability
export async function searchDomain(domain) {
  return winnrFetch(`/v1/domains/search?q=${encodeURIComponent(domain)}`)
}

// Bulk search domain availability (up to 100)
export async function searchDomainsBulk(domains) {
  return winnrFetch('/v1/domains/search-bulk', {
    method: 'POST',
    body: JSON.stringify({ domains }),
  })
}

// Generate variations and check availability
export async function suggestDomains(keywords) {
  const q = keywords.trim().toLowerCase().replace(/\s+/g, '')
  const variations = [
    `${q}-homes.com`,
    `${q}-realty.com`,
    `${q}-listings.com`,
    `${q}-properties.com`,
    `get${q}.com`,
    `${q}-group.com`,
    `${q}re.com`,
    `${q}-sales.com`,
  ]
  const json = await winnrFetch('/v1/domains/search-bulk', {
    method: 'POST',
    body: JSON.stringify({ domains: variations }),
  })
  return {
    data: (json.data?.results || []).map(r => ({
      domain: r.domain,
      available: r.available,
      price: r.price,
    })),
  }
}

// Purchase and setup a domain
export async function setupDomain(domain) {
  return winnrFetch('/v1/domains/setup', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  })
}

// Connect external domains (with optional Cloudflare token)
export async function connectDomains(domains, cloudflareApiToken) {
  const body = { domains }
  if (cloudflareApiToken) body.cloudflare_api_token = cloudflareApiToken
  return winnrFetch('/v1/domains/connect', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Delete a domain
export async function deleteDomain(domainId) {
  return winnrFetch(`/v1/domains/${domainId}`, { method: 'DELETE' })
}

// Check DNS propagation
export async function getDnsStatus(domainId) {
  return winnrFetch(`/v1/domains/${domainId}/dns-status`)
}

// Get expected DNS records (for manual setup domains)
export async function getDnsRecords(domainId) {
  return winnrFetch(`/v1/domains/${domainId}/dns-records`)
}

// Verify DNS via live lookup
export async function verifyDns(domainId) {
  return winnrFetch(`/v1/domains/${domainId}/verify-dns`, { method: 'POST' })
}

// Check nameservers
export async function checkNameservers(domains) {
  return winnrFetch('/v1/domains/check-ns', {
    method: 'POST',
    body: JSON.stringify({ domains }),
  })
}

// Setup domain redirect
export async function setupRedirect(domainId, url) {
  return winnrFetch(`/v1/domains/${domainId}/redirect`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
}

// Setup email forwarding
export async function setupForward(domainId, address) {
  return winnrFetch(`/v1/domains/${domainId}/forward`, {
    method: 'POST',
    body: JSON.stringify({ address }),
  })
}

// ============================================================================
// EMAIL USERS (MAILBOXES)
// ============================================================================

// List all email users
export async function listEmailUsers(domain, limit = 25, cursor) {
  const params = new URLSearchParams({ limit })
  if (domain) params.set('domain', domain)
  if (cursor) params.set('cursor', cursor)
  return winnrFetch(`/v1/email-users?${params}`)
}

// List email users for a specific domain
export async function listDomainEmailUsers(domainId, limit = 25, cursor) {
  const params = new URLSearchParams({ limit })
  if (cursor) params.set('cursor', cursor)
  return winnrFetch(`/v1/domains/${domainId}/email-users?${params}`)
}

// Get email user details
export async function getEmailUser(userId) {
  return winnrFetch(`/v1/email-users/${userId}`)
}

// Create single email user
export async function createEmailUser({ username, domain, name, password }) {
  const body = { username, domain, name }
  if (password) body.password = password
  return winnrFetch('/v1/email-users', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// Bulk create email users (up to 100)
// domain goes at top level, users array has username + name only
export async function bulkCreateEmailUsers(domain, users) {
  return winnrFetch('/v1/email-users/bulk', {
    method: 'POST',
    body: JSON.stringify({
      domain,
      users: users.map(u => ({ username: u.username, name: u.name })),
    }),
  })
}

// Update email user
export async function updateEmailUser(userId, updates) {
  return winnrFetch(`/v1/email-users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

// Delete email user
export async function deleteEmailUser(userId) {
  return winnrFetch(`/v1/email-users/${userId}`, { method: 'DELETE' })
}

// Bulk delete email users
export async function bulkDeleteEmailUsers(userIds) {
  return winnrFetch('/v1/email-users/bulk', {
    method: 'DELETE',
    body: JSON.stringify({ user_ids: userIds }),
  })
}

// ============================================================================
// INBOX (SENDING & RECEIVING)
// ============================================================================

// List inbox messages
export async function listInbox(userId, limit = 25, cursor) {
  const params = new URLSearchParams({ limit })
  if (cursor) params.set('cursor', cursor)
  return winnrFetch(`/v1/email-users/${userId}/inbox?${params}`)
}

// Send email
export async function sendEmail(userId, { to, subject, body, html, inReplyTo, references }) {
  const payload = { to, subject, body }
  if (html !== undefined) payload.html = html
  if (inReplyTo) payload.in_reply_to = inReplyTo
  if (references) payload.references = references
  return winnrFetch(`/v1/email-users/${userId}/inbox/send`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Refresh inbox (trigger sync)
export async function refreshInbox(userId) {
  return winnrFetch(`/v1/email-users/${userId}/inbox/refresh`, { method: 'POST' })
}

// Get full message body
export async function getMessageBody(uid, mailbox) {
  return winnrFetch(`/v1/inbox/${uid}/body?mailbox=${encodeURIComponent(mailbox)}`)
}

// Mark message read/unread
export async function markMessageRead(uid, mailbox, isRead) {
  return winnrFetch(`/v1/inbox/${uid}?mailbox=${encodeURIComponent(mailbox)}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: isRead }),
  })
}

// Delete message
export async function deleteMessage(userId, messageId) {
  return winnrFetch(`/v1/email-users/${userId}/inbox/${messageId}`, { method: 'DELETE' })
}

// ============================================================================
// WARMING (Admin-only — agent never sees this)
// ============================================================================

// List warming mailboxes
export async function listWarming() {
  return winnrFetch('/v1/warming')
}

// Get warming overview
export async function getWarmingOverview() {
  return winnrFetch('/v1/warming/overview')
}

// Enable warming
export async function enableWarming(userIds, settings = {}) {
  return winnrFetch('/v1/warming/enable', {
    method: 'POST',
    body: JSON.stringify({
      user_ids: userIds,
      settings: { emails_per_day: 20, rampup_speed: 'normal', ...settings },
    }),
  })
}

// Disable warming
export async function disableWarming(userIds) {
  return winnrFetch('/v1/warming/disable', {
    method: 'POST',
    body: JSON.stringify({ user_ids: userIds }),
  })
}

// Pause warming
export async function pauseWarming(userId) {
  return winnrFetch(`/v1/warming/${userId}/pause`, { method: 'POST' })
}

// Resume warming
export async function resumeWarming(userId) {
  return winnrFetch(`/v1/warming/${userId}/resume`, { method: 'POST' })
}

// Update warming settings
export async function updateWarmingSettings(userId, settings) {
  return winnrFetch(`/v1/warming/${userId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
}

// Get warming metrics
export async function getWarmingMetrics(userId, days = 30) {
  return winnrFetch(`/v1/warming/${userId}/metrics?days=${days}`)
}

// ============================================================================
// JOBS (Async operations)
// ============================================================================

export async function listJobs(limit = 25, cursor) {
  const params = new URLSearchParams({ limit })
  if (cursor) params.set('cursor', cursor)
  return winnrFetch(`/v1/jobs?${params}`)
}

export async function getJob(jobId) {
  return winnrFetch(`/v1/jobs/${jobId}`)
}

// ============================================================================
// EXPORT
// ============================================================================

export async function exportEmailUsers(format, domains, getAll = false) {
  const body = { format }
  if (domains) body.domains = domains
  if (getAll) body.get_all = true
  return winnrFetch('/v1/export', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
