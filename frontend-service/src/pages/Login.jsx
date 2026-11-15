import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthShell from "../components/auth/AuthShell";
import AuthForm from "../components/auth/AuthForm";
import { login } from "../services/authApi";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  async function handleSubmit({ email, password }) {
    setLoading(true);
    setError("");
    try {
      const data = await login(email, password);
      authenticate(data);
      navigate("/chat");
    } catch (err) {
      setError(
        err.status === 401
          ? "Your email or password is incorrect."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthShell tagline="A calm, simple place to understand information and find your next step.">
      <h2 className="text-3xl font-bold tracking-tight text-navy">
        Welcome back
      </h2>
      <p className="mt-2 mb-8 text-slate-600">
        Sign in to continue your healthcare journey.
      </p>
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      <p className="mt-7 text-center text-sm text-slate-600">
        Don’t have an account?{" "}
        <Link className="font-semibold text-aqua hover:underline" to="/signup">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
