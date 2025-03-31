"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/public/public-layout";

export default function ConditionsGenerales() {
  return (
    <PublicLayout>
      <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl bg-white p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">
              Conditions Générales d'Utilisation
            </h1>
            <p className="text-gray-500">Dernière mise à jour : 24 mars 2025</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Bienvenue sur Gobering. Les présentes Conditions Générales
              d'Utilisation régissent votre utilisation de notre plateforme de
              prise et de gestion de rendez-vous en ligne, accessible via le
              site web gobering.com et ses applications mobiles (collectivement
              désignés comme le "Service").
            </p>
            <p>
              En accédant à notre Service ou en l'utilisant, vous acceptez
              d'être lié par ces Conditions. Si vous n'acceptez pas
              l'intégralité des termes et conditions énoncés dans le présent
              document, vous ne pouvez pas accéder au Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Définitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Utilisateur :</strong> Toute personne qui accède ou
                utilise le Service.
              </li>
              <li>
                <strong>Professionnel :</strong> Tout utilisateur qui propose
                des services et gère des rendez-vous via la plateforme.
              </li>
              <li>
                <strong>Client :</strong> Tout utilisateur qui prend rendez-vous
                avec un Professionnel via la plateforme.
              </li>
              <li>
                <strong>Contenu :</strong> Toutes les informations, textes,
                images, et autres matériels que les utilisateurs soumettent à la
                plateforme.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              3. Inscription et Compte
            </h2>
            <p>
              Pour utiliser certaines fonctionnalités du Service, vous devez
              créer un compte. Vous êtes responsable de maintenir la
              confidentialité de vos informations de compte, y compris votre mot
              de passe, et de toutes les activités qui se produisent sous votre
              compte.
            </p>
            <p>
              Vous acceptez de nous informer immédiatement de toute utilisation
              non autorisée de votre compte ou de toute autre violation de
              sécurité. Gobering ne sera pas responsable des pertes résultant de
              l'utilisation non autorisée de votre compte.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Abonnements et Paiements
            </h2>
            <p>
              Certaines fonctionnalités du Service sont disponibles uniquement
              avec un abonnement payant. Les détails des différentes offres
              d'abonnement sont disponibles sur notre page Tarifs.
            </p>
            <p>
              En souscrivant à un abonnement, vous acceptez de payer les frais
              applicables selon la périodicité choisie (mensuelle ou annuelle).
              Les paiements sont non remboursables, sauf disposition contraire
              dans les présentes Conditions ou exigée par la loi applicable.
            </p>
            <p>
              Nous nous réservons le droit de modifier nos tarifs à tout moment.
              Toute modification de prix prendra effet au début de la période de
              facturation suivante.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. Rendez-vous et Annulations
            </h2>
            <p>
              Les Professionnels sont responsables de la gestion de leur
              disponibilité et de leurs services sur la plateforme. Les Clients
              peuvent prendre rendez-vous en fonction des disponibilités
              affichées.
            </p>
            <p>
              Les politiques d'annulation sont définies par chaque
              Professionnel. Gobering n'est pas responsable des annulations ou
              des changements de rendez-vous effectués par les Professionnels ou
              les Clients.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Responsabilités des Utilisateurs
            </h2>
            <p>En utilisant notre Service, vous acceptez de :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Fournir des informations exactes, complètes et à jour lors de
                l'inscription et de l'utilisation du Service.
              </li>
              <li>
                Respecter tous les rendez-vous pris via la plateforme ou les
                annuler conformément à la politique d'annulation applicable.
              </li>
              <li>
                Ne pas utiliser le Service à des fins illégales ou non
                autorisées.
              </li>
              <li>Ne pas tenter de nuire au bon fonctionnement du Service.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              7. Propriété Intellectuelle
            </h2>
            <p>
              Le Service et son contenu original, ses fonctionnalités et sa
              fonctionnalité sont et resteront la propriété exclusive de
              Gobering et de ses concédants de licence. Le Service est protégé
              par le droit d'auteur, les marques et d'autres lois en France et à
              l'étranger.
            </p>
            <p>
              Nos marques et notre habillage commercial ne peuvent pas être
              utilisés en relation avec un produit ou un service sans notre
              consentement écrit préalable.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              8. Limitation de Responsabilité
            </h2>
            <p>
              En aucun cas, Gobering, ses administrateurs, employés ou agents ne
              seront responsables de tout dommage direct, indirect, spécial,
              accessoire ou consécutif découlant de l'utilisation ou de
              l'incapacité d'utiliser le Service.
            </p>
            <p>
              Gobering n'est pas responsable de la qualité des services fournis
              par les Professionnels, ni des actions ou omissions des Clients.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              9. Modifications des Conditions
            </h2>
            <p>
              Nous nous réservons le droit, à notre seule discrétion, de
              modifier ou de remplacer ces Conditions à tout moment. Si une
              révision est importante, nous fournirons un préavis d'au moins 30
              jours avant l'entrée en vigueur des nouvelles conditions.
            </p>
            <p>
              En continuant à accéder ou à utiliser notre Service après l'entrée
              en vigueur de ces révisions, vous acceptez d'être lié par les
              conditions révisées. Si vous n'acceptez pas les nouvelles
              conditions, vous n'êtes plus autorisé à utiliser le Service.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
              10. Loi Applicable
            </h2>
            <p>
              Ces Conditions sont régies et interprétées conformément aux lois
              de la France, sans égard aux principes de conflits de lois.
            </p>
            <p>
              Notre incapacité à faire respecter un droit ou une disposition de
              ces Conditions ne sera pas considérée comme une renonciation à ces
              droits. Si une disposition de ces Conditions est jugée invalide ou
              inapplicable par un tribunal, les dispositions restantes de ces
              Conditions resteront en vigueur.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact</h2>
            <p>
              Si vous avez des questions concernant ces Conditions, veuillez
              nous contacter à l'adresse suivante : contact@gobering.com
            </p>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
