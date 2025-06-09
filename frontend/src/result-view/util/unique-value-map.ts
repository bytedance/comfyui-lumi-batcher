// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { isEqual } from 'lodash';

export class UniqueValueStruct<T> {
  private id = 0;

  private readonly map: Record<string, T> = {};

  private genId() {
    return (this.id++).toString();
  }

  set(value: T) {
    const newKey = this.genId();
    this.map[newKey] = value;
    return newKey;
  }

  get(key: string) {
    return this.map[key];
  }

  find(value: T) {
    return Object.keys(this.map).find(mapKey =>
      isEqual(this.map[mapKey], value),
    );
  }

  findOrSet(value: T) {
    return this.find(value) || this.set(value);
  }
}
