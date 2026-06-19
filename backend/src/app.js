import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import cafeRoutes from "./routes/cafeRoutes.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Tribeca Cafe API", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api", cafeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
