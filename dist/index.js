import express from "express";
import https from "https";
import fs from "fs";
const PORT = parseInt(process.env.PORT || "5060");
const HOST = process.env.HOST || "localhost";
const app = express();
const server = https.createServer({
    cert: fs.readFileSync("certs/localhost+2.pem"),
    key: fs.readFileSync("certs/localhost+2-key.pem"),
}, app);
server.listen(PORT, () => {
    console.log(`Server is running on https://${HOST}:${PORT}`);
});
//# sourceMappingURL=index.js.map