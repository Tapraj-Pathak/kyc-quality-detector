const toneStyles = {
  error: "bg-danger/10 text-danger",
  warning: "bg-amber-50 text-warn",
  success: "bg-brand-soft text-brand-dark",
};

function PreviewModal({ capture, onClose }) {
  if (!capture) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 sm:items-center">
      <div className="wallet-card animate-slide-up w-full max-w-md overflow-hidden">
        <div className="border-b border-slate-100 px-5 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/60">
                Captured preview
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Review capture</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              Close
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Confirm the document is crisp, centered, and ready for submission.
          </p>
        </div>

        <div className="space-y-4 px-5 pb-5 pt-4">
          <div className="section-card p-3">
            <div className="overflow-hidden rounded-[24px] bg-slate-100">
              <img
                src={capture.imageSrc}
                alt="Captured document preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="metric-card">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Quality score
              </p>
              <p className="mt-1 text-xl font-semibold text-ink">{capture.score}%</p>
            </div>
            <div
              className={`rounded-[22px] px-4 py-3 text-right ${toneStyles[capture.statusTone]}`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">
                Status
              </p>
              <p className="mt-1 text-sm font-semibold">{capture.status}</p>
            </div>
          </div>

          <div className="section-card p-3">
            <div className="mb-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Analysis breakdown
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Review the final frame before saving it into the KYC queue.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PreviewMetric label="Blur variance" value={Math.round(capture.meta.blurVariance)} />
              <PreviewMetric label="Brightness" value={Math.round(capture.meta.brightness)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ label, value }) {
  return (
    <div className="metric-card">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export default PreviewModal;
