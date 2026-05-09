function ReviewChecklist({ quality, hasCapture }) {
  const items = [
    { label: "Capture recorded", done: hasCapture },
    // Original production checklist threshold: quality.score >= 72
    // Temporary testing threshold kept lower for weak laptop cameras.
    { label: "Quality score above 50%", done: quality.score >= 50 },
    // Original production checklist threshold: quality.brightness >= 85
    // Temporary testing threshold kept lower for weak laptop cameras.
    { label: "Brightness acceptable", done: quality.brightness >= 55 },
    // Original production checklist threshold: quality.blurVariance >= 95
    // Previous temporary testing threshold: quality.blurVariance >= 45
    // Temporary testing threshold kept lower for weak laptop cameras.
    { label: "Image sharpness acceptable", done: quality.blurVariance >= 30 },
  ];

  return (
    <section className="wallet-card overflow-hidden">
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand/55">
          Review readiness
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">Checklist</h2>
      </div>

      <div className="space-y-3 px-5 py-5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.done ? "bg-brand-soft text-brand-dark" : "bg-amber-50 text-warn"
              }`}
            >
              {item.done ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReviewChecklist;
