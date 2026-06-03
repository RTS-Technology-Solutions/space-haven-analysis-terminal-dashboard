# Space Haven Analysis Terminal Dashboard
This repository contains the code for a dashboard that provides save file analysis for the game Space Haven. The dashboard is custom built, allowing users to easily upload their save files and visualize various aspects of their game progress.

## Features
- Upload Space Haven save files for analysis (XML format).
- Explore curated hierarchies such as System -> Ship -> Crew -> Skill -> Level.
- Visualize various aspects of game progress through interactive charts and graphs.
- Compare different save files to track progress over time.
- Generate insights and recommendations based on the analysis of the save files.

## Project Details
- **Project ID**: space-haven-analysis-terminal
- **Project Name**: Space Haven Analysis Terminal Dashboard
- **Infrastructure**: Google Cloud Platform (GCP)
- **Hosting Provider**: Firebase

## User Access
- https://shat-dash.labs.rtsts.tech (https://space-haven-analysis-terminal.web.app/)
- No auth required to upload and view basic save file metrics
- Login and GoogleOauth required for advanced features (AI insights, report generation, downloads)

---

## Design Framework

### Design Philosophy
This dashboard pays homage to Space Haven's pixel-art aesthetic while creating its own identity as a terminal-style analysis tool. The design embraces:
- **Retro Terminal UI**: Inspired by classic command-line interfaces and spacecraft computer systems
- **Low-Bit Graphics**: 8-16 bit style iconography and visual elements for metrics
- **Functional Brutalism**: Clean, purposeful design that prioritizes data clarity
- **Respectful Inspiration**: Original artwork that captures the spirit of Space Haven without copying assets

### Color Scheme

#### Primary Palette (Terminal Core)
```css
--terminal-bg-dark:    #0a0e1a;  /* Deep space background */
--terminal-bg-panel:   #121829;  /* Panel backgrounds */
--terminal-bg-overlay: #1a2235;  /* Elevated surfaces */
--terminal-border:     #2a3650;  /* Borders and dividers */
```

#### Accent Colors (Status & Alerts)
```css
--accent-cyan:         #00f7ff;  /* Primary accent - oxygen systems */
--accent-green:        #00ff88;  /* Success - hull integrity */
--accent-yellow:       #ffd700;  /* Warning - power systems */
--accent-orange:       #ff9500;  /* Caution - heat levels */
--accent-red:          #ff3366;  /* Critical - life support */
--accent-purple:       #b042ff;  /* Special - research/tech */
--accent-blue:         #4a9eff;  /* Info - navigation */
```

#### Text Colors
```css
--text-primary:        #e8f0ff;  /* Primary text */
--text-secondary:      #8fa3c1;  /* Secondary/muted text */
--text-tertiary:       #5a6f8f;  /* Disabled/placeholder */
--text-glow:           #00f7ff;  /* Glowing terminal text */
```

### Typography

#### Font Families
- **Primary UI Font**: `'JetBrains Mono', 'Fira Code', 'Courier New', monospace`
  - Use for all UI elements, data displays, and general text
  - Monospace reinforces terminal aesthetic
  
- **Headers/Titles**: `'Press Start 2P', 'Orbitron', monospace` (optional)
  - Use sparingly for main title and major section headers
  - Brings pixel-game nostalgia without overwhelming

- **Metrics Display**: `'Space Mono', 'Share Tech Mono', monospace`
  - Use for large numeric displays and key statistics

#### Font Sizing
```css
--font-xs:   0.75rem;  /* 12px - Labels, captions */
--font-sm:   0.875rem; /* 14px - Body text, secondary */
--font-base: 1rem;     /* 16px - Primary text */
--font-lg:   1.25rem;  /* 20px - Section headers */
--font-xl:   1.5rem;   /* 24px - Panel titles */
--font-2xl:  2rem;     /* 32px - Page title */
--font-3xl:  3rem;     /* 48px - Hero metrics */
```

### Visual Elements & Graphics

#### Pixel Art Guidelines
- **Grid**: Use 8x8 or 16x16 pixel grid for icons and small graphics
- **Color Depth**: Limit to 4-8 colors per icon (true low-bit aesthetic)
- **Metrics Visualization**: Consider pixel-style bar graphs, pie charts with chunky pixels
- **Icons**: 
  - Ship silhouettes (16x16)
  - Crew avatars (8x8 pixel heads)
  - Resource icons (oxygen tank, battery, food, etc.)
  - Status indicators (pixel hearts for health, stars for skills)

#### Scanline & CRT Effects
```css
/* Optional subtle scanline overlay */
.terminal-scanlines {
  background: linear-gradient(
    rgba(18, 24, 41, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
}

/* Subtle screen glow */
.terminal-glow {
  box-shadow: 
    inset 0 0 100px rgba(0, 247, 255, 0.03),
    0 0 20px rgba(0, 247, 255, 0.1);
}
```

#### Animation Patterns
- **Text Cursor**: Blinking cursor for input fields and loading states
- **Pixel Flicker**: Subtle flicker on accent colors (1-2% opacity variation)
- **Data Stream**: Scrolling data effect for live updates
- **Typing Animation**: Terminal-style text reveal for notifications
- **Progress Bars**: Chunky pixel-style with glowing fill

### Layout Structure

