import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import CaptureButton from "./CaptureButton";
import FeedbackMessage from "./FeedbackMessage";
import OverlayGuide from "./OverlayGuide";
import { checkBrightness } from "../utils/brightnessCheck";
import { analyzeBlur } from "../utils/blurDetection";

const videoConstraints = {
  facingMode: "environment",
  width: 1280,
  height: 720,
};

const initialQuality = {
  score: 0,
  blurVariance: 0,
  brightness: 0,
  status: "warning",
  message: "Initializing camera checks...",
  canCapture: false,
};

const TESTING_CAPTURE_THRESHOLDS = {
  // Original production blur threshold: 95
  // Previous temporary testing blur threshold: 45
  blurVarianceMin: 30,
  // Original production brightness threshold: 85
  brightnessMin: 55,
  // Original production capture score threshold: 72
  captureScoreMin: 50,
  // Original production blur scoring divisor: 180
  blurScoreDivisor: 110,
  // Original production brightness target: 138
  brightnessTarget: 128,
  // Original production brightness penalty multiplier: 1.2
  brightnessPenaltyMultiplier: 0.75,
  // Original production minimum displayed score: 8
  minimumDisplayedScore: 50,
};

export { initialQuality };

function checkPositioning(imageData) {
  const { data, width, height } = imageData;
  const frameX = Math.floor(width * 0.2);
  const frameY = Math.floor(height * 0.2);
  const frameWidth = Math.floor(width * 0.6);
  const frameHeight = Math.floor(height * 0.6);

  let centerBrightness = 0;
  let centerPixels = 0;
  let outerBrightness = 0;
  let outerPixels = 0;

  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 8) {
      const index = (y * width + x) * 4;
      const brightness = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
      const inCenter =
        x >= frameX &&
        x <= frameX + frameWidth &&
        y >= frameY &&
        y <= frameY + frameHeight;

      if (inCenter) {
        centerBrightness += brightness;
        centerPixels += 1;
      } else {
        outerBrightness += brightness;
        outerPixels += 1;
      }
    }
  }

  const centerAverage = centerBrightness / centerPixels;
  const outerAverage = outerBrightness / outerPixels;
  const contrastDelta = Math.abs(centerAverage - outerAverage);

  return {
    confidence: Math.min(100, contrastDelta * 4.5),
    needsAdjustment: contrastDelta < 14,
  };
}

