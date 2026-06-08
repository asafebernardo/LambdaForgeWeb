"use client";

import { useState, type ReactNode } from "react";
import { SHOWCASE_SLIDES } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";

function MockScreen({ id }: { id: string }) {
  const screens: Record<string, ReactNode> = {
    library: (
      <div className="space-y-2 p-4">
        {["Better UI", "Expanded Crafting", "Survival Plus"].map((m, i) => (
          <div
            key={m}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5 text-xs transition hover:border-accent/20"
          >
            <span className="text-text/90">{m}</span>
            <span className={i === 2 ? "text-amber-400" : "text-emerald-400"}>
              {i === 2 ? "Update" : "OK"}
            </span>
          </div>
        ))}
      </div>
    ),
    browser: (
      <div className="grid grid-cols-3 gap-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-md bg-gradient-to-b from-accent/25 to-card ring-1 ring-white/5"
          />
        ))}
      </div>
    ),
    downloads: (
      <div className="space-y-3 p-4">
        {[
          { name: "Shader Pack", pct: 92 },
          { name: "QoL Mod", pct: 45 },
        ].map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex justify-between text-[10px] text-muted">
              <span>{d.name}</span>
              <span>{d.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright transition-all duration-700"
                style={{ width: `${d.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
    profiles: (
      <div className="space-y-2 p-4">
        {["Vanilla", "Modded · Main", "Hardcore"].map((p, i) => (
          <div
            key={p}
            className={`rounded-lg px-3 py-2.5 text-xs transition ${
              i === 1
                ? "bg-accent/15 text-accent ring-1 ring-accent/25"
                : "bg-white/5 text-muted"
            }`}
          >
            {p}
          </div>
        ))}
      </div>
    ),
    settings: (
      <div className="space-y-3 p-4 text-xs text-muted">
        <div className="flex justify-between rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5">
          <span>Auto-update mods</span>
          <span className="text-accent">On</span>
        </div>
        <div className="flex justify-between rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5">
          <span>Conflict warnings</span>
          <span className="text-accent">On</span>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.04] px-3 py-2.5">
          Game library paths…
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-[220px] bg-[#111113]">{screens[id] ?? screens.library}</div>
  );
}

export function ScreenshotGallery() {
  const [active, setActive] = useState(0);
  const slide = SHOWCASE_SLIDES[active];

  return (
    <section className="section-elevated py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Product preview
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
              See it in action
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Library, browser, download queue, and profiles — a real desktop workflow
              in one polished app.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-12 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
            <div
              className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
              role="tablist"
              aria-label="Launcher screens"
            >
              {SHOWCASE_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-300 lg:w-full ${
                    i === active
                      ? "border-accent/50 bg-accent/10 text-text shadow-[0_0_20px_rgba(232,93,4,0.12)]"
                      : "border-border/60 bg-card/30 text-muted hover:border-accent/25 hover:bg-card/50"
                  }`}
                >
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </div>

            <div className="relative" role="tabpanel">
              <div
                className="absolute -inset-4 rounded-3xl bg-accent/8 blur-3xl transition-opacity duration-500"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(232,93,4,0.06)]">
                <div className="flex items-center gap-2 border-b border-border/60 bg-[#0e0e10] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                  <span className="ml-2 text-xs font-medium text-muted">{slide.title}</span>
                </div>
                <div
                  key={slide.id}
                  className="animate-[fadeIn_0.35s_ease-out]"
                >
                  <MockScreen id={slide.id} />
                </div>
              </div>
              <p className="mt-5 text-center text-sm leading-relaxed text-muted lg:text-left">
                {slide.description}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
