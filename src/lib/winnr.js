const WINNR_API_URL = 'https://api.winnr.app'
const WINNR_TOKEN = 'wnr_tUE3La3uxRUpFDsdLF9s_wtOfT9yYnBGKXRE6PcToJFoA'

const headers = {
  Authorization: `Bearer ${WINNR_TOKEN}`,
  'Content-Type': 'application/json',
}

// Search domain availability
export async function searchDomain(query) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/search?q=${encodeURIComponent(query)}`, { headers })
  if (!res.ok) throw new Error('Domain search failed')
  return res.json()
}

// Generate domain variations and check availability in bulk
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
  const res = await fetch(`${WINNR_API_URL}/v1/domains/search-bulk`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ domains: variations }),
  })
  if (!res.ok) throw new Error('Domain search failed')
  const json = await res.json()
  return {
    data: (json.data?.results || []).map(r => ({
      domain: r.domain,
      available: r.available,
      price: r.price,
    })),
  }
}

// Purchase/setup a domain
export async function setupDomain(domain) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/setup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ domain }),
  })
  if (!res.ok) throw new Error('Domain setup failed')
  return res.json()
}

// Connect existing domains
export async function connectDomains(domains) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/connect`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ domains }),
  })
  if (!res.ok) throw new Error('Domain connect failed')
  return res.json()
}

// Create email user (mailbox)
export async function createEmailUser({ username, domain, name }) {
  const res = await fetch(`${WINNR_API_URL}/v1/email-users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, domain, name }),
  })
  if (!res.ok) throw new Error('Email user creation failed')
  return res.json()
}

// Bulk create email users
export async function bulkCreateEmailUsers(users) {
  const res = await fetch(`${WINNR_API_URL}/v1/email-users/bulk`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ users }),
  })
  if (!res.ok) throw new Error('Bulk email user creation failed')
  return res.json()
}

// Get domain details
export async function getDomain(domainId) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/${domainId}`, { headers })
  if (!res.ok) throw new Error('Get domain failed')
  return res.json()
}

// Get DNS status
export async function getDnsStatus(domainId) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/${domainId}/dns-status`, { headers })
  if (!res.ok) throw new Error('DNS status check failed')
  return res.json()
}

// List email users for a domain
export async function listDomainEmailUsers(domainId) {
  const res = await fetch(`${WINNR_API_URL}/v1/domains/${domainId}/email-users`, { headers })
  if (!res.ok) throw new Error('List email users failed')
  return res.json()
}

// Enable warming for mailboxes
export async function enableWarming(userIds, settings = {}) {
  const res = await fetch(`${WINNR_API_URL}/v1/warming/enable`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      user_ids: userIds,
      settings: { emails_per_day: 20, rampup_speed: 'normal', ...settings },
    }),
  })
  if (!res.ok) throw new Error('Enable warming failed')
  return res.json()
}
