from threading import Thread
from typing import Iterator

# import torch
from transformers.utils import logging
from ctransformers import AutoModelForCausalLM
from transformers import TextIteratorStreamer, AutoTokenizer


logging.set_verbosity_info()
logger = logging.get_logger("transformers")

config = {
    "max_new_tokens": 256,
    "repetition_penalty": 1.1,
    "temperature": 0.1,
    "stream": True,
}
model_id = "TheBloke/Llama-2-7B-Chat-GGML"
device = "cpu"


model = AutoModelForCausalLM.from_pretrained(
    model_id, model_type="llama", lib="avx2", hf=True
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-chat-hf")


def get_prompt(
    message: str, chat_history: list[tuple[str, str]], system_prompt: str
) -> str:
    # logger.info("get_prompt chat_history=%s",chat_history)
    # logger.info("get_prompt system_prompt=%s",system_prompt)
    texts = [f"<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n"]
    # logger.info("texts=%s",texts)
    do_strip = False
    for user_input, response in chat_history:
        user_input = user_input.strip() if do_strip else user_input
        do_strip = True
        texts.append(f"{user_input} [/INST] {response.strip()} </s><s>[INST] ")
    message = message.strip() if do_strip else message
    # logger.info("get_prompt message=%s",message)
    texts.append(f"{message} [/INST]")
    # logger.info("get_prompt final texts=%s",texts)
    return "".join(texts)


def get_input_token_length(
    message: str, chat_history: list[tuple[str, str]], system_prompt: str
) -> int:
    # logger.info("get_input_token_length=%s",message)
    prompt = get_prompt(message, chat_history, system_prompt)
    # logger.info("prompt=%s",prompt)
    input_ids = tokenizer([prompt], return_tensors="np", add_special_tokens=False)[
        "input_ids"
    ]
    # logger.info("input_ids=%s",input_ids)
    return input_ids.shape[-1]


def run(
    message: str,
    chat_history: list[tuple[str, str]],
    system_prompt: str,
    max_new_tokens: int = 1024,
    temperature: float = 0.8,
    top_p: float = 0.95,
    top_k: int = 50,
) -> Iterator[str]:
    prompt = get_prompt(message, chat_history, system_prompt)
    inputs = tokenizer([prompt], return_tensors="pt", add_special_tokens=False).to(
        device
    )

    streamer = TextIteratorStreamer(
        tokenizer, timeout=15.0, skip_prompt=True, skip_special_tokens=True
    )
    generate_kwargs = dict(
        inputs,
        streamer=streamer,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        top_p=top_p,
        top_k=top_k,
        temperature=temperature,
        num_beams=1,
    )
    t = Thread(target=model.generate, kwargs=generate_kwargs)
    t.start()

    outputs = []
    for text in streamer:
        outputs.append(text)
        yield "".join(outputs)
