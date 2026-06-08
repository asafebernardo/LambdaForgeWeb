import { CAPY_LAUNCHER_NAME, WHY_LAMBDA_FORGE } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";
import { FeatureIcon } from "./FeatureIcon";

export function WhyLambdaForge() {
  return (
    <section className="section-elevated border-y border-border/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Why switch
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
              Why {CAPY_LAUNCHER_NAME}?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Manual modding works — until it doesn&apos;t. Replace scattered ZIP files
              with a focused, repeatable workflow built for real players.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_LAMBDA_FORGE.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 60}>
              <article className="glass-card group h-full rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_12px_40px_rgba(232,93,4,0.1)]">
                <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent ring-1 ring-accent/15 transition group-hover:bg-accent/15 group-hover:shadow-[0_0_24px_rgba(232,93,4,0.12)]">
                  <FeatureIcon name={item.icon} className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/60 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-border/60 bg-[#0e0e10] p-6 sm:border-b-0 sm:border-r">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Manual install
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted">
                  <li className="flex gap-2">
                    <span className="text-muted/50">×</span>
                    Find mod links across forums
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted/50">×</span>
                    Extract ZIPs by hand
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted/50">×</span>
                    Hunt for conflicting files
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted/50">×</span>
                    Repeat for every game
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {CAPY_LAUNCHER_NAME}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-text">
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    One launcher, multiple games
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    One-click install &amp; updates
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    Built-in conflict detection
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">✓</span>
                    Profiles you can swap instantly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
