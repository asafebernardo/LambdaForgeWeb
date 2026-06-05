import { WHY_LAMBDA_FORGE } from "@/lib/config";
import { ScrollReveal } from "./ScrollReveal";
import { FeatureIcon } from "./FeatureIcon";

export function WhyLambdaForge() {
  return (
    <section className="border-y border-border/60 bg-card/20 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">Why Lambda Forge?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted">
              Manual modding works — until it doesn&apos;t. Lambda Forge replaces
              scattered ZIP files with a focused, repeatable workflow.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_LAMBDA_FORGE.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 60}>
              <article className="glass-card group h-full rounded-xl p-5 transition duration-300 hover:border-accent/35 hover:shadow-[0_8px_32px_rgba(56,189,248,0.08)]">
                <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-2.5 text-accent transition group-hover:bg-accent/15">
                  <FeatureIcon name={item.icon} />
                </div>
                <h3 className="font-semibold text-text">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <div className="mt-10 overflow-hidden rounded-xl border border-border/60">
            <div className="grid sm:grid-cols-2">
              <div className="border-b border-border/60 bg-[#0b1220] p-5 sm:border-b-0 sm:border-r">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Manual install
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>• Find mod links across forums</li>
                  <li>• Extract ZIPs by hand</li>
                  <li>• Hunt for conflicting files</li>
                  <li>• Repeat for every game</li>
                </ul>
              </div>
              <div className="bg-accent/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Lambda Forge
                </p>
                <ul className="mt-3 space-y-2 text-sm text-text">
                  <li>• One launcher, multiple games</li>
                  <li>• One-click install &amp; updates</li>
                  <li>• Built-in conflict detection</li>
                  <li>• Profiles you can swap instantly</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
