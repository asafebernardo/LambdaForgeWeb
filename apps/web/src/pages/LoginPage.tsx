import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <>
      <Header active="login" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
