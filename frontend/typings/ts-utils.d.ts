export namespace TSUtils {
  export type AnyFunction = (...args: any[]) => any;
  export type NestedObject<T = unknown> = {
    [key: string]: T | NestedObject<T>;
  };
  export type AnyObject = Record<string, any>;
  export type UnknownObject = Record<string, unknown>;
}
