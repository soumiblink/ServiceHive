import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requesterSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    receiverSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
