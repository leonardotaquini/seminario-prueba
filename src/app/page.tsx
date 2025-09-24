"use client";

import { useEffect, useMemo, useState } from "react";

const INITIAL_TIME = 90 * 60;
const ACCESS_CODE = "6647";
const PENALTY = 5 * 60;

type Status = "idle" | "success" | "error" | "exploded";

export default function Home() {
  const [secondsRemaining, setSecondsRemaining] = useState(INITIAL_TIME);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "success" || status === "exploded") {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (secondsRemaining <= 0 && status !== "success") {
      setStatus("exploded");
    }
  }, [secondsRemaining, status]);

  const formattedTime = useMemo(() => {
    const hours = Math.floor(secondsRemaining / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((secondsRemaining % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(secondsRemaining % 60)
      .toString()
      .padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [secondsRemaining]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "success" || status === "exploded") {
      return;
    }

    if (code === ACCESS_CODE) {
      setStatus("success");
    } else {
      setStatus("error");
      setSecondsRemaining((prev) => Math.max(prev - PENALTY, 0));
    }

    setCode("");
  };

  const statusMessage = (() => {
    switch (status) {
      case "success":
        return "reactor estabilizado";
      case "error":
        return "codigo incrorrecto";
      case "exploded":
        return "el reactor explotó, estan todos despedidos";
      default:
        return "";
    }
  })();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(30,41,59,0.8),_rgba(15,23,42,0.95))]" />
      <div className="relative z-10 mx-4 flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-10 shadow-[0_0_60px_rgba(8,47,73,0.45)] backdrop-blur">
        <header className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-amber-400/80">panel de control</p>
          <h1 className="text-4xl font-semibold text-slate-100">Amenaza de Reactor Inestable</h1>
          <p className="max-w-md text-sm text-slate-300/80">
            Introduce el codigo de estabilizacion antes de que se agote el
            temporizador.
          </p>
        </header>

        <section className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs uppercase tracking-[0.6em] text-slate-400">tiempo restante</span>
          <div className="rounded-lg border border-amber-500/50 bg-slate-950/80 px-8 py-4 font-mono text-5xl text-amber-400 shadow-inner shadow-amber-500/20">
            {formattedTime}
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-sm flex-col gap-4"
        >
          <label className="text-left text-sm font-semibold text-slate-200">
            Codigo de acceso
          </label>
          <input
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 4))
            }
            inputMode="numeric"
            pattern="\\d{4}"
            maxLength={4}
            disabled={status === "success" || status === "exploded"}
            className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 text-center text-2xl tracking-[0.5em] text-slate-100 outline-none transition focus:border-amber-400 focus:text-amber-300 disabled:cursor-not-allowed disabled:text-slate-500"
            placeholder="0000"
            aria-label="Codigo de acceso"
          />
          <button
            type="submit"
            disabled={status === "success" || status === "exploded"}
            className="rounded-lg border border-amber-500/60 bg-gradient-to-br from-amber-500 to-orange-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-lg shadow-orange-500/30 transition hover:from-amber-400 hover:to-orange-500 disabled:cursor-not-allowed disabled:border-slate-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400"
          >
            Ingresar codigo
          </button>
        </form>

        {statusMessage && (
          <div
            className={`w-full max-w-sm rounded-lg border px-4 py-3 text-center text-sm uppercase tracking-[0.3em] ${
              status === "success"
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                : status === "error"
                  ? "border-red-500/60 bg-red-500/10 text-red-300"
                  : "border-red-700/70 bg-red-700/10 text-red-200"
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
    </main>
  );
}
