function ToastMessage({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm animate-slide-up rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">{toast.title}</p>
          <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ToastMessage;
