#!/usr/bin/python3
import os
import sys
import json
# import logging
import websocket

def log_message(message):
    pring(message)

log_message("ANSWER")  # Answer the call
log_message("STREAM FILE welcome")  # Play a sound file

# # Read raw audio stream from FD3
# fd = 3
# buffer_size = 4096

# try:
#     with os.fdopen(fd, 'rb', buffering=0) as audio_stream:
#         buffer = audio_stream.read(buffer_size)
#         if buffer:
#             log_message(f"Received {len(buffer)} bytes of audio data")
# except OSError as e:
#     log_message(f"Error reading audio data: {e}")

# log_message("HANGUP")  # End the call

# # Read AGI environment from stdin
# agi_env = {}
# reading_env = True

# def start_audio_streaming():
#     log_message(f"AGI environment: {json.dumps(agi_env)}")

#     try:
#         with os.fdopen(3, 'rb', buffering=0) as audio_stream:
#             ws_url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17"
#             ws_headers = {
#                 "Authorization": "Bearer sk-xxxxxx",
#                 "OpenAI-Beta": "realtime=v1",
#             }

#             ws = websocket.WebSocket()
#             ws.connect(ws_url, header=[f"{key}: {value}" for key, value in ws_headers.items()])

#             log_message("WebSocket connected. Streaming audio...")

#             while True:
#                 chunk = audio_stream.read(buffer_size)
#                 if not chunk:
#                     break
#                 ws.send(chunk)

#             ws.close()
#             log_message("WebSocket closed, ending EAGI script.")
#     except Exception as e:
#         log_message(f"Error in audio streaming: {e}")
#         sys.exit(1)

# for line in sys.stdin:
#     log_message("Received AGI data")
#     if reading_env:
#         line = line.strip()
#         if not line:
#             reading_env = False
#             start_audio_streaming()
#             break
#         parts = line.split(":")
#         if len(parts) >= 2:
#             key = parts[0].strip()
#             value = ":".join(parts[1:]).strip()
#             agi_env[key] = value

# sys.stdin.close()
