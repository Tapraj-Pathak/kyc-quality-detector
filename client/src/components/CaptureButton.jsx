function CaptureButton({ disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-[22px] px-4 py-4 text-base font-semibold transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
          : "animate-pulse-glow bg-brand text-white shadow-glow hover:bg-brand-dark active:scale-[0.99]"
      }`}
    >
      {disabled ? "Improve quality to capture" : "Capture document"}
    </button>
  );
}

export default CaptureButton;
