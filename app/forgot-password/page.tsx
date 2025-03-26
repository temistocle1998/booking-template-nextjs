"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight, RefreshCw, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation de base de l'email
    if (!email || !email.includes("@")) {
      setError("Veuillez saisir une adresse email valide.")
      return
    }

    setIsLoading(true)
    setError(null)

    // Simuler l'envoi d'un email de réinitialisation (à remplacer par votre API)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      // Dans un cas réel, vous appelleriez votre API ici
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center font-bold text-xl text-primary">
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
                  className="mr-2 h-6 w-6"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
                Gobering
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 font-medium hover:text-primary">
                Accueil
              </Link>
              <Link href="/tarifs" className="text-gray-500 font-medium hover:text-primary">
                Tarifs
              </Link>
              <Link href="/contact" className="text-gray-500 font-medium hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="hidden md:block">
              <Button variant="outline" className="ml-4">
                Je suis un professionnel
              </Button>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary"
            >
              Accueil
            </Link>
            <Link
              href="/tarifs"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary"
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary"
            >
              Contact
            </Link>
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                Je suis un professionnel
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">Mot de passe oublié</h1>
            <p className="mt-2 text-sm text-gray-500">
              Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <div className="mt-8 bg-white p-8 shadow-md rounded-xl">
            {isSubmitted ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Un email de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception et
                    suivre les instructions.
                  </AlertDescription>
                </Alert>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-500">
                    Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier de spam ou
                    essayez à nouveau.
                  </p>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/connexion">Retour à la connexion</Link>
                    </Button>
                    <Button onClick={() => setIsSubmitted(false)}>Essayer une autre adresse</Button>
                  </div>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      placeholder="nom@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Envoyer le lien de réinitialisation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Vous vous souvenez de votre mot de passe?{" "}
                    <Link href="/connexion" className="font-medium text-primary hover:text-primary/80">
                      Connectez-vous
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full border-t bg-gray-50 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 Gobering. Tous droits réservés.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                Avis de confidentialités
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                Conditions générales d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

