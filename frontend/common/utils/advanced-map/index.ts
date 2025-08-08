export const memoryMap = (map: Map<any, any>) => {
  const memorySetMap = new Map<string, number>();
  const memoryGetMap = new Map<string, number>();

  const buildKey = (key: string, count: number) =>
    count > 0 ? `${key}-${count}` : key;

  return {
    get: (key: string) => {
      const count = memoryGetMap.get(key) || 0;
      if (count > 0) {
        memoryGetMap.set(key, count + 1);
        return map.get(buildKey(key, count));
      } else {
        memoryGetMap.set(key, 1);
        return map.get(key);
      }
    },
    set: (key: string, value: any) => {
      const count = memorySetMap.get(key) || 0;
      if (count > 0) {
        map.set(buildKey(key, count), value);
        memorySetMap.set(key, count + 1);
      } else {
        map.set(key, value);
        memorySetMap.set(key, 1);
      }
    },
  };
};
