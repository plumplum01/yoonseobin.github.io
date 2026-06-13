# Deprecated

This directory stores legacy UI that is intentionally excluded from the active app build.

- `home-hero/` contains the previous horizontal home hero and its project overlay/card helpers.
- Active pages should not import from this directory.
- If a deprecated feature is restored, move it back into the active `src` structure and make it pass `npm run build`.
