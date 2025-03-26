"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import PublicLayout from "./components/public/public-layout";

export default function VerificationComptePage() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("u******@exemple.com"); // Email masqué pour l'exemple
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Gérer le compte à rebours pour la demande d'un nouveau code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  // Gérer la saisie des chiffres du code
  const handleChange = (index: number, value: string) => {
    // Ne permettre que les chiffres
    if (!/^\d*$/.test(value)) return;

    // Mettre à jour le code
    const newCode = [...code];
    newCode[index] = value.slice(0, 1); // Prendre seulement le premier caractère
    setCode(newCode);

    // Effacer le message d'erreur si présent
    if (error) setError(null);

    // Passer au champ suivant si un chiffre est saisi
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Gérer les touches spéciales (retour arrière, flèches, etc.)
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Si le champ actuel est vide et que l'utilisateur appuie sur Backspace, revenir au champ précédent
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      // Flèche gauche pour aller au champ précédent
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      // Flèche droite pour aller au champ suivant
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Gérer le collage d'un code complet
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Vérifier si le texte collé contient 6 chiffres
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);

      // Mettre le focus sur le dernier champ
      inputRefs.current[5]?.focus();
    }
  };

  // Vérifier le code
  const verifyCode = () => {
    const fullCode = code.join("");

    // Vérifier que le code est complet
    if (fullCode.length !== 6) {
      setError("Veuillez saisir les 6 chiffres du code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simuler une vérification de code (à remplacer par votre API)
    setTimeout(() => {
      setIsLoading(false);

      // Pour la démonstration, considérons que "123456" est un code valide
      if (fullCode === "123456") {
        // Rediriger vers la page d'accueil ou le tableau de bord
        router.push("/connexion");
      } else {
        setError("Code incorrect. Veuillez vérifier et réessayer.");
      }
    }, 1500);
  };

  // Demander un nouveau code
  const resendCode = () => {
    setResendDisabled(true);
    setCountdown(60); // 60 secondes avant de pouvoir demander un nouveau code

    // Simuler l'envoi d'un nouveau code (à remplacer par votre API)
    setTimeout(() => {
      // Réinitialiser les champs
      setCode(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  return (
    <PublicLayout>
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary">
              Vérification de compte
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Nous avons envoyé un code à 6 chiffres à l'adresse {email}
            </p>
          </div>

          <div className="mt-8 bg-white p-8 shadow-md rounded-xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="verification-code" className="sr-only">
                  Code de vérification
                </label>
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      value={code[index]}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <Button
                onClick={verifyCode}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Vérifier
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Vous n'avez pas reçu de code?{" "}
                  <button
                    type="button"
                    className={`font-medium text-primary hover:text-primary/80 ${
                      resendDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={resendCode}
                    disabled={resendDisabled}
                  >
                    {resendDisabled
                      ? `Renvoyer dans ${countdown}s`
                      : "Renvoyer le code"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
