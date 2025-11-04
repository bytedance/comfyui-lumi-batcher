# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from .image import process_save_image
from .text import process_pysssss_show_text
from .video import (
    process_vhs_video_combine,
    process_save_video,
)
from .audio import process_save_audio

output_processor_map = {
    "SaveImage": process_save_image,
    "Image Save": process_save_image,
    "ShowText|pysssss": process_pysssss_show_text,
    "VHS_VideoCombine": process_vhs_video_combine,
    "VideoCombine_Adv": process_vhs_video_combine,
    "SaveVideo": process_save_video,
    "SaveAudio": process_save_audio,
    "SaveAudioMP3": process_save_audio,
    "SaveAudioOpus": process_save_audio,
}

default_output_class_type_list = [
    "SaveImage",
    "Image Save",
    "ShowText|pysssss",
    "VHS_VideoCombine",
    "VideoCombine_Adv",
    "SaveVideo",
    "SaveAudio",
    "SaveAudioMP3",
    "SaveAudioOpus",
]
