function StatusOverview({ stats, health }) {
  const cards = [
    { label: "Total submissions", value: stats.totalSubmissions, tone: "text-ink" },
    { label: "Pending review", value: stats.pendingReview, tone: "text-warn" },
    { label: "Approved", value: stats.approvedCount, tone: "text-brand-dark" },
    { label: "Average quality", value: `${stats.averageQuality}%`, tone: "text-ink" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="wallet-card px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {card.label}
          </p>
          <p className={`mt-3 text-2xl font-semibold ${card.tone}`}>{card.value}</p>
        </div>
      ))}

      <div className="wallet-card px-5 py-4 md:col-span-2 xl:col-span-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Platform health
            </p>
            <p className="mt-1 text-sm text-slate-600">
              API service is live and ready for capture submissions.
            </p>
          </div>
          <div className="rounded-full border border-brand/10 bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-dark">
            {health.ok ? "API online" : "API offline"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusOverview;
