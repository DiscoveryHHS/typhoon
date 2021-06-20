import { EventEmitter } from "https://deno.land/x/event@1.0.0/mod.ts";
import { encoderHandler, proximityHandler } from "./CommandHandler.ts";

/**
 * Send text to the serial port
 * @param serialPort The (xbee) serial port, example: /dev/ttyUSB0
 * @param payload  The text that needs to be send.
 */
const linuxSend = async (serialPort: string, payload: string) => {
  await Deno.writeTextFile(serialPort, payload);
};

/**
 * Linux receive logic, reads serial port buffer
 * @param serialPort The (xbee) serial port, example: /dev/ttyUSB0
 * @returns data as a string.
 */
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

//Platform setting, linux is supported.
const platform = "linux";

// Type declarations
type Events = {
  receive: [string];
};

export enum CommandType {
  SETMOTORS = "SM",
  GET_ENCODERS = "GE",
  OPERATION = "",
}

class SerialEvents extends EventEmitter<Events> {}
const serialEvents = new SerialEvents();

// Serial interface class, used for sending and receiving all serial data from other files.
export class SerialInterface {
  public static readonly events = serialEvents;

  public static async send(type: CommandType, message: string) {
    if (platform === "linux") {
      await linuxSend("/dev/ttyUSB0", `${type}${type.length > 0 ? ":" : ""}${message}\n`);
    }

    console.log("Sending serial: ", { type, message });
  }
}

// Read serial port 2x a second.
setInterval(async () => {
  const received = await linuxReceive("/dev/ttyUSB0");

  if (received.length > 0) {
    const commandArray = received.split("\n");

    for (const command of commandArray) {
      if (command.length > 0) {
        console.log("Incomming serial:", command);
        const [commandType, value] = command.split(":");
        switch (commandType) {
          case "EC":
            encoderHandler(value);
            break;
          case "PR":
            proximityHandler(value);
            break;
        }
      }
    }
  }
}, 500);
