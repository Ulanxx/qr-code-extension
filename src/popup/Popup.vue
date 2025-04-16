<template>
  <div class="container">
    <h1 class="title">
      二维码生成器
    </h1>

    <form @submit.prevent="generateQRCode" class="form">
      <div class="form-group">
        <input
          id="text-input"
          type="text"
          v-model="text"
          placeholder="输入文本或URL"
          class="input"
          autofocus
        />
      </div>

      <button
        type="submit"
        class="button primary-button"
      >
        生成二维码
      </button>
    </form>

    <div v-show="qrGenerated" class="qr-container">
      <div class="canvas-container">
        <canvas ref="qrCanvas" width="200" height="200"></canvas>
      </div>

      <div class="button-group">
        <button
          @click="downloadQRCode"
          class="button primary-button small"
        >
          下载
        </button>

        <button
          @click="copyQRCodeToClipboard"
          class="button secondary-button small"
        >
          复制
        </button>
      </div>

      <div 
        v-if="copySuccess" 
        class="success-message"
      >
        已复制到剪贴板
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import QRCode from "qrcode";

const text = ref("");
const qrCanvas = ref(null);
const qrGenerated = ref(false);
const copySuccess = ref(false);

// Load saved text from Chrome storage on mount
onMounted(() => {
  // Check if we're in a browser extension environment
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.local.get(["lastQRText"], (result) => {
      if (result.lastQRText) {
        text.value = result.lastQRText;
        generateQRCode();
      }
    });
  } else {
    // Fallback for development environment
    const savedText = localStorage.getItem("lastQRText");
    if (savedText) {
      text.value = savedText;
      generateQRCode();
    }
  }
});

const generateQRCode = async () => {
  if (!text.value) return;
  
  try {
    // 先设置状态，确保元素显示
    qrGenerated.value = true;
    
    // 使用nextTick确保DOM已更新再绘制二维码
    await nextTick();
    
    if (qrCanvas.value) {
      await QRCode.toCanvas(qrCanvas.value, text.value, {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      console.log("QR code generated", text.value);
      // Save text to Chrome storage
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ lastQRText: text.value });
      } else {
        // Fallback for development environment
        localStorage.setItem("lastQRText", text.value);
      }
    } else {
      console.error("Canvas element not found");
    }
  } catch (error) {
    console.error("Failed to generate QR code:", error);
  }
};

const downloadQRCode = () => {
  if (!qrCanvas.value) return;

  const link = document.createElement("a");
  link.download = "qrcode.png";
  link.href = qrCanvas.value.toDataURL("image/png");
  link.click();
};

const copyQRCodeToClipboard = async () => {
  if (!qrCanvas.value) return;

  try {
    const dataUrl = qrCanvas.value.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};
</script>

<style>
/* 像素风科技绿 */
:root {
  --primary: #0f0;
  --primary-dim: #0a0;
  --dark: #000;
  --light: #ffffff;
  --border: #0f0;
  --text: #0f0;
  --highlight: #00ff66;
  --background: #001800;
}

@font-face {
  font-family: 'Pixel';
  src: local('Silkscreen'), local('Press Start 2P'), local('VT323'), local('Courier New');
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  image-rendering: pixelated;
}

body {
  font-family: 'Pixel', monospace;
  background-color: var(--dark);
  color: var(--text);
}

.container {
  width: 320px;
  height: 450px;
  padding: 8px;
  background-color: var(--dark);
  background-image: 
    linear-gradient(0deg, rgba(0, 24, 0, 0.97), rgba(0, 24, 0, 0.97)),
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px);
  border: 2px solid var(--primary);
  position: relative;
  overflow: hidden;
}

/* 像素风格边框 */
.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid var(--dark);
  pointer-events: none;
}

/* 像素风角落 */
.container::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
  top: 0;
  left: 0;
}

.title {
  font-size: 18px;
  font-weight: normal;
  text-align: center;
  margin: 8px 0 12px;
  color: var(--primary);
  text-shadow: 0 0 5px var(--primary);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.form {
  margin-bottom: 10px;
  border: 1px solid var(--primary-dim);
  padding: 8px;
  position: relative;
}

.form::before {
  content: '// INPUT';
  position: absolute;
  top: -8px;
  left: 8px;
  background-color: var(--background);
  padding: 0 4px;
  font-size: 10px;
  color: var(--primary-dim);
}

.form-group {
  margin-bottom: 8px;
}

.input {
  width: 100%;
  height: 30px;
  padding: 6px 8px;
  background-color: rgba(0, 15, 0, 0.6);
  border: 1px solid var(--primary-dim);
  color: var(--primary);
  font-family: 'Pixel', monospace;
  font-size: 12px;
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

.input::placeholder {
  color: rgba(0, 255, 0, 0.3);
}

.button {
  width: 100%;
  height: 30px;
  border: none;
  font-size: 12px;
  font-family: 'Pixel', monospace;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 1px;
}

.primary-button {
  background-color: var(--primary-dim);
  color: var(--dark);
  border: 1px solid var(--primary);
  position: relative;
  overflow: hidden;
}

.primary-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.primary-button:hover::before {
  left: 100%;
}

.primary-button:active {
  background-color: var(--primary);
}

.secondary-button {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary-dim);
}

.secondary-button:hover {
  background-color: rgba(0, 255, 0, 0.1);
}

.small {
  font-size: 11px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--primary-dim);
  position: relative;
}

.qr-container::before {
  content: '// OUTPUT';
  position: absolute;
  top: -8px;
  left: 8px;
  background-color: var(--background);
  padding: 0 4px;
  font-size: 10px;
  color: var(--primary-dim);
}

.canvas-container {
  margin-bottom: 12px;
  padding: 8px;
  background-color: white;
  border: 1px solid var(--primary);
  position: relative;
}

/* 像素风角落 */
.canvas-container::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 5px;
  border-bottom: 2px solid var(--primary);
  border-right: 2px solid var(--primary);
  bottom: 0;
  right: 0;
}

.button-group {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.success-message {
  margin-top: 8px;
  font-size: 10px;
  color: var(--highlight);
  background-color: rgba(0, 255, 0, 0.1);
  padding: 2px 6px;
  border: 1px solid var(--highlight);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 终端闪烁光标 */
.success-message::after {
  content: '';
  display: inline-block;
  width: 5px;
  height: 12px;
  background-color: var(--highlight);
  margin-left: 6px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
