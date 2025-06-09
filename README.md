# ComfyUI Lumi Batcher

[简体中文](./README_CN.md) | English

## Overview

ComfyUI Lumi Batcher is a batch processing extension plugin designed for ComfyUI, aiming to improve workflow debugging efficiency. Traditional debugging methods require adjusting parameters one by one, while this tool significantly enhances work efficiency through batch processing capabilities.

## Core Value

### Pain Points of Traditional Debugging

- Manual parameter adjustment one by one
- Difficult to manage parameter combinations (e.g., image-text correspondence)
- Time-consuming and error-prone

![Traditional Method](./static/old_way_en.png)

### Advantages of Batch Tool

- One-time configuration, automatic execution of multiple parameter combinations
- Visual result comparison
- Supports multiple output types (images/text/videos)

![Batch Tool](./static/new_way_en.png)

## Features

### Core Functions

- 🚀 Batch Task Creation: Intelligent parameter cross-multiplication generation
- 📊 Task Management: Real-time task status monitoring
- 🔍 Result Comparison:
  - Horizontal/vertical comparison modes
  - Multi-modal support (text/images/videos etc.)
- ⬇️ Result Export: One-click package download

## Installation Guide

> Local environment requires Python 3.10 or higher

- Method 1: In ComfyUI's CustomNode directory, clone this project using git command, then restart ComfyUI

```bash
git clone https://github.com/bytedance/comfyui-lumi-batcher.git
```

- Method 2: Search for `comfyui-lumi-batcher` in ComfyUI-Manager and click install

After installation, in ComfyUI's UI panel, by default in the upper right corner, click the button to open the batch tool interface.

## Beginner's Guide

[ComfyUI Lumi Batcher Guide](https://bytedance.larkoffice.com/docx/LGLWdPIj8ooQyxxMAOQcWmR8nCh)

## Tool Architecture Diagram

![Architecture Diagram](./static/architecture_en.png)
