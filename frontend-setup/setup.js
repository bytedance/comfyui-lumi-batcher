// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

const staticFileUrl = "/api/comfyui-lumi-batcher/get-static-file";
const staticFilePrefixPath =
  "./custom_nodes/comfyui-lumi-batcher/frontend/dist";

async function injectEntry() {
  const htmlResponse = await fetch(
    `${staticFileUrl}?path=${staticFilePrefixPath}/index.html&timeStamp=${new Date().getTime()}`
  );
  const html = await htmlResponse.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // 提取所有js和css文件
  const links = Array.from(
    doc.querySelectorAll('script[src$=".js"], link[href$=".css"]')
  );

  const entryPromises = links.map(async (link) => {
    const resourceUrl = link.getAttribute("src") || link.getAttribute("href");
    const isJs = resourceUrl.endsWith(".js");

    if (isJs) {
      // 动态加载JS模块
      try {
        await import(
          resourceUrl
          // `${staticFileUrl}?path=${staticFilePrefixPath}${resourceUrl}`
        );
      } catch (error) {
        console.error(`Failed to load JS: ${resourceUrl}`, error);
      }
    } else {
      // 创建CSS link元素
      const styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = resourceUrl;
      // styleLink.href = `${staticFileUrl}?path=${staticFilePrefixPath}${resourceUrl}`;

      // 添加错误处理
      styleLink.onerror = () => {
        console.error(`Failed to load CSS: ${resourceUrl}`);
      };

      document.head.appendChild(styleLink);
    }
  });
  await Promise.all(entryPromises);
  if (window?._ba_main) {
    await window._ba_main();
  }
}

// 先挂，因为 web app 中会使用
window.app = app;
window.comfyApi = api;

/** 供不同环境，注入不同变量初始化 */
export const setup = () => {
  app.registerExtension({
    name: "waitBatchToolsApp",
    async init() {
      try {
        await injectEntry();
      } catch (e) {
        console.error("Failed to get comfyui web application because of ", e);
      }
    },
  });
};

setup();
