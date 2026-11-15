import { Link } from "react-router-dom";
export default function Brand({ to = "/", compact = false }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2.5 font-bold tracking-tight text-navy"
      aria-label="MedNavigator home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-aqua text-lg text-white shadow-sm">
        ✦
      </span>
      {!compact && <span className="text-xl">MedNavigator</span>}
    </Link>
  );
}
