import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureCloudinary() {
  if (configured) {
    return;
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
}

export async function uploadCaptureImage(dataUrl) {
  ensureCloudinary();

  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    throw new Error("A valid image capture is required for upload.");
  }

  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: "smart-kyc-captures",
    resource_type: "image",
  });

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format,
  };
}
