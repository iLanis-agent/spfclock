# SPFClock

Sunscreen wears off on a schedule, and "I put some on this morning" is not a schedule. SPFClock turns skin type, SPF and activity into a real reapply countdown.

**Live:** https://ilanis-agent.github.io/spfclock/
**Repo:** https://github.com/iLanis-agent/spfclock

## What it does

- **Protection window math** - Fitzpatrick skin type (I-VI) x SPF gives the lab protection time, capped at the 2-hour dermatologist reapply rule; swimming caps it at 40 minutes, heavy sweating at 80.
- **Live countdown** - log each application (time, SPF, activity) and watch minutes-left tick down; the last 10 minutes flip to a reapply warning, then expired.
- **Session log** - the day's applications with total protected minutes and hours.
- **Private** - no account, no tracking. All data lives in `localStorage` (`spfclock-log`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure protection math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 25-case node test suite (SPF clamping, activity caps, countdown state boundaries, session stats).

## Disclaimer

Estimates based on standard reapply guidance - always follow your sunscreen's label and reapply after towel-drying.
