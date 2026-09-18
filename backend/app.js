import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./src/routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL?.split(",").map(v => v.trim()) || true,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "WILD Dating API is running",
    health: "/api/health"
  });
});
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "wild-dating-api" }));
app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;