import express from "express";
import https from "https";
import fs from "fs";
import connectMongo from "./config/mongodb.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";
import { appRouter } from "./routes/app.router.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";

const PORT = parseInt(process.env.PORT || "3434");
const HOST = process.env.HOST || "localhost";

connectMongo();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
  res.send("Welcome to Psychosphere API");
});
app.use("/api/v1", appRouter);
app.use(errorHandlerMiddleware);

const server = https.createServer(
  {
    cert: fs.readFileSync("certs/localhost+2.pem"),
    key: fs.readFileSync("certs/localhost+2-key.pem"),
  },
  app
);

server.listen(PORT, () => {
  console.log(`Server is running on https://${HOST}:${PORT}`);
});
