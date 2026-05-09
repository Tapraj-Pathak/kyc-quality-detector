import KycSubmission from "../models/KycSubmission.js";
import { uploadCaptureImage } from "../services/cloudinary.service.js";

export async function uploadCapture(req, res) {
  const { imageSrc } = req.body;

  if (!imageSrc) {
    return res.status(400).json({ message: "Image capture is required." });
  }

  const uploadedImage = await uploadCaptureImage(imageSrc);
  return res.status(201).json(uploadedImage);
}

export async function listSubmissions(_req, res) {
  const submissions = await KycSubmission.find(
    {},
    {
      applicantName: 1,
      documentType: 1,
      documentNumber: 1,
      branch: 1,
      reviewStatus: 1,
      createdAt: 1,
      "capture.qualityScore": 1,
      "capture.imageUrl": 1,
    },
  )
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
  res.json(submissions);
}

export async function getSubmissionStats(_req, res) {
  const [totalSubmissions, pendingReview, approvedCount, flaggedCount, avgQuality] =
    await Promise.all([
      KycSubmission.countDocuments(),
      KycSubmission.countDocuments({ reviewStatus: "pending" }),
      KycSubmission.countDocuments({ reviewStatus: "approved" }),
      KycSubmission.countDocuments({ reviewStatus: "flagged" }),
      KycSubmission.aggregate([
        {
          $group: {
            _id: null,
            averageQuality: { $avg: "$capture.qualityScore" },
          },
        },
      ]),
    ]);

  res.json({
    totalSubmissions,
    pendingReview,
    approvedCount,
    flaggedCount,
    averageQuality: avgQuality[0]?.averageQuality
      ? Math.round(avgQuality[0].averageQuality)
      : 0,
  });
}

export async function createSubmission(req, res) {
  const {
    applicantName,
    phoneNumber,
    documentType,
    documentNumber,
    branch,
    notes,
    capture,
  } = req.body;

  if (
    !applicantName ||
    !phoneNumber ||
    !documentType ||
    !documentNumber ||
    !branch ||
    !capture?.imageUrl ||
    !capture?.publicId
  ) {
    return res.status(400).json({
      message: "Applicant details and an uploaded capture are required.",
    });
  }

  // Original production review summary thresholds:
  // capture.qualityScore >= 85 => excellent
  // capture.qualityScore >= 72 => accepted
  // Temporary testing thresholds kept lower for weak laptop cameras.
  const reviewSummary =
    capture.qualityScore >= 70
      ? "Excellent capture quality. Ready for accelerated review."
      : capture.qualityScore >= 50
        ? "Capture accepted. Manual verification recommended."
        : "Capture saved with caution. Reviewer should inspect closely.";

  const submission = await KycSubmission.create({
    applicantName,
    phoneNumber,
    documentType,
    documentNumber,
    branch,
    notes,
    reviewSummary,
    capture: {
      imageUrl: capture.imageUrl,
      publicId: capture.publicId,
      qualityScore: capture.qualityScore,
      statusMessage: capture.statusMessage,
      statusTone: capture.statusTone,
      blurVariance: capture.blurVariance,
      brightness: capture.brightness,
    },
  });

  return res.status(201).json(submission);
}
