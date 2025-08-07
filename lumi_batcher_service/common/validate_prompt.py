import asyncio
import inspect

import execution


async def handle_validate_prompt(prompt_id: str, prompt: dict):
    # 获取validate_prompt函数的参数信息
    sig = inspect.signature(execution.validate_prompt)
    param_count = len(sig.parameters)

    try:
        if param_count == 3:
            # 三个参数时的处理逻辑,默认全部校验
            result = await execution.validate_prompt(prompt_id, prompt, None)
        elif param_count == 2:
            # 两个参数时的处理逻辑
            result = await execution.validate_prompt(prompt_id, prompt)
        else:
            # 一个参数时的处理逻辑，同样使用to_thread
            result = await asyncio.to_thread(execution.validate_prompt, prompt)
        return result
    except Exception as e:
        print(f"验证prompt失败: {e}")
        raise
