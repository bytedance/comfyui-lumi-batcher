import type { Comfy } from './comfy';
import type { LGraph, LGraphGroup, LGraphNode, LiteGraph } from './litegraph.d';

declare global {
  interface Window {
    __webScmVersion: string;
    __baManagerPreload?: HTMLDivElement;
    __baPageReady?: boolean;
    __COMFYUI_FRONTEND_VERSION__?: string;
    app: Comfy.App;
    comfyApi: Comfy.Api;
    LGraphCanvas: Comfy.LGraphCanvas;
    __baBuildRegion: string;
    LiteGraph: typeof LiteGraph & {
      isValidConnection?: (a: string, b: string) => boolean;
      WIDGET_OUTLINE_COLOR: string;
      WIDGET_BGCOLOR: string;
      WIDGET_TEXT_COLOR: string;
      WIDGET_SECONDARY_TEXT_COLOR: string;
      pointerevents_method: string;
      closeAllContextMenus: () => void;
    };
    LGraph: typeof LGraph;
    LGraphNode: typeof LGraphNode;
    LGraphGroup: typeof LGraphGroup;
  }
  const CUSTOM_BA_SCENE: string, BA_BUILD_REGION: string;
}

// 模块导出
export {};
