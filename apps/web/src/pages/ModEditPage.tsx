import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EditModForm } from "@/components/mods/EditModForm";

export function ModEditPage() {
  return (
    <>
      <Header active="upload" />
      <EditModForm />
      <Footer />
    </>
  );
}
