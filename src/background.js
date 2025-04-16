
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 'lastQRText': '' });
  console.log('二维码生成器安装完成. Storage initialized.');
});
// 在 background.js 中添加以下代码

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanQRCode",
    title: "扫描二维码",
    contexts: ["image"]
  });
});

// 存储当前选中的图片信息
let currentImageInfo = null;

// 接收消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCurrentImageId') {
    currentImageInfo = {
      imageId: message.imageId,
      tabId: sender.tab.id,
      src: message.src
    };
  } else if (message.action === 'qrDetected') {
    // 处理扫描到的二维码内容
    chrome.storage.local.set({ 'lastQRText': message.content });
  }
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanQRCode") {
    if (currentImageInfo && tab.id === currentImageInfo.tabId) {
      // 向content script发送消息，要求扫描特定图片
      chrome.tabs.sendMessage(tab.id, {
        action: 'scanImage',
        imageId: currentImageInfo.imageId
      });
    }
  }
});