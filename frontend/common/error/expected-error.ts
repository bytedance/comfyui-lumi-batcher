// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
type AfterError = (() => void) | undefined;
export class ExpectedError extends Error {
  expectedReason: string;
  afterError: AfterError;
  constructor(msg: string, afterError?: AfterError) {
    super(`ExpectedError: ${msg}`);
    this.expectedReason = msg;
    this.afterError = afterError;
  }
  static is(errorIns: unknown): errorIns is ExpectedError {
    return errorIns instanceof ExpectedError;
  }
}
