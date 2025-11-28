# Campus 360 Virtual Tour - Setup & Deployment Guide

## 🚀 Local Development

### Prerequisites
- Node.js 18+ installed
- Your university logo as `public/logo.svg` (replace the placeholder)
- 360° panorama images in `exported/` folder structure
- Thumbnails in `exported/thumbnails/` folder

### Quick Start
1. **Navigate to project directory:**
   ```powershell
   cd 'd:\New folder\test-1\campus-360'
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```

4. **Open browser to:** `http://localhost:5173/`

## 🎯 Features Implemented

### ✅ Core Features
- **Translucent Block Menu**: Scroll-friendly vertical menu with hover previews
- **360° Panorama Viewer**: Mouse drag, WASD/Arrow key controls
- **Auto-play Mode**: Gentle rotation and photo cycling when idle (3s timeout)
- **Smart Controls**: Hide/fade controls during interaction, show when needed
- **Mobile Responsive**: Touch-friendly on-screen directional controls
- **Fast Loading**: Uses thumbnails for quick previews, manifest.json for data
- **Navigation**: Left/right buttons to move within same block
- **Info Modal**: Bottom-right info button (populated from manifest data)
- **Frosted Glass UI**: Clean, minimal translucent backgrounds

### 🎮 Controls
- **Mouse**: Drag to look around
- **Keyboard**: WASD or Arrow keys for precise movement
- **Touch**: On-screen directional pad (mobile/tablet)
- **Navigation**: ◀ ▶ buttons to cycle photos within same building
- **Menu**: Click any block to jump to its first photo
- **Auto-play**: When idle, camera slowly rotates and advances photos

### 📱 Mobile Support
- Responsive design for phone/tablet
- Touch-friendly controls
- Collapsible menu for smaller screens
- Optimized layouts

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)
1. **Build the project:**
   ```powershell
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
   - OR connect your GitHub repo for continuous deployment
   - Get your public URL (e.g., `https://your-campus-tour.netlify.app`)

3. **Generate QR Code:**
   - Use any QR generator with your Netlify URL
   - Print/display for easy mobile access

### Option 2: Vercel
1. **Build and deploy:**
   ```powershell
   npm run build
   npx vercel --prod
   ```

### Option 3: Local + ngrok (Quick Testing)
1. **Keep dev server running:**
   ```powershell
   npm run dev
   ```

2. **Expose via ngrok (in new terminal):**
   ```powershell
   npx ngrok http 5173
   ```

3. **Share the ngrok URL** - generates QR code automatically

## 📁 File Structure Required

```
campus-360/
├── public/
│   ├── logo.svg          # Your university logo
│   └── exported/         # Your panorama files
│       ├── thumbnails/   # Fast-loading previews
│       ├── Block1/       # Building photos
│       ├── Block2/
│       ├── Gate_to_Logo/
│       ├── ARCHI/
│       └── OUT/          # Outside areas
└── src/
    └── data/
        └── manifest.json # Photo metadata
```

## 🔧 Customization

### Add Your Logo
Replace `public/logo.svg` with your university logo:
```powershell
# Copy your logo
Copy-Item "your-logo.png" "public/logo.svg"
```

### Update Block Information
Edit `src/data/manifest.json` to add:
- Block descriptions
- Contact information  
- Links to department pages
- Custom labels for locations

### Modify Auto-play Timing
In `ViewerPage.tsx`, adjust:
```javascript
3000  // Idle timeout (3 seconds)
10000 // Auto-advance timeout (10 seconds)
0.02  // Rotation speed
```

## 🎨 Extra Features Available

### Planned Enhancements
- **Search & Filter**: Find specific locations quickly
- **Favorites**: Bookmark interesting spots
- **Deep Links**: Share specific views with exact camera position
- **Analytics**: Track popular locations and user paths
- **Offline Mode**: Cache photos for offline viewing
- **Accessibility**: Screen reader support, keyboard navigation
- **Virtual Tours**: Guided paths between related locations
- **Interactive Hotspots**: Click to jump between connected areas

### Custom Styling
The UI uses Tailwind CSS classes. Key components:
- `BlockMenu.tsx` - Left sidebar menu
- `InfoModal.tsx` - Information overlay
- `ViewerPage.tsx` - Main viewer + controls

## 📊 Performance Tips

### Optimize Images
```powershell
# Compress panoramas (optional)
python compress_images.py

# Generate thumbnails (if needed)
python generate_thumbnails.py
```

### Fast Loading
- Thumbnails load first (small files)
- Full panoramas load on demand
- Next photo prefetched automatically

## 🔍 Troubleshooting

### Images Not Loading
- Check file paths in `manifest.json`
- Ensure `exported/` folder is in `public/`
- Verify thumbnail files exist

### Menu Not Showing
- Check `manifest.json` syntax
- Ensure blocks have `labs` array
- Verify API imports work

### Mobile Issues
- Test on actual devices
- Check touch event handlers
- Verify responsive breakpoints

## 🌟 QR Code Generation
For easy campus access, generate QR codes pointing to your deployed URL:
1. Use [QR Code Generator](https://www.qr-code-generator.com/)
2. Input your live URL
3. Print as posters/signs around campus
4. Include instructions: "Scan to explore campus in 360°"

---

**Ready to share your campus with the world! 🎓📱**