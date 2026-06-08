import { TRUST_INDICATORS } from "@/lib/config";
import { FeatureIcon } from "./FeatureIcon";
import { ScrollReveal } from "./ScrollReveal";

interface TrustBarProps {
  gameCount: number;
  version: string;
}

export function TrustBar({ gameCount, version }: TrustBarProps) {
  const stats = [
    { value: `${gameCount}+`, label: "Supported games" },
    { value: "1-click", label: "Mod installs" },
    { value: `v${version}`, label: "Latest release" },
    { value: "100%", label: "Open source" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <ScrollReveal>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border/50 bg-card/25 px-6 py-4">
          {TRUST_INDICATORS.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted transition hover:text-text"
            >
              <FeatureIcon name={item.icon} className="h-4 w-4 text-accent/80" />
              {item.label}
            </span>
          ))}
        </div>
      </ScrollReveal>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 50}>
            <div className="glass-card rounded-xl px-4 py-4 text-center transition duration-300 hover:border-accent/30 hover:shadow-[0_8px_28px_rgba(232,93,4,0.08)]">
              <p className="font-display text-xl font-semibold text-text">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
