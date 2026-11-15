import { useState } from "react";

export default function AuthForm({ type, onSubmit, loading, error }) {
  const signup = type === "signup";

  const [showPassword, setShowPassword] = useState(false);

  const [fields, setFields] = useState({
    username: "",
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState({});

  function submit(event) {
    event.preventDefault();

    const next = {};

    if (signup && !fields.username.trim())
      next.username = "Please enter a username.";

    if (signup && !fields.name.trim())
      next.name = "Please enter your name.";

    if (!/^\S+@\S+\.\S+$/.test(fields.email))
      next.email = "Enter a valid email address.";

    if (signup && !fields.age)
      next.age = "Please enter your age.";

    if (signup && (Number(fields.age) < 1 || Number(fields.age) > 120))
      next.age = "Enter a valid age.";

    if (!fields.password)
      next.password = "Please enter a password.";

    if (signup && fields.password !== fields.confirmPassword)
      next.confirmPassword = "Passwords do not match.";

    setValidation(next);

    if (!Object.keys(next).length) {
      onSubmit(fields);
    }
  }

  const update = (key) => (event) =>
    setFields({
      ...fields,
      [key]: event.target.value,
    });

  return (
    <form onSubmit={submit} noValidate className="space-y-5">

      {signup && (
        <Field
          id="username"
          label="Username"
          value={fields.username}
          onChange={update("username")}
          error={validation.username}
          autoComplete="username"
        />
      )}

      {signup && (
        <Field
          id="name"
          label="Name"
          value={fields.name}
          onChange={update("name")}
          error={validation.name}
          autoComplete="name"
        />
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        value={fields.email}
        onChange={update("email")}
        error={validation.email}
        autoComplete="email"
      />

      {signup && (
        <Field
          id="age"
          label="Age"
          type="number"
          min="1"
          max="120"
          value={fields.age}
          onChange={update("age")}
          error={validation.age}
          autoComplete="off"
        />
      )}

      <div>
        <label
          htmlFor="password"
          className="text-sm font-semibold text-ink"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={fields.password}
            onChange={update("password")}
            className="field pr-16"
            autoComplete={signup ? "new-password" : "current-password"}
            aria-invalid={Boolean(validation.password)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-aqua"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {validation.password && (
          <p className="mt-1 text-xs text-red-600">
            {validation.password}
          </p>
        )}
      </div>

      {signup && (
        <Field
          id="confirmPassword"
          label="Confirm password"
          type="password"
          value={fields.confirmPassword}
          onChange={update("confirmPassword")}
          error={validation.confirmPassword}
          autoComplete="new-password"
        />
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="btn-primary w-full"
        type="submit"
      >
        {loading ? "Please wait…" : signup ? "Create account" : "Login"}
      </button>
    </form>
  );
}

function Field({ id, label, error, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-ink"
      >
        {label}
      </label>

      <input
        id={id}
        className="field"
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}