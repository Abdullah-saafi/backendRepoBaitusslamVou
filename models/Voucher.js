import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
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
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    expiryDate: { type: Date, required: true },
    totalCards: { type: Number, required: true },
    cards: [
      {
        cardNumber: { type: String, required: true, unique: true },
        qrCode: { type: String, required: true },
        status: {
          type: String,
          enum: ["active", "used", "expired"],
          default: "active",
        },
        usedAt: { type: Date },
        usedBy: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Voucher", voucherSchema);
