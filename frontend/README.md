# AgriTrack Frontend — Multilingual System (Phase 12)

This frontend contains the React 19 application for **AgriTrack Smart Farm Management System** built with Vite.

## Features & Highlights

- **12 Indian Regional Languages**: English (`en`), Hindi (`hi`), Kannada (`kn`), Telugu (`te`), Tamil (`ta`), Marathi (`mr`), Bengali (`bn`), Gujarati (`gu`), Malayalam (`ml`), Punjabi (`pa`), Odia (`or`), Assamese (`as`).
- **Standardized i18n Architecture**: Powered by `i18next`, `react-i18next`, and `i18next-browser-languagedetector`.
- **Persistent Preferences**: Language preference persists in browser `localStorage` under `agritrack-language`.
- **Zero URL Path Distortion**: Seamlessly preserves all application routes without language path prefixes.
- **Dynamic Localization**: Numbers, currency (`₹`), acreage, weights, and dates adapt using active locale standards via `src/utils/formatters.js`.
- **Dual Selector Placement**: Language switcher available in `TopNavbar` and `ProfilePreferences`.

## Development Commands

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build
```
