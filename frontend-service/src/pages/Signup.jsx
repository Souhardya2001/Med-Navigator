import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthShell from "../components/auth/AuthShell";
import AuthForm from "../components/auth/AuthForm";
import { signup } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { authenticate } = useAuth();

  async function handleSubmit({
    username,
    age,
    name,
    email,
    password,
  }) {
    setLoading(true);
    setError("");

    try {
      const data = await signup(
        username,
        age,
        name,
        email,
        password
      );

      authenticate(data);
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell tagline="Start navigating healthcare with greater confidence.">
      <h2 className="text-3xl font-bold tracking-tight text-navy">
        Create your account
      </h2>

      <p className="mt-2 mb-8 text-slate-600">
        Start navigating healthcare with MedNavigator.
      </p>

      <AuthForm
        type="signup"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />

      <p className="mt-7 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          className="font-semibold text-aqua hover:underline"
          to="/login"
        >
          Login
        </Link>
      </p>
    </AuthShell>
  );
}