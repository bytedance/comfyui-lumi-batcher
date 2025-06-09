# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
def getErrorResponse(e: Exception, message=""):
    print("---------http error----------", e, message)
    if message:
        return {"code": 500, "message": message, "error": e}
    else:
        return {"code": 500, "message": "服务器错误", "error": e}
