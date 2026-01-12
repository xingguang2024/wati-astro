# Troubleshooting Guide

## Common Issues and Solutions

### 🖼️ Static Assets Returning 404

**Problem**: Images in `public/` folder show 404 errors in the browser.

**Root Cause**: The placeholder images were created as SVG files but had incorrect file extensions (`.webp`, `.png`), causing MIME type mismatch.

**Solution**: ✅ Fixed

1. Removed incorrectly named files
2. Created proper SVG placeholders with `.svg` extension
3. Updated all image paths in `astra.astro`

**How to Verify**:
```bash
# Check file types
file public/images/*.svg

# Should show: "SVG Scalable Vector Graphics image"
```

**Current Status**:
- ✅ All placeholder images use `.svg` extension
- ✅ All paths in `astra.astro` updated
- ✅ Images should load correctly now

### 📁 Public Folder Structure

Correct structure:
```
public/
├── favicon.svg
├── images/
│   ├── ai-icon1.svg
│   ├── ai-icon2.svg
│   ├── ai-icon3.svg
│   ├── ai-kf1.svg
│   ├── ai-kf2.svg
│   ├── ai-kf3.svg
│   ├── card1.svg
│   ├── card2.svg
│   ├── card3.svg
│   ├── card4.svg
│   ├── card5.svg
│   ├── card6.svg
│   ├── integrations.svg
│   ├── table-bg.svg
│   ├── round-arrow.svg
│   ├── faq-bg.svg
│   ├── world-map.svg
│   └── placeholder.svg
└── video/
    └── (video files go here)
```

### 🔄 Replacing Placeholder Images

When you have actual images:

1. **For WebP/PNG images**:
   ```bash
   # Place actual images in public/images/
   cp /path/to/actual/ai-kf1.webp public/images/
   
   # Update the path in astra.astro
   # Change: src="/images/ai-kf1.svg"
   # To:     src="/images/ai-kf1.webp"
   ```

2. **Batch replacement**:
   ```bash
   # Use the copy-assets.sh script
   ./copy-assets.sh
   
   # Then update paths in astra.astro
   ```

### 🚫 Dev Server Issues

**Problem**: Server not starting or showing errors

**Solutions**:

1. **Check if port is in use**:
   ```bash
   lsof -i :4321
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules .astro
   bun install
   bun run dev
   ```

3. **Check for TypeScript errors**:
   ```bash
   bunx astro check
   ```

### 🎨 Styles Not Applying

**Problem**: Tailwind classes not working

**Solutions**:

1. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   bun run dev
   ```

2. **Check Tailwind config**:
   ```bash
   # Verify astro.config.mjs has Tailwind plugin
   cat astro.config.mjs | grep tailwindcss
   ```

3. **Clear browser cache**:
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

### ⚛️ React Components Not Working

**Problem**: Interactive components (FAQ, Modal, etc.) not functioning

**Solutions**:

1. **Check client directive**:
   ```astro
   <!-- ✅ Correct -->
   <FAQ client:load />
   
   <!-- ❌ Wrong -->
   <FAQ />
   ```

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Verify React is loading

3. **Verify imports**:
   ```astro
   ---
   import FAQ from '../components/FAQ';  // ✅ Correct
   import FAQ from '../components/FAQ.tsx';  // ❌ Wrong
   ---
   ```

### 🔗 Links Not Working

**Problem**: Internal links showing 404

**Solutions**:

1. **Check route exists**:
   ```bash
   ls src/pages/
   # Verify the .astro file exists
   ```

2. **Use correct path**:
   ```astro
   <!-- ✅ Correct -->
   <a href="/astra">Astra Page</a>
   
   <!-- ❌ Wrong -->
   <a href="/astra.astro">Astra Page</a>
   ```

### 📱 Mobile Menu Not Working

**Problem**: Hamburger menu doesn't open

**Solutions**:

1. **Check JavaScript is loaded**:
   - Open browser console
   - Look for errors in `Header.astro` script

2. **Verify element IDs**:
   ```astro
   <button id="mobileMenuBtn">  <!-- Must match -->
   <div id="mobileMenu">        <!-- Must match -->
   ```

### 🎬 Video Not Playing

**Problem**: Background video doesn't play

**Solutions**:

1. **Check video file exists**:
   ```bash
   ls -lh public/video/bgvideo.mp4
   ```

2. **Verify video format**:
   ```bash
   file public/video/bgvideo.mp4
   # Should show: "ISO Media, MP4"
   ```

3. **Check video attributes**:
   ```html
   <!-- Required attributes for autoplay -->
   <video autoplay muted loop playsinline>
   ```

### 🐛 Console Errors

**Common errors and fixes**:

1. **"Cannot find module"**:
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   bun install
   ```

2. **"Unexpected token"**:
   - Check for syntax errors in components
   - Verify all imports are correct

3. **"hydration mismatch"**:
   - Ensure React component props are consistent
   - Check for conditional rendering issues

### 🔍 Debugging Tips

1. **Enable verbose logging**:
   ```bash
   bun run build -- --verbose
   ```

2. **Check Astro dev server logs**:
   ```bash
   # Logs are in terminal where you ran 'bun run dev'
   ```

3. **Use browser DevTools**:
   - Network tab: Check for 404s
   - Console tab: Check for JS errors
   - Elements tab: Inspect DOM

4. **Test in different browsers**:
   - Chrome/Edge
   - Firefox
   - Safari

### 📊 Performance Issues

**Problem**: Page loads slowly

**Solutions**:

1. **Optimize images**:
   ```bash
   # Use WebP format
   # Compress images
   # Add lazy loading
   ```

2. **Check bundle size**:
   ```bash
   bun run build
   # Check dist/ folder size
   ```

3. **Use Lighthouse**:
   - Open DevTools
   - Go to Lighthouse tab
   - Run audit

### 🚀 Deployment Issues

**Problem**: Site doesn't work after deployment

**Solutions**:

1. **Check build output**:
   ```bash
   bun run build
   # Verify no errors
   ```

2. **Test production build locally**:
   ```bash
   bun run preview
   ```

3. **Verify environment**:
   - Node version compatible
   - All dependencies installed
   - Build command correct

### 📞 Getting Help

If you're still stuck:

1. **Check documentation**:
   - [README.md](./README.md)
   - [USAGE.md](./USAGE.md)
   - [QUICK-START.md](./QUICK-START.md)

2. **Check official docs**:
   - [Astro Docs](https://docs.astro.build)
   - [Tailwind Docs](https://tailwindcss.com)
   - [React Docs](https://react.dev)

3. **Search for similar issues**:
   - Astro GitHub Issues
   - Stack Overflow
   - Discord communities

### 🛠️ Useful Commands

```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Check for errors
bunx astro check

# Clear cache
rm -rf .astro node_modules

# Reinstall dependencies
bun install

# Check file types
file public/images/*

# List running processes on port
lsof -i :4321

# View git changes
git status
git diff
```

---

**Last Updated**: 2026-01-12  
**Status**: Active troubleshooting guide
