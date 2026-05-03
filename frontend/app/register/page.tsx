"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, BadgeCheck, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Complete all fields to create your account.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }

    if (!accepted) {
      setError("Confirm that you understand PolyTrade uses virtual credits only.");
      return;
    }

    register(name.trim(), email.trim(), password, username.trim());
    router.push("/markets");
  }

  return (
    <section className="section-container grid min-h-[calc(100vh-92px)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="max-w-xl">
        <p className="eyebrow">Create your account</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Start copying skilled traders with virtual credits.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-400">
          Build confidence in prediction markets with a virtual wallet, transparent
          positions, and copy ratio controls that keep you in charge.
        </p>
        <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <BadgeCheck className="h-5 w-5 text-cyan-300" />
          <p className="mt-3 text-lg font-semibold text-white">You’ll start with 1,000 virtual credits.</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use them to explore markets, follow traders, and learn how copy-based participation works.
          </p>
        </div>
      </div>

      <div className="glass-panel mx-auto w-full max-w-md p-6 sm:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sign up</h2>
          <p className="mt-2 text-sm text-slate-400">Create your PolyTrade profile.</p>
        </div>

        <form className="mt-8" onSubmit={onSubmit}>
          {error ? (
            <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <AuthField
            icon={UserRound}
            id="name"
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Vansh Saraf"
          />
          <AuthField
            icon={AtSign}
            id="username"
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="vanshtrades"
            className="mt-5"
          />
          <AuthField
            icon={Mail}
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vansh@polytrade.dev"
            className="mt-5"
          />
          <AuthField
            icon={LockKeyhole}
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            className="mt-5"
          />
          <AuthField
            icon={LockKeyhole}
            id="confirm-password"
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
            className="mt-5"
          />

          <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
            <input
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-white/10 bg-white/[0.04] accent-cyan-300"
            />
            I understand PolyTrade uses virtual credits only.
          </label>

          <button type="submit" className="premium-button mt-6 w-full">
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

function AuthField({
  icon: Icon,
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className,
}: {
  icon: typeof UserRound;
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-300" htmlFor={id}>
        {label}
      </label>
      <div className="premium-input mt-2 flex items-center gap-3 px-4">
        <Icon className="h-4 w-4 text-slate-500" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-white outline-none placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
