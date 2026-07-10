// Central feature flags.
//
// Modules (lamp.module) arrived on master via the in-flight LST work but the
// feature is not yet released to participants. This flag hides the
// participant-facing Modules UI (the Modules sub-tab and module accordion
// sections) without removing any module code — flip it back to true to
// restore the UI. Researcher-side module creation is intentionally NOT
// gated here.
export const MODULES_ENABLED = false
