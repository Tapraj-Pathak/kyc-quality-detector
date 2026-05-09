const statusStyles = {
  error: "border-danger/20 bg-danger/10 text-danger",
  warning: "border-warn/20 bg-amber-50 text-warn",
  success: "border-brand/20 bg-brand-soft text-brand-dark",
};

function FeedbackMessage({ message, status, score }) {
  return (
    <div
      className={`flex items-center justify-between rounded-[22px] border px-4 py-4 transition-all duration-300 ${statusStyles[status]}`}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-70">
          Real-time feedback
        </p>
        <p className="mt-1 text-[15px] font-semibold">{message}</p>
      </div>
      <span className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold shadow-sm">
        {score}%
      </span>
    </div>
  );
}

export default FeedbackMessage;
