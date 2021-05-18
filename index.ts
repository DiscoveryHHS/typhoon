import { Application } from "https://deno.land/x/oak@v7.3.0/mod.ts";

import { SocketManager } from "./controllers/SocketManager.ts";
import { CommandType, SerialInterface } from "./controllers/SerialInterface.ts";

import fileRouter from "./routes/file.ts";

const app = new Application();

app.addEventListener("listen", () => {
  console.log("Listening for HTTP requests on port 5000");
});

app.addEventListener("error", (error) => {
  console.log(error);
});

app.use(fileRouter.routes());

app.use(fileRouter.allowedMethods());

app.listen({ port: 5000 });

SocketManager.events.on("message", (json) => {
  const object = JSON.parse(json);
  console.log(object);

  if (object.key) {
    SerialInterface.send(CommandType.OPERATION, object.key);
  }
});
