import Footer from "@/components/landingpage/footer";
import Header from "@/components/landingpage/header";

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