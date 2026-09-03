"use client"
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

const heroActions = [
  {
    label: "Je vends mes récoltes",
    variant: "default",
    icon:( <Image src="/delivery-truck.svg" alt="Icône de récolte" width={20} height={20} />),
  },
  {
    label: "Je cherche des produits",
    variant: "tertiary",
    icon: <Search className="h-5 w-5" />,
  },
];

export default function Hero() {
  return (
    <section className="relative bg-cover bg-no-repeat bg-center bg-[url(/hero.png)] justify-center items-center flex flex-col h-[70vh] md:h-[90vh]">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 mx-auto  px-6 py-16 md:py-24 container mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="font-sans text-[18vw] font-bold px-4 text-center leading-none select-none">
         
            <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-[var(--color-primary)] sm:text-5xl lg:text-6xl">
              Le marché agricole,
              <span className="text-[var(--color-secondary)]"> à portée de main</span>
              .
            </h1>
         
            <div className="  mt-8 flex  flex-col justify-center items-center sm:flex-row sm:justify-start border border-red-500">
              {heroActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant as "default" | "secondary"}
                  className="min-w-[12rem] px-3  py-5 text-sm text-[16px] font-medium sm:text-base sm:px-8 sm:py-4"
                >
                  {action.label}
                   <span className="mr-2 flex items-center">
                    {action.icon}
                  </span>
                </Button>
              ))}
            </div>
          </div>

    
          
        </div>
      </div>
    </section>
  );
}
