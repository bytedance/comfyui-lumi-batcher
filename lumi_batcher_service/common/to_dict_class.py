# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from dataclasses import fields, dataclass
from enum import Enum
import json


def trans_value(v):
    if isinstance(v, Enum):
        return v.value
    if isinstance(v, ToDictBase):
        return v.to_dict()
    if isinstance(v, list):
        return [trans_value(item) for item in v]
    if isinstance(v, dict):
        return {key: trans_value(v[key]) for key in v}

    return v


@dataclass
class ToDictBase:
    def to_dict(self) -> dict[str, any]:
        result = {}
        for field in fields(self):
            v = trans_value(getattr(self, field.name))
            if v is None:
                continue
            result[field.name] = v

        return result

    def to_json(self, placeholder="") -> str:
        class CustomEncoder(json.JSONEncoder):
            def default(self, obj):
                try:
                    return super().default(obj)
                except TypeError:
                    return placeholder

        return json.dumps(self.to_dict(), cls=CustomEncoder)
