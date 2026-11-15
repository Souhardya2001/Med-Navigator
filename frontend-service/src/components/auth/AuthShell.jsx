import { Link } from "react-router-dom";
import Brand from "../Brand";
export default function AuthShell({ children, tagline }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-12 lg:flex lg:flex-col">
        <Brand />
        <div className="my-auto max-w-md">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-teal-200">
            MedNavigator
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white">
            Clarity for your healthcare journey.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{tagline}</p>
        </div>
        <p className="text-sm text-slate-400">
          AI-powered healthcare navigation
        </p>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-[48px] border-teal-400/20" />
      </aside>
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden">
            <Brand />
          </div>
          {children}
          <p className="mt-10 text-center text-xs text-slate-400">
            MedNavigator provides informational assistance, not medical advice.
          </p>
          <Link
            to="/"
            className="mt-5 block text-center text-sm font-medium text-slate-500 hover:text-aqua"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
