import { Identifiers, SocketManager } from "../controllers/SocketManager.ts";

interface encoderData {
  left: number;
  right: number;
}

interface proximityData {
  led: number;
  left: number;
  forward: number;
  right: number;
}

/**
 * Parse encoder data and send it to the websocket clients
 * @param value incoming data
 */
export const encoderHandler = (value: string) => {
  const valueArray = value.split(",");
  const ob = {
    time: new Date(),
    identifier: Identifiers.ENCODER,
    data: { left: parseInt(valueArray[0]), right: parseInt(valueArray[1]) },
  };
  SocketManager.send<encoderData>(ob);
};

/**
 * Parse proximity data and send it to the websocket clients
 * @param value incoming data
 */
export const proximityHandler = (value: string) => {
  const valueArray = value.split(",");
  const ob = {
    time: new Date(),
    identifier: Identifiers.PROXIMITY,
    data: {
      led: parseInt(valueArray[0]),
      left: parseInt(valueArray[1]),
      forward: parseInt(valueArray[2]),
      right: parseInt(valueArray[3]),
    },
  };
  SocketManager.send<proximityData>(ob);
};
