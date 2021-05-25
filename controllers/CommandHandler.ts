import { SocketManager } from "../controllers/SocketManager.ts";

interface encoderDate {
    left: number,
    right: number
}

export const encoderHandler = (value: string) => {
  const valueArray = value.split(",");
  const ob = {time: new Date(), data: { left: parseInt(valueArray[0]), right: parseInt(valueArray[1]) }}
  SocketManager.send<encoderDate>(ob);
};