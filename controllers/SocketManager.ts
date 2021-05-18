import { WebSocket } from "https://deno.land/std@0.96.0/ws/mod.ts";
import { EventEmitter } from "https://deno.land/x/event@1.0.0/mod.ts";

const activeSockets: WebSocket[] = [];

type Events = {
  message: [string, WebSocket];
  close: [WebSocket];
};

class SocketEvents extends EventEmitter<Events> {}

const socketEvents = new SocketEvents();

export class SocketManager {
  public static readonly events = socketEvents;

  public static async register(socket: WebSocket) {
    activeSockets.push(socket);

    for await (const ev of socket) {
      if (typeof ev === "string") {
        socketEvents.emit("message", ev, socket);
      }
      if (typeof ev === "object") {
        socketEvents.emit("close", socket);
      }
    }
  }

  public static send(payload: unknown) {
    for (const socket of activeSockets) {
      socket.send(JSON.stringify(payload));
    }
  }
}

socketEvents.on("close", (targetSocket) => {
  const targetIndex = activeSockets.findIndex((socket) =>
    socket === targetSocket
  );
  activeSockets.splice(targetIndex, 1);
});
