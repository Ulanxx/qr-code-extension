# QR Code Extension

A modern Vue browser extension for QR code generation and scanning.

[中文文档](README-zh.md)

## Features

- Generate QR codes from any text or URL input
- Scan QR codes from images on web pages through context menu
- Pixel art style UI with retro tech green theme
- Copy QR code contents to clipboard automatically
- Download generated QR codes as PNG images
- Persistent storage of last used text

## Installation

1. Clone this repository
2. Install dependencies: `npm install` or `pnpm install`
3. Build the extension: `npm run build` or `pnpm run build`
4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode (toggle in the top right)
   - Click "Load unpacked" and select the `dist` directory

## Usage

### Generate QR Codes
1. Click on the extension icon in your browser toolbar
2. Enter text or a URL in the input field
3. Click "Generate QR Code"
4. Use the buttons to download or copy the QR code

### Scan QR Codes from Web Images
1. Right-click on any image on a webpage that contains a QR code
2. Select "Scan QR Code" from the context menu
3. The QR code content will be automatically copied to your clipboard

## Development

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development with watch mode
npm run dev
# or
pnpm run dev

# Build for production
npm run build
# or
pnpm run build
```

The project uses:
- Vue 3 for the popup UI
- Vite for bundling
- jsQR for QR code scanning
- qrcode.js for QR code generation

## Project Structure

```
/
├── dist/             # Compiled extension files
├── src/
│   ├── background.js   # Background script
│   ├── content.js      # Content script for QR scanning
│   ├── popup/
│       ├── Popup.vue     # Popup UI component
│       ├── popup.js     # Popup entry point
├── popup.html       # Popup HTML
├── script/          # Build scripts
├── vite.config.js   # Vite configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
