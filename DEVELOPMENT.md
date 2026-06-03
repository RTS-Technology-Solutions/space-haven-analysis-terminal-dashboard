# S.H.A.T. Command Center

**Space Haven Analysis Terminal Dashboard**

A retro terminal-style dashboard for analyzing Space Haven save files.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # Main header
│   ├── QuickStats.tsx  # Stats display
│   └── UploadZone.tsx  # File upload
├── styles/             # Global styles
│   ├── theme.css       # Design tokens
│   └── terminal.css    # Terminal UI styles
├── test/               # Test utilities
├── App.tsx             # Main app
└── main.tsx            # Entry point
```

## 🎨 Design System

The project uses a custom terminal-inspired design system with:
- **Color Palette**: Cyan, green, yellow, orange, red accents on dark backgrounds
- **Typography**: JetBrains Mono, Press Start 2P, Space Mono
- **Components**: Terminal panels, pixel-style progress bars, retro buttons

See full design documentation in the main README.

## 🔧 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vitest** - Testing
- **Firebase** - Hosting
- **GitHub Actions** - CI/CD

## 📦 Build & Deploy

### Development
```bash
npm run dev
```
Opens on http://localhost:3000

### Production Build
```bash
npm run build
```
Output in `dist/` directory

### Deploy to Firebase
```bash
# First time: Login and init
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 🔄 CI/CD Workflow

- **Push to `main`**: Runs tests and linting
- **Push to `prod`**: Runs tests, builds, and deploys to Firebase

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🌐 Live Site

- Production: https://shat-dash.labs.rtsts.tech
- Firebase: https://space-haven-analysis-terminal.web.app

## 📝 License

MIT - Fan project not affiliated with Space Haven or Bugbyte Ltd.
