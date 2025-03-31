"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PublicLayout from "@/components/public/public-layout"

export default function ContactPage() {
  return (
    <PublicLayout>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">
                Contactez-nous
              </h1>
              <p className="mt-4 text-gray-500 md:text-xl">
                Nous sommes là pour répondre à vos questions et vous aider à tirer le meilleur parti de Gobering.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tighter text-primary">Envoyez-nous un message</h2>
                    <p className="mt-2 text-gray-500">
                      Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.
                    </p>
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Prénom
                        </label>
                        <Input id="first-name" placeholder="Jean" required />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Nom
                        </label>
                        <Input id="last-name" placeholder="Dupont" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="jean.dupont@example.com" required />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sujet
                      </label>
                      <Select>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Renseignements généraux</SelectItem>
                          <SelectItem value="support">Support technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="partnership">Partenariat</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Message
                      </label>
                      <Textarea id="message" placeholder="Votre message ici..." className="min-h-[150px]" required />
                    </div>

                    <Button type="submit" className="w-full">
                      Envoyer le message
                    </Button>
                  </form>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tighter text-primary">Informations de contact</h2>
                    <p className="mt-2 text-gray-500">
                      Vous préférez nous contacter directement ? Utilisez les informations ci-dessous.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Mail className="mr-4 h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">Email</h3>
                        <p className="mt-1 text-gray-500">contact@gobering.com</p>
                        <p className="mt-1 text-gray-500">support@gobering.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="mr-4 h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">Téléphone</h3>
                        <p className="mt-1 text-gray-500">+33 1 23 45 67 89</p>
                        <p className="mt-1 text-gray-500">Lun-Ven, 9h-18h (CET)</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="mr-4 h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">Adresse</h3>
                        <p className="mt-1 text-gray-500">123 Avenue des Champs-Élysées</p>
                        <p className="mt-1 text-gray-500">75008 Paris, France</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border bg-gray-50 p-6">
                    <h3 className="text-lg font-semibold">Heures d'ouverture</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lundi - Vendredi</span>
                        <span>9h - 18h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Samedi</span>
                        <span>10h - 15h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dimanche</span>
                        <span>Fermé</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Suivez-nous</h3>
                    <div className="mt-3 flex flex-wrap space-x-4">
                      <a
                        href="#"
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-primary hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                        <span className="sr-only">Facebook</span>
                      </a>
                      <a
                        href="#"
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-primary hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        <span className="sr-only">Instagram</span>
                      </a>
                      <a
                        href="#"
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-primary hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                        <span className="sr-only">Twitter</span>
                      </a>
                      <a
                        href="#"
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-primary hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-primary">Questions fréquentes</h2>
              <p className="mt-4 text-gray-500">
                Consultez notre FAQ pour trouver rapidement des réponses à vos questions.
              </p>
              <div className="mt-8 grid gap-6 text-left">
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">Quel est le délai de réponse à ma demande?</h3>
                  <p className="mt-2 text-gray-500">
                    Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrables.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">Comment puis-je obtenir une démonstration du produit?</h3>
                  <p className="mt-2 text-gray-500">
                    Vous pouvez demander une démonstration en remplissant le formulaire de contact et en sélectionnant
                    "Renseignements généraux" comme sujet.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="text-lg font-semibold">
                    Proposez-vous un support technique en dehors des heures de bureau?
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Oui, pour les clients avec un forfait Premium, nous offrons un support d'urgence 24/7. Pour les
                    autres forfaits, le support est disponible pendant les heures de bureau.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button variant="outline">Voir toutes les FAQ</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      </PublicLayout>
  )
}