function CameraFeed({ capture, isUploadingCapture, onCapture, onRetake, onQualityChange }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [quality, setQuality] = useState(initialQuality);
  const [hasCameraError, setHasCameraError] = useState(false);

  useEffect(() => {
    if (capture) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const video = webcamRef.current?.video;

      if (!video || video.readyState < 2 || !canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        return;
      }

      context.drawImage(video, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const blur = analyzeBlur(imageData);
      const brightness = checkBrightness(imageData);
      const positioning = checkPositioning(imageData);

      const isTooBlurry = blur.variance < TESTING_CAPTURE_THRESHOLDS.blurVarianceMin;
      const isLowLight = brightness.average < TESTING_CAPTURE_THRESHOLDS.brightnessMin;
      const needsPositioning = positioning.needsAdjustment;

      let message = "Perfect - capture now";
      let status = "success";

      if (isTooBlurry) {
        message = "Too blurry";
        status = "error";
      } else if (isLowLight) {
        message = "Low light";
        status = "warning";
      } else if (needsPositioning) {
        message = "Adjust position";
        status = "warning";
      }

      const blurScore = Math.min(
        100,
        (blur.variance / TESTING_CAPTURE_THRESHOLDS.blurScoreDivisor) * 100,
      );
      const brightnessScore =
        100 -
        Math.min(
          100,
          Math.abs(brightness.average - TESTING_CAPTURE_THRESHOLDS.brightnessTarget) *
            TESTING_CAPTURE_THRESHOLDS.brightnessPenaltyMultiplier,
        );
      const framingScore = needsPositioning ? positioning.confidence : 100;
      const score = Math.max(
        TESTING_CAPTURE_THRESHOLDS.minimumDisplayedScore,
        Math.round(blurScore * 0.52 + brightnessScore * 0.3 + framingScore * 0.18),
      );

      setQuality((current) => {
        const nextCanCapture =
          !isTooBlurry &&
          !isLowLight &&
          !needsPositioning &&
          score >= TESTING_CAPTURE_THRESHOLDS.captureScoreMin;

        const nextQuality =
          current.message === message &&
          current.status === status &&
          Math.abs(current.score - score) < 2
            ? {
                ...current,
                score,
                blurVariance: blur.variance,
                brightness: brightness.average,
                canCapture: nextCanCapture,
              }
            : {
                score,
                blurVariance: blur.variance,
                brightness: brightness.average,
                status,
                message,
                canCapture: nextCanCapture,
              };

        onQualityChange?.(nextQuality);
        return nextQuality;
      });
    }, 400);

    return () => window.clearInterval(intervalId);
  }, [capture, onQualityChange]);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc || !quality.canCapture || isUploadingCapture) {
      return;
    }

    onCapture({
      imageSrc,
      score: quality.score,
      status: quality.message,
      statusTone: quality.status,
      meta: {
        blurVariance: quality.blurVariance,
        brightness: quality.brightness,
      },
    });
  };

  return (
    <section className="wallet-card animate-slide-up overflow-hidden p-0">
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand/60">
              Live analysis
            </p>
            <h3 className="mt-1 text-lg font-semibold text-ink">Document capture</h3>
            <p className="mt-1 text-sm text-slate-500">
              Capture first, then review the uploaded preview and retake if needed.
            </p>
          </div>
          <div className="rounded-2xl border border-brand/10 bg-brand-soft px-3 py-2 text-center text-brand-dark">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand/60">
              Quality
            </p>
            <p className="mt-1 text-lg font-semibold">{capture?.score ?? quality.score}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5 sm:pb-5">
        <div className="section-card p-3">
          <div className="relative overflow-hidden rounded-[26px] bg-slate-900 shadow-soft">
            {capture ? (
              <img
                src={capture.previewSrc || capture.imageSrc || capture.imageUrl}
                alt="Captured document preview"
                className="aspect-[3/4] w-full object-cover sm:aspect-[4/5]"
              />
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  mirrored
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="aspect-[3/4] w-full object-cover sm:aspect-[4/5]"
                  onUserMediaError={() => setHasCameraError(true)}
                />
                <OverlayGuide />
              </>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {hasCameraError ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
            Camera access is blocked. Please allow webcam permission and refresh the page.
          </div>
        ) : null}

        <FeedbackMessage
          message={capture ? "Capture uploaded successfully" : quality.message}
          status={capture ? "success" : quality.status}
          score={capture?.score ?? quality.score}
        />

        <div className="section-card p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Live metrics
              </p>
              <p className="mt-1 text-sm text-slate-500">Realtime signal health for this capture.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {capture ? "Preview locked" : "Updates every 400ms"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <MetricCard label="Sharpness" value={Math.round(capture?.meta?.blurVariance ?? quality.blurVariance)} />
            <MetricCard label="Brightness" value={Math.round(capture?.meta?.brightness ?? quality.brightness)} />
            <MetricCard label="Capture" value={capture ? "Uploaded" : quality.canCapture ? "Ready" : "Hold"} />
          </div>
        </div>

        {capture ? (
          <button
            type="button"
            onClick={onRetake}
            className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Retake capture
          </button>
        ) : (
          <CaptureButton disabled={!quality.canCapture || isUploadingCapture} onClick={handleCapture} />
        )}

        {isUploadingCapture ? (
          <p className="text-center text-sm text-slate-500">Uploading capture to Cloudinary...</p>
        ) : null}
      </div>
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}

export default CameraFeed;
