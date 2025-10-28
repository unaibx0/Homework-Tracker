# PWA Icons

Place your PWA icons in this folder. Required sizes:

## Required Icon Sizes:
- `icon-192.png` - 192x192px (for home screen)
- `icon-512.png` - 512x512px (for splash screen and high-res displays)

## Recommended Icon Sizes (optional):
- `icon-72.png` - 72x72px
- `icon-96.png` - 96x96px
- `icon-128.png` - 128x128px
- `icon-144.png` - 144x144px
- `icon-152.png` - 152x152px
- `icon-384.png` - 384x384px

## Icon Guidelines:
- Use PNG format with transparent background
- Design should be simple and recognizable at small sizes
- Use the app's primary colors
- Test on different backgrounds (light/dark themes)

## Current Manifest Configuration:
The manifest.json references `/icon-192.png` and `/icon-512.png` from the root public folder.
If you place icons here, update the manifest.json paths to `/icons/icon-192.png` and `/icons/icon-512.png`.