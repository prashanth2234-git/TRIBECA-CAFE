let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitQueueUpdate(payload) {
  if (ioInstance) {
    ioInstance.to("queue").emit("queue:update", payload);
  }
}
