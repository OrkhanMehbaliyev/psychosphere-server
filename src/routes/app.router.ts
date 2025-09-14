import { Router } from "express";
import authRouter from "./auth.router.js";
import chatRouter from "./chat.router.js";

export const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/chat", chatRouter);
