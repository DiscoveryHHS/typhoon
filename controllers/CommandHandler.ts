import { Identifiers, SocketManager } from "../controllers/SocketManager.ts";

interface encoderData {
  left: number;
  right: number;
}

interface proximityData {
  left: number;
  right: number;
  forward: number;
}

export const encoderHandler = (value: string) => {
  const valueArray = value.split(",");
  const ob = {
    time: new Date(),
    identifier: Identifiers.ENCODER,
    data: { left: parseInt(valueArray[0]), right: parseInt(valueArray[1]) },
  };
  SocketManager.send<encoderData>(ob);
};

export const proximityHandler = (value: string) => {
  const valueArray = value.split(",");
  const ob = {
    time: new Date(),
    identifier: Identifiers.PROXIMITY,
    data: {
      left: parseInt(valueArray[0]),
      right: parseInt(valueArray[1]),
      forward: parseInt(valueArray[2]),
    },
  };
  SocketManager.send<proximityData>(ob);
};
