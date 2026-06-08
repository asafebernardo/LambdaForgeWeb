import { GITHUB_URL } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";
import { FeatureIcon } from "./FeatureIcon";

interface SocialProofProps {
  gameCount: number;
  version: string;
}

const PROOF_ITEMS = [
  { label: "Open source", icon: "code", detail: "MIT licensed" },
  { label: "No telemetry", icon: "shield", detail: "Privacy-first" },
  { label: "No ads", icon: "ban", detail: "Ever" },
  { label: "Cross-platform", icon: "grid", detail: "Windows & Linux" },
  { label: "Community-driven", icon: "users", detail: "Built with modders" },
  { label: "Frequent updates", icon: "pulse", detail: "Active development" },
] as const;

export function SocialProof({ gameCount, version }: SocialProofProps) {
  return (
    <section className="border-y border-border/50 bg-gradient-to-b from-card/30 via-[#0d0d10] to-card/20 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Trust & transparency
              </p>
              <h2 className="font-display mt-2 text-xl font-semibold sm:text-2xl">
                A launcher you can actually trust
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                No corporate bloat. No hidden tracking. Just a focused tool maintained
                in the open.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-sm text-muted no-underline transition hover:border-accent/40 hover:text-text"
              >
                <FeatureIcon name="code" className="h-4 w-4 text-accent" />
                <span>View on GitHub</span>
              </a>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                v{version}
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {PROOF_ITEMS.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 40}>
              <div className="glass-card rounded-xl px-4 py-4 text-center transition duration-300 hover:border-accent/30 hover:shadow-[0_8px_28px_rgba(232,93,4,0.08)]">
                <FeatureIcon
                  name={item.icon}
                  className="mx-auto h-5 w-5 text-accent/90"
                />
                <p className="mt-2 text-xs font-semibold text-text">{item.label}</p>
                <p className="mt-0.5 text-[10px] text-muted">{item.detail}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={120}>
          <p className="mt-8 text-center text-sm text-muted">
            <span className="font-medium text-text">{gameCount}+</span> supported games
            · Free forever · Get started in under 2 minutes
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
