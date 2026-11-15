import { Link } from "react-router-dom";
import Brand from "../Brand";
export default function Navbar() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Brand />
      <nav className="flex items-center gap-2 sm:gap-5">
        <Link
          to="/login"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:text-aqua"
        >
          Login
        </Link>
        <Link to="/signup" className="btn-primary px-4 py-2.5 text-sm">
          Get started <span className="ml-1">→</span>
        </Link>
      </nav>
    </header>
  );
}
