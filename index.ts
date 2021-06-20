import { Application } from "https://deno.land/x/oak@v7.3.0/mod.ts";

import { SocketManager } from "./controllers/SocketManager.ts";
import { CommandType, SerialInterface } from "./controllers/SerialInterface.ts";

import controlRouter from "./routes/control.ts";

const app = new Application();

app.addEventListener("listen", () => {
  console.log("Listening for HTTP requests on port 5000");
});

app.addEventListener("error", (error) => {
  console.log(error);
});

app.use(controlRouter.routes());
app.use(controlRouter.allowedMethods());

// start server
app.listen({ port: 5000 });

// On incomming websocket commands
SocketManager.events.on("message", async (json) => {
  try {
    const object = JSON.parse(json);
    console.log("Incomming Socket command: ", object);

    if (object.command) {
      await SerialInterface.send(CommandType.OPERATION, object.command);
    }
  } catch (err) {
    console.error(err);
  }
});

// Encoder query interval
setInterval(() => {
  SerialInterface.send(CommandType.GET_ENCODERS, ";");
}, 2000);