# Brand Logos Directory

This directory contains local brand logo images used across the application.

## Logo Cascading Strategy

The application uses a 3-tier fallback system:

1. **Local Logos** (this directory) - Fastest, best quality
2. **Google Favicons** - Universal fallback for any domain
3. **Brand Name Text** - Final fallback

## File Naming Convention

Logo files must follow this naming pattern:
- Convert brand name to lowercase
- Replace spaces and special characters with hyphens
- Remove leading/trailing hyphens

**Examples:**
- `apple.svg` → Apple
- `samsung.svg` → Samsung
- `callya-vodafone.svg` → CallYa Vodafone
- `bang-olufsen.svg` → Bang & Olufsen
- `t-mobile.svg` → T-Mobile

## Supported File Formats

Preferred order:
1. `.svg` (vector, scales perfectly) - **RECOMMENDED**
2. `.png` (transparent background recommended)
3. `.jpg` (use only if no other option)

The component will automatically try `.svg` first.

## Where to Get Free Brand Logos

### 1. Wikimedia Commons (Free, Open Source)
**Best source for legally free brand logos**

- URL: https://commons.wikimedia.org
- Search: "Brand Name logo"
- Look for: Files with permissive licenses (Public Domain, CC0, CC-BY)
- Download: SVG format when available

**Example searches:**
- https://commons.wikimedia.org/wiki/File:Apple_logo_black.svg
- https://commons.wikimedia.org/wiki/File:Samsung_Logo.svg
- https://commons.wikimedia.org/wiki/File:Google_2015_logo.svg

### 2. Simple Icons
- URL: https://simpleicons.org
- Free SVG brand icons
- Consistent style across brands
- MIT licensed

### 3. WorldVectorLogo
- URL: https://worldvectorlogo.com
- Large collection of brand logos
- Check individual licenses

### 4. Brands of the World
- URL: https://www.brandsoftheworld.com
- Vector logo database
- Various licenses (check each)

## Adding Logos

### Manual Process:

1. Download the logo file (preferably SVG)
2. Rename to match the brand slug (see naming convention above)
3. Place in this directory: `/public/logos/`
4. Optimize if needed (remove unnecessary metadata)

### Bulk Download Script (Coming Soon):

```bash
# Run this script to download logos for all mapped brands
npm run download-logos
```

## Logo Guidelines

### Quality Requirements:
- **Format:** SVG preferred, PNG as fallback
- **Size:** Minimum 128x128px for raster images
- **Background:** Transparent (for PNG)
- **Color:** Full color (grayscale will be applied via CSS if needed)

### Optimization:
- Remove unnecessary metadata
- Compress PNG files
- Minify SVG files
- Keep file size under 50KB when possible

## Current Priority List

High priority brands to add first (most commonly used):

### Phones & Mobile:
- [ ] apple.svg
- [ ] samsung.svg
- [ ] google.svg
- [ ] xiaomi.svg
- [ ] oneplus.svg
- [ ] nokia.svg
- [ ] motorola.svg

### Telecom:
- [ ] vodafone.svg
- [ ] t-mobile.svg
- [ ] att.svg
- [ ] verizon.svg
- [ ] orange.svg

### Gaming:
- [ ] nintendo.svg
- [ ] playstation.svg
- [ ] xbox.svg
- [ ] steam.svg

### Laptops:
- [ ] microsoft.svg
- [ ] lenovo.svg
- [ ] asus.svg
- [ ] hp.svg
- [ ] dell.svg

### Audio:
- [ ] jbl.svg
- [ ] bose.svg
- [ ] beats.svg
- [ ] sennheiser.svg

## Example: Adding Apple Logo

1. Go to: https://commons.wikimedia.org/wiki/File:Apple_logo_black.svg
2. Download the SVG file
3. Rename to: `apple.svg`
4. Place in: `/public/logos/apple.svg`
5. Done! The component will now use the local logo instead of fetching from Google

## Testing

After adding logos, test them by:

1. Clearing browser cache
2. Visiting the brands page: http://localhost:3000/brands
3. Checking browser console for any 404 errors
4. Verifying logos display correctly

## Fallback Behavior

If a local logo is not found or fails to load:
- Component automatically tries Google Favicon
- If Google Favicon fails, shows brand name as text
- No console errors, graceful degradation

## Legal Notice

⚠️ **Important:** Only use logos that you have the right to use.

- Prefer logos with permissive licenses (Public Domain, CC0, CC-BY)
- Check license requirements for each logo
- Attribute when required by license
- Remove logos if requested by brand owner

## Need Help?

If you need assistance adding logos, contact the development team or see the main project README.
