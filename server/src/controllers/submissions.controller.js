import KycSubmission from "../models/KycSubmission.js";

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
    !capture?.imageSrc
  ) {
    return res.status(400).json({
      message: "Applicant details and a valid capture are required.",
    });
  }

  const reviewSummary =
    capture.qualityScore >= 85
      ? "Excellent capture quality. Ready for accelerated review."
      : capture.qualityScore >= 72
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
      imageSrc: capture.imageSrc,
      qualityScore: capture.qualityScore,
      statusMessage: capture.statusMessage,
      statusTone: capture.statusTone,
      blurVariance: capture.blurVariance,
      brightness: capture.brightness,
    },
  });

  return res.status(201).json(submission);
}
