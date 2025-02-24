import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { initializeDatabase } from "./database.js";
import { logger } from "./middleware/logger.js";
import authRoutes from "./routes/auth.js";
import memberRoutes from "./routes/member.js";
import bookRoutes from "./routes/book.js";
import dashboardRoutes from "./routes/dashboard.js";
import issuanceRoutes from "./routes/issuance.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(logger);

const db = await initializeDatabase();
app.locals.db = db;

// Mount all API routes under /api
app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/issuance", issuanceRoutes);

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
