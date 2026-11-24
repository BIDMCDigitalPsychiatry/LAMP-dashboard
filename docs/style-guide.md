# Dashboard style guide

This guide started with the auth release screens: the account menu, the logout and delete dialogs, the idle prompt, the 2FA messages, and the error screen. Most of the dashboard is older than this guide. Follow it for new UI, and when you rework a screen. Don't restyle a screen you aren't otherwise changing just to match.

## Where things live

| What | Where |
| --- | --- |
| Colors, corner radii, shadows, touch target, font | `src/theme/tokens.ts` |
| Shared button and dialog classes | `src/theme/styles.ts`: `useButtonStyles()`, `useDialogStyles()` |
| App-wide Material UI theme (font, MUI palette) | `src/components/App.tsx`, `createTheme` |
| mindLAMP logo and wordmark | `src/icons/Logo.svg`, `src/icons/mindLAMP.svg` |
| Activity and section icons | `src/icons/` |
| Version and server helpers | `dashboardVersion()`, `serverAddress()` in `src/components/helper.js` |

Working examples:

- Account menu: `NavigationLayout.tsx`
- Logout and delete dialogs: `NavigationLayout.tsx`
- Idle prompt: `IdlePrompt.tsx`
- Error screen: `ErrorScreen.tsx`

Use the tokens instead of typing hex values. Use the shared classes for buttons and dialogs, and add a component's own class on top for layout:

```tsx
const buttons = useButtonStyles()
<Button className={`${buttons.primary} ${classes.reload}`}>{`${t("Reload page")}`}</Button>
```

The MUI theme in `App.tsx` doesn't use these tokens yet. Its `palette.primary` is MUI's default blue. Changing it would restyle every MUI button and input in the dashboard, so that is its own project.

## Color

Import them as `themeColors` from `src/theme/tokens.ts` (`themeColors.primary`). Material UI's own `colors` export is a different set of palettes, and many files already import it under that name.

| Token | Hex | Use |
| --- | --- | --- |
| `brand` | `#7599FF` | Logo, illustrations, large accents. Never text, and never under white text (2.7:1). |
| `primary` | `#1565C0` | Buttons, links, selected states (white text on it: 5.8:1) |
| `primaryHover` | `#0D47A1` | Hover on primary |
| `primarySoft` | `#ECF4FF` | Icon circles, avatar background |
| `danger` | `#B42318` | Destructive actions only (white text on it: 6.6:1) |
| `dangerSoft` | `#FEF3F2` | Destructive icon circles and hovers |
| `text` | `#111827` | Titles |
| `textStrong` | `#1F2937` | Menu items, secondary buttons |
| `textBody` | `#4B5563` | Body copy |
| `textMuted` | `#6B7280` | The lightest color allowed for text: 4.8:1 on white, 4.6:1 on `surface` |
| `iconFaint` | `#9CA3AF` | Decorative icons only, never text |
| `border`, `divider` | `#E5E7EB`, `#EEF0F3` | Outlines, menu dividers |
| `surface`, `surfaceHover` | `#F7F8FA`, `#F3F4F6` | Panels, footers, hovers, secondary buttons |

**Open question: which blue.** The dashboard uses three blues:

- `#7599FF`: the brand blue, in about 110 places, including the pill buttons on the login screens. It fails contrast for text.
- `#4C66D6`: an older darker brand blue, in about 40 places. It passes for text and buttons (5.0:1).
- `#1565C0`: Material blue, which the new screens use as `primary`.

Picking one action blue is a single change to `primary` in `tokens.ts`. `#4C66D6` would keep buttons closer to the brand.

## Type

The font is Inter, set in the MUI theme.

| Role | Size and weight |
| --- | --- |
| Page title | 22–25 px, 600 |
| Dialog title | 20 px, 600 |
| Body | 15 px, line height 1.5 |
| Menu item | 15 px (16 px on phones) |
| Small labels, version footer | 12–13 px |

## Shape and spacing

- **Corner radii:** `radius.item` 8 (menu rows), `radius.control` 10 (buttons, panels), `radius.menu` 14, `radius.dialog` 16.
- **Shadows:** `shadow.card`, `shadow.menu`, `shadow.dialog`.
- **Touch targets:** anything tappable is at least 44 px (`touchTarget`). Menu rows grow to 48 px on phones.
- **Spacing:** use flex or grid `gap` in steps of 8, 12, 16 and 24 px.

## Buttons

- **Primary:** one per dialog or screen, for the main or safe action.
- **Secondary:** grey, for Cancel and the other choices.
- **Danger:** red, only for an action that deletes something or can't be undone.
- Labels are sentence case and start with a verb ("Reload page", "Stay logged in"). No all caps.

## Dialogs

Use `useDialogStyles()` and build every dialog in this order:

1. An icon in a circle: `icon`, or `icon` plus `iconDanger`.
2. A title that is a short question or statement ("Log out?").
3. One or two sentences saying what will happen.
4. Actions on the right: secondary first, then primary or danger.

For destructive dialogs, focus Cancel (`autoFocus`) so Enter never deletes anything, and make the confirm button red. Give the dialog `aria-labelledby` and `aria-describedby`.

## Menus

The account menu is the pattern to follow:

1. Who is signed in, at the top.
2. Dividers between groups.
3. External links marked with an open-in-new icon.
4. A destructive item last, in red, away from Logout.
5. The version footer at the bottom.

## Icons

- Use `@material-ui/icons` (v4) in the **Rounded** style, with outline-style names: `HelpOutlineRounded`, `MailOutlineRounded`, `DeleteOutlineRounded`.
- Where the Rounded version is only a filled shape, use the Outlined one instead (`ReportProblemOutlined`).
- Use `fontSize="small"` in menus. Icons in circles are 22–24 px.
- Icon-only buttons need an `aria-label`.
- `package.json` also has `@mui/material` v5, used in a few older files. New UI uses v4 (`@material-ui/*`) like the rest of the dashboard.

## Text

- Sentence case, short, plain. Say what happens next and what the person can do.
- Every visible string goes through `t()` and into all 10 `public/locales/*/translation.json` files.
- The existing labels "Logout" and "Delete Account" stay as they are, so their translations keep working. New text uses "Log out" as the verb.

## Accessibility checklist

- Text contrast at least 4.5:1. `textMuted` is the lightest color allowed for text.
- Touch targets at least 44 px.
- Use real `<button>` and `<a>` elements, and give icon-only buttons an `aria-label`.
- In destructive dialogs, the safe action has focus.
- Don't use color as the only signal.

## Debugging info

The account menus and login screens show the dashboard version, and the menus also show the server. The error screen shows version, server, time, screen and error under "Details for support". Keep these visible when reworking those screens: they are how screenshots from users become triageable reports.
