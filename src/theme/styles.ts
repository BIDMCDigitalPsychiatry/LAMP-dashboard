import { makeStyles } from "@material-ui/core"
import { themeColors, radius, shadow, touchTarget } from "./tokens"

// Shared classes for new UI. Combine with a component's own classes for layout, e.g.
// className={`${buttons.primary} ${classes.reload}`}; the component's classes win.

const button = {
  height: touchTarget,
  padding: "0 16px",
  borderRadius: radius.control,
  fontSize: 15,
  fontWeight: 600,
  textTransform: "none" as const,
}

/** One primary (or danger) action per dialog or screen; secondary for everything else */
export const useButtonStyles = makeStyles({
  primary: {
    ...button,
    color: themeColors.white,
    background: themeColors.primary,
    "&:hover": { background: themeColors.primaryHover },
  },
  secondary: {
    ...button,
    color: themeColors.textStrong,
    background: themeColors.surfaceHover,
    "&:hover": { background: themeColors.border },
  },
  danger: {
    ...button,
    color: themeColors.white,
    background: themeColors.danger,
    "&:hover": { background: themeColors.dangerHover },
  },
})

/** Confirmation and alert dialogs: icon, title, body, then actions on the right */
export const useDialogStyles = makeStyles({
  paper: {
    width: 380,
    maxWidth: "calc(100% - 32px)",
    margin: 16,
    borderRadius: radius.dialog,
    padding: "24px 24px 20px",
    boxShadow: shadow.dialog,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: themeColors.primarySoft,
    color: themeColors.primary,
  },
  iconDanger: { background: themeColors.dangerSoft, color: themeColors.danger },
  title: { fontSize: 20, fontWeight: 600, color: themeColors.text, marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 1.5, color: themeColors.textBody },
  actions: { display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 8, marginTop: 20 },
})
