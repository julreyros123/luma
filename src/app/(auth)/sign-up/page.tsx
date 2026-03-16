"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { username: form.username } },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-slate-300 text-sm">We sent a confirmation link to <span className="text-white font-medium">{form.email}</span>. Click it to activate your account.</p>
          <Link href="/sign-in" className="mt-6 inline-block text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            Back to sign in &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const passwordStrength = form.password.length >= 12 ? "strong" : form.password.length >= 8 ? "medium" : form.password.length > 0 ? "weak" : null;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-slate-300 text-sm">Start discovering your next great read</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="email" value={form.email} onChange={update("email")} required placeholder="you@example.com"
                className="w-full h-11 rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" value={form.username} onChange={update("username")} required placeholder="your_username"
                className="w-full h-11 rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} required placeholder="Min. 8 characters"
                className="w-full h-11 rounded-xl bg-white/10 border border-white/20 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordStrength && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {["weak","medium","strong"].map((s,i) => (
                    <div key={s} className={`h-1 w-8 rounded-full transition-colors ${
                      (passwordStrength === "weak" && i === 0) || (passwordStrength === "medium" && i <= 1) || passwordStrength === "strong"
                        ? passwordStrength === "weak" ? "bg-red-400" : passwordStrength === "medium" ? "bg-amber-400" : "bg-green-400"
                        : "bg-white/20"
                    }`} />
                  ))}
                </div>
                <span className={`text-xs capitalize ${passwordStrength === "weak" ? "text-red-400" : passwordStrength === "medium" ? "text-amber-400" : "text-green-400"}`}>
                  {passwordStrength}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={update("confirmPassword")} required placeholder="Repeat password"
                className="w-full h-11 rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Creating account\u2026" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-indigo-400 hover:underline">Terms</Link>{" "}and{" "}
          <Link href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>.
        </p>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
