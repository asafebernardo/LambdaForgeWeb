import { FeatureIcon } from "@/components/landing/FeatureIcon";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureGridProps {
  features: readonly Feature[];
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {features.map((feature, i) => (
        <ScrollReveal key={feature.title} delay={i * 50}>
          <article className="glass-card group h-full rounded-xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_12px_40px_rgba(232,93,4,0.1)]">
            <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-2.5 text-accent transition duration-300 group-hover:bg-accent/15 group-hover:shadow-[0_0_20px_rgba(232,93,4,0.15)]">
              <FeatureIcon name={feature.icon ?? "zap"} />
            </div>
            <h3 className="font-semibold text-text">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {feature.description}
            </p>
          </article>
        </ScrollReveal>
      ))}
    </div>
  );
}
