import { Router } from "https://deno.land/x/oak@v7.3.0/mod.ts";

import { SocketManager } from "../controllers/SocketManager.ts";

const router = new Router();

router.prefix("/control");

router.get("/ws", async (ctx) => {
  const socket = await ctx.upgrade();
  SocketManager.register(socket);
});

export default router;
