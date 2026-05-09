import { formatDate, formatStatusLabel } from "../utils/formatters";

const toneStyles = {
  pending: "bg-amber-50 text-warn",
  approved: "bg-brand-soft text-brand-dark",
  flagged: "bg-danger/10 text-danger",
};

function SubmissionHistory({ submissions }) {
  return (
    <section className="wallet-card overflow-hidden">
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand/55">
          Recent activity
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">Submission history</h2>
      </div>

      <div className="space-y-3 px-5 py-5">
        {submissions.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No KYC submissions yet. Capture and save your first record.
          </div>
        ) : (
          submissions.map((submission) => (
            <article
              key={submission._id}
              className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{submission.applicantName}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {submission.documentType} • {submission.documentNumber}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[submission.reviewStatus]}`}
                >
                  {formatStatusLabel(submission.reviewStatus)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>{submission.branch}</span>
                <span>{submission.capture.qualityScore}% quality</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{formatDate(submission.createdAt)}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default SubmissionHistory;
