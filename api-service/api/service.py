import os
from fastapi import FastAPI, Path, Query, File
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from api.routers import imageclassification, audio2text, text2audio, plots, styletransfer

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes


@app.get(
    "/",
    summary="Index",
    description="Root api"
)
async def get_index():
    return {
        "message": "Welcome to the API Service"
    }

# Additional routers here
app.include_router(imageclassification.router, prefix="/imageclassification")
app.include_router(audio2text.router, prefix="/audio2text")
app.include_router(text2audio.router, prefix="/text2audio")
app.include_router(plots.router, prefix="/plots")
app.include_router(styletransfer.router, prefix="/styletransfer")
