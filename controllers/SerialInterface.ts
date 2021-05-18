import { EventEmitter } from "https://deno.land/x/event@1.0.0/mod.ts";

const linuxSend = (serialPort: string, payload: string) => {
  Deno.writeTextFileSync(serialPort, payload);
};

const platform = "linux";

type Events = {
  receive: [string];
};

export enum CommandType {
  OPERATION = "OP:",
  QUERY = "QR:",
}

class SerialEvents extends EventEmitter<Events> {}

const serialEvents = new SerialEvents();

export class SerialInterface {
  public static readonly events = serialEvents;

  public static send(type: CommandType, message: string) {
    if (platform === "linux") linuxSend("/dev/ttyUSB0", `${type}${message}`);
  }
}
