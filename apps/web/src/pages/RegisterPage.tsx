import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <>
      <Header active="register" />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <RegisterForm />
      </main>
      <Footer />
    </>
  );
}
