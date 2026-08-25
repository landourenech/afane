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
                  Indispensables au fonctionnement de la plateforme (authentification, session).
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium">Cookies fonctionnels</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mémorisent vos préférences pour améliorer votre expérience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Gestion des cookies</h2>
            <p className="text-gray-600">
              Vous pouvez à tout moment modifier vos préférences via votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Contact</h2>
            <p className="text-gray-600">
              Pour toute question : contact@kimba.ga
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
