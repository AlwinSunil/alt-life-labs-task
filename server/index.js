import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { initializeDatabase } from "./database.js";
import { logger } from "./middleware/logger.js";
import authRoutes from "./routes/auth.js";

import memberRoutes from "./routes/member.js";
import bookRoutes from "./routes/book.js";
import dashboardRoutes from "./routes/dashboard.js";
import issuanceRoutes from "./routes/issuance.js";

dotenv.config();

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

// Mount the auth routes on '/auth'
app.use("/auth", authRoutes);

app.use("/member", memberRoutes);
app.use("/book", bookRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/issuance", issuanceRoutes);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
