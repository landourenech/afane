import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function Layout(
    { children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col content-between min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
         <Header />
          {children}
        <Footer />
    </main>
  )
}