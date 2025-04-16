import jsQR from "jsqr";

// content.js - 二维码扫描功能
console.log("QR code scanner content script activated");

// 主函数：为页面上的所有图片添加扫描功能
function addScanButtonsToImages() {
  // 获取页面上所有图片
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // 检查图片尺寸，太小的图片可能不是二维码
    if (img.width < 40 || img.height < 40) {
      return;
    }
    // 添加右键菜单功能
    setupContextMenu(img);
  });
}

// 在图片上添加右键菜单
function setupContextMenu(img) {
  // 为图片添加标识
  const imageId = `qr-img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  img.dataset.qrImageId = imageId;

  // 添加右键点击事件监听器
  img.addEventListener("contextmenu", function (e) {
    // 设置当前选中的图像ID到localStorage，供background脚本读取
    try {
      chrome.runtime.sendMessage({
        action: "setCurrentImageId",
        imageId: imageId,
        src: img.src,
      });
    } catch (error) {
      console.error("发送消息失败:", error);
      // 如果是扩展上下文无效的错误，不做额外处理
    }
  });
}

// 扫描图片中的二维码
function scanQRCode(img) {
  // 创建canvas来处理图像
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  // 绘制图像到canvas
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  // 获取图像数据
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // 在实际应用中，这里会使用jsQR或其他库来解码二维码
  // 这里我们模拟一个解码过程
  try {
    // 这里假设已经解码成功并获得了结果
    // 实际使用时需要替换为真实的二维码解码逻辑
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    console.log("code ===>", code);
    // 发送消息到background.js
    try {
      // 使用传统的 execCommand 方法复制到剪贴板
      const copyText = (text) => {
        // 创建一个临时的文本区域元素
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';  // 避免滚动到视图中
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          // 执行复制命令
          const successful = document.execCommand('copy');
          if (successful) {
            console.log("QR code copied to clipboard");
          } else {
            console.error('Failed to copy QR code');
          }
        } catch (err) {
          console.error('Failed to copy QR code:', err);
        } finally {
          // 清理临时元素
          document.body.removeChild(textArea);
        }
      };
      
      // 复制二维码内容
      copyText(code.data);
      
      // 发送消息到 background.js
      chrome.runtime.sendMessage({
        action: "qrDetected",
        content: code.data,
      });
    } catch (error) {
      console.error("发送二维码结果失败:", error);
      // 如果扩展上下文无效，尝试使用其他方式处理结果
      if (error.message.includes("Extension context invalidated")) {
        // 可以考虑使用其他方式处理结果，比如直接显示在页面上
        alert("二维码内容: " + code.data);
      }
    }
  } catch (error) {
    showError("未检测到二维码或处理图像时出错");
    console.error("QR code scanning error:", error);
  }
}

// 显示错误信息
function showError(message) {
  console.error(message);
  alert(message);
}

// 监听来自background.js的消息
try {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scanImage") {
      // 查找对应ID的图片并扫描
      const targetImage = document.querySelector(
        `img[data-qr-image-id="${message.imageId}"]`
      );
      if (targetImage) {
        scanQRCode(targetImage);
      }
    }
  });
} catch (error) {
  console.error("注册消息监听器失败:", error);
  // 如果扩展上下文无效，可以考虑使用其他方式实现功能
}

// 节流函数，限制函数执行频率
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func.apply(this, args);
  };
}

// 使用节流处理的扫描函数
const throttledAddScanButtons = throttle(addScanButtonsToImages, 500);

// 当页面加载完成时执行主函数
window.addEventListener("load", () => {
  try {
    addScanButtonsToImages();
  } catch (error) {
    console.error("初始化扫描功能失败:", error);
  }
});

// 处理动态加载的内容
const observer = new MutationObserver((mutations) => {
  // 检查是否有新的图片添加
  let hasNewImages = false;

  mutations.forEach((mutation) => {
    // 如果是添加新节点
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // 检查是否存在新的图片
      mutation.addedNodes.forEach((node) => {
        // 直接添加的图片
        if (node.nodeName === "IMG") {
          hasNewImages = true;
        }
        // 在添加的容器内的图片
        else if (node.nodeType === 1) {
          const images = node.querySelectorAll("img");
          if (images.length > 0) {
            hasNewImages = true;
          }
        }
      });
    }
  });

  // 只有在确定有新图片时才调用函数
  if (hasNewImages) {
    throttledAddScanButtons();
  }
});

// 开始监听页面变化
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
