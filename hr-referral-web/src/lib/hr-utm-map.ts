/** Mirrors `HR_UTM_MAP` in Apps Script — display only; server resolves HR from utm_id. */
export const HR_UTM_MAP: Record<string, string> = {
  HR_TANUSHREE_001: "Tanushree",
  HR_TADAKSHA_001: "Tadaksha",
  HR_SRAVANI_001: "Sravani",
}

export function hrDisplayNameForUtmId(utmId: string): string | undefined {
  const key = utmId.trim()
  if (!key) return undefined
  return HR_UTM_MAP[key]
}
