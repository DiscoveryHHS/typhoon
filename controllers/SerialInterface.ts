import { EventEmitter } from "https://deno.land/x/event@1.0.0/mod.ts";
import { encoderHandler } from "./CommandHandler.ts";

const linuxSend = async (serialPort: string, payload: string) => {
  await Deno.writeTextFile(serialPort, payload);
};

const linuxReceive = async (serialPort: string) => {
  const cmd = Deno.run({
    cmd: ["cat", serialPort],
    stdout: "piped",
  });

  const decoder = new TextDecoder();

  setTimeout(() => {
    cmd.close();
  }, 500);

  const buffer = await cmd.output();
  const plainText = decoder.decode(buffer);
  return plainText;
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

  public static async send(_type: CommandType, message: string) {
    if (platform === "linux") await linuxSend("/dev/ttyUSB0", `${message}\n`);
  }
}

setInterval(async () => {
  const received = await linuxReceive("/dev/ttyUSB0");

  if (received.length > 0) {
    const commandArray = received.split("\n");

    for (const command of commandArray) {
      if (command.length > 0) {
        const [commandType, value] = command.split(":");
        switch (commandType) {
          case "EC":
            encoderHandler(value);
            break;
        }
      }
    }
  }
}, 500);
