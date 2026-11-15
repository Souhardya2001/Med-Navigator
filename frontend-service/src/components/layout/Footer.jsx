import { Link } from "react-router-dom";
import Brand from "../Brand";
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Brand />
          <p className="mt-2 text-sm text-slate-500">
            AI-powered healthcare navigation
          </p>
        </div>
        <div className="flex gap-5 text-sm font-medium text-slate-600">
          <Link to="/login">Login</Link>
          <Link to="/signup">Get started</Link>
        </div>
      </div>
    </footer>
  );
}
