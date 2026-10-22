// Use the correct protocol to make requests to the LAMP-server
// Default to using https
export function buildLampServerRequestUrl(lampServerUrl: string, path?: string) {
  const protocol = process.env.REACT_APP_USE_HTTPS === "false" ? "http://" : "https://"
  return `${protocol}${lampServerUrl.replace(/\/$/, "")}/${path?.replace(/^\//, "") || ""}`
}

// Takes a list of path components and joins them after excluding duplicate slashes
// Ex: composeRequestPath(['/one/', "/two", 'three']) => "one/two/three"
export function composeRequestPath(urlSegments: string[]) {
  return urlSegments.map((s) => s.replace(/^\//, "").replace(/\/$/, "")).join("/")
}

// A local calendar day may have 23 or 25 hours when daylight saving time changes.
export function getLocalDayBounds(date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { startTime: start.getTime(), endTime: end.getTime() }
}
