import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const features = [
  [
    "✦",
    "AI Health Assistant",
    "Have natural, thoughtful conversations about your healthcare questions.",
  ],
  [
    "⌁",
    "Grounded information",
    "Explore relevant medical information drawn from a trusted knowledge system.",
  ],
  [
    "⌖",
    "Nearby care discovery",
    "Find healthcare facilities nearby when sharing your location feels helpful.",
  ],
];
const steps = [
  ["01", "Ask", "Share what is on your mind in everyday language."],
  ["02", "Understand", "Get clear, grounded information to help orient you."],
  ["03", "Find", "Discover relevant care options in your area."],
  ["04", "Navigate", "Take your next step with more confidence."],
];
export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
          <div className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" />
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
            <div className="animate-fade-up">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-mist px-3 py-1.5 text-sm font-semibold text-aqua">
                <span className="h-2 w-2 rounded-full bg-aqua" /> Healthcare,
                made clearer
              </p>
              <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-navy sm:text-6xl">
                Navigate healthcare{" "}
                <span className="text-aqua">with confidence.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                MedNavigator is an AI-powered healthcare navigation assistant
                that helps you understand medical information and find relevant
                healthcare facilities.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" to="/signup">
                  Start using MedNavigator <span className="ml-2">→</span>
                </Link>
                <a className="btn-secondary" href="#how-it-works">
                  Learn how it works <span className="ml-2">↓</span>
                </a>
              </div>
              <p className="mt-5 text-xs text-slate-500">
                Built to support your next step—not replace your clinician.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white bg-white p-4 shadow-soft">
              <div className="rounded-[1.5rem] bg-[#f4faf9] p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-aqua text-white">
                    ✦
                  </span>
                  <div>
                    <p className="font-semibold text-navy">MedNavigator</p>
                    <p className="text-xs text-aqua">
                      Here to help you navigate
                    </p>
                  </div>
                </div>
                <div className="mt-7 rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 text-slate-600 shadow-card">
                  I’m looking for a cardiology hospital near me.
                </div>
                <div className="ml-auto mt-4 w-4/5 rounded-2xl rounded-tr-sm bg-navy p-4 text-sm leading-6 text-white">
                  I can help you explore relevant facilities. If you choose to
                  share it, your location can help refine results.
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-400">
                  <span>Ask MedNavigator...</span>
                  <span className="ml-auto text-aqua">➤</span>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-7 hidden rounded-2xl border border-white bg-white p-3 shadow-card sm:flex sm:items-center sm:gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 text-aqua">
                  ⌖
                </span>
                <span className="text-sm font-semibold text-ink">
                  Care options, nearby
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-mist py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[.16em] text-aqua">
                A calmer way forward
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                Helpful at every point in your healthcare journey.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {features.map(([icon, title, text]) => (
                <article
                  key={title}
                  className="rounded-2xl border border-teal-100/70 bg-white p-7 shadow-card"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-xl text-aqua">
                    {icon}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy">{title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-5 py-20 sm:px-8"
        >
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-aqua">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              A simple path to your next step.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, text], index) => (
              <article key={title} className="relative">
                <span className="text-sm font-bold text-aqua">{number}</span>
                <h3 className="mt-3 text-xl font-bold text-navy">{title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{text}</p>
                {index < 3 && (
                  <span className="absolute right-0 top-5 hidden text-xl text-teal-300 lg:block">
                    →
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-6 py-5 text-sm leading-6 text-slate-600">
            <strong className="font-semibold text-ink">
              A note about your care.
            </strong>{" "}
            MedNavigator provides informational assistance and healthcare
            navigation support. It is not a substitute for professional medical
            advice, diagnosis, or treatment.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
