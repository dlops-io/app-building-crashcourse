import os
import io
import ffmpeg
from fastapi import APIRouter, File
#from google.cloud import speech

from tempfile import TemporaryDirectory

# Define Router
router = APIRouter()

#client = speech.SpeechClient()

# Routes


@router.post("/transcribe")
async def transcribe(
        file: bytes = File(...)
):
    print("audio file:", len(file), type(file))

    # # Save the file
    # with TemporaryDirectory() as audio_dir:
    #     audio_path = os.path.join(audio_dir, "audio.mp3")
    #     flac_path = os.path.join(audio_dir, "audio.flac")
    #     with open(audio_path, "wb") as output:
    #         output.write(file)

    #     stream = ffmpeg.input(audio_path)
    #     stream = ffmpeg.output(stream, flac_path)
    #     ffmpeg.run(stream)

    #     with io.open(flac_path, "rb") as audio_file:
    #         content = audio_file.read()

    #     # Transcribe
    #     audio = speech.RecognitionAudio(content=content)
    #     config = speech.RecognitionConfig(
    #         language_code="en-US"
    #     )
    #     operation = client.long_running_recognize(config=config, audio=audio)
    #     response = operation.result(timeout=90)
    #     print(response)
    #     print(response.results)

    #     transcription_results = []
    #     for result in response.results:
    #         transcription_results.append(
    #             {
    #                 "transcript": result.alternatives[0].transcript,
    #                 "confidence": result.alternatives[0].confidence
    #             }
    #         )
    #     return transcription_results

    transcription_results = [{
        "transcript": "Blah blah blah!",
        "confidence": 0.99
    }]

    return transcription_results
