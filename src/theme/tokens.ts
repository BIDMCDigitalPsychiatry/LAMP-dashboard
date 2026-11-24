// Shared colors and sizes for dashboard UI. Use these instead of hex values in new or reworked screens.
// docs/style-guide.md says when to use each one.

// Named themeColors so it doesn't clash with Material UI's `colors` import
export const themeColors = {
  // mindLAMP blue: logo, illustrations and large accents only. As text, or under white text, it fails contrast (2.7:1)
  brand: "#7599FF",
  // Buttons, links and selected states (white text on it: 5.8:1)
  primary: "#1565C0",
  primaryHover: "#0D47A1",
  primarySoft: "#ECF4FF",
  // Destructive actions only
  danger: "#B42318",
  dangerHover: "#912018",
  dangerSoft: "#FEF3F2",
  text: "#111827", // titles
  textStrong: "#1F2937", // menu items, secondary buttons
  textBody: "#4B5563", // body copy
  textMuted: "#6B7280", // the lightest allowed for text: 4.8:1 on white, 4.6:1 on surface
  iconFaint: "#9CA3AF", // decorative icons only, never text
  border: "#E5E7EB",
  divider: "#EEF0F3",
  surface: "#F7F8FA",
  surfaceHover: "#F3F4F6",
  white: "#FFFFFF",
}

export const radius = { item: 8, control: 10, menu: 14, dialog: 16 }

export const shadow = {
  card: "0 1px 3px rgba(15, 23, 42, 0.06)",
  menu: "0 12px 32px rgba(15, 23, 42, 0.14), 0 2px 6px rgba(15, 23, 42, 0.06)",
  dialog: "0 20px 48px rgba(15, 23, 42, 0.24)",
}

// Minimum height and width of anything tappable
export const touchTarget = 44

export const fontFamily = "Inter, Roboto, Helvetica, Arial, sans-serif"
