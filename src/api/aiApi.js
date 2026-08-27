
export const AI_BASE_URL = import.meta.env.VITE_AI_URL ?? 'http://localhost:8000'

const API = `${AI_BASE_URL}/api/v1`

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    throw new Error(`AI service responded ${response.status}`)
  }
  return response.json()
}

/** Funnel, demand, assistant usage and model health. */
export function fetchInsights(days = 30) {
  return request(`/insights?days=${days}`)
}

/** Qualified lead queue, hottest first. */
export function fetchLeads({ band, status, limit = 25, skip = 0 } = {}) {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })
  if (band) params.set('band', band)
  if (status) params.set('status', status)
  return request(`/leads?${params}`)
}

export function rescoreLead(leadId) {
  return request(`/leads/${leadId}/score`, { method: 'POST' })
}

export function updateLeadStatus(leadId, status) {
  return request(`/leads/${leadId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  })
}

/** Scheduler state plus recent automation runs. */
export function fetchAutomation(limit = 15) {
  return request(`/admin/automation?limit=${limit}`)
}

export function triggerRetrain() {
  return request('/admin/retrain', { method: 'POST' })
}

export function fetchHealth() {
  return fetch(`${AI_BASE_URL}/health`).then((response) => response.json())
}
