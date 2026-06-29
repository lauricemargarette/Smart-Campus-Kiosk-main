# Smart Campus Navigation & Concierge Kiosk

A touchscreen kiosk web app built for **ICCT Colleges – Cainta Campus** that helps students and visitors find their way around the school. It shows an interactive indoor map, calculates step-by-step directions to any office or room, answers common registrar/admin questions through a built-in chatbot, and can hand off a route to a visitor's phone via QR code.

This project was developed and defended as a capstone project.

## Features

- **Welcome / idle screen** — animated splash screen with the campus branding; tapping anywhere starts a kiosk session and (where supported) puts the browser into fullscreen.
- **Interactive campus map** (`/map`) — SVG floor plans per building and floor, with pin markers for every room, office, lab, and facility.
- **Indoor pathfinding** — an A\* search over a hand-mapped graph of rooms and walkways (`src/data/campusData.js`) calculates the shortest route from the kiosk's fixed location to any destination, then converts that path into plain-language, turn-by-turn directions.
- **Search & on-screen keyboard** — a touch-friendly virtual keyboard on the Home screen for looking up a destination by name.
- **Building cards with mini floor maps** — flip-style cards on the Home screen preview each building's layout floor by floor.
- **QR hand-off** (`/directions`) — generates a QR code so a visitor can scan it and continue following directions on their own phone (`MobilePage`), useful for routes that continue outside after leaving the kiosk's view.
- **Concierge chatbot** — a local, keyword-matched assistant with a built-in knowledge base covering common registrar/accounting/student-services questions (e.g. where to claim a Summary of Grades, where to process a TOR, graduation requirements, etc.), with replies that link straight to the relevant location on the map.
- **Idle timeout** — automatically returns the kiosk to the welcome screen after a period of inactivity, with a countdown warning so an active user can stay on the page.
- **Light/dark theme toggle** for the main kiosk screens.
- **Admin panel** (`/admin`) — a demo-credential gated dashboard for managing locations and reviewing kiosk data (see [Admin access](#admin-access) below).
- **Directory page** (`/directory`) — currently a placeholder, not yet implemented.

## Tech stack

- **React 19** + **React Router v7** for the UI and page routing
- **Vite** as the build tool and dev server
- **Framer Motion** for page transitions and animations
- **qrcode.react** to render the QR code on the directions hand-off screen
- **ogl** for WebGL-based visual effects (background strands/particle effects)
- **ESLint** for linting

## Project structure

```
src/
├── App.jsx                  # Route definitions & page transition wrapper
├── Theme.js                 # Light/dark theme definitions
├── data/
│   └── campusData.js        # Room/location graph, edges, A* pathfinding, directions generator
└── components/pages/
    ├── WelcomePage.jsx       # Idle splash / start screen        → "/"
    ├── Home.jsx              # Main kiosk home, search, building cards → "/home"
    ├── MapPage.jsx            # Interactive map & route display   → "/map"
    ├── MobilePage.jsx         # Mobile hand-off view (via QR)      → "/directions"
    ├── DirectoryPage.jsx      # Staff/faculty directory (WIP)      → "/directory"
    ├── AdminPage.jsx          # Admin login & dashboard            → "/admin"
    ├── ChatBot.jsx            # Concierge chatbot + knowledge base
    ├── IdleTimeout.jsx        # Inactivity detection & auto-reset
    ├── ShinyText.jsx          # Animated text effect
    └── Strands.jsx / .css     # Background visual effect
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/lauricemargarette/Smart-Campus-Kiosk-main.git
cd Smart-Campus-Kiosk-main
npm install
```

### Run in development

```bash
npm run dev
```

This starts the Vite dev server (with hot module reload). Open the printed local URL in your browser — ideally in a touchscreen browser window or device to get the intended kiosk experience.

### Build for production

```bash
npm run build
```

Outputs a production-ready build to the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Usage notes

- **Kiosk location**: the app assumes a single, fixed kiosk position (defined as `KIOSK_NODE_ID` in `campusData.js`) as the starting point for every route. To deploy this at a different physical spot, update the kiosk's coordinates and connecting edges in that file.
- **Testing on a phone via QR code**: the QR hand-off on `/directions` needs the kiosk and the visitor's phone to reach the same dev server. When testing locally across devices (e.g. via [ngrok](https://ngrok.com/)), add your tunnel hostname to the `server.allowedHosts` array in `vite.config.js`.
- **Admin access**: the `/admin` route currently uses hardcoded demo credentials defined directly in `AdminPage.jsx` (`DEMO_USERS`) and is intended to be replaced with real authentication (e.g. JWT-based) before any production use. **Do not use these credentials or this auth approach in a real deployment.**
- **Idle timeout**: by default the kiosk returns to the welcome screen after a short period of inactivity (see `IDLE_TIME` in `IdleTimeout.jsx`), with a 10-second warning countdown beforehand. Adjust these constants to change kiosk session behavior.

## Known limitations / planned work

- The Directory page is a placeholder and has not been built out yet.
- Admin authentication is a local demo stub, not a real backend.
- The chatbot's knowledge base is static and keyword-matched rather than connected to a live data source — updates to office locations or procedures require editing `ChatBot.jsx` directly.

## Acknowledgments

Developed as a capstone project for ICCT Colleges – Cainta Campus.