import os
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

from lumi_batcher_service.common.file_path import (
    get_safe_upload_filename,
    is_path_under_directory,
    is_under_delete_white_dir,
    is_under_lumi_batcher,
)


class FilePathSecurityTest(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.old_cwd = os.getcwd()
        os.chdir(self.root)

        (self.root / "comfyui_lumi_batcher_workspace" / "upload").mkdir(
            parents=True
        )
        (self.root / "custom_nodes" / "comfyui-lumi-batcher").mkdir(parents=True)
        (self.root / "input").mkdir()
        (self.root / "output").mkdir()

    def tearDown(self):
        os.chdir(self.old_cwd)
        self.temp_dir.cleanup()

    def test_path_must_be_inside_exact_directory(self):
        upload_dir = self.root / "comfyui_lumi_batcher_workspace" / "upload"

        self.assertTrue(is_path_under_directory(upload_dir / "normal.txt", upload_dir))
        self.assertFalse(
            is_path_under_directory(
                upload_dir
                / ".."
                / ".."
                / "custom_nodes"
                / "comfyui-lumi-batcher"
                / "prestartup_script.py",
                upload_dir,
            )
        )

    def test_delete_white_dir_rejects_component_name_bypass(self):
        (self.root / "comfyui_lumi_batcher_workspace_evil").mkdir()

        self.assertTrue(
            is_under_delete_white_dir(
                "comfyui_lumi_batcher_workspace/upload/normal.txt"
            )
        )
        self.assertFalse(
            is_under_delete_white_dir("comfyui_lumi_batcher_workspace_evil/evil.txt")
        )

    def test_delete_white_dir_rejects_upload_traversal_to_plugin(self):
        malicious_path = os.path.join(
            "comfyui_lumi_batcher_workspace",
            "upload",
            "..",
            "..",
            "custom_nodes",
            "comfyui-lumi-batcher",
            "prestartup_script.py",
        )

        self.assertFalse(is_under_delete_white_dir(malicious_path))

    def test_dynamic_input_output_directories_are_preserved(self):
        output_dir = self.root / "custom-output"
        input_dir = self.root / "custom-input"
        output_dir.mkdir()
        input_dir.mkdir()

        fake_folder_paths = SimpleNamespace(
            get_output_directory=lambda: str(output_dir),
            get_input_directory=lambda: str(input_dir),
        )

        with mock.patch.dict(sys.modules, {"folder_paths": fake_folder_paths}):
            self.assertTrue(is_under_delete_white_dir(output_dir / "result.png"))
            self.assertTrue(is_under_delete_white_dir(input_dir / "source.png"))

    def test_lumi_batcher_static_path_uses_containment(self):
        self.assertTrue(
            is_under_lumi_batcher(
                "custom_nodes/comfyui-lumi-batcher/frontend/dist/index.js"
            )
        )
        self.assertFalse(
            is_under_lumi_batcher(
                "custom_nodes/comfyui-lumi-batcher-evil/frontend/dist/index.js"
            )
        )

    def test_upload_filename_uses_basename_for_posix_and_windows_paths(self):
        self.assertEqual(
            get_safe_upload_filename(
                "../../custom_nodes/comfyui-lumi-batcher/prestartup_script.py"
            ),
            "prestartup_script.py",
        )
        self.assertEqual(
            get_safe_upload_filename(
                r"..\..\custom_nodes\comfyui-lumi-batcher\prestartup_script.py"
            ),
            "prestartup_script.py",
        )
        self.assertEqual(get_safe_upload_filename(r"C:\fakepath\params.txt"), "params.txt")
        self.assertIsNone(get_safe_upload_filename(""))
        self.assertIsNone(get_safe_upload_filename(".."))
        self.assertIsNone(get_safe_upload_filename("bad\x00name.txt"))


if __name__ == "__main__":
    unittest.main()
