"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PublicLayout from "./components/public/public-layout";

export default function TarifsPage() {
  const [isYearly, setIsYearly] = useState(false);

  // Prix mensuel et annuel (par mois)
  const monthlyPrice = 10;
  const yearlyPrice = 8.5; // 102€ / 12 mois = 8.5€ par mois
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice;
  const savingsPercentage = Math.round(
    ((monthlyPrice - yearlyPrice) / monthlyPrice) * 100
  );

  return (
    <PublicLayout>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Nos tarifs
              </h1>
              <p className="mt-4 text-gray-500 md:text-xl">
                Des solutions adaptées à vos besoins, quelle que soit la taille
                de votre entreprise.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
              {/* Toggle switch for monthly/yearly billing */}
              <div className="flex flex-col items-center justify-center mb-12">
                <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-full">
                  <span
                    className={`px-4 py-2 rounded-full ${
                      !isYearly ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    Mensuel
                  </span>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="billing-toggle"
                      checked={isYearly}
                      onCheckedChange={setIsYearly}
                    />
                    <Label htmlFor="billing-toggle" className="sr-only">
                      Basculer entre facturation mensuelle et annuelle
                    </Label>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full ${
                      isYearly ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    Annuel
                  </span>
                </div>
                {isYearly && (
                  <p className="mt-2 text-sm text-primary font-medium">
                    Économisez {savingsPercentage}% avec la facturation annuelle
                  </p>
                )}
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="col-span-1 md:col-span-1">
                  {/* Placeholder for future plans */}
                </div>

                <div className="col-span-1 md:col-span-1 rounded-xl border bg-white p-6 shadow-lg relative">
                  <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    Populaire
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold">Starter</h3>
                    <p className="text-sm text-gray-500">
                      La solution idéale pour les petites entreprises
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">
                        ${currentPrice}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        /{isYearly ? "mois" : "mois"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {isYearly
                        ? "Facturé annuellement à $102 par professionnel inscrit"
                        : "ou $102/an par professionnel inscrit"}
                    </p>
                  </div>
                  <ul className="mt-6 space-y-4">
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>Gestion des rendez-vous</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>Accès à un tableau de bord simplifié</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>Rappels automatisés par courriel</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>
                        Statistiques avancées et rapports personnalisés
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>1 Soutien administratif</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary shrink-0" />
                      <span>Support et assistance</span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button className="w-full" size="lg">
                      Commencer
                    </Button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-1">
                  {/* Placeholder for future plans */}
                </div>
              </div>

              <div className="mt-12 text-center">
                <h3 className="text-lg font-semibold">
                  Besoin d'une solution personnalisée?
                </h3>
                <p className="mt-2 text-gray-500">
                  Contactez notre équipe commerciale pour discuter de vos
                  besoins spécifiques.
                </p>
                <Button variant="outline" className="mt-4">
                  Contactez-nous
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-primary">
                Questions fréquentes
              </h2>
              <div className="mt-8 grid gap-6 text-left">
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">
                    Comment fonctionne la facturation?
                  </h3>
                  <p className="mt-2 text-gray-500">
                    La facturation est basée sur le nombre de professionnels
                    inscrits sur votre compte. Vous pouvez choisir entre un
                    paiement mensuel ou annuel avec une réduction.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">
                    Puis-je changer de forfait à tout moment?
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Oui, vous pouvez passer à un forfait supérieur à tout
                    moment. Les ajustements de facturation seront calculés au
                    prorata.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">
                    Y a-t-il une période d'essai?
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Oui, nous offrons une période d'essai gratuite de 14 jours
                    pour tous nos forfaits, sans carte de crédit requise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
