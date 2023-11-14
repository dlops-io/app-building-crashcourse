from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import asyncio
import pandas as pd
import os
from fastapi import File
from typing import Iterator

from api import model

DEFAULT_SYSTEM_PROMPT = """"""
MAX_MAX_NEW_TOKENS = 2048
DEFAULT_MAX_NEW_TOKENS = 1024
MAX_INPUT_TOKEN_LENGTH = 4000


def generate(
    message: str,
    history_with_input: list[tuple[str, str]],
    system_prompt: str,
    max_new_tokens: int,
    temperature: float,
    top_p: float,
    top_k: int,
) -> Iterator[list[tuple[str, str]]]:
    # logger.info("message=%s",message)
    if max_new_tokens > MAX_MAX_NEW_TOKENS:
        raise ValueError

    history = history_with_input[:-1]
    generator = model.run(
        message, history, system_prompt, max_new_tokens, temperature, top_p, top_k
    )
    try:
        first_response = next(generator)
        yield history + [(message, first_response)]
    except StopIteration:
        yield history + [(message, "")]
    for response in generator:
        yield history + [(message, response)]


# Setup FastAPI app
app = FastAPI(title="Chatbot Server", description="Chatbot Server", version="v1")

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@app.get("/")
async def get_index():
    return {"message": "Welcome to the Chatbot Server"}


@app.get("/test")
async def invoke_chat():
    message = "hello"
    return generate(message, [], DEFAULT_SYSTEM_PROMPT, 1024, 1, 0.95, 50)


@app.post("/chat")
async def invoke_chat(chat: dict):
    print(chat)

    message = chat["input_message"]
    return generate(message, [], DEFAULT_SYSTEM_PROMPT, 150, 1, 0.95, 50)
