import asyncio
import logging
from fastapi import WebSocket
from fastapi.websockets import WebSocketDisconnect
from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)

class WebSocketCommunicator:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.message_queues: Dict[str, asyncio.Queue] = {}
        self._receiver_task: Optional[asyncio.Task] = None
        self._stop_event = asyncio.Event()

    async def start(self):
        if self._receiver_task is None:
            self._receiver_task = asyncio.create_task(self._receive_messages())
            logger.info("WebSocket receiver task started")

    async def stop(self):
        if self._receiver_task:
            self._stop_event.set()
            try:
                await self._receiver_task
            except Exception as e:
                logger.error(f"Error during receiver shutdown: {e}")
            self._receiver_task = None
            logger.info("WebSocket receiver task stopped")

    def get_queue(self, message_type: str) -> asyncio.Queue:
        if message_type not in self.message_queues:
            self.message_queues[message_type] = asyncio.Queue()
        return self.message_queues[message_type]

    async def _receive_messages(self):
        try:
            while not self._stop_event.is_set():
                try:
                    message = await self.websocket.receive_json()
                    message_type = message.get("type", "default")
                    queue = self.get_queue(message_type)
                    await queue.put(message)
                except Exception as e:
                    # If the exception indicates the connection is closed, break out of the loop.
                    if "cannot call" in str(e).lower() or isinstance(e, WebSocketDisconnect):
                        break
                    logger.error(f"Error receiving message: {e}")
        except Exception as e:
            logger.error(f"Message receiver task error: {e}")
        finally:
            self._stop_event.set()


    async def receive(self, message_type: str = "default") -> dict:
        queue = self.get_queue(message_type)
        message = await queue.get()
        return message

    async def send(self, type_: str, content: Any):
        try:
            message = {"type": type_, "content": content}
            await self.websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            self._stop_event.set()
            raise