"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import PublicLayout from "@/components/public/public-layout";

export default function ReinitialisationMotDePassePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();

  // Récupérer le token de réinitialisation depuis l'URL
  useEffect(() => {
    // Dans un environnement réel, vous utiliseriez quelque chose comme:
    // const params = new URLSearchParams(window.location.search)
    // const tokenFromUrl = params.get('token')

    // Pour la démonstration, on simule un token
    const tokenFromUrl: string = "valid-token-123";
    setToken(tokenFromUrl);

    // Vérifier la validité du token (simulé)
    if (tokenFromUrl === "invalid-token") {
      setTokenValid(false);
    }
  }, []);

  // Calculer la force du mot de passe
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Longueur minimale
    if (password.length >= 8) strength += 25;

    // Contient des chiffres
    if (/\d/.test(password)) strength += 25;

    // Contient des minuscules et majuscules
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;

    // Contient des caractères spéciaux
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  // Obtenir la couleur de la barre de progression en fonction de la force du mot de passe
  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Obtenir le texte de la force du mot de passe
  const getStrengthText = () => {
    if (passwordStrength < 50) return "Faible";
    if (passwordStrength < 75) return "Moyen";
    return "Fort";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (passwordStrength < 50) {
      setError(
        "Votre mot de passe est trop faible. Veuillez choisir un mot de passe plus sécurisé."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simuler la réinitialisation du mot de passe (à remplacer par votre API)
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push("/connexion");
      }, 3000);
    }, 1500);
  };

  // Si le token est invalide, afficher un message d'erreur
  if (!tokenValid) {
    return (
      <PublicLayout>
        <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">
                Lien invalide
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Le lien de réinitialisation du mot de passe est invalide ou a
                expiré.
              </p>
            </div>

            <div className="mt-8 bg-white p-8 shadow-md rounded-xl">
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-700">
                  Veuillez demander un nouveau lien de réinitialisation pour
                  continuer.
                </AlertDescription>
              </Alert>

              <div className="mt-6 text-center">
                <Button asChild>
                  <Link href="/mot-de-passe-oublie">
                    Demander un nouveau lien
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </PublicLayout>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center font-bold text-xl text-primary"
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
              <Link
                href="/"
                className="text-gray-500 font-medium hover:text-primary"
              >
                Accueil
              </Link>
              <Link
                href="/tarifs"
                className="text-gray-500 font-medium hover:text-primary"
              >
                Tarifs
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 font-medium hover:text-primary"
              >
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">
              Réinitialiser votre mot de passe
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Veuillez créer un nouveau mot de passe sécurisé pour votre compte.
            </p>
          </div>

          <div className="mt-8 bg-white p-8 shadow-md rounded-xl">
            {isSuccess ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Votre mot de passe a été réinitialisé avec succès. Vous
                    allez être redirigé vers la page de connexion.
                  </AlertDescription>
                </Alert>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Si vous n'êtes pas redirigé automatiquement, cliquez sur le
                    bouton ci-dessous.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/connexion">Aller à la page de connexion</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Indicateur de force du mot de passe */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">
                          Force du mot de passe:
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength < 50
                              ? "text-red-500"
                              : passwordStrength < 75
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {getStrengthText()}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-1 ${getStrengthColor()}`}
                      />
                      <ul className="mt-2 text-xs text-gray-500 space-y-1">
                        <li
                          className={
                            password.length >= 8 ? "text-green-600" : ""
                          }
                        >
                          • Au moins 8 caractères
                        </li>
                        <li
                          className={
                            /\d/.test(password) ? "text-green-600" : ""
                          }
                        >
                          • Au moins un chiffre
                        </li>
                        <li
                          className={
                            /[a-z]/.test(password) && /[A-Z]/.test(password)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Lettres minuscules et majuscules
                        </li>
                        <li
                          className={
                            /[^a-zA-Z0-9]/.test(password)
                              ? "text-green-600"
                              : ""
                          }
                        >
                          • Au moins un caractère spécial
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation en cours...
                    </span>
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full border-t bg-gray-50 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2025 Gobering. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Avis de confidentialités
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-primary"
              >
                Conditions générales d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
