"use client";

import { useState, type ReactNode } from "react";
import { SHOWCASE_SLIDES } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";

function MockScreen({ id }: { id: string }) {
  const screens: Record<string, ReactNode> = {
    library: (
      <div className="space-y-2 p-4">
        {["Better UI", "Expanded Crafting", "Survival Plus"].map((m, i) => (
          <div key={m} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-xs">
            <span>{m}</span>
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
          <div key={i} className="aspect-[2/3] rounded-sm bg-gradient-to-b from-accent/20 to-card" />
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
                className="h-full rounded-full bg-accent"
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
            className={`rounded-md px-3 py-2 text-xs ${
              i === 1 ? "bg-accent/15 text-accent" : "bg-white/5 text-muted"
            }`}
          >
            {p}
          </div>
        ))}
      </div>
    ),
    settings: (
      <div className="space-y-3 p-4 text-xs text-muted">
        <div className="flex justify-between rounded-md bg-white/5 px-3 py-2">
          <span>Auto-update mods</span>
          <span className="text-accent">On</span>
        </div>
        <div className="flex justify-between rounded-md bg-white/5 px-3 py-2">
          <span>Conflict warnings</span>
          <span className="text-accent">On</span>
        </div>
        <div className="rounded-md bg-white/5 px-3 py-2">Game library paths…</div>
      </div>
    ),
  };

  return (
    <div className="min-h-[200px] bg-[#111113]">{screens[id] ?? screens.library}</div>
  );
}

export function ScreenshotGallery() {
  const [active, setActive] = useState(0);
  const slide = SHOWCASE_SLIDES[active];

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">See it in action</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              A launcher built for modding workflows — library, browser, queue, and profiles in one place.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mt-10 lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {SHOWCASE_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`shrink-0 rounded-lg border px-4 py-3 text-left text-sm transition lg:w-full ${
                    i === active
                      ? "border-accent/50 bg-accent/10 text-text"
                      : "border-border/60 bg-card/30 text-muted hover:border-accent/30"
                  }`}
                >
                  <span className="font-medium">{s.title}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-accent/5 blur-2xl" aria-hidden />
              <div className="relative overflow-hidden rounded-xl border border-border/80 bg-[#111113] shadow-2xl">
                <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#f87171]" />
                  <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
                  <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
                  <span className="ml-2 text-xs text-muted">{slide.title}</span>
                </div>
                <MockScreen id={slide.id} />
              </div>
              <p className="mt-4 text-center text-sm text-muted lg:text-left">
                {slide.description}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
