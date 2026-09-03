import { TruckIcon, AwardIcon, HandbagIcon, HeadsetIcon } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <section className="py-16">
      <div className=" px-4 flex flex-col gap-10 container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          <div><h4>18 752</h4>
          <p>Producteurs inscrits</p></div>
          <div><h4>250</h4>
          <p>Coopératives partenaires</p></div>
          <div><h4>100 500 ha</h4>
          <p>Exploitations cartographiées</p></div>
          <div><h4>4,2 M FCFA</h4>
          <p>Économisés en achats groupés</p></div>

        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-quinary)]">
          Ce que fait AgroCon
        </p>
        <h2 className="text-[var(--color-secondary)] text-3xl md:text-4xl font-extrabold mb-8">
          Quatre outils, une seule plateforme.
        </h2>
        <p>Chaque module répond à une contrainte concrète des producteurs — des  volumes trop faibles pour intéresser un acheteur, aux intrants trop  chers à l'unité.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 */}
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--color-septenary)] w-16 h-16 flex justify-center items-center rounded-lg shrink-0">
              <TruckIcon className="text-[var(--color-primary)] w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Ventes collectives</h3>
              <p className="text-gray-600">
                Regroupez votre production avec d&apos;autres producteurs de votre zone pour atteindre les volumes que recherchent les gros acheteurs.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--color-septenary)] w-16 h-16 flex justify-center items-center rounded-lg shrink-0">
              <AwardIcon className="text-[var(--color-primary)] w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Semences</h3>
              <p className="text-gray-600">
                Un catalogue de variétés adaptées à votre région, avec rendements attendus et disponibilité en temps réel.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--color-septenary)] w-16 h-16 flex justify-center items-center rounded-lg shrink-0">
              <HandbagIcon className="text-[var(--color-primary)] w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Achats groupés</h3>
              <p className="text-gray-600">
                Commandez engrais, semences et équipements à plusieurs pour obtenir de meilleurs prix auprès des fournisseurs.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex gap-4 items-center">
            <div className="bg-[var(--color-septenary)] w-16 h-16 flex justify-center items-center rounded-lg shrink-0">
              <HeadsetIcon className="text-[var(--color-primary)] w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Conseils agricoles</h3>
              <p className="text-gray-600">
                Fiches techniques, alertes saisonnières et recommandations d&apos;un réseau de conseillers agricoles.
              </p>
            </div>
          </div>
        </div>

      </div>
        {/* Image globale de la section */}
      <div className="w-full ">
          <Image
          src="/about.png"
          alt="Présentation globale des services d'AgroCon"
          width={1200}
          height={600}
          className="w-full h-auto"
        />
      </div>
    

    </section>
  );
}