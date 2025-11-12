## PassFort
Passfort — a small, privacy-first browser extension to generate strong passwords, measure password entropy, and check whether a password has appeared in known breaches using the Have I Been Pwned (HIBP) Pwned Passwords k-anonymity API.

Designed with a clean, dark “cybersecurity” UI and focused on local computation: password entropy is calculated in the popup and only the first 5 characters of the SHA-1 hash are sent to HIBP (k-anonymity), so full passwords are never transmitted.

## Features

- Generate secure, random passwords (configurable length).

- Calculate entropy (bits) and provide a clear strength label (Very Weak → Very Strong).

- Check breaches using HIBP Pwned Passwords API (k-anonymity range endpoint).

- Toggle password visibility and copy password to clipboard.

- Minimal, modern “cyber / pentest” inspired UI.

- Works entirely in the browser — no external server required other than HIBP for breach checks.
---

## Installation
### Prerequisites

- A modern Chromium-based browser (Chrome, Edge, Brave) or Firefox.

- No build tools required — the extension runs as-is from the source directory.
 
### Quick install (load unpacked extension)

- Clone or download the repository to your computer:

```
git clone https://github.com/<your-username>/PassFort.git
cd PassFort
```

- Load the extension in your browser:

**Chrome / Edge / Brave**
```
Open chrome://extensions/

Enable Developer mode (top-right)

Click Load unpacked

Select the PassFort project folder (the directory with manifest.json)
```
**Firefox**
```
Open about:debugging#/runtime/this-firefox

Click Load Temporary Add-on

Select manifest.json from the project folder

```
Once loaded you should see the PassFort icon in the toolbar — click it to open the popup.
---

## Usage

Click the PassFort toolbar icon to open the popup.

Type or paste a password into the field or click Generate to create a random password.

Click Analyze / Verify to:

compute entropy and show a strength label (Very Weak → Very Strong),

query HIBP (k-anonymity): only the first 5 characters of the SHA-1 hash of the password are sent.

Use the 👁️ button to toggle visibility and 📋 to copy the password to clipboard.
---

## Security & Privacy

Local-first design: entropy calculation and generation are done locally in the browser; the extension does not send raw passwords anywhere.

HIBP k-anonymity: the extension uses HIBP's range API — only the first 5 hex characters of the SHA-1 hash are sent. This is the recommended and privacy-preserving approach by HIBP.

No telemetry: the extension contains no analytics or telemetry by default.
---

## Troubleshooting

- “Nothing happens” on button click

Open the browser console for the popup (right-click popup → Inspect) and check for syntax errors.

Ensure manifest.json points to popup.html and that popup.js is included.

- Clipboard copy failing

Confirm you perform the copy action after a user gesture (click). Some browsers restrict clipboard access to user gestures.

- HIBP API errors

If the API call fails, ensure the browser can reach https://api.pwnedpasswords.com/ and that host_permissions allow it in your manifest.

HIBP sometimes rate-limits heavy usage; consider respecting rate limits if automating repeated checks.
---

## Developer notes

- Files of interest:

popup.html — extension popup UI

popup.css — styles (dark / cyber theme)

popup.js — core logic: generator, entropy calculation, HIBP check, copy/visibility handlers

- Entropy calculation:

Bits are computed using bits = length * log2(charsetSize) where charsetSize depends on the characters present (lower, upper, digits, symbols).

Strength label is derived from entropy thresholds — adjust thresholds in evaluateStrength() to taste.

- HIBP integration:

The extension computes the SHA-1 of the password, uppercases it, sends the first 5 hex characters to https://api.pwnedpasswords.com/range/<prefix>, then compares suffixes locally.
--- 

## Contributing

Contributions welcome — open an issue or a pull request.

- Recommended workflow:

Fork repository

Create a feature branch: git checkout -b feat/my-change

Implement changes & update README.md if needed

Open a PR and describe the change and why it helps

Please follow secure coding practices and avoid adding telemetry.
--- 

## Acknowledgements

Uses Have I Been Pwned Pwned Passwords k-anonymity API (https://haveibeenpwned.com/).

Inspired UI: dark cyber / pentester aesthetic.
