# Astra AI Agent Landing Page

This is a modern landing page for Astra AI Agent, rebuilt with Astro + Tailwind CSS + React from the original WordPress PHP template.

## 🚀 Tech Stack

- **Astro 5.x** - Modern static site generator
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **React 19.x** - For interactive components
- **TypeScript** - Type safety

## 📁 Project Structure

```
/
├── public/
│   ├── images/          # Image assets
│   │   ├── ai-kf1.webp
│   │   ├── ai-kf2.webp
│   │   ├── ai-kf3.webp
│   │   ├── ai-icon1.png
│   │   ├── ai-icon2.png
│   │   ├── ai-icon3.png
│   │   ├── card1.png
│   │   ├── card2.webp
│   │   ├── card3.webp
│   │   ├── card4.webp
│   │   ├── card5.webp
│   │   ├── card6.webp
│   │   ├── integrations.webp
│   │   ├── world-map.svg
│   │   ├── table-bg.png
│   │   └── round-arrow.png
│   └── video/
│       └── bgvideo.mp4  # Background video
├── src/
│   ├── components/
│   │   ├── Header.astro           # Navigation bar
│   │   ├── Footer.astro           # Footer
│   │   ├── FAQ.tsx                # FAQ interactive component (React)
│   │   ├── ComparisonTable.tsx    # Comparison table component (React)
│   │   └── BookDemoModal.tsx      # Book demo modal (React)
│   ├── layouts/
│   │   └── Layout.astro           # Main layout
│   ├── pages/
│   │   └── astra.astro            # Astra landing page
│   └── styles/
│       └── global.css             # Global styles
└── package.json
```

## 🎨 Main Features

### Static Components (Astro)
- ✅ Responsive navigation bar and footer
- ✅ Hero Banner with background video
- ✅ Voice Agent demo section
- ✅ Key features showcase
- ✅ Performance metrics display
- ✅ Integrations showcase
- ✅ Features grid

### Interactive Components (React)
- ✅ **FAQ Component** - Collapsible FAQ accordion
- ✅ **Comparison Table** - Desktop table + Mobile tab switching
- ✅ **Book Demo Modal** - Form popup

## 🛠️ Development Guide

### Install Dependencies

```bash
bun install
# or
npm install
```

### Start Development Server

```bash
bun run dev
# or
npm run dev
```

Visit `http://localhost:4321/astra` to view the page

### Build for Production

```bash
bun run build
# or
npm run build
```

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

## 📸 Required Assets

Please place the following asset files in their respective directories:

### Images (`public/images/`)
- `ai-kf1.webp` - Key feature 1 screenshot
- `ai-kf2.webp` - Key feature 2 screenshot
- `ai-kf3.webp` - Key feature 3 screenshot
- `ai-icon1.png` - Icon 1 (Near-human conversations)
- `ai-icon2.png` - Icon 2 (Real-time latency)
- `ai-icon3.png` - Icon 3 (Best-in-class accuracy)
- `card1.png` - Feature card 1
- `card2.webp` - Feature card 2
- `card3.webp` - Feature card 3
- `card4.webp` - Feature card 4
- `card5.webp` - Feature card 5
- `card6.webp` - Feature card 6
- `integrations.webp` - Integrations background
- `world-map.svg` - World map SVG
- `table-bg.png` - Table background
- `round-arrow.png` - Round arrow decoration

### Video (`public/video/`)
- `bgvideo.mp4` - Hero Banner background video

## 🎯 Key Improvements

### Advantages Over Original PHP Template

1. **Performance Optimization**
   - Uses Astro's Partial Hydration
   - React only for interactive components
   - Static generation for blazing fast loading

2. **Modern Development Experience**
   - TypeScript type safety
   - Component-based development
   - Tailwind CSS utility classes
   - Hot Module Replacement (HMR)

3. **Better Maintainability**
   - Component separation with clear responsibilities
   - Tailwind for easy style customization
   - Clean code structure

4. **Responsive Design**
   - Mobile-first approach
   - Complete responsive support
   - Optimized mobile interactions

## 🔧 Customization

### Modify Color Theme

Customize colors in Tailwind config or use custom color classes directly in components.

### Change Fonts

Modify the Google Fonts link in `Layout.astro`.

### Add More Pages

Create new `.astro` files in the `src/pages/` directory.

## 📝 Notes

1. Ensure all image and video assets are properly placed
2. Video files can be large - recommend optimization/compression
3. Use WebP format for images for better performance
4. Modal form component can integrate HubSpot or other form services

## 🚀 Deployment

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy --prod
```

### Other Platforms

Built files are in the `dist/` directory and can be deployed to any static hosting service.

## 📋 Documentation

- **Quick Start**: [QUICK-START.md](./QUICK-START.md)
- **Usage Guide**: [USAGE.md](./USAGE.md)
- **Project Summary**: [PROJECT-SUMMARY.md](./PROJECT-SUMMARY.md)
- **Coding Standards**: [CODING-STANDARDS.md](./CODING-STANDARDS.md) ⚠️ **Important**

## ⚠️ Important Note

**All documentation and code comments MUST be written in English.**

Please refer to [CODING-STANDARDS.md](./CODING-STANDARDS.md) for complete coding guidelines.

## 📄 License

MIT

## 👥 Contributing

Issues and Pull Requests are welcome! Please follow our [coding standards](./CODING-STANDARDS.md).