#### Single-Page Layout Zones
```
┌─────────────────────────────────────────┐
│  [TERMINAL HEADER]                      │ ← Title, upload button
├─────────────────────────────────────────┤
│  [QUICK STATS BAR]                      │ ← Key metrics in pixel style
├──────────────┬──────────────────────────┤
│              │                          │
│  [SHIP       │  [CREW OVERVIEW]         │
│   MANIFEST]  │  - Pixel avatars         │
│  - List view │  - Skill bars            │
│              │  - Health status         │
│              │                          │
├──────────────┴──────────────────────────┤
│  [RESOURCE TRACKING]                    │ ← Pixel charts
│  - O2, Power, Food, Materials           │
├─────────────────────────────────────────┤
│  [SYSTEM STATUS]                        │ ← Terminal-style logs
│  - Recent events, alerts                │
├─────────────────────────────────────────┤
│  [ADVANCED INSIGHTS]  🔒                │ ← Requires auth
│  - AI recommendations                   │
└─────────────────────────────────────────┘
```

#### Responsive Breakpoints
- **Desktop** (1200px+): Full layout as shown
- **Tablet** (768px-1199px): 2-column to 1-column transition
- **Mobile** (< 768px): Single column, collapsible sections

### Component Styling Guidelines

#### Panels & Cards
```css
.terminal-panel {
  background: var(--terminal-bg-panel);
  border: 2px solid var(--terminal-border);
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* Add corner brackets for terminal feel */
.terminal-panel::before,
.terminal-panel::after {
  content: '';
  /* CSS for corner brackets */
}
```

#### Buttons
```css
.btn-terminal {
  background: transparent;
  border: 2px solid var(--accent-cyan);
  color: var(--accent-cyan);
  font-family: 'JetBrains Mono', monospace;
  padding: 0.5rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.2s;
}

.btn-terminal:hover {
  background: var(--accent-cyan);
  color: var(--terminal-bg-dark);
  box-shadow: 0 0 20px rgba(0, 247, 255, 0.5);
}
```

#### Data Displays
- **Stat Cards**: Pixel icon + large number + label
- **Progress Bars**: 8px height, chunky pixel steps (0%, 25%, 50%, 75%, 100%)
- **Charts**: Consider using pixel-style libraries or custom SVG with stepped values
- **Tables**: Alternating row colors, monospace font, border lines

### Pixel Metrics Examples

#### Resource Gauge (ASCII/Pixel Style)
```
OXYGEN   [████████░░] 80% 
POWER    [██████████] 100%
FOOD     [███░░░░░░░] 30% ⚠️
HULL     [██████████] 100%
```

#### Skill Level Display
```
🔧 Engineering ★★★★☆ (4/5)
💊 Medical     ★★☆☆☆ (2/5)
🔫 Combat      ★★★☆☆ (3/5)
```

#### Ship Status Icon
```
    ▄▄█████▄▄
  ▄█░░░░░░░░░█▄
 █░░█████████░░█
 █░░░░░▄░▄░░░░░█  [SHIP-A]
 █░░█████████░░█  Status: ✓ OK
  ▀█░░░░░░░░░█▀
    ▀▀█████▀▀
```

### Interaction Patterns

#### File Upload Zone
- Dashed border with terminal color
- Icon: Pixel floppy disk or upload arrow
- Drag-and-drop with glow effect on hover
- Success: Green checkmark with pixel burst animation
- Error: Red alert with shake animation

#### Loading States
```
PARSING SAVE FILE...
[▓▓▓▓▓░░░░░] 50%

or

ANALYZING DATA ▓▓▓ (animated dots)
```

#### Tooltips
- Terminal-style boxes with monospace text
- Border with slight glow
- Arrow/pointer made of ASCII characters

### Accessibility Considerations
- Maintain WCAG AA contrast ratios (cyan on dark bg meets this)
- Provide text alternatives for pixel graphics
- Keyboard navigation with visible focus states (glowing border)
- Screen reader labels for all interactive elements
- Option to disable animations/effects

### Technical Stack Recommendations
- **Framework**: React or Vue.js for component-based architecture
- **Styling**: CSS-in-JS (styled-components) or Tailwind CSS with custom config
- **Charts**: Chart.js or D3.js with custom theming
- **Icons**: Custom pixel art SVGs
- **Fonts**: Google Fonts (Press Start 2P, JetBrains Mono, Space Mono)

---

## Development Setup

### Prerequisites
- Node.js 18+
- Firebase CLI
- Google Cloud SDK (for GCP integration)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd space-haven-analysis-terminal-dashboard

# Install dependencies
npm install

# Set up Firebase
firebase login
firebase use space-haven-analysis-terminal

# Run development server
npm run dev
```

### Environment Variables
```env
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_PROJECT_ID=space-haven-analysis-terminal
VITE_FIREBASE_AUTH_DOMAIN=space-haven-analysis-terminal.firebaseapp.com
```

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

## Project Structure
```
space-haven-analysis-terminal-dashboard/
├── src/
│   ├── components/         # React components
│   │   ├── metrics/        # Metric display components
│   │   ├── panels/         # Panel/section components
│   │   └── ui/             # Reusable UI elements
│   ├── styles/            
│   │   ├── theme.css       # Color scheme & variables
│   │   └── terminal.css    # Terminal-specific styles
│   ├── assets/
│   │   ├── icons/          # Pixel art icons (SVG)
│   │   └── fonts/          # Custom fonts
│   ├── utils/
│   │   └── parser.js       # XML save file parser
│   └── App.jsx             # Main app component
├── public/
├── firebase.json
└── package.json
```

---

## Contributing
This is a community project for Space Haven fans! Contributions welcome:
- Submit pixel art assets
- Improve data parsing
- Add new metric visualizations
- Report bugs or suggest features

---

## License
MIT License - This is a fan-made tool and is not affiliated with Bugbyte Ltd. or the official Space Haven game.

## Credits
- **Space Haven** by Bugbyte Ltd. - Original game that inspired this project
- Design inspired by retro terminal UIs and classic sci-fi interfaces
- Built with ❤️ for the Space Haven community