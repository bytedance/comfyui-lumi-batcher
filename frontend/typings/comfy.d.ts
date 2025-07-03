// project name：ComfyUI-Lumi-Batcher
// license：GPL-3.0
// Copyright (C) 2007 Free Software Foundation, Inc.
// license url：https://github.com/comfyanonymous/ComfyUI/blob/master/LICENSE
/* eslint-disable @typescript-eslint/method-signature-style */
import {
  type ComfyExtension,
  type ComfyObjectInfo,
  type ComfyObjectInfoConfig,
} from '@/typings/base-comfy';
import {
  type ContextMenu,
  type LGraphGroup,
  type LGraphNode,
  type SerializedLGraphNode,
} from '@/typings/litegraph';
import { type TSUtils } from '@/typings/ts-utils';

import { type GraphData } from './graph-data';

export namespace Comfy {
  export type widgetTypes =
    | 'number'
    | 'slider'
    | 'combo'
    | 'text'
    | 'customtext'
    | 'toggle'
    | 'button'
    | 'hidden'
    | 'converted-widget';

  export interface Widget {
    type: widgetTypes;
    name: string | null;
    label?: string;
    value: unknown;
    options?: Record<string, unknown>;
    linkedWidgets?: Widget[];
    y?: number;
    last_y: number;
  }

  export type ContextMenuEventListener = (
    value: ContextMenuItem,
    options: ContextMenuOptions,
    event: MouseEvent,
    parentMenu: ContextMenu | undefined,
    node: Node | null,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ) => boolean | void;

  export interface ContextMenuOptions {
    callback?: ContextMenuEventListener;
    ignore_item_callbacks?: boolean;
    event?: MouseEvent | CustomEvent;
    parentMenu?: ContextMenu;
    autoopen?: boolean;
    title?: string;
    extra?: any;
  }

  export type ContextMenuItem = {
    content: string;
    callback?: ContextMenuEventListener;
    /** Used as innerHTML for extra child element */
    title?: string;
    disabled?: boolean;
    has_submenu?: boolean;
    submenu?: {
      options: ContextMenuItem[];
    } & ContextMenuOptions;
    className?: string;
  } | null;

  export type Node = LGraphNode & {
    title: string;
    type: string;
    widgets: Widget[];
    getInnerNodes?: () => Node[];
    addDOMWidget: (
      name: string,
      type: string,
      inputEl: HTMLElement,
      opts: TSUtils.AnyObject,
    ) => Awaited<ReturnType<Comfy.Extension['getCustomWidgets']>>[string];
    /** ba 特有的节点属性，用于存储一些创建时候的副作用 */
    ba_clear_effects?: VoidFunction[];
  };
  export type WorkflowOutput = Record<
    string,
    {
      inputs: Record<string, string | number | unknown[]>;
      class_type: string;
    }
  >;
  export interface GraphPrompt {
    output: WorkflowOutput;
    workflow: GraphData;
  }
  export interface LGraphCanvas {
    prototype: {
      getCanvasMenuOptions?: () => ContextMenuItem[];
      getNodeMenuOptions?: (node: Node) => ContextMenuItem[];
      selected_nodes: Record<string, Node>;
      current_node: Node | null;
      renderInfo?: (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
      ) => void;
      offsetHeight: number;
      canvas: HTMLCanvasElement;
      ds: {
        scale: number;
      };
      draw: (forceCanvas: boolean, forceBgCanvas: boolean) => void;
    };
  }
  export interface App {
    lastNodeErrors: Record<
      string,
      {
        errors?: string;
      }
    > | null;
    canvas: LGraphCanvas['prototype'];
    canvasEl: HTMLCanvasElement;
    ui: {
      dialog: {
        close(): void;
        show(): void;
      };
    };
    registerExtension: (extension: Extension) => void;
    /** 存放各个节点输出的内容 */
    nodeOutputs: Record<string, Record<string, unknown>>;
    graph: {
      _nodes: LGraphNode[];
      _groups?: GraphGroup[];
      onConfigure?: (o: SerializedLGraphNode) => void;
      onSerialize?: (graphData: GraphData) => void;
      /** 根据 id 获取节点 */
      getNodeById: (nodeId: number | string) => Node | null;
      serialize: () => GraphData;
      setDirtyCanvas(fg: boolean, bg: boolean): void;
    };
    graphToPrompt(): Promise<GraphPrompt>;
    loadGraphData(
      graphData: Comfy.GraphPrompt['workflow'],
      ...args: unknown[]
    ): Promise<void>;
    registerNodes(): Promise<void>;
    refreshComboInNodes(): Promise<void>;
    handleFile(file: File): Promise<void>;
    queuePrompt(num: number, batchCount = 1): Promise<void>;
    showMissingNodesError(missingNodeTypes, hasAddedNodes: boolean): void;
    ue_modified_prompt?: () => Promise<{
      output: Comfy.WorkflowOutput;
      workflow: Comfy.Workflow;
    }>;
  }

  export interface ApiEventMap {
    /** 任务执行完成的耗时 */
    task_execute_duration: {
      duration: number;
      prompt_id: string;
    };
    /** 节点执行完成的耗时 */
    node_execute_duration: {
      duration: number;
      prompt_id: string;
      node_id: string;
    };
    /** 任务开始执行 */
    execution_start: {
      prompt_id: string;
    };
    /** 插件中心服务通过WS服务通知到页面 */
    model_manager_server: {
      type: string;
      data: any;
    };
    executed: {
      node: string;
      prompt_id: string;
      output: {
        images: Array<{
          filename: string;
          subfolder: string;
          type: string;
        }>;
      };
    };
    execution_error: {
      prompt_id: string;
      exception_type: string;
      exception_message: string;
      node_id: string;
      node_type: string;
      node_id: string;
      traceback: string;
      executed: any[];
      current_inputs: Record<string, number[] | string[]>;
      current_outputs: Record<string, number[] | string[]>;
    };
    executing: string | null;
    /** 缓存的节点 */
    execution_cached: {
      nodes: string[];
      prompt_id: string;
    };
  }

  export interface Api {
    addEventListener: <T extends keyof ApiEventMap>(
      type: T,
      callback: (event: { detail: ApiEventMap[T] }) => void,
    ) => void;
    clientId?: string;
    initialClientId?: string;
    socket: WebSocket;
  }

  export type Extension = ComfyExtension & {
    beforeConfigureGraph: (
      graphData: GraphData,
      missingNodeTypes: string[],
    ) => Promise<void>;
  };
  export type ObjectInfo = ComfyObjectInfo & {
    output_node: boolean;
  };
  export type ObjectInfoConfig = ComfyObjectInfoConfig;

  export type GraphGroup = LGraphGroup & {
    _ctor: (title: string) => void;
    _ba_id?: string;
    _nodes?: LGraphNode[];
  };
}
