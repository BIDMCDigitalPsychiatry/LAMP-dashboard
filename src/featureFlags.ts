// Central feature flags.
//
// Modules (lamp.module) arrived on master via the in-flight LST work but the
// feature is not yet released to participants. This flag hides the
// participant-facing Modules UI (the Modules sub-tab and module accordion
// sections) without removing any module code — flip it back to true to
// restore the UI. Researcher-side module creation is intentionally NOT
// gated here.
export const MODULES_ENABLED = false

// Hides the participant-facing Messages icon (comment badge in the top bar,
// NavigationLayout). Researcher-side Conversations are NOT gated here.
export const MESSAGING_ENABLED = false

// Favorites (the star on activity cards, the Favorites sub-tab, and the
// favorite toggles in the activity popup and module accordions) arrived on
// master via the in-flight work but is not yet ready for participants. This
// flag hides the participant-facing Favorites UI and stops the dashboard
// reading or writing the lamp.dashboard.favorite_activities attachment,
// without removing any favorites code — flip it back to true to restore it.
export const FAVORITES_ENABLED = false
