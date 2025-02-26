import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import cookieParser from "cookie-parser";
import express from "express";

import { initializeDatabase } from "./database.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/book.js";
import dashboardRoutes from "./routes/dashboard.js";
import issuanceRoutes from "./routes/issuance.js";
import memberRoutes from "./routes/member.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./logger.js";
import requestLogger from "./middleware/requestLogger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

const db = await initializeDatabase();
app.locals.db = db;

app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/issuance", issuanceRoutes);

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const clientBuildPath = path.join(__dirname, "dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.use(errorHandler);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});
