// controller/VouControllers.js
import Voucher from "../models/Voucher.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// Create a new voucher
export const createVoucher = async (req, res) => {
  const {
    voucherName,
    shopName,
    idName,
    partnerArea,
    discountType,
    specificTests,
    discountPercentage,
    discountValue,
    expiryDate,
    totalCards,
  } = req.body;

  try {
    console.log("=== CREATE VOUCHER REQUEST ===");
    console.log(req.body);

    // Validate required fields
    if (
      !voucherName ||
      !shopName ||
      !idName ||
      !partnerArea ||
      !discountType ||
      !discountPercentage ||
      !discountValue ||
      !expiryDate ||
      !totalCards
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        received: req.body,
      });
    }

    const cards = [];

    for (let i = 0; i < totalCards; i++) {
      const cardNumber = `${idName}-${Date.now()}-${uuidv4()
        .slice(0, 4)
        .toUpperCase()}`;

      cards.push({
        cardNumber,
        qrCode: cardNumber,
        status: "active",
      });
    }

    const voucher = new Voucher({
      voucherName,
      shopName,
      idName,
      partnerArea,
      discountType,
      specificTests: discountType === "specific_tests" ? specificTests : [],
      discountPercentage,
      discountValue,
      expiryDate,
      totalCards,
      cards,
    });

    await voucher.save();

    console.log("=== VOUCHER CREATED SUCCESSFULLY ===");
    console.log(voucher);

    res.status(201).json({ message: "Voucher created", voucher });
  } catch (err) {
    console.error("CREATE VOUCHER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all vouchers
export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    res.status(200).json(vouchers);
  } catch (err) {
    console.error("GET ALL VOUCHERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all cards of a voucher
export const getVoucherCards = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });

    res.status(200).json(voucher.cards);
  } catch (err) {
    console.error("GET VOUCHER CARDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a voucher (robust version)
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE REQUEST ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid voucher id" });
    }

    const voucher = await Voucher.findByIdAndDelete(id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get details of a specific card
export const getCardDetails = async (req, res) => {
  try {
    const value = req.params.cardNumber;

    const voucher = await Voucher.findOne({
      $or: [{ "cards.cardNumber": value }, { "cards.qrCode": value }],
    });

    if (!voucher) return res.status(404).json({ message: "Card not found" });

    const card = voucher.cards.find(
      (c) => c.cardNumber === value || c.qrCode === value,
    );

    res.status(200).json({
      card,
      voucher: {
        voucherName: voucher.voucherName,
        shopName: voucher.shopName,
        discountPercentage: voucher.discountPercentage,
        discountValue: voucher.discountValue,
        discountType: voucher.discountType,
        specificTests: voucher.specificTests,
        expiryDate: voucher.expiryDate,
      },
    });
  } catch (err) {
    console.error("GET CARD DETAILS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Use a card
export const useCard = async (req, res) => {
  const { cardNumber, usedBy } = req.body;

  console.log("useCard body:", req.body);

  try {
    const voucher = await Voucher.findOne({ "cards.cardNumber": cardNumber });

    if (!voucher) return res.status(404).json({ message: "Card not found" });

    const card = voucher.cards.find((c) => c.cardNumber === cardNumber);

    if (!card)
      return res.status(404).json({ message: "Card not found in voucher" });

    if (card.status !== "active")
      return res.status(400).json({ message: `Card is ${card.status}` });

    if (new Date(voucher.expiryDate) < new Date()) {
      card.status = "expired";
      await voucher.save();
      return res.status(400).json({ message: "Card expired" });
    }

    card.status = "used";
    card.usedAt = new Date();
    card.usedBy = usedBy || "Unknown";

    await voucher.save();

    res.status(200).json({ message: "Discount applied", card });
  } catch (err) {
    console.error("USE CARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Tech report route
export const getTechReport = async (req, res) => {
  try {
    const { techName } = req.params;
    const { startDate, endDate } = req.query;

    const vouchers = await Voucher.find();
    const report = [];

    vouchers.forEach((voucher) => {
      voucher.cards.forEach((card) => {
        if (card.usedBy === techName && card.status === "used") {
          let includeCard = true;

          if (startDate && endDate && card.usedAt) {
            const usedDate = new Date(card.usedAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59);

            if (usedDate < start || usedDate > end) includeCard = false;
          }

          if (includeCard) {
            report.push({
              shopName: voucher.shopName,
              cardNumber: card.cardNumber,
              discount:
                voucher.discountPercentage === "percentage"
                  ? `${voucher.discountValue}%`
                  : `PKR ${voucher.discountValue}`,
              discountValue: voucher.discountValue,
              discountType: voucher.discountType,
              usedAt: card.usedAt,
            });
          }
        }
      });
    });

    res.status(200).json(report);
  } catch (err) {
    console.error("TECH REPORT ERROR:", err);
    res.status(500).json({ message: "Error fetching report" });
  }
};
