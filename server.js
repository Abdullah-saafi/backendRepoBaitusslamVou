import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import VoucherRoutes from "./routes/VoucherRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
// Allow your frontend to access static files
app.use(
  "/uploads",
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // add all frontend URLs
  }),
  express.static(path.join(path.resolve(), "uploads")),
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  }),
);
app.use("", authRoutes);
app.use("", adminRoutes);
app.use("/", VoucherRoutes);

app.get("", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port this PORT ${PORT}`),
);
