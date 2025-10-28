[简体中文](./README_CN.md) | English

<div align="center">

# 🚀 ComfyUI Lumi Batcher

**By Intelligent-Creation Team，ByteDance**

<h4 align="center">
<div align="center">
<img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version"> 
<img src="https://img.shields.io/badge/License-GPL 3.0-green.svg" alt="License">
<img src="https://img.shields.io/github/stars/bytedance/comfyui-lumi-batcher?color=yellow" alt="Stars">
<img src="https://img.shields.io/github/issues/bytedance/comfyui-lumi-batcher?color=orange" alt="Issues">
<img src="https://img.shields.io/badge/python-3.10%2B-red.svg" alt="Python">
</h4>

</div>

https://github.com/user-attachments/assets/9d4588b5-696f-4b5c-b01b-4b6def5056cf

&nbsp;

---

&nbsp;

## 📌 Overview

## **ComfyUI-Lumi-Batcher is a specialized batch processing extension for ComfyUI, designed to enhance AIGC creation efficiency.**

&nbsp;

## 😭 Are You Facing These Creative Challenges?

❌ **Model Indecision**:  
Spending hours replacing models manually, unable to pinpoint the best style.

❌ **Parameter Tuning Headaches**:  
Manually adjusting dimensions/weights/sampling steps through 20 revisions, still failing to meet requirements.

❌ **Chaotic Asset Management**:  
Generating 100 images with inconsistent naming – 10 minutes generating, 2 hours finding.

&nbsp;

---

&nbsp;

## ☀️ How ComfyUI-Lumi-Batcher Solves These

ComfyUI-Lumi-Batcher extends beyond tools like XYZ Plot in WebUI, becoming a powerhouse for batch generation and parameter testing.

- **Beyond Basic Dimensions**: Cross-test any workflow parameter freely – no restrictions to XYZ axes.
- **Flexible Parameter Grouping**: Combine parameters creatively (e.g., "product shots + prompts" × different base models).
- **Visual Result Management**: Browse outputs in multi-dimensional grids for easy previewing and batch exporting.

&nbsp;

---

&nbsp;

## 😁 Why Choose ComfyUI-Lumi-Batcher?

- 🔥 **Easy Adoption**: Intuitive interface lowers learning curve – works seamlessly with your existing ComfyUI knowledge.
- 🔥 **Efficiency Boost**: Replace repetitive manual inputs with single-parameter configuration and AI-assisted asset management.
- 🔥 **Multimodal Support**: Accelerates text, image, and video creation workflows.

&nbsp;

---

&nbsp;

## ⭐️ Release Notes

- 🚀 **version 1.0.9**: Fixes the zoom-in/zoom-out issue when switching between cells with images/videos in the preview table; Adds support for cell navigation using the arrow keys.

- 🚀 **version 1.0.8**: Fixes the scroll issue in the ComfyUI official latest UI template selection popup, and supports dragging the result image into the canvas to restore the accurate parameters.

- ✂️ **Version 1.0.7**: Supports the latest ComfyUI updates, ensuring batch tool functionality

- ☀️ **Version 1.0.6**：Compatible with official ComfyUI version 0.3.44 for changes made to validate_prompt

- ☕️ **Version 1.0.5**：Supports batch processing in API node scenarios, allows custom output directories, and batch supports the Image Save output node of the was-node-suite-comfyui plugin

- 👁 **Version 1.0.4**：Optimized the detection logic when initiating batch tasks from workflows to no longer actually initiate a task inference, and supports batch processing in scenarios using the cg-use-everywhere plugin

- 🔍 **Version 1.0.3**：Task management supports deletion functionality, custom parameters support magic expressions for quick input, and single-image result preview supports download functionality

- 📚 **Version 1.0.2**：Support bilingual versions (Chinese/English) and language switching functionality

- 💻 **Version 1.0.1**：Fix file relative path and path compatibility issues in Windows scenarios

- 🎉 **Version 1.0.0**：Initial release of ComfyUI-Lumi-Batcher, featuring basic batch processing and multi-modal support.

&nbsp;

---

&nbsp;

## 🚀 Installation

> Local environment requires Python 3.10 or higher

- Method 1: In ComfyUI's CustomNode directory, clone this project using git command, then restart ComfyUI

```bash
git clone https://github.com/bytedance/comfyui-lumi-batcher.git
```

- Method 2: Search for `comfyui-lumi-batcher` in ComfyUI-Manager and click install

After installation, in ComfyUI's UI panel, by default in the upper right corner, click the button to open the batch tool interface.

&nbsp;

---

&nbsp;

## 🤝 Get Help

**[Beginner's Guide](https://bytedance.larkoffice.com/docx/LGLWdPIj8ooQyxxMAOQcWmR8nCh)**

<div style="margin-bottom:20px;font-weight: bold;">
  Contact Us
</div>
<img alt="Contact Image" src="https://github.com/user-attachments/assets/b24c1e8c-dba8-47ed-9ad4-ed197f57301b" width="300" style="height:auto;" />
