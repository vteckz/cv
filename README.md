# Linton Evans - 3D Interactive CV Portfolio

An impressive, interactive 3D CV website featuring:
- Animated 3D box that "unpacks" to reveal the portfolio
- 3D avatar with gestures and animations
- Text-to-speech narration of experience
- High-resolution WebGL graphics
- Autonomous navigation through CV sections

## Quick Start

### Option 1: Using Node.js (Recommended)

```bash
# Install Node.js first (if not installed)
# macOS: brew install node
# or download from https://nodejs.org

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Option 2: Using Python (No Node.js required)

```bash
# Navigate to the project folder
cd ~/Dev/3d-cv-portfolio

# Start a simple HTTP server with Python 3
python3 -m http.server 3000
```

Then open http://localhost:3000/standalone.html

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy.

## Features

- **3D Box Animation**: Click "Open My CV" to unpack the gift box
- **Avatar Narration**: The avatar will speak and gesture through your CV
- **Keyboard Controls**:
  - `Space` or `→` - Skip to next section
  - `←` - Go to previous section
  - `M` - Toggle audio mute
- **Navigation**: Use the dots at the bottom to jump to any section

## Tech Stack

- Three.js - 3D rendering
- GSAP - Professional animations
- Web Speech API - Text-to-speech
- Vite - Development & build tool

## Customization

Edit `src/data/cv-data.js` to update your CV content, including:
- Personal information
- Work experience
- Skills
- Education
- Certifications
- Speech scripts for narration

## Deployment

The built site can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

---
Built with Three.js | Designed for Linton Evans
