# Grace Health System — AI Command Center

CEO Demo Dashboard for Grace Health System's 12-agent AI platform.

## Deployment (Netlify)

1. Drag the `grace-health-dashboard` folder into [Netlify Drop](https://app.netlify.com/drop)
2. Or connect via GitHub:
   - Push this folder to `github.com/samrachsu/Ai-adoption-dashboard`
   - Set publish directory to `grace-health-dashboard`
   - No build command needed (static HTML)

## Files

- `grace-health-command-center.html` — Single self-contained dashboard (all CSS/JS inline)
- `README.md` — This file

## Features

- 7 tabs: Overview, Revenue Cycle, Clinical Operations, Patient Engagement, Compliance & Safety, Supply Chain, Agent Control
- Static snapshot data (no live API calls — maximum demo reliability)
- Live orchestrator trigger button (POST to n8n webhook)
- Real-time clock with LIVE indicator
- Responsive design

## Data

All data is 100% synthetic (Synthea + CMS DE-SynPUF). No real PHI.

## Tech

- Zero dependencies (single HTML file)
- Google Fonts (Inter) loaded via CDN
- n8n webhook: `POST https://samrachsu.app.n8n.cloud/webhook/orchestrator-run`
