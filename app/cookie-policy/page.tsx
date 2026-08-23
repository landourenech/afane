export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Politique de Cookies
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-600">
              Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez 
              notre plateforme. Il nous permet de reconnaître votre navigateur et de mémoriser 
              vos préférences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Types de cookies utilisés</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">Cookies nécessaires</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Indispensables au fonctionnement de la plateforme :
                  <ul className="list-disc list-inside mt-2">
                    <li>kc_sync_uid : Identifiant de synchronisation</li>
                    <li>kc_sync_time : Horodatage de la dernière synchronisation</li>
                    <li>kc_profile_id : Identifiant du profil utilisateur</li>
                    <li>kc_user_role : Rôle de l'utilisateur</li>
                    <li>kc_onboarding_done : État de l'onboarding</li>
                  </ul>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">Cookies fonctionnels</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mémorisent vos préférences pour améliorer votre expérience.
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">Cookies analytiques</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Nous aident à comprendre l'utilisation de la plateforme pour l'améliorer.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Durée de conservation</h2>
            <p className="text-gray-600">
              Les cookies sont conservés pour une durée maximale de 7 jours, 
              sauf si vous les supprimez manuellement via votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Gestion des cookies</h2>
            <p className="text-gray-600">
              Vous pouvez à tout moment modifier vos préférences en matière de cookies 
              via la bannière de consentement ou les paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant notre politique de cookies, 
              contactez-nous à : contact@kimba.ga
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}