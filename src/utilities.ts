// Use the correct protocol to make requests to the LAMP-server
// Default to using https
export function buildLampServerRequestUrl(lampServerUrl: string, path?: "") {
  const protocol = process.env.REACT_APP_USE_HTTPS === "false" ? "http://" : "https://"
  return `${protocol}${lampServerUrl.replace(/\/$/, "")}/${path?.replace(/^\//, "") || ""}`
}
