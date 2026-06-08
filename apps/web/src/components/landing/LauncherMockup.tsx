import { CAPY_LAUNCHER_NAME } from "@/lib/config";

export function LauncherMockup() {
  return (
    <div className="launcher-mockup relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-4 rounded-2xl bg-accent/10 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-[#111113] shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(232,93,4,0.08)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border/60 bg-[#111113]/90 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
          <span className="ml-3 text-xs font-medium text-muted">{CAPY_LAUNCHER_NAME}</span>
        </div>

        <div className="flex min-h-[320px] text-left text-[11px] sm:min-h-[360px] sm:text-xs">
          {/* Sidebar */}
          <aside className="hidden w-36 shrink-0 border-r border-border/60 bg-[#0a0a0b]/80 p-3 sm:block">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Games
            </p>
            {["Vintage Story", "Project Zomboid", "Kenshi"].map((game, i) => (
              <div
                key={game}
                className={`mb-1.5 rounded-md px-2 py-1.5 ${
                  i === 0
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-white/5"
                }`}
              >
                {game}
              </div>
            ))}
            <p className="mt-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Profile
            </p>
            <div className="rounded-md bg-white/5 px-2 py-1.5 text-text">Modded · Main</div>
          </aside>

          {/* Main */}
          <div className="flex flex-1 flex-col">
            <div className="border-b border-border/60 px-4 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-text">Installed mods</span>
                <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] text-accent">
                  12 active
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 p-3">
              {[
                { name: "Better UI Pack", status: "Installed", ok: true },
                { name: "Expanded Crafting", status: "Installed", ok: true },
                { name: "Map Overhaul", status: "Conflict", ok: false },
              ].map((mod) => (
                <div
                  key={mod.name}
                  className="flex items-center justify-between rounded-md border border-border/50 bg-card/50 px-3 py-2"
                >
                  <span className="text-text">{mod.name}</span>
                  <span
                    className={`text-[10px] ${
                      mod.ok ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Download queue */}
            <div className="border-t border-border/60 bg-[#0a0a0b]/60 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Download queue
              </p>
              <div className="space-y-2">
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-muted">
                    <span>Quality of Life Mod</span>
                    <span>68%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-accent to-accent-dim" />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-muted">
                    <span>Shader Pack v2</span>
                    <span>Queued</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div className="h-full w-[12%] rounded-full bg-accent/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
