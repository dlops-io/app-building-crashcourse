import os
import io
from fastapi import APIRouter, Query
from starlette.responses import FileResponse
from tempfile import TemporaryDirectory
import uuid
#from google.cloud import texttospeech

# Instantiates a client
#client = texttospeech.TextToSpeechClient()

# Define Router
router = APIRouter()

# Routes


@router.post("/synthesize")
async def synthesize(json_obj: dict):
    print(print(json_obj))

    # output_dir = "outputs"
    # os.makedirs(output_dir, exist_ok=True)

    # # Generate a unique id
    # file_id = uuid.uuid1()
    # file_path = os.path.join(output_dir, str(file_id)+".mp3")

    # # Set the text input to be synthesized
    # synthesis_input = texttospeech.SynthesisInput(text=json_obj["text"])

    # # language_code="en-US"
    # language_code = "fr-FR"

    # # Build the voice request, select the language code ("en-US") and the ssml
    # # voice gender ("neutral")
    # voice = texttospeech.VoiceSelectionParams(
    #     language_code=language_code, ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    # )

    # # Select the type of audio file you want returned
    # audio_config = texttospeech.AudioConfig(
    #     audio_encoding=texttospeech.AudioEncoding.MP3
    # )

    # # Perform the text-to-speech request on the text input with the selected
    # # voice parameters and audio file type
    # response = client.synthesize_speech(
    #     input=synthesis_input, voice=voice, audio_config=audio_config
    # )

    # # Save the response's audio_content which is binary.
    # with open(file_path, "wb") as out:
    #     # Write the response to the output file.
    #     out.write(response.audio_content)
    #     print('Audio content written to file', file_path)

    return {
        "audio_path": "examples/audio/test.mp3",
        "text": "cut the chicken!"
    }


@router.get("/get_audio_data")
async def get_audio_data(
        path: str = Query(..., description="Audio path")
):
    print(path)
    return FileResponse(path, media_type="audio/mp3")
