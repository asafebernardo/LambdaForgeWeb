import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-block text-accent no-underline hover:underline">
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
