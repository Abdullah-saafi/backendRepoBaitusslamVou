import express from "express";
import {
  createVoucher,
  getAllVouchers,
  getVoucherCards,
  deleteVoucher,
  getCardDetails,
  useCard,
} from "../controller/VouControllers.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/create-voucher", verifyToken, createVoucher);
router.get("/vouchers", verifyToken, getAllVouchers);
router.get("/voucher/:id/cards", verifyToken, getVoucherCards);
router.delete("/delete-voucher/:id", verifyToken, deleteVoucher);
router.get("/card/:cardNumber", verifyToken, getCardDetails);
router.post("/use-card", verifyToken, useCard);

export default router;
