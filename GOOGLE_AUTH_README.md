# Google Authentication — Re-enable Guide

Google Auth has been **temporarily disabled** from the login page UI.

## How to Re-enable

All changes are in **one file**: `index.html`

Search for `GOOGLE_AUTH_START` — there are **3 blocks** to uncomment:

### Block 1 — Google Identity Services Script (line ~13)
```html
<!-- [GOOGLE_AUTH_START] — Commented out: Google Identity Services script
<script src="https://accounts.google.com/gsi/client" async defer></script>
[GOOGLE_AUTH_END] -->
```
**Uncomment to:**
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Block 2 — Google Sign-In Button & Divider (line ~119)
```html
<!-- [GOOGLE_AUTH_START] — Commented out: Google Sign-In Button & Divider
<div class="google-btn-container" id="googleSignInBtn"></div>
<div class="auth-divider"><span>or</span></div>
[GOOGLE_AUTH_END] -->
```
**Uncomment to:**
```html
<div class="google-btn-container" id="googleSignInBtn"></div>
<div class="auth-divider"><span>or</span></div>
```

### Block 3 — Google Sign-In JavaScript (line ~327)
```js
/* [GOOGLE_AUTH_START] — Commented out: Google Sign-In JavaScript
  ... (all Google JS functions) ...
[GOOGLE_AUTH_END] */
```
**Remove the `/*` at the start and `*/` at the end.**

> **Note:** The backend route (`/api/auth/google`) and Google Client ID env variable (`GOOGLE_CLIENT_ID`) do NOT need any changes — they are still intact on the server side.
