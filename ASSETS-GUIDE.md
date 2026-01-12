# Assets Guide - How to Get Real Images

## 🎯 The Problem

The `wati-wordpress` directory contains only PHP template files, not the actual image assets. The images are hosted on the live WordPress website.

## 📥 Solution: Download from WordPress Site

### Option 1: Download Script (Recommended)

Use the provided script to download all assets automatically:

```bash
# Download from default URL (wati.io)
./download-assets.sh

# Or specify custom WordPress URL
./download-assets.sh https://your-wordpress-site.com
```

This will download:
- ✅ Key feature images (ai-kf1, ai-kf2, ai-kf3)
- ✅ Icons (ai-icon1, ai-icon2, ai-icon3)
- ✅ Feature cards (card1-6)
- ✅ Background images
- ✅ SVG icons
- ✅ Background video

### Option 2: Manual Download

If the script fails, download manually from your WordPress site:

1. **Find the live URLs**:
   ```
   https://wati.io/wp-content/uploads/2025/12/ai-kf1new.png.webp
   https://wati.io/wp-content/uploads/2025/12/ai-icon1.png
   https://wati.io/wp-content/uploads/2025/12/card1.png
   ... etc
   ```

2. **Download each file**:
   ```bash
   cd public/images
   curl -O https://wati.io/wp-content/uploads/2025/12/ai-kf1new.png.webp
   mv ai-kf1new.png.webp ai-kf1.webp
   ```

### Option 3: Copy from WordPress Installation

If you have access to the WordPress server:

```bash
# SSH into WordPress server
ssh user@wordpress-server

# Find and tar the uploads
cd /path/to/wordpress/wp-content/uploads/2025/12
tar -czf assets.tar.gz *.png *.webp *.svg *.mp4

# Download to local
scp user@wordpress-server:/path/to/assets.tar.gz ./

# Extract
tar -xzf assets.tar.gz -C public/images/
```

## 📋 Required Files (from tpl-astra.php)

### Images
```
✅ ai-icon1.png
✅ ai-icon2.png  
✅ ai-icon3.png
✅ ai-kf1new.png.webp → ai-kf1.webp
✅ ai-kf2new.png.webp → ai-kf2.webp
✅ ai-kf3new.png.webp → ai-kf3.webp
✅ card1.png
✅ card2new.webp → card2.webp
✅ card3new.webp → card3.webp
✅ card4new.webp → card4.webp
✅ card5new.webp → card5.webp
✅ card6new.webp → card6.webp
✅ intergrations.webp → integrations.webp
✅ Background-table.png → table-bg.png
✅ round-arrow.png
✅ faq-bg.png
✅ World-Map.svg → world-map.svg
✅ ai-kfbg.png
✅ Add.png → add-icon.png
✅ arrowwhite.svg → arrow-white.svg
✅ blackarrow.svg → arrow-black.svg
```

### Video
```
✅ bgvideo2.mp4 → bgvideo.mp4
```

## 🔄 After Downloading

### 1. Update File Extensions in Code

Once you have real images, update `src/pages/astra.astro`:

```astro
<!-- Change from SVG placeholders -->
<img src="/images/ai-kf1.svg" />

<!-- To actual image format -->
<img src="/images/ai-kf1.webp" />
```

### 2. Batch Update Script

```bash
# Update key features
sed -i '' 's/ai-kf1\.svg/ai-kf1.webp/g' src/pages/astra.astro
sed -i '' 's/ai-kf2\.svg/ai-kf2.webp/g' src/pages/astra.astro
sed -i '' 's/ai-kf3\.svg/ai-kf3.webp/g' src/pages/astra.astro

# Update icons
sed -i '' 's/ai-icon1\.svg/ai-icon1.png/g' src/pages/astra.astro
sed -i '' 's/ai-icon2\.svg/ai-icon2.png/g' src/pages/astra.astro
sed -i '' 's/ai-icon3\.svg/ai-icon3.png/g' src/pages/astra.astro

# Update cards
sed -i '' 's/card1\.svg/card1.png/g' src/pages/astra.astro
sed -i '' 's/card2\.svg/card2.webp/g' src/pages/astra.astro
sed -i '' 's/card3\.svg/card3.webp/g' src/pages/astra.astro
sed -i '' 's/card4\.svg/card4.webp/g' src/pages/astra.astro
sed -i '' 's/card5\.svg/card5.webp/g' src/pages/astra.astro
sed -i '' 's/card6\.svg/card6.webp/g' src/pages/astra.astro

# Update backgrounds
sed -i '' 's/integrations\.svg/integrations.webp/g' src/pages/astra.astro
sed -i '' 's/table-bg\.svg/table-bg.png/g' src/pages/astra.astro
sed -i '' 's/round-arrow\.svg/round-arrow.png/g' src/pages/astra.astro
```

### 3. Remove SVG Placeholders

```bash
# Keep only world-map.svg and placeholder.svg
cd public/images
rm -f ai-*.svg card*.svg integrations.svg table-bg.svg round-arrow.svg faq-bg.svg
```

## 🔍 Verification

### Check Downloaded Files

```bash
# List all images with sizes
ls -lh public/images/

# Verify file types
file public/images/ai-kf1.webp
file public/images/ai-icon1.png

# Check video
file public/video/bgvideo.mp4
```

### Expected File Sizes

Real images should be much larger than placeholders:
- SVG placeholders: ~800 bytes
- Real PNG icons: 10-50 KB
- Real WebP images: 50-500 KB
- Real background images: 100 KB - 2 MB
- Video: 5-20 MB

## ⚠️ Common Issues

### Issue: Download Script Fails

**Cause**: WordPress URL incorrect or files not publicly accessible

**Solution**:
1. Check if site uses a different URL structure
2. Try accessing images directly in browser
3. May need authentication or VPN

### Issue: 404 Errors After Download

**Cause**: File paths in code don't match downloaded files

**Solution**:
1. Check file names match exactly
2. Update paths in `astra.astro`
3. Clear browser cache

### Issue: Images Look Different

**Cause**: Using placeholder SVGs instead of real images

**Solution**:
1. Verify file types: `file public/images/*`
2. Check file sizes are reasonable
3. Open images to inspect visually

## 📞 Need Help?

If you can't access the WordPress files:

1. **Contact site administrator** for asset export
2. **Use browser inspector** to find actual image URLs
3. **Screenshot and recreate** if absolutely necessary (not recommended)

## 🎨 Alternative: Use Design Assets

If you have access to design files (Figma, Sketch, etc.):

1. Export images at 2x resolution
2. Convert to WebP format
3. Optimize file sizes
4. Place in `public/images/`

---

**Current Status**: Using SVG placeholders  
**Next Step**: Run `./download-assets.sh` to get real images  
**After Download**: Update file extensions in `astra.astro`
