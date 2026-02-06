// This script is placed in frontend/dist/loader.js
// It runs automatically because it's in the WEB_DIRECTORY.
// Its purpose is to fetch index.html, extract CSS links, and inject them into the page.
// We skip JS injection because ComfyUI automatically loads the JS files in this directory.

import { app } from "/scripts/app.js";

const extensionBasePath = "/extensions/comfyui-lumi-batcher";

async function injectCss() {
  try {
    console.log('[Lumi-Batcher-Loader] Starting CSS injection...');
    
    const htmlResponse = await fetch(
      `${extensionBasePath}/index.html?timeStamp=${new Date().getTime()}`
    );
    
    if (!htmlResponse.ok) {
      throw new Error(`Failed to load index.html: ${htmlResponse.status}`);
    }
    
    const html = await htmlResponse.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract only css files
    const links = Array.from(
      doc.querySelectorAll('link[rel="stylesheet"]')
    );
    
    console.log('[Lumi-Batcher-Loader] Found CSS links:', links.length);

    links.forEach((link) => {
      const resourceUrl = link.getAttribute("href");
      if (!resourceUrl) return;

      console.log('[Lumi-Batcher-Loader] Processing CSS:', resourceUrl);
      
      // Convert relative paths to absolute extension paths if needed
      // The index.html usually has /extensions/... paths now due to rsbuild config
      // But we double check.
      let fullPath = resourceUrl;
      if (!fullPath.startsWith('/extensions/') && !fullPath.startsWith('http')) {
           fullPath = fullPath.startsWith('/') 
            ? fullPath 
            : `${extensionBasePath}${resourceUrl.startsWith('.') ? resourceUrl.substring(1) : '/' + resourceUrl}`;
      }
      
      console.log('[Lumi-Batcher-Loader] Full CSS path:', fullPath);

      // Create CSS link element
      const styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.href = fullPath;
      styleLink.onload = () => console.log('[Lumi-Batcher-Loader] ✅ CSS loaded:', fullPath);
      styleLink.onerror = () => console.error('[Lumi-Batcher-Loader] ❌ Failed to load CSS:', fullPath);
      
      document.head.appendChild(styleLink);
    });
    
  } catch (e) {
    console.error("[Lumi-Batcher-Loader] Failed to inject CSS:", e);
  }
}

app.registerExtension({
  name: "comfyui-lumi-batcher-loader",
  async init() {
    await injectCss();
  },
});
