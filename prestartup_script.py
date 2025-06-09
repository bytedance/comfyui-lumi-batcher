# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import importlib
import os
import subprocess
import sys
import traceback

module_dir_name = "lumi_batcher_service"


def register_module():
    try:
        print(f"Registering {module_dir_name} module...")
        init_file_path = os.path.join(
            os.path.dirname(os.path.realpath(__file__)), module_dir_name
        )
        if not os.path.exists(os.path.join(init_file_path, "__init__.py")):
            raise ImportError(f"{module_dir_name} module not found at {init_file_path}")

        module_name = os.path.basename(init_file_path)
        module_spec = importlib.util.spec_from_file_location(
            module_name, os.path.join(init_file_path, "__init__.py")
        )
        if module_spec is None:
            raise ImportError(f"Failed to create spec for {module_name}")

        module = importlib.util.module_from_spec(module_spec)
        sys.modules[module_name] = module
        module_spec.loader.exec_module(module)
        print(f"Successfully registered module: {module_name}")
    except Exception as e:
        print(f"Failed to register {module_dir_name} module: {str(e)}")
        raise


def start_up():
    try:
        print(f"Starting up {module_dir_name}...")
        register_module()
        print(f"{module_dir_name} started successfully.")
    except (Exception, subprocess.CalledProcessError) as e:
        print(f"Failed to load {module_dir_name} with error ", e)
        traceback.print_exc()


start_up()
