import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DownloadCards } from "@/components/DownloadCards";
import { Logo } from "@/components/Logo";
import { CAPY_LAUNCHER_NAME, SITE_NAME } from "@/lib/config";
import { getDownloadsManifest, getInstallableAssets } from "@/lib/downloads";

export function DownloadPage() {
  const manifest = getDownloadsManifest();
  const installable = getInstallableAssets();

  const versionLabel = manifest.version
    ? `v${manifest.version}${
        manifest.released_at
          ? ` · ${new Date(manifest.released_at).toLocaleDateString("en-US")}`
          : ""
      }`
    : null;

  return (
    <>
      <Header active="download" />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <Logo size={96} className="mx-auto drop-shadow-[0_8px_24px_rgba(232,93,4,0.25)]" />
          <h1 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Download {CAPY_LAUNCHER_NAME}
          </h1>
          {versionLabel && (
            <p className="mt-2 font-mono text-sm text-muted">{versionLabel}</p>
          )}
        </div>

        <section className="mt-10">
          {installable.length > 0 ? (
            <DownloadCards assets={installable} />
          ) : (
            <div className="glass-card rounded-2xl px-6 py-12 text-center">
              <p className="font-medium text-text">No installers available yet</p>
              <p className="mt-2 text-sm text-muted">
                Published builds will appear here when ready.
              </p>
              <Link
                to="/home"
                className="mt-6 inline-block text-sm text-accent no-underline hover:underline"
              >
                Back to home
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
