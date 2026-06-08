import { CAPY_LAUNCHER_NAME } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";
import { FeatureIcon } from "./FeatureIcon";

const STEPS = [
  {
    step: "01",
    title: "Select your game",
    description:
      "CapyLauncher auto-detects installed titles or lets you point to any library folder.",
    icon: "grid",
  },
  {
    step: "02",
    title: "Install mods in one click",
    description:
      "Browse, queue downloads, and deploy — no ZIP extraction or manual copying.",
    icon: "download",
  },
  {
    step: "03",
    title: "Launch and play",
    description:
      "Swap profiles, resolve conflicts, and jump into your modded session in seconds.",
    icon: "rocket",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Simple workflow
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
              Three steps from scattered mod files to a clean, repeatable setup with{" "}
              {CAPY_LAUNCHER_NAME}.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 80}>
              <article className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition duration-300 hover:border-accent/35 hover:shadow-[0_12px_40px_rgba(232,93,4,0.1)]">
                <span
                  className="pointer-events-none absolute -right-2 -top-4 font-display text-6xl font-bold text-accent/[0.07] transition group-hover:text-accent/[0.12]"
                  aria-hidden
                >
                  {item.step}
                </span>
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent ring-1 ring-accent/20 transition group-hover:bg-accent/15 group-hover:shadow-[0_0_24px_rgba(232,93,4,0.15)]">
                    <FeatureIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-accent/40 to-transparent md:block"
                    aria-hidden
                  />
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
