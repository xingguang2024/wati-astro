# Astra Landing Page Usage Guide

## 🎯 Project Overview

This is an Astra AI Agent landing page rebuilt with **Astro + Tailwind CSS + React**, fully based on the original WordPress PHP template (`tpl-astra.php`) design and functionality.

## 🚀 Quick Start

### 1. Start Development Server

```bash
cd /Users/sternelee/www/wati/wati-astro
bun run dev
```

Visit: **http://localhost:4321/astra**

### 2. View Pages

The development server is running. You can access the following pages:

- Home: `http://localhost:4321/`
- Astra Landing Page: `http://localhost:4321/astra`

## 📁 Project Structure

```
wati-astro/
├── src/
│   ├── components/          # Components directory
│   │   ├── Header.astro     # Navigation bar (static)
│   │   ├── Footer.astro     # Footer (static)
│   │   ├── FAQ.tsx          # FAQ component (React, interactive)
│   │   ├── ComparisonTable.tsx  # Comparison table (React, interactive)
│   │   └── BookDemoModal.tsx    # Book demo modal (React)
│   ├── layouts/
│   │   └── Layout.astro     # Main layout template
│   ├── pages/
│   │   ├── index.astro      # Home page
│   │   └── astra.astro      # Astra landing page ⭐
│   └── styles/
│       └── global.css       # Global styles (Tailwind)
├── public/
│   ├── images/              # Image assets
│   └── video/               # Video assets
└── package.json
```

## 🎨 Main Feature Modules

### 1. Hero Banner
- ✅ Background video effect
- ✅ Gradient title
- ✅ CTA buttons
- ✅ YouTube video embed

### 2. Voice Agent Demo
- ✅ iframe embed demo
- ✅ Responsive layout

### 3. Key Features
- ✅ Three feature cards
- ✅ Image-text mixed layout
- ✅ Responsive flip (mobile)

### 4. Why Build with Astra
- ✅ Three-column feature display
- ✅ Icon + title + description

### 5. Performance Metrics
- ✅ Four statistics cards
- ✅ World map background

### 6. Integrations
- ✅ Dark background
- ✅ Bottom image showcase

### 7. Features Grid
- ✅ 6 feature cards
- ✅ Responsive grid layout

### 8. Comparison Table ⭐ React Component
- ✅ Desktop: Full table
- ✅ Mobile: Tab switching
- ✅ Gradient border effect
- ✅ Interactive switching

### 9. FAQ ⭐ React Component
- ✅ Accordion effect
- ✅ Smooth expand/collapse
- ✅ First item open by default
- ✅ Rotating arrow animation

### 10. Modal ⭐ React Component
- ✅ Click button to open
- ✅ Form loading animation
- ✅ Click outside to close
- ✅ Can integrate HubSpot form

## 🔧 Technical Features

### Astro Advantages
1. **Partial Hydration**
   - Only interactive components use React
   - Other parts completely static
   - Extremely fast loading speed

2. **Zero JS by Default**
   - Static components don't ship JS
   - Interactive components load on-demand

3. **Multi-Framework Support**
   - Can mix React, Vue, Svelte, etc.

### Tailwind CSS
- Utility-first CSS framework
- Simple responsive design
- Easy to customize and maintain
- Automatic purging of unused styles in production

### React Components
Load using `client:load` directive:
```astro
<FAQ client:load />
<ComparisonTable client:load />
```

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile Optimizations
- ✅ Hamburger menu
- ✅ Stacked layout
- ✅ Touch-friendly interactions
- ✅ Optimized font sizes

## 🎨 Custom Styles

### Color Scheme
```css
/* Primary colors */
--primary: #1A3478
--gradient: linear-gradient(90deg, #8564FF, #4D71FF, #E26C90)

/* Neutral colors */
--zinc-50: #fafafa
--zinc-700: #3f3f46
--zinc-900: #18181b
```

### Fonts
- **Primary Font**: DM Sans (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800

## 🖼️ Asset Files

### Current Status
- ✅ Placeholder images created
- ⚠️ Need to replace with actual design images

### Replace Assets
1. Place actual images in `public/images/`
2. Place videos in `public/video/`
3. Keep filenames consistent

### Copy from WordPress
If you have WordPress asset files:
```bash
./copy-assets.sh
```

## 🔗 Link Configuration

### Links to Update
Search and replace in `src/pages/astra.astro`:

1. **Registration Link**
   ```astro
   href="https://astra.wati.io/register/"
   ```

2. **Login Link**
   ```astro
   href="https://astra.wati.io/login"
   ```

3. **Voice Demo iframe**
   ```astro
   src="https://dev-astra.watiapp.io/voice-demo"
   ```

4. **YouTube Video**
   ```astro
   src="https://www.youtube.com/embed/HdTLh4loRB4"
   ```

## 🧪 Testing Checklist

### Desktop
- [ ] Navigation bar fixed positioning
- [ ] Hero Banner video plays
- [ ] All buttons clickable
- [ ] FAQ expand/collapse
- [ ] Comparison table displays correctly
- [ ] Modal opens/closes
- [ ] Footer links work

### Mobile
- [ ] Hamburger menu works
- [ ] Layout stacks correctly
- [ ] Comparison table tabs switch
- [ ] Touch interactions smooth
- [ ] Text readability

### Performance
- [ ] First load < 3s
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Image lazy loading

## 🚀 Deployment

### Build for Production
```bash
bun run build
```

### Preview Production Build
```bash
bun run preview
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 📝 TODO Items

### Must Complete
- [ ] Replace placeholder images with actual designs
- [ ] Add background video file
- [ ] Integrate HubSpot form in Modal
- [ ] Update all links to production URLs
- [ ] SEO optimization (meta tags)

### Optional Enhancements
- [ ] Add page transition animations
- [ ] Add scroll animations (AOS)
- [ ] Optimize images (WebP + lazy loading)
- [ ] Add Google Analytics
- [ ] Add Cookie consent banner

## 💡 Tips

### Development Tips
1. **Hot Reload**: Auto-refresh after file changes
2. **Type Checking**: TypeScript provides type safety
3. **Tailwind IntelliSense**: Install VS Code extension for autocomplete

### Debugging
```bash
# View build details
bun run build -- --verbose

# Check type errors
bunx astro check
```

### Performance Optimization
1. Use WebP format for images
2. Compress video files
3. Enable CDN
4. Use image lazy loading

## 🆘 Common Issues

### Q: Blank page?
A: Check console errors, ensure all asset files exist

### Q: React components not working?
A: Make sure you use the `client:load` directive

### Q: Styles not applying?
A: Check Tailwind config and global.css import

### Q: Video not playing?
A: Ensure video file exists and format is correct (MP4)

## 📞 Support

For issues, please check:
- Astro Docs: https://docs.astro.build
- Tailwind Docs: https://tailwindcss.com
- React Docs: https://react.dev

---

**Happy Coding!** 🎉
