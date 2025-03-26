"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Calendar, Users, CreditCard, Clock, Award, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fermer le menu mobile lors du défilement
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mobileMenuOpen])

  // Empêcher le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-primary">Gobering</span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">
              Témoignages
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
              Tarifs
            </Link>
            <Link href="#faq" className="text-gray-600 hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/connexion">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/inscription">
              <Button>S'inscrire</Button>
            </Link>
          </div>

          {/* Menu Mobile Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t fixed inset-0 top-[65px] z-50 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-6">
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-primary transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="#testimonials"
                  className="text-gray-600 hover:text-primary transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Témoignages
                </Link>
                <Link
                  href="#pricing"
                  className="text-gray-600 hover:text-primary transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tarifs
                </Link>
                <Link
                  href="#faq"
                  className="text-gray-600 hover:text-primary transition-colors py-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <div className="flex flex-col space-y-4 pt-6 border-t mt-2">
                  <Link href="/connexion-page" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-6 text-lg">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/inscription-page" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full py-6 text-lg">S'inscrire</Button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Simplifiez la gestion de vos rendez-vous professionnels
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8">
                  Gobering est une plateforme complète qui permet aux professionnels de gérer efficacement leurs
                  rendez-vous, clients et services en un seul endroit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/inscription-page">
                    <Button size="lg" className="w-full sm:w-auto py-6 text-base sm:text-lg">
                      Commencer gratuitement
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto py-6 text-base sm:text-lg">
                      Voir les fonctionnalités
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Gobering Interface"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-20 bg-gray-50 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Fonctionnalités principales</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment Gobering peut transformer votre gestion professionnelle au quotidien.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="h-full">
                <CardHeader>
                  <Calendar className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Gestion des rendez-vous</CardTitle>
                  <CardDescription>Planifiez, modifiez et suivez tous vos rendez-vous en temps réel.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Calendrier interactif</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Rappels automatiques</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Gestion des disponibilités</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <Users className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Gestion des clients</CardTitle>
                  <CardDescription>
                    Centralisez les informations de vos clients pour un suivi personnalisé.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Fiches clients détaillées</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Historique des rendez-vous</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Communication simplifiée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CreditCard className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Gestion des paiements</CardTitle>
                  <CardDescription>Suivez vos revenus et gérez vos transactions en toute simplicité.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Facturation automatisée</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Suivi des paiements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Rapports financiers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Gestion des services</CardTitle>
                  <CardDescription>Configurez vos services avec leurs durées et tarifs spécifiques.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Catalogue de services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Tarification personnalisée</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Durées ajustables</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <Award className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Profil professionnel</CardTitle>
                  <CardDescription>
                    Mettez en valeur votre expertise et vos services auprès de nouveaux clients.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Page de profil personnalisable</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Avis et témoignages clients</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Visibilité optimisée</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <Calendar className="h-8 w-8 md:h-10 md:w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">Réservation en ligne</CardTitle>
                  <CardDescription>
                    Permettez à vos clients de réserver directement en fonction de vos disponibilités.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Système de réservation intuitif</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Confirmation instantanée</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Intégration à votre site web</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-12 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment Gobering a transformé la gestion professionnelle de nos utilisateurs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">ML</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Marie Laporte</h4>
                      <p className="text-sm text-gray-500">Thérapeute</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Gobering a complètement transformé ma façon de gérer mes rendez-vous. Je gagne un temps précieux
                    chaque jour et mes clients apprécient la simplicité du système de réservation."
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">TD</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Thomas Dubois</h4>
                      <p className="text-sm text-gray-500">Coach sportif</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "L'interface est intuitive et me permet de gérer efficacement mon planning. La possibilité d'avoir
                    plusieurs lieux de rendez-vous est un vrai plus pour mon activité mobile."
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">SB</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Sophie Berger</h4>
                      <p className="text-sm text-gray-500">Consultante</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "Depuis que j'utilise Gobering, j'ai augmenté mon nombre de clients de 30%. La plateforme me permet
                    d'être plus visible et de gérer mes rendez-vous sans stress."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 md:py-20 bg-gray-50 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Tarifs adaptés à vos besoins</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Une offre simple et transparente pour votre activité professionnelle.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="border-primary shadow-lg">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                  Populaire
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription className="text-base mt-2">
                    La solution idéale pour les petites entreprises
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl sm:text-5xl font-bold">$10</span>
                    <span className="text-gray-500">/mois</span>
                    <p className="text-sm text-gray-500 mt-1">ou $102/an par professionnel inscrit</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>Gestion des rendez-vous</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>Accès à un tableau de bord simplifié</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>Rappels automatisés par courriel</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>Statistiques avancées et rapports personnalisés</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>1 Soutien administratif</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>Support et assistance</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full py-5 sm:py-6 text-base sm:text-lg">Commencer maintenant</Button>
                </CardFooter>
              </Card>
              <div className="text-center mt-8 text-gray-600">
                <p>
                  Vous avez des besoins spécifiques ?{" "}
                  <a href="#contact" className="text-primary font-medium hover:underline">
                    Contactez-nous
                  </a>{" "}
                  pour une offre personnalisée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-20 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Questions fréquentes</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Trouvez rapidement des réponses à vos questions sur Gobering.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Comment fonctionne la période d'essai ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Gobering offre une période d'essai gratuite de 14 jours pour tous les forfaits. Vous pouvez tester
                    toutes les fonctionnalités sans engagement et sans avoir à entrer vos coordonnées bancaires.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Puis-je changer de forfait à tout moment ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Le changement prendra
                    effet à la prochaine période de facturation, avec un ajustement au prorata si nécessaire.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Comment mes clients peuvent-ils prendre rendez-vous ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Vos clients peuvent prendre rendez-vous directement depuis votre profil professionnel sur Gobering,
                    ou via un widget que vous pouvez intégrer à votre site web. Ils recevront une confirmation par email
                    et des rappels automatiques.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">
                    Gobering est-il compatible avec mon agenda existant ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Oui, Gobering peut se synchroniser avec les agendas les plus populaires comme Google Calendar,
                    Outlook et Apple Calendar. Cela vous permet de visualiser tous vos rendez-vous au même endroit.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Prêt à transformer votre gestion professionnelle ?
            </h2>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
              Rejoignez des milliers de professionnels qui font confiance à Gobering pour gérer leur activité au
              quotidien.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/inscription-page">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto py-5 sm:py-6 text-base sm:text-lg">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto py-5 sm:py-6 text-base sm:text-lg"
                >
                  Voir les fonctionnalités
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Gobering</h3>
              <p className="mb-4">La solution complète pour la gestion de rendez-vous professionnels.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Produit</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white">
                    Témoignages
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Ressources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/conditions-generales" className="hover:text-white">
                    Conditions générales
                  </a>
                </li>
                <li>
                  <a href="/avis-confidentialite" className="hover:text-white">
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Gobering. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

