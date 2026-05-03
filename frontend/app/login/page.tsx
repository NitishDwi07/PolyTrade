"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Copy, LineChart, Mail, LockKeyhole } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const benefits = [
  { label: "Follow top traders", icon: Copy },
  { label: "Practice with virtual credits", icon: BarChart3 },
  { label: "Track your portfolio in real time", icon: LineChart },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    login(email.trim(), password);
    router.push("/markets");
  }

  return (
    <section className="section-container grid min-h-[calc(100vh-92px)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="max-w-xl">
        <p className="eyebrow">Welcome back</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Trade smarter with copy-based prediction markets.
        </h1>
        <p className="mt-5 text-base leading-7 text-slate-400">
          Sign in to follow skilled traders, manage copy ratios, and keep your virtual
          portfolio moving with every market decision.
        </p>
        <div className="mt-8 grid gap-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.label} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300">
                  <Icon className="h-4 w-4" />
                </span>
                {benefit.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel mx-auto w-full max-w-md p-6 sm:p-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Log in</h2>
          <p className="mt-2 text-sm text-slate-400">Access your markets, wallet, and copied traders.</p>
        </div>

        <form className="mt-8" onSubmit={onSubmit}>
          {error ? (
            <div className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <AuthField
            icon={Mail}
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="vansh@polytrade.dev"
          />
          <AuthField
            icon={LockKeyhole}
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            className="mt-5"
          />

          <div className="mt-5 flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/[0.04] accent-cyan-300"
              />
              Remember me
            </label>
            <Link href="/login" className="font-medium text-cyan-300 hover:text-cyan-200">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="premium-button mt-6 w-full">
            Log in
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <p className="text-center text-sm text-slate-400">
          New to PolyTrade?{" "}
          <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create an account
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
  type,
  value,
  onChange,
  placeholder,
  className,
}: {
  icon: typeof Mail;
  id: string;
  label: string;
  type: string;
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
