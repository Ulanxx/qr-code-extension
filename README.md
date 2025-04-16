# QR Code Extension

The simplest Vue browser extension for converting text to QR codes.

## Features

- Generate QR codes for the current webpage URL
- Create QR codes from selected text

## Installation

1. Clone this repository
2. Load the extension in your browser:
   - Chrome: Open `chrome://extensions/`, enable Developer mode, and click "Load unpacked"
   - Firefox: Open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file in the extension directory

## Usage

1. Click on the extension icon in your browser toolbar
2. The QR code for the current page will be displayed
3. To generate a QR code for specific text, select the text on the page before clicking the extension icon

## Development

```
pnpm install   # Install dependencies
pnpm run build # Build the extension
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
