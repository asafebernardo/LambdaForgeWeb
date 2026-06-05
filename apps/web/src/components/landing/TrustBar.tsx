import { TRUST_INDICATORS } from "@/lib/config";
import { FeatureIcon } from "./FeatureIcon";

interface TrustBarProps {
  gameCount: number;
  version: string;
}

export function TrustBar({ gameCount, version }: TrustBarProps) {
  const stats = [
    { value: `${gameCount}+`, label: "Supported games" },
    { value: "1-click", label: "Mod installs" },
    { value: `v${version}`, label: "Latest release" },
    { value: "Active", label: "Development" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-border/60 py-4">
        {TRUST_INDICATORS.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted"
          >
            <FeatureIcon name={item.icon} className="h-4 w-4 text-accent/80" />
            {item.label}
          </span>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-lg px-4 py-3 text-center transition hover:border-accent/30"
          >
            <p className="text-lg font-semibold text-text">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
