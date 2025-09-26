export function buildLampServerRequestUrl(lampServerUrl: string, path?: "") {
  const protocol = process.env.USE_HTTPS === "true" ? "https://" : "http://"
  return `${protocol}${lampServerUrl.replace(/\/$/, "")}/${path?.replace(/^\//, "") || ""}`
}
