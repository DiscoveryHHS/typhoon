import { WebSocket } from "https://deno.land/std@0.96.0/ws/mod.ts";
import { EventEmitter } from "https://deno.land/x/event@1.0.0/mod.ts";

// List of active sockets
const activeSockets: WebSocket[] = [];

// Type declarations
type Events = {
  message: [string, WebSocket];
  close: [WebSocket];
};

interface WebSocketPackage<T> {
  data: T;
  time: Date;
  identifier: Identifiers;
}

export enum Identifiers {
  PROXIMITY = "PROXIMITY",
  ENCODER = "ENCODER",
}

class SocketEvents extends EventEmitter<Events> {}

const socketEvents = new SocketEvents();

// Socketmanager, used for sending and receiving socket commands from other files.
export class SocketManager {
  public static readonly events = socketEvents;


  /**
   * Register new socket client
   *
   * @param {WebSocket} socket the new socket
   */
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


  /**
   * send new data to websockets
   *
   * @template T type of data thats wrapped in socket package
   * @param {WebSocketPackage<T>} payload the data thats wrapped in a socket package
   */
  public static send<T>(payload: WebSocketPackage<T>) {
    for (const socket of activeSockets) {
      socket.send(JSON.stringify(payload));
    }
  }
}

// Remove socket from active list when it disconnects
socketEvents.on("close", (targetSocket) => {
  const targetIndex = activeSockets.findIndex((socket) =>
    socket === targetSocket
  );
  activeSockets.splice(targetIndex, 1);
});
