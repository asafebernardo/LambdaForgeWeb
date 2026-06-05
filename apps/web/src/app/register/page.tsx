import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function RegisterPage() {
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
