import { useEffect, useMemo, useState } from "react";
import ApplicantForm from "./components/ApplicantForm";
import CameraFeed, { initialQuality } from "./components/CameraFeed";
import PreviewModal from "./components/PreviewModal";
import ReviewChecklist from "./components/ReviewChecklist";
import StatusOverview from "./components/StatusOverview";
import SubmissionHistory from "./components/SubmissionHistory";
import ToastMessage from "./components/ToastMessage";
import { createSubmission, fetchDashboardData } from "./lib/api";

const initialForm = {
  applicantName: "",
  phoneNumber: "",
  documentType: "",
  documentNumber: "",
  branch: "",
  notes: "",
};

function App() {
  const [capture, setCapture] = useState(null);
  const [quality, setQuality] = useState(initialQuality);
  const [form, setForm] = useState(initialForm);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingReview: 0,
    approvedCount: 0,
    flaggedCount: 0,
    averageQuality: 0,
  });
  const [health, setHealth] = useState({ ok: false });
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date());
  }, []);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function loadDashboard() {
    try {
      setIsLoading(true);
      const data = await fetchDashboardData();
      setHealth(data.health);
      setStats(data.stats);
      setSubmissions(data.submissions);
    } catch (error) {
      setToast({
        title: "Connection issue",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!capture) {
      setToast({
        title: "Capture required",
        message: "Please take a document capture before saving the submission.",
      });
      return;
    }

    try {
      setIsSaving(true);

      await createSubmission({
        ...form,
        capture: {
          imageSrc: capture.imageSrc,
          qualityScore: capture.score,
          statusMessage: capture.status,
          statusTone: capture.statusTone,
          blurVariance: capture.meta.blurVariance,
          brightness: capture.meta.brightness,
        },
      });

      setToast({
        title: "Submission saved",
        message: "The KYC packet has been added to the review queue.",
      });
      setForm(initialForm);
      setCapture(null);
      await loadDashboard();
    } catch (error) {
      setToast({
        title: "Save failed",
        message: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  const canSubmit =
    Boolean(capture) &&
    Boolean(form.applicantName) &&
    Boolean(form.phoneNumber) &&
    Boolean(form.documentType) &&
    Boolean(form.documentNumber) &&
    Boolean(form.branch);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="wallet-card relative overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-[#0C4E09] p-5 text-white">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-6 bottom-0 h-20 w-20 rounded-full border border-white/15" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/70">
                Secure onboarding
              </p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
                Smart KYC
                <span className="block text-white/82">Capture Assistant</span>
              </h1>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-right shadow-soft backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                Session
              </p>
              <p className="mt-1 text-sm font-semibold">{todayLabel}</p>
            </div>
          </div>
          <p className="relative mt-4 max-w-xl text-sm leading-6 text-white/80">
            Capture, validate, and store KYC records with live camera quality signals and a reviewer-ready submission queue.
          </p>

          <div className="relative mt-5 grid grid-cols-3 gap-2 md:max-w-md">
            <HeaderStat label="Checks" value="Live" />
            <HeaderStat label="Mode" value="MERN" />
            <HeaderStat label="Queue" value={isLoading ? "..." : `${stats.pendingReview}`} />
          </div>
        </header>

        <StatusOverview stats={stats} health={health} />

        <section className="section-card flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand/55">
              Capture workspace
            </p>
            <h2 className="mt-1 text-base font-semibold text-ink">End-to-end KYC submission flow</h2>
          </div>
          <div className="rounded-full border border-brand/10 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-dark">
            {capture ? "Capture ready" : "Awaiting capture"}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <CameraFeed onCapture={setCapture} onQualityChange={setQuality} />
            <SubmissionHistory submissions={submissions} />
          </div>

          <div className="space-y-4">
            <ApplicantForm
              form={form}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              isSaving={isSaving}
              canSubmit={canSubmit}
              hasCapture={Boolean(capture)}
            />
            <ReviewChecklist quality={quality} hasCapture={Boolean(capture)} />
          </div>
        </div>
      </div>

      <PreviewModal capture={capture} onClose={() => setCapture(null)} />
      <ToastMessage toast={toast} onClose={() => setToast(null)} />
    </main>
  );
}

function HeaderStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/10 px-3 py-3 backdrop-blur-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/65">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default App;
