// Background script for the QR code extension
// This is typically used for persistent background operations

// Example: Set up initial storage values when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'lastQRText': '' });
  console.log('QR Code Extension installed. Storage initialized.');
});
