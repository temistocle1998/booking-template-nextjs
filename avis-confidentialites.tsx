import PublicLayout from "./components/public/public-layout";

export default function AvisConfidentialite() {
  return (
    <PublicLayout>
      <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">
              Avis de Confidentialité
            </h1>
            <p className="text-gray-500">Dernière mise à jour : 24 mars 2025</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Chez Gobering, nous accordons une grande importance à la
              protection de vos données personnelles. Le présent Avis de
              Confidentialité explique comment nous collectons, utilisons,
              partageons et protégeons vos informations lorsque vous utilisez
              notre plateforme de prise et de gestion de rendez-vous en ligne.
            </p>
            <p>
              En utilisant notre Service, vous consentez aux pratiques décrites
              dans cet Avis de Confidentialité. Si vous n'acceptez pas ces
              pratiques, veuillez ne pas utiliser notre Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. Informations que nous collectons
            </h2>
            <p>
              Nous collectons différents types d'informations pour fournir et
              améliorer notre Service :
            </p>
            <h3 className="text-lg font-medium mt-4 mb-2">
              2.1 Informations que vous nous fournissez
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Informations de compte :</strong> Lorsque vous créez un
                compte, nous collectons votre nom, adresse e-mail, numéro de
                téléphone et mot de passe.
              </li>
              <li>
                <strong>Informations de profil :</strong> Si vous êtes un
                Professionnel, nous collectons également des informations sur
                vos services, tarifs, disponibilités et qualifications.
              </li>
              <li>
                <strong>Informations de paiement :</strong> Pour les abonnements
                et les paiements, nous collectons vos informations de carte de
                crédit ou d'autres informations de paiement.
              </li>
              <li>
                <strong>Communications :</strong> Lorsque vous nous contactez,
                nous conservons un enregistrement de cette communication.
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">
              2.2 Informations collectées automatiquement
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Informations d'utilisation :</strong> Nous collectons
                des informations sur la façon dont vous utilisez notre Service,
                comme les pages que vous visitez et les fonctionnalités que vous
                utilisez.
              </li>
              <li>
                <strong>Informations sur l'appareil :</strong> Nous collectons
                des informations sur l'appareil que vous utilisez pour accéder à
                notre Service, y compris le modèle, le système d'exploitation et
                l'identifiant unique de l'appareil.
              </li>
              <li>
                <strong>Informations de localisation :</strong> Avec votre
                consentement, nous pouvons collecter des informations sur votre
                localisation précise pour vous fournir des services basés sur la
                localisation.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Comment nous utilisons vos informations
            </h2>
            <p>Nous utilisons les informations que nous collectons pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir, maintenir et améliorer notre Service.</li>
              <li>
                Traiter les transactions et envoyer des notifications liées aux
                transactions.
              </li>
              <li>
                Envoyer des communications techniques, des mises à jour, des
                alertes de sécurité et des messages de support.
              </li>
              <li>Répondre à vos commentaires, questions et demandes.</li>
              <li>
                Surveiller et analyser les tendances, l'utilisation et les
                activités liées à notre Service.
              </li>
              <li>
                Détecter, prévenir et résoudre les problèmes techniques et de
                sécurité.
              </li>
              <li>
                Personnaliser et améliorer votre expérience sur notre Service.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Partage de vos informations
            </h2>
            <p>
              Nous pouvons partager vos informations dans les circonstances
              suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Avec les Professionnels et les Clients :</strong> Pour
                faciliter les rendez-vous, nous partageons les informations
                nécessaires entre les Professionnels et les Clients.
              </li>
              <li>
                <strong>Avec les fournisseurs de services :</strong> Nous
                partageons des informations avec des fournisseurs de services
                tiers qui effectuent des services en notre nom, comme le
                traitement des paiements et l'analyse des données.
              </li>
              <li>
                <strong>Pour se conformer à la loi :</strong> Nous pouvons
                divulguer vos informations si nous sommes tenus de le faire par
                la loi ou en réponse à des demandes légales valides.
              </li>
              <li>
                <strong>Avec votre consentement :</strong> Nous pouvons partager
                vos informations avec votre consentement ou selon vos
                instructions.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Sécurité des données
            </h2>
            <p>
              Nous prenons des mesures raisonnables pour protéger vos
              informations contre l'accès, l'utilisation, la modification ou la
              divulgation non autorisés. Cependant, aucune méthode de
              transmission sur Internet ou de stockage électronique n'est
              totalement sécurisée, et nous ne pouvons garantir sa sécurité
              absolue.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Conservation des données
            </h2>
            <p>
              Nous conservons vos informations aussi longtemps que nécessaire
              pour fournir notre Service et atteindre les objectifs décrits dans
              cet Avis de Confidentialité, sauf si une période de conservation
              plus longue est requise ou permise par la loi.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Vos droits</h2>
            <p>
              Selon votre lieu de résidence, vous pouvez avoir certains droits
              concernant vos informations personnelles, notamment :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Le droit d'accéder à vos informations personnelles.</li>
              <li>
                Le droit de rectifier ou de mettre à jour vos informations
                personnelles.
              </li>
              <li>Le droit de supprimer vos informations personnelles.</li>
              <li>
                Le droit de restreindre ou de s'opposer au traitement de vos
                informations personnelles.
              </li>
              <li>Le droit à la portabilité des données.</li>
              <li>Le droit de retirer votre consentement à tout moment.</li>
            </ul>
            <p>
              Pour exercer ces droits, veuillez nous contacter à l'adresse
              indiquée dans la section "Contact" ci-dessous.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Cookies et technologies similaires
            </h2>
            <p>
              Nous utilisons des cookies et des technologies similaires pour
              collecter des informations sur votre activité, votre navigateur et
              votre appareil. Vous pouvez configurer votre navigateur pour
              refuser tous les cookies ou pour indiquer quand un cookie est
              envoyé. Cependant, certaines fonctionnalités de notre Service
              peuvent ne pas fonctionner correctement sans cookies.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Transferts internationaux de données
            </h2>
            <p>
              Vos informations peuvent être transférées et traitées dans des
              pays autres que celui où vous résidez. Ces pays peuvent avoir des
              lois sur la protection des données différentes de celles de votre
              pays.
            </p>
            <p>
              Si nous transférons vos informations en dehors de l'Espace
              économique européen ou de la Suisse, nous nous assurerons que ces
              transferts sont effectués conformément aux lois applicables sur la
              protection des données.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Modifications de cet Avis de Confidentialité
            </h2>
            <p>
              Nous pouvons mettre à jour cet Avis de Confidentialité de temps à
              autre. Nous vous informerons de tout changement en publiant le
              nouvel Avis de Confidentialité sur cette page. Nous vous
              encourageons à consulter régulièrement cet Avis de Confidentialité
              pour rester informé de la façon dont nous protégeons vos
              informations.
            </p>
            <p>
              En continuant à utiliser notre Service après la publication des
              modifications de cet Avis de Confidentialité, vous acceptez les
              modifications.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact</h2>
            <p>
              Si vous avez des questions ou des préoccupations concernant cet
              Avis de Confidentialité ou nos pratiques en matière de
              confidentialité, veuillez nous contacter à l'adresse suivante :
              privacy@gobering.com
            </p>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
