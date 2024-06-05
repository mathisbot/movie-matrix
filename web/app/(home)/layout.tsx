import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
