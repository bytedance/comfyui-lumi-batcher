import os
from .value import OutputNodeType
import folder_paths


def process_save_audio(ui):
    output_directory = folder_paths.get_output_directory()
    result = []
    output_key = "audio"
    if output_key in ui:
        audio_list = ui.get(output_key, [])
        if isinstance(audio_list, list):
            for item in audio_list:
                filename = item.get("filename", "")
                subfolder = item.get("subfolder", "")
                file_path = os.path.join(output_directory, subfolder, filename)
                result.append(
                    {
                        "type": OutputNodeType.Audio,
                        "value": file_path,
                    }
                )

    return result, output_key
