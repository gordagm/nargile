"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j.error || "Giriş başarısız");
    }
  }

  return (
    <div className="login">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">💨</div>
        <h1>Yönetim Paneli</h1>
        <p>Devam etmek için şifreni gir</p>
        <input
          className="input"
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button className="btn btn-primary" disabled={loading || !password}>
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
        <div className="err">{err}</div>
      </form>
    </div>
  );
}
