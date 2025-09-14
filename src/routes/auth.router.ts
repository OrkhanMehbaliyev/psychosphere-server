import { Router } from "express";
import authHandler from "../handlers/auth.handler.js";
import { userAuthMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
authRouter.post("/register", authHandler.registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", authHandler.loginUser);

/**
 * @swagger
 * /auth/renew:
 *   post:
 *     summary: Renew access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenewToken'
 *     responses:
 *       200:
 *         description: Token renewed successfully
 *       401:
 *         description: Invalid or expired token
 */
authRouter.post("/renew", authHandler.renewAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post("/logout", userAuthMiddleware, authHandler.logoutUser);

export default authRouter;
