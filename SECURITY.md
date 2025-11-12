# Security Policy

## Summary

Thank you for taking the time to report a security issue in **PassFort**. We take security and responsible disclosure seriously. This document explains how to report vulnerabilities, what information to include, and how we handle reports.

---

## Reporting a vulnerability

Preferred reporting method:

1. **Encrypted email** (PGP): send to `range.bay8483@eagereverest.com` using the project's PGP key (replace with actual address and key). If you need our public key, request it and we'll provide it.
2. **Alternative:** open a confidential issue on the repository and mark it as `security` (use GitHub's private security advisories if available) or contact via an existing maintainer's email.

**Do NOT** post proof-of-concept exploit code or sensitive details in a public issue or public forum.

### Required information for reports

When you report an issue, please include as much of the following information as possible to help us reproduce and triage the issue quickly:

* **Short summary** of the issue (one line).
* **Component / file(s)** affected (e.g. `popup.js`, `sha1Hex` logic, manifest, etc.).
* **Version(s) affected** (git tag, commit hash or branch). If unsure, indicate the commit you tested.
* **Steps to reproduce** (step-by-step). Be explicit.
* **Expected behavior** vs **actual behavior**.
* **Proof-of-concept** (minimal and safe) — include code snippets or attachments in an encrypted message if they are sensitive.
* **Impact assessment** (your view of the risk and potential impact).
* **Your contact information** (email, handle) and whether you want to be credited.

Optional but helpful:

* Operating system and browser (name + version).
* Any logs, screenshots, or network traces.

---

## What I will **not** do

* I will not share private contact information or internal investigation details publicly until coordinated disclosure.
* I will not penalize security researchers acting in good faith. Responsible disclosure is encouraged.

---

## Contact template (suggested)

```
Subject: [PassFort][SEC] - short title describing the issue

- Component: (file, module)
- Versions tested: (git commit / tag / branch)
- Browser / OS: (name & versions)
- Steps to reproduce:
  1. ...
  2. ...
- PoC (if safe / encrypted):
- Impact: (confidentiality, integrity, availability)
- Preferred contact: (email / handle)
- Disclosure preference: (coordinated / public / request CVE)
```

---

## Acknowledgements

I appreciate the efforts of security researchers and maintainers who help keep this project safe. If you would like to be credited, indicate that in your report.

---

## Contact placeholders

* Email (encrypted preferred): `security@your-domain.example`
* PGP public key: `-----BEGIN PGP PUBLIC KEY BLOCK-----\n...replace with actual key...\n-----END PGP PUBLIC KEY BLOCK-----`

---

*Last updated: 2025-11-12*
