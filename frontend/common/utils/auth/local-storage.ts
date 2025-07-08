export function getValueByPrefix(prefix: string) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) {
      continue;
    }
    if (key.startsWith(prefix)) {
      return localStorage.getItem(key);
    }
  }
  return ''; // 未找到匹配的key
}
