const documentTypes = ["Citizenship", "Passport", "National ID", "Driving License"];
const branches = ["Kathmandu", "Pokhara", "Biratnagar", "Butwal"];

function ApplicantForm({ form, onChange, onSubmit, isSaving, canSubmit, hasCapture }) {
  return (
    <section className="wallet-card overflow-hidden">
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand/55">
          Applicant intake
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">Submission details</h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the applicant record and attach a verified capture.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Applicant name"
            name="applicantName"
            value={form.applicantName}
            onChange={onChange}
            placeholder="Sujal Pandeya"
          />
          <FormField
            label="Phone number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="98XXXXXXXX"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Document type"
            name="documentType"
            value={form.documentType}
            onChange={onChange}
            options={documentTypes}
          />
          <FormField
            label="Document number"
            name="documentNumber"
            value={form.documentNumber}
            onChange={onChange}
            placeholder="01-02-78-12345"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Branch"
            name="branch"
            value={form.branch}
            onChange={onChange}
            options={branches}
          />
          <div className="rounded-[22px] border border-brand/10 bg-brand-soft px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/60">
              Capture state
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-dark">
              {hasCapture ? "Capture uploaded and ready" : "Waiting for capture"}
            </p>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            name="notes"
            rows="4"
            value={form.notes}
            onChange={onChange}
            placeholder="Optional reviewer context"
            className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isSaving}
          className={`w-full rounded-[22px] px-4 py-4 text-base font-semibold transition ${
            !canSubmit || isSaving
              ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
              : "bg-brand text-white shadow-glow hover:bg-brand-dark"
          }`}
        >
          {isSaving ? "Saving submission to database..." : "Save KYC submission"}
        </button>
      </form>
    </section>
  );
}

function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
      />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        {...props}
        className="mt-2 w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ApplicantForm;
