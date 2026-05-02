import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import VoucherRoutes from "./routes/VoucherRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS — single middleware, handles everything
app.use((req, res, next) => {
  const origin = req.headers.origin;

  const isAllowed =
    !origin ||
    origin === "https://frontendrepobaitusslamvouapp-wef5.vercel.app" ||
    (origin.includes("frontendrepobaitusslamvouapp") && origin.endsWith(".vercel.app")) ||
    origin === "http://localhost:5173" ||
    origin === "http://localhost:3000";

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ✅ Routes
app.use("", authRoutes);
app.use("", VoucherRoutes);
app.use("", adminRoutes);

// ✅ Health checks
app.get("/", (req, res) => res.json({ success: true, message: "API is live" }));
app.get("/health", (req, res) => res.send("OK"));

// ✅ Export for Vercel
export default app;
