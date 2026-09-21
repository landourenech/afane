import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-quaternary)] p-4 text-[var(--color-primary)] flex flex-col gap-4 md:gap-8 ">
        <div className="contenair max-auto py-6">
        <h3 className="text-center ">Partenaires</h3>

      </div>
      <section className="grid grid-cols-2 container mx-auto min-md:grid-cols-5  gap-4 grid-auto-rows-auto ">

        <div>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={150}
            height={40}
          />  
        </div>
     
        
        <div className="col-span-1 ">
          <h3 className="font-bold mb-2">Acteurs</h3>
            <ul className="space-y-1">
                <li>Producteurs</li>
                <li>Coopératives</li>
                <li>Distributeurs</li>
                <li>Consommateurs</li>
                <li>Fournisseurs</li>
            </ul>
        </div>

          <div className="col-span-1 ">
          <h3 className="font-bold mb-2">Navigation</h3>
            <ul className="space-y-1">
                <li>Ventes collectives</li>
                <li>Achats groupés</li>
                <li>Carte agricole</li>
                <li>Conseils agricoles</li>
            </ul>
        </div>
          <div className="col-span-1 ">
          <h3 className="font-bold mb-2">A propos</h3>
            <ul className="space-y-1">
                <li>les projets</li>
                <li>Contact</li>
                <li>Confidentialité</li>
            </ul>
        </div>
          <div className="col-span-1 ">
          <h3 className="font-bold mb-2">Ressources</h3>
            <ul className="space-y-1">
                <li>Blog</li>
                <li>Développeurs</li>
                <li>Aide</li>
                <li>IA agricole</li>
            </ul>
        </div>
      </section>

      <section className="flex flex-col items-center gap-2 mt-4 -mx-4">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 gap-2 text-[var(--text-quaternary)] container mx-auto">
            <p className="font-sans text-center sm:text-left">© 2026 AFANE. Tous droits réservés.</p>
            <p className="font-sans text-center sm:text-left">Mentions légales | Politique de confidentialité</p>
        </div>

        {/* Image bord à bord sur 100% de la largeur du footer */}
        <div className="relative w-full h-32 md:h-48">
          <Image 
            src="/footer.png" 
            alt="logo" 
            fill
            className="object-cover" 
          />
        </div>

      <p className="font-sans text-[18vw] font-bold px-4 text-center leading-none select-none container mx-auto">
        AFANE
      </p>     
      
       </section>
    </footer>
  );
}