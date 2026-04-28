export type LeadPayload = {
  name: string
  email: string
  phone: string
  cta: string
  utm_id: string
  utm_source: string
  marketer_name: string
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; message?: string }

/** POST JSON to Apps Script web app. Use text/plain to avoid CORS preflight issues. */
export async function submitLeadToAppsScript(
  execUrl: string,
  payload: LeadPayload,
  webhookSecret?: string,
): Promise<SubmitResult> {
  const body: Record<string, string> = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    cta: payload.cta,
    utm_id: payload.utm_id,
    utm_source: payload.utm_source,
    marketer_name: payload.marketer_name,
  }
  if (webhookSecret) body.secret = webhookSecret

  const res = await fetch(execUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(body),
    redirect: "follow",
  })

  const text = await res.text()
  let data: SubmitResult
  try {
    data = JSON.parse(text) as SubmitResult
  } catch {
    return { ok: false, error: text || `HTTP ${res.status}` }
  }

  return data
}
