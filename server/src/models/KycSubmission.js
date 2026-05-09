import mongoose from "mongoose";

const captureSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    qualityScore: { type: Number, required: true, min: 0, max: 100 },
    statusMessage: { type: String, required: true },
    statusTone: {
      type: String,
      enum: ["success", "warning", "error"],
      required: true,
    },
    blurVariance: { type: Number, required: true },
    brightness: { type: Number, required: true },
  },
  { _id: false },
);

const kycSubmissionSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    documentType: { type: String, required: true, trim: true },
    documentNumber: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "flagged"],
      default: "pending",
    },
    notes: { type: String, trim: true, default: "" },
    reviewSummary: {
      type: String,
      trim: true,
      default: "Awaiting manual review",
    },
    capture: { type: captureSchema, required: true },
  },
  { timestamps: true },
);

const KycSubmission = mongoose.model("KycSubmission", kycSubmissionSchema);

export default KycSubmission;
