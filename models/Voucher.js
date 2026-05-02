import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    voucherName: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    idName: {
      type: String,
      required: true,
    },
    partnerArea: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["all_tests", "specific_tests"],
      required: true,
    },
    specificTests: [{ type: String }],
    discountPercentage: {
      type: String,
      enum: ["percentage", "rupee"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    totalCards: {
      type: Number,
      required: true,
    },
    // ── Partner / card background image ──────────────────────────────────
    // Stored as a relative path e.g. /uploads/partners/1234567890.jpg
    // Frontend prefixes SERVER_BASE to build the full URL
    partnerImageUrl: {
      type: String,
      default: null,
    },
    // ─────────────────────────────────────────────────────────────────────
    cards: [
      {
        cardNumber: {
          type: String,
          required: true,
          unique: true,
        },
        qrCode: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["active", "used", "expired"],
          default: "active",
        },
        usedAt: {
          type: Date,
        },
        usedBy: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Voucher", voucherSchema);
