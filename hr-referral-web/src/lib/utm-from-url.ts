/** Matches sheet columns UTM_ID + UTM_SOURCE (query params utm_id, utm_source). */
export type UtmPayload = {
  utm_id: string
  utm_source: string
}

export function readUtmFromSearch(search: string): UtmPayload {
  const q = search.startsWith("?") ? search.slice(1) : search
  const p = new URLSearchParams(q)
  return {
    utm_id: (p.get("utm_id") ?? "").trim(),
    utm_source: (p.get("utm_source") ?? "").trim(),
  }
}
