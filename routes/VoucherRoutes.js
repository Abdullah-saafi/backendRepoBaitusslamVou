import express from "express";
import {
  createVoucher,
  getAllVouchers,
  getVoucherCards,
  deleteVoucher,
  getCardDetails,
  useCard,
  upload, // ← multer middleware exported from controller
} from "../controller/VouControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Protected routes - require authentication
// upload.single("partnerImage") runs before createVoucher
// it parses the multipart/form-data and attaches req.file
router.post(
  "/create-voucher",
  verifyToken,
  upload.single("partnerImage"),
  createVoucher,
);
router.get("/vouchers", verifyToken, getAllVouchers);
router.get("/voucher/:id/cards", verifyToken, getVoucherCards);
router.delete("/delete-voucher/:id", verifyToken, deleteVoucher);
router.get("/card/:cardNumber", verifyToken, getCardDetails);
router.post("/use-card", verifyToken, useCard);

export default router;
