import { supabase } from './supabase'

// =========================================================================
// AGENT SIDE
// =========================================================================

// Create a lead order (agent requests leads)
export async function createLeadOrder({ agentId, zipCodes, leadTypes, priceMin, priceMax, notes }) {
  const orderNumber = `Order #${1000 + Math.floor(Math.random() * 9000)}`
  const { data, error } = await supabase
    .from('lead_orders')
    .insert({
      agent_id: agentId,
      order_number: orderNumber,
      zip_codes: zipCodes,
      lead_types: leadTypes,
      price_min: priceMin,
      price_max: priceMax,
      quantity_requested: 250,
      notes,
      status: 'pending',
    })
    .select()
    .single()
  return { data, error }
}

// Get agent's lead orders
export async function getAgentOrders(agentId) {
  const { data, error } = await supabase
    .from('lead_orders')
    .select('*')
    .eq('agent_id', agentId)
    .order('requested_at', { ascending: false })
  return { data: data || [], error }
}

// Get leads for a specific order
export async function getLeadsByOrder(orderId) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// Get all leads for an agent
export async function getAgentLeads(agentId) {
  const { data, error } = await supabase
    .from('leads')
    .select('*, lead_orders(order_number, requested_at)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// Update lead pitch status
export async function updateLeadStatus(leadId, updates) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .select()
    .single()
  return { data, error }
}

// =========================================================================
// ADMIN SIDE
// =========================================================================

// Get all pending lead orders (for admin)
export async function getAllOrders(statusFilter) {
  let query = supabase
    .from('lead_orders')
    .select('*, users(full_name, email, initials, market, plan, status)')
    .order('requested_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  return await query
}

// Update order status (admin)
export async function updateOrderStatus(orderId, status, rejectionReason) {
  const updates = { status }
  if (rejectionReason) updates.rejection_reason = rejectionReason
  if (status === 'completed') updates.delivered_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('lead_orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single()
  return { data, error }
}

// Insert leads from CSV (admin uploads)
export async function insertLeads(leads) {
  const { data, error } = await supabase
    .from('leads')
    .insert(leads)
    .select()
  return { data, error }
}

// Log request history event
export async function logRequestEvent(orderId, adminId, status, detailText, rejectionReason) {
  return await supabase
    .from('lead_request_history')
    .insert({
      order_id: orderId,
      status,
      changed_by_admin_id: adminId,
      detail_text: detailText,
      rejection_reason: rejectionReason,
    })
}

// Log CSV upload
export async function logCsvUpload(orderId, adminId, fileName, rowCount) {
  return await supabase
    .from('csv_uploads')
    .insert({
      order_id: orderId,
      uploaded_by_admin_id: adminId,
      file_name: fileName,
      row_count: rowCount,
      status: 'completed',
      processed_at: new Date().toISOString(),
    })
}

// Get order with full history
export async function getOrderWithHistory(orderId) {
  const [orderRes, historyRes] = await Promise.all([
    supabase.from('lead_orders').select('*, users(full_name, email, initials, market, plan, status)').eq('id', orderId).single(),
    supabase.from('lead_request_history').select('*').eq('order_id', orderId).order('changed_at', { ascending: true }),
  ])
  return { order: orderRes.data, history: historyRes.data || [], error: orderRes.error || historyRes.error }
}
