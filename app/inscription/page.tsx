"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, User, Phone, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import PublicLayout from "@/components/public/public-layout";

export default function InscriptionPage() {
  // États pour les champs du formulaire
  const [profession, setProfession] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // État pour l'autocomplétion des professions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProfessions, setFilteredProfessions] = useState<string[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Liste des professions médicales et paramédicales
  const professions = [
    "Médecin généraliste",
    "Médecin spécialiste",
    "Dentiste",
    "Orthodontiste",
    "Kinésithérapeute",
    "Ostéopathe",
    "Psychologue",
    "Psychothérapeute",
    "Infirmier",
    "Sage-femme",
    "Orthophoniste",
    "Podologue",
    "Pédicure",
    "Diététicien",
    "Nutritionniste",
    "Ergothérapeute",
    "Ophtalmologue",
    "Dermatologue",
    "Cardiologue",
    "Neurologue",
    "Pédiatre",
    "Gynécologue",
    "Massothérapeute",
    "Acupuncteur",
    "Chiropraticien",
    "Physiothérapeute",
    "Orthoptiste",
    "Radiologue",
    "Psychiatre",
    "Urologue",
  ];

  // Filtrer les professions en fonction de la saisie
  useEffect(() => {
    if (profession.trim() === "") {
      setFilteredProfessions([]);
      return;
    }

    const filtered = professions.filter((p) =>
      p.toLowerCase().includes(profession.toLowerCase())
    );
    setFilteredProfessions(filtered);
  }, [profession]);

  // Fermer les suggestions si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer la sélection d'une profession
  const handleSelectProfession = (selected: string) => {
    setProfession(selected);
    setShowSuggestions(false);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de base
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Logique d'inscription à implémenter
    console.log("Inscription avec:", {
      profession,
      prenom,
      nom,
      email,
      telephone,
      password,
    });
  };
  const router = useRouter();
  return (
    <PublicLayout>
      <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Inscription
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Déjà inscrit?{" "}
              <Link
                href="/connexion"
                className="font-medium text-primary hover:text-primary/80"
              >
                Connectez-vous
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 shadow-md rounded-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Profession avec autocomplétion */}
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-sm font-medium">
                  Profession
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="profession"
                    name="profession"
                    type="text"
                    required
                    className="pl-10"
                    placeholder="Votre profession"
                    value={profession}
                    onChange={(e) => {
                      setProfession(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                  />

                  {/* Liste des suggestions */}
                  {showSuggestions && filteredProfessions.length > 0 && (
                    <div
                      ref={suggestionRef}
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm"
                    >
                      {filteredProfessions.map((prof, index) => (
                        <div
                          key={index}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                          onClick={() => handleSelectProfession(prof)}
                        >
                          {prof}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-sm font-medium">
                    Prénom
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      required
                      className="pl-10"
                      placeholder="Votre prénom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium">
                    Nom
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      className="pl-10"
                      placeholder="Votre nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
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
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-sm font-medium">
                  Téléphone
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    className="pl-10"
                    placeholder="+33 6 12 34 56 78"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
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
              </div>

              {/* Confirmer le mot de passe */}
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

              <div className="pt-2">
                <Button
                  type="submit"
                  onClick={() => router.push("/verify-code")}
                  className="w-full"
                >
                  S'inscrire
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
