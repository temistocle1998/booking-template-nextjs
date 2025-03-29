"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Info,
  X,
  MapPin,
  Star,
  Phone,
  Mail,
  Filter,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Eye,
} from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import PrivateLayout from "@/components/public/private-layout"

// Types
interface Adresse {
  id: string
  nom: string
  numeroCivique: string
  rue: string
  appartement: string
  ville: string
  province: string
  codePostal: string
  latitude: string
  longitude: string
}

interface Horaire {
  id: string
  jour: string
  debut: string
  fin: string
  adresseId: string
}

interface Professionnel {
  id: string
  prenom: string
  nom: string
  titre: string
  profession: string
  email: string
  telephone: string
  specialites: string[]
  langues: string[]
  biographie: string
  photo: string
  adresses: string[] // IDs des adresses associées
  horaires?: Horaire[]
  actif: boolean
  dateCreation: string
  note?: number
  nombreAvis?: number
}

// Données d'exemple pour les adresses
const adressesInitiales: Adresse[] = [
  {
    id: "1",
    nom: "Siège social",
    numeroCivique: "123",
    rue: "Boulevard Saint-Laurent",
    appartement: "",
    ville: "Montréal",
    province: "Québec",
    codePostal: "H2T 1R7",
    latitude: "45.5169",
    longitude: "-73.5923",
  },
  {
    id: "2",
    nom: "Succursale Rive-Sud",
    numeroCivique: "456",
    rue: "Boulevard Taschereau",
    appartement: "Suite 200",
    ville: "Brossard",
    province: "Québec",
    codePostal: "J4Z 1A7",
    latitude: "45.4631",
    longitude: "-73.4660",
  },
  {
    id: "3",
    nom: "Bureau Laval",
    numeroCivique: "789",
    rue: "Boulevard Le Corbusier",
    appartement: "301",
    ville: "Laval",
    province: "Québec",
    codePostal: "H7S 2K9",
    latitude: "45.5581",
    longitude: "-73.7445",
  },
]

// Données d'exemple pour les professionnels
const professionnelsInitiaux: Professionnel[] = [
  {
    id: "1",
    prenom: "Sophie",
    nom: "Tremblay",
    titre: "Physiothérapeute",
    profession: "Physiothérapeute",
    email: "sophie.tremblay@example.com",
    telephone: "(514) 555-1234",
    specialites: ["Physiothérapie sportive", "Réadaptation post-opératoire"],
    langues: ["Français", "Anglais"],
    biographie: "Sophie est spécialisée dans la réadaptation des athlètes et possède plus de 10 ans d'expérience.",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: ["1", "2"],
    horaires: [
      { id: "1", jour: "Lundi", debut: "09:00", fin: "17:00", adresseId: "1" },
      { id: "2", jour: "Mercredi", debut: "09:00", fin: "17:00", adresseId: "1" },
      { id: "3", jour: "Vendredi", debut: "10:00", fin: "16:00", adresseId: "2" },
    ],
    actif: true,
    dateCreation: "2023-01-15",
    note: 4.8,
    nombreAvis: 47,
  },
  {
    id: "2",
    prenom: "Marc",
    nom: "Lavoie",
    titre: "Ostéopathe",
    profession: "Ostéopathe",
    email: "marc.lavoie@example.com",
    telephone: "(514) 555-2345",
    specialites: ["Ostéopathie crânienne", "Traitement des douleurs chroniques"],
    langues: ["Français"],
    biographie:
      "Marc pratique l'ostéopathie depuis 15 ans et se spécialise dans le traitement des douleurs chroniques.",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: ["1"],
    horaires: [
      { id: "4", jour: "Mardi", debut: "08:00", fin: "16:00", adresseId: "1" },
      { id: "5", jour: "Jeudi", debut: "08:00", fin: "16:00", adresseId: "1" },
    ],
    actif: true,
    dateCreation: "2023-02-20",
    note: 4.6,
    nombreAvis: 32,
  },
  {
    id: "3",
    prenom: "Julie",
    nom: "Bergeron",
    titre: "Massothérapeute",
    profession: "Massothérapeute",
    email: "julie.bergeron@example.com",
    telephone: "(514) 555-3456",
    specialites: ["Massage suédois", "Massage thérapeutique"],
    langues: ["Français", "Anglais", "Espagnol"],
    biographie: "Julie est une massothérapeute certifiée avec une approche holistique du bien-être.",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: [],
    horaires: [],
    actif: true,
    dateCreation: "2023-03-10",
    note: 4.9,
    nombreAvis: 28,
  },
  {
    id: "4",
    prenom: "David",
    nom: "Gagnon",
    titre: "Chiropraticien",
    profession: "Chiropraticien",
    email: "david.gagnon@example.com",
    telephone: "(514) 555-4567",
    specialites: ["Ajustements vertébraux", "Traitement des blessures sportives"],
    langues: ["Français", "Anglais"],
    biographie:
      "David est un chiropraticien passionné par l'amélioration de la mobilité et la réduction de la douleur.",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: ["3"],
    horaires: [
      { id: "6", jour: "Lundi", debut: "10:00", fin: "18:00", adresseId: "3" },
      { id: "7", jour: "Mercredi", debut: "10:00", fin: "18:00", adresseId: "3" },
      { id: "8", jour: "Vendredi", debut: "10:00", fin: "18:00", adresseId: "3" },
    ],
    actif: false,
    dateCreation: "2023-04-05",
    note: 4.5,
    nombreAvis: 19,
  },
  {
    id: "5",
    prenom: "Isabelle",
    nom: "Morin",
    titre: "Acupunctrice",
    profession: "Acupuncteur",
    email: "isabelle.morin@example.com",
    telephone: "(514) 555-5678",
    specialites: ["Acupuncture traditionnelle", "Traitement de la douleur"],
    langues: ["Français", "Mandarin"],
    biographie: "Isabelle pratique l'acupuncture traditionnelle chinoise depuis plus de 12 ans.",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: ["1", "3"],
    horaires: [
      { id: "9", jour: "Mardi", debut: "09:00", fin: "17:00", adresseId: "1" },
      { id: "10", jour: "Jeudi", debut: "09:00", fin: "17:00", adresseId: "3" },
    ],
    actif: true,
    dateCreation: "2023-05-12",
    note: 4.7,
    nombreAvis: 36,
  },
]

// Liste des spécialités disponibles
const specialitesDisponibles = [
  "Physiothérapie sportive",
  "Réadaptation post-opératoire",
  "Ostéopathie crânienne",
  "Traitement des douleurs chroniques",
  "Massage suédois",
  "Massage thérapeutique",
  "Ajustements vertébraux",
  "Traitement des blessures sportives",
  "Acupuncture traditionnelle",
  "Traitement de la douleur",
  "Thérapie manuelle",
  "Rééducation posturale",
  "Kinésithérapie",
  "Drainage lymphatique",
  "Thérapie par ventouses",
  "Électrothérapie",
  "Thérapie par ultrasons",
  "Réhabilitation neurologique",
]

// Liste des langues disponibles
const languesDisponibles = [
  "Français",
  "Anglais",
  "Espagnol",
  "Italien",
  "Allemand",
  "Portugais",
  "Arabe",
  "Mandarin",
  "Cantonais",
  "Russe",
  "Japonais",
  "Coréen",
  "Vietnamien",
  "Créole haïtien",
]

// Liste des professions disponibles
const professionsDisponibles = [
  "Dentiste",
  "Massothérapeute",
  "Physiothérapeute",
  "Ostéopathe",
  "Chiropraticien",
  "Acupuncteur",
  "Psychologue",
  "Nutritionniste",
  "Podologue",
  "Orthophoniste",
  "Ergothérapeute",
  "Kinésiologue",
  "Naturopathe",
  "Orthésiste",
  "Audiologiste",
]

// Liste des jours de la semaine
const joursDisponibles = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export default function CrudProfessionnels() {
  const router = useRouter()
  const [professionnels, setProfessionnels] = useState<Professionnel[]>(professionnelsInitiaux)
  const [adresses, setAdresses] = useState<Adresse[]>(adressesInitiales)
  const [professionnel, setProfessionnel] = useState<Professionnel | null>(null)
  const [modalOuvert, setModalOuvert] = useState(false)
  const [alerteSuppressionOuverte, setAlerteSuppressionOuverte] = useState(false)
  const [professionnelASupprimer, setProfessionnelASupprimer] = useState<string | null>(null)
  const [recherche, setRecherche] = useState("")
  const [page, setPage] = useState(1)
  const [ongletActif, setOngletActif] = useState("informations")
  const [nouvelleSpecialite, setNouvelleSpecialite] = useState("")
  const [nouvelleLangue, setNouvelleLangue] = useState("")
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [filtreProfession, setFiltreProfession] = useState<string>("")
  const [filtreAdresse, setFiltreAdresse] = useState<string>("")
  const [nouvelHoraire, setNouvelHoraire] = useState({ jour: "", debut: "", fin: "", adresseId: "" })
  const [modeAffichage, setModeAffichage] = useState<"liste" | "grille">("liste")
  const [tri, setTri] = useState<"nom" | "date" | "note">("nom")
  const [ordre, setOrdre] = useState<"asc" | "desc">("asc")
  const professionnelsParPage = 5

  // Filtrer les professionnels en fonction des critères
  const professionnelsFiltres = professionnels.filter((pro) => {
    // Filtre de recherche
    const matchRecherche =
      `${pro.prenom} ${pro.nom}`.toLowerCase().includes(recherche.toLowerCase()) ||
      pro.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      pro.email.toLowerCase().includes(recherche.toLowerCase())

    // Filtre de statut
    const matchStatut =
      filtreStatut === "tous" || (filtreStatut === "actifs" && pro.actif) || (filtreStatut === "inactifs" && !pro.actif)

    // Filtre de profession
    const matchProfession = !filtreProfession || pro.profession === filtreProfession

    // Filtre d'adresse
    const matchAdresse = !filtreAdresse || pro.adresses.includes(filtreAdresse)

    return matchRecherche && matchStatut && matchProfession && matchAdresse
  })

  // Tri des professionnels
  const professionnelsTries = [...professionnelsFiltres].sort((a, b) => {
    if (tri === "nom") {
      const nomA = `${a.prenom} ${a.nom}`.toLowerCase()
      const nomB = `${b.prenom} ${b.nom}`.toLowerCase()
      return ordre === "asc" ? nomA.localeCompare(nomB) : nomB.localeCompare(nomA)
    } else if (tri === "date") {
      return ordre === "asc"
        ? new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime()
        : new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    } else if (tri === "note") {
      const noteA = a.note || 0
      const noteB = b.note || 0
      return ordre === "asc" ? noteA - noteB : noteB - noteA
    }
    return 0
  })

  // Pagination
  const indexDernierProfessionnel = page * professionnelsParPage
  const indexPremierProfessionnel = indexDernierProfessionnel - professionnelsParPage
  const professionnelsActuels = professionnelsTries.slice(indexPremierProfessionnel, indexDernierProfessionnel)
  const totalPages = Math.ceil(professionnelsTries.length / professionnelsParPage)

  // Formulaire vide pour nouveau professionnel
  const nouveauProfessionnelVide: Professionnel = {
    id: "",
    prenom: "",
    nom: "",
    titre: "",
    profession: "",
    email: "",
    telephone: "",
    specialites: [],
    langues: ["Français"],
    biographie: "",
    photo: "/placeholder.svg?height=128&width=128",
    adresses: [],
    horaires: [],
    actif: true,
    dateCreation: new Date().toISOString().split("T")[0],
  }

  // Ouvrir le modal pour ajouter un professionnel
  const ajouterProfessionnel = () => {
    setProfessionnel({ ...nouveauProfessionnelVide, id: Date.now().toString() })
    setModalOuvert(true)
    setOngletActif("informations")
  }

  // Ouvrir le modal pour modifier un professionnel
  const modifierProfessionnel = (id: string) => {
    const pro = professionnels.find((p) => p.id === id)
    if (pro) {
      setProfessionnel({ ...pro })
      setModalOuvert(true)
      setOngletActif("informations")
    }
  }

  // Confirmer la suppression d'un professionnel
  const confirmerSuppression = (id: string) => {
    setProfessionnelASupprimer(id)
    setAlerteSuppressionOuverte(true)
  }

  // Supprimer un professionnel
  const supprimerProfessionnel = () => {
    if (professionnelASupprimer) {
      setProfessionnels(professionnels.filter((p) => p.id !== professionnelASupprimer))
      setAlerteSuppressionOuverte(false)
      setProfessionnelASupprimer(null)
      toast({
        title: "Professionnel supprimé",
        description: "Le professionnel a été supprimé avec succès.",
        variant: "default",
      })
    }
  }

  // Sauvegarder un professionnel (ajout ou modification)
  const sauvegarderProfessionnel = () => {
    if (professionnel) {
      // Vérifier si c'est un nouveau professionnel ou une modification
      const index = professionnels.findIndex((p) => p.id === professionnel.id)

      if (index !== -1) {
        // Modification
        const nouveauxProfessionnels = [...professionnels]
        nouveauxProfessionnels[index] = professionnel
        setProfessionnels(nouveauxProfessionnels)
        toast({
          title: "Professionnel modifié",
          description: "Les informations du professionnel ont été mises à jour avec succès.",
          variant: "default",
        })
      } else {
        // Ajout
        setProfessionnels([...professionnels, professionnel])
        toast({
          title: "Professionnel ajouté",
          description: "Le nouveau professionnel a été ajouté avec succès.",
          variant: "default",
        })
      }

      setModalOuvert(false)
      setProfessionnel(null)
    }
  }

  // Mettre à jour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (professionnel) {
      setProfessionnel({
        ...professionnel,
        [e.target.name]: e.target.value,
      })
    }
  }

  // Ajouter une spécialité
  const ajouterSpecialite = (specialite: string) => {
    if (professionnel && !professionnel.specialites.includes(specialite)) {
      setProfessionnel({
        ...professionnel,
        specialites: [...professionnel.specialites, specialite],
      })
    }
    setNouvelleSpecialite("")
  }

  // Supprimer une spécialité
  const supprimerSpecialite = (specialite: string) => {
    if (professionnel) {
      setProfessionnel({
        ...professionnel,
        specialites: professionnel.specialites.filter((s) => s !== specialite),
      })
    }
  }

  // Ajouter une langue
  const ajouterLangue = (langue: string) => {
    if (professionnel && !professionnel.langues.includes(langue)) {
      setProfessionnel({
        ...professionnel,
        langues: [...professionnel.langues, langue],
      })
    }
    setNouvelleLangue("")
  }

  // Supprimer une langue
  const supprimerLangue = (langue: string) => {
    if (professionnel) {
      setProfessionnel({
        ...professionnel,
        langues: professionnel.langues.filter((l) => l !== langue),
      })
    }
  }

  // Gérer les adresses associées
  const toggleAdresse = (adresseId: string) => {
    if (professionnel) {
      const adressesActuelles = [...professionnel.adresses]

      if (adressesActuelles.includes(adresseId)) {
        // Supprimer l'adresse
        setProfessionnel({
          ...professionnel,
          adresses: adressesActuelles.filter((id) => id !== adresseId),
          // Supprimer également les horaires associés à cette adresse
          horaires: professionnel.horaires?.filter((h) => h.adresseId !== adresseId) || [],
        })
      } else {
        // Ajouter l'adresse
        setProfessionnel({
          ...professionnel,
          adresses: [...adressesActuelles, adresseId],
        })
      }
    }
  }

  // Ajouter un horaire
  const ajouterHoraire = () => {
    if (professionnel && nouvelHoraire.jour && nouvelHoraire.debut && nouvelHoraire.fin && nouvelHoraire.adresseId) {
      const horaires = professionnel.horaires || []
      setProfessionnel({
        ...professionnel,
        horaires: [
          ...horaires,
          {
            id: Date.now().toString(),
            ...nouvelHoraire,
          },
        ],
      })
      setNouvelHoraire({ jour: "", debut: "", fin: "", adresseId: "" })
    }
  }

  // Supprimer un horaire
  const supprimerHoraire = (horaireId: string) => {
    if (professionnel && professionnel.horaires) {
      setProfessionnel({
        ...professionnel,
        horaires: professionnel.horaires.filter((h) => h.id !== horaireId),
      })
    }
  }

  // Obtenir le nom complet d'une adresse
  const getAdresseComplete = (adresseId: string) => {
    const adresse = adresses.find((a) => a.id === adresseId)
    if (!adresse) return "Adresse inconnue"

    return `${adresse.nom} - ${adresse.numeroCivique} ${adresse.rue}, ${adresse.ville}`
  }

  // Obtenir les noms des adresses associées à un professionnel
  const getNomsAdresses = (adresseIds: string[]) => {
    if (adresseIds.length === 0) return "Tous les lieux"

    return adresseIds
      .map((id) => {
        const adresse = adresses.find((a) => a.id === id)
        return adresse ? adresse.nom : "Adresse inconnue"
      })
      .join(", ")
  }

  // Réinitialiser les filtres
  const reinitialiserFiltres = () => {
    setRecherche("")
    setFiltreStatut("tous")
    setFiltreProfession("")
    setFiltreAdresse("")
    setPage(1)
  }

  // Afficher les étoiles pour la note
  const renderEtoiles = (note: number | undefined) => {
    if (!note) return null

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((etoile) => (
          <Star
            key={etoile}
            className={`h-4 w-4 ${etoile <= Math.round(note) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{note.toFixed(1)}</span>
      </div>
    )
  }

  // Voir le profil d'un professionnel
  const voirProfil = (id: string) => {
    router.push(`/profil-professionnel/${id}`)
  }

  return (
<PrivateLayout>
<div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <User className="mr-2 h-6 w-6" />
                Gestion des professionnels
              </CardTitle>
              <CardDescription>
                Gérez les professionnels de votre entreprise, leurs spécialités et leurs horaires
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={ajouterProfessionnel} className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un professionnel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filtres et recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un professionnel..."
                    className="pl-8 w-full"
                    value={recherche}
                    onChange={(e) => {
                      setRecherche(e.target.value)
                      setPage(1) // Réinitialiser à la première page lors d'une recherche
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {(recherche || filtreStatut !== "tous" || filtreProfession || filtreAdresse) && (
                    <Button variant="outline" size="sm" onClick={reinitialiserFiltres} className="h-8">
                      <X className="mr-1 h-3 w-3" />
                      Réinitialiser les filtres
                    </Button>
                  )}

                  {recherche && (
                    <Badge variant="secondary" className="h-8 px-3">
                      Recherche: {recherche}
                      <button onClick={() => setRecherche("")} className="ml-1 rounded-full hover:bg-gray-200 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                  <SelectTrigger className="w-[140px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Statut</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="actifs">Actifs</SelectItem>
                    <SelectItem value="inactifs">Inactifs</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtreProfession} onValueChange={setFiltreProfession}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{filtreProfession || "Profession"}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">Toutes les professions</SelectItem> */}
                    {professionsDisponibles.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtreAdresse} onValueChange={setFiltreAdresse}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {filtreAdresse ? adresses.find((a) => a.id === filtreAdresse)?.nom || "Lieu" : "Lieu"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les lieux</SelectItem>
                    {adresses.map((adresse) => (
                      <SelectItem key={adresse.id} value={adresse.id}>
                        {adresse.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <span>Trier par</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Critère de tri</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTri("nom")} className={tri === "nom" ? "bg-accent" : ""}>
                      <Check className={`mr-2 h-4 w-4 ${tri === "nom" ? "opacity-100" : "opacity-0"}`} />
                      Nom
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTri("date")} className={tri === "date" ? "bg-accent" : ""}>
                      <Check className={`mr-2 h-4 w-4 ${tri === "date" ? "opacity-100" : "opacity-0"}`} />
                      Date d'ajout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTri("note")} className={tri === "note" ? "bg-accent" : ""}>
                      <Check className={`mr-2 h-4 w-4 ${tri === "note" ? "opacity-100" : "opacity-0"}`} />
                      Note
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Ordre</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOrdre("asc")} className={ordre === "asc" ? "bg-accent" : ""}>
                      <Check className={`mr-2 h-4 w-4 ${ordre === "asc" ? "opacity-100" : "opacity-0"}`} />
                      Croissant
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOrdre("desc")} className={ordre === "desc" ? "bg-accent" : ""}>
                      <Check className={`mr-2 h-4 w-4 ${ordre === "desc" ? "opacity-100" : "opacity-0"}`} />
                      Décroissant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={modeAffichage === "liste" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none px-3"
                    onClick={() => setModeAffichage("liste")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </Button>
                  <Button
                    variant={modeAffichage === "grille" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none px-3"
                    onClick={() => setModeAffichage("grille")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div>
              <div className="text-sm text-muted-foreground mb-4">
                {professionnelsTries.length} professionnel{professionnelsTries.length !== 1 ? "s" : ""} trouvé
                {professionnelsTries.length !== 1 ? "s" : ""}
              </div>

              {modeAffichage === "liste" ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Professionnel</TableHead>
                        <TableHead className="hidden md:table-cell">Titre</TableHead>
                        <TableHead className="hidden lg:table-cell">Contact</TableHead>
                        <TableHead className="hidden xl:table-cell">Lieux de travail</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professionnelsActuels.length > 0 ? (
                        professionnelsActuels.map((pro) => (
                          <TableRow key={pro.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={pro.photo} alt={`${pro.prenom} ${pro.nom}`} />
                                  <AvatarFallback>
                                    {pro.prenom[0]}
                                    {pro.nom[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {pro.prenom} {pro.nom}
                                  </div>
                                  <div className="text-sm text-muted-foreground md:hidden">{pro.titre}</div>
                                  {pro.note && <div className="mt-1 md:hidden">{renderEtoiles(pro.note)}</div>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>
                                {pro.titre}
                                {pro.note && <div className="mt-1">{renderEtoiles(pro.note)}</div>}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="text-sm">
                                <div className="flex items-center">
                                  <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  {pro.email}
                                </div>
                                <div className="flex items-center mt-1">
                                  <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  {pro.telephone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <div className="text-sm">{getNomsAdresses(pro.adresses)}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={pro.actif ? "success" : "secondary"}>
                                {pro.actif ? "Actif" : "Inactif"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => voirProfil(pro.id)}
                                  aria-label="Voir"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => modifierProfessionnel(pro.id)}
                                  aria-label="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => confirmerSuppression(pro.id)}
                                  className="text-destructive"
                                  aria-label="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Aucun professionnel trouvé.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {professionnelsActuels.length > 0 ? (
                    professionnelsActuels.map((pro) => (
                      <Card key={pro.id} className="overflow-hidden">
                        <div className="relative">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white/90 backdrop-blur-sm"
                              onClick={() => modifierProfessionnel(pro.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-white/90 backdrop-blur-sm text-destructive"
                              onClick={() => confirmerSuppression(pro.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-6 flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                              <AvatarImage src={pro.photo} alt={`${pro.prenom} ${pro.nom}`} />
                              <AvatarFallback className="text-2xl">
                                {pro.prenom[0]}
                                {pro.nom[0]}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-semibold text-center">
                              {pro.prenom} {pro.nom}
                            </h3>
                            <p className="text-muted-foreground text-center">{pro.titre}</p>
                            {pro.note && (
                              <div className="mt-2 flex items-center justify-center">
                                {renderEtoiles(pro.note)}
                                <span className="text-sm text-muted-foreground ml-1">({pro.nombreAvis} avis)</span>
                              </div>
                            )}
                            <Badge variant={pro.actif ? "success" : "secondary"} className="mt-2">
                              {pro.actif ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{getNomsAdresses(pro.adresses)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{pro.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm">{pro.telephone}</span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Spécialités</h4>
                            <div className="flex flex-wrap gap-1">
                              {pro.specialites.map((specialite) => (
                                <Badge key={specialite} variant="outline" className="text-xs">
                                  {specialite}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <div className="p-4 pt-0 flex justify-center">
                          <Button onClick={() => voirProfil(pro.id)} className="w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le profil
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center border rounded-lg">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Aucun professionnel trouvé</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Essayez de modifier vos critères de recherche ou d'ajouter un nouveau professionnel.
                      </p>
                      <Button onClick={reinitialiserFiltres} variant="outline" className="mt-4">
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink onClick={() => setPage(p)} isActive={page === p}>
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour ajouter/modifier un professionnel */}
      <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {professionnel && professionnels.some((p) => p.id === professionnel.id)
                ? "Modifier le professionnel"
                : "Ajouter un professionnel"}
            </DialogTitle>
            <DialogDescription>Remplissez les informations du professionnel ci-dessous.</DialogDescription>
          </DialogHeader>

          <Tabs value={ongletActif} onValueChange={setOngletActif}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="lieux">Lieux de travail</TabsTrigger>
              <TabsTrigger value="horaires">Horaires</TabsTrigger>
            </TabsList>

            <TabsContent value="informations" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={professionnel?.prenom || ""}
                    onChange={handleChange}
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={professionnel?.nom || ""}
                    onChange={handleChange}
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="titre">Titre professionnel</Label>
                <Input
                  id="titre"
                  name="titre"
                  value={professionnel?.titre || ""}
                  onChange={handleChange}
                  placeholder="Ex: Physiothérapeute, Ostéopathe, etc."
                />
              </div>

              <div>
                <Label htmlFor="profession">Profession</Label>
                <div className="relative mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {professionnel?.profession || "Sélectionner une profession"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher une profession..." />
                        <CommandList>
                          <CommandEmpty>
                            <div className="px-2 py-3 text-sm">
                              Profession non trouvée. Vous pouvez la saisir manuellement.
                            </div>
                            <div className="border-t px-2 py-2">
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                  const input = document.querySelector(".profession-input") as HTMLInputElement
                                  if (input && input.value) {
                                    if (professionnel) {
                                      setProfessionnel({
                                        ...professionnel,
                                        profession: input.value,
                                      })
                                    }
                                  }
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter cette profession
                              </Button>
                            </div>
                          </CommandEmpty>
                        </CommandList>
                        <CommandList>
                          <CommandGroup>
                            {professionsDisponibles.map((profession) => (
                              <CommandItem
                                key={profession}
                                value={profession}
                                onSelect={() => {
                                  if (professionnel) {
                                    setProfessionnel({
                                      ...professionnel,
                                      profession,
                                    })
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    professionnel?.profession === profession ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {profession}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <Input
                        className="mt-2 profession-input"
                        placeholder="Ou saisir une profession personnalisée"
                        value={professionnel?.profession || ""}
                        onChange={(e) => {
                          if (professionnel) {
                            setProfessionnel({
                              ...professionnel,
                              profession: e.target.value,
                            })
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={professionnel?.email || ""}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={professionnel?.telephone || ""}
                    onChange={handleChange}
                    placeholder="(514) 555-1234"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialites">Spécialités</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {professionnel?.specialites.map((specialite) => (
                    <Badge key={specialite} variant="outline" className="flex items-center gap-1 py-1">
                      {specialite}
                      <button
                        onClick={() => supprimerSpecialite(specialite)}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={nouvelleSpecialite} onValueChange={setNouvelleSpecialite}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialitesDisponibles
                        .filter((s) => !professionnel?.specialites.includes(s))
                        .map((specialite) => (
                          <SelectItem key={specialite} value={specialite}>
                            {specialite}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => nouvelleSpecialite && ajouterSpecialite(nouvelleSpecialite)}
                    disabled={!nouvelleSpecialite}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="langues">Langues parlées</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {professionnel?.langues.map((langue) => (
                    <Badge key={langue} variant="outline" className="flex items-center gap-1 py-1">
                      {langue}
                      <button
                        onClick={() => supprimerLangue(langue)}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        disabled={langue === "Français" && professionnel.langues.length === 1}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Select value={nouvelleLangue} onValueChange={setNouvelleLangue}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      {languesDisponibles
                        .filter((l) => !professionnel?.langues.includes(l))
                        .map((langue) => (
                          <SelectItem key={langue} value={langue}>
                            {langue}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => nouvelleLangue && ajouterLangue(nouvelleLangue)}
                    disabled={!nouvelleLangue}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="biographie">Biographie</Label>
                <Textarea
                  id="biographie"
                  name="biographie"
                  value={professionnel?.biographie || ""}
                  onChange={handleChange}
                  placeholder="Décrivez l'expérience et l'expertise du professionnel..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="actif"
                  checked={professionnel?.actif}
                  onCheckedChange={(checked) => {
                    if (professionnel) {
                      setProfessionnel({
                        ...professionnel,
                        actif: checked as boolean,
                      })
                    }
                  }}
                />
                <Label htmlFor="actif">Professionnel actif</Label>
              </div>
            </TabsContent>

            <TabsContent value="lieux" className="space-y-4 pt-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-green-700 text-sm">
                    Ceci permet de filtrer les employés quand on sélectionne un lieu lors de la recherche d'un
                    rendez-vous disponible. Vous devez quand même associer le lieu à son horaire de travail.
                  </p>
                </div>
                <p className="text-green-700 text-sm mt-2 ml-7">
                  Lorsque cette boîte est vide, nous considérons l'employé disponible pour tous les lieux.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Lieux de travail associés</Label>
                <div className="border rounded-md divide-y">
                  {adresses.map((adresse) => (
                    <div key={adresse.id} className="flex items-center p-3">
                      <Checkbox
                        id={`adresse-${adresse.id}`}
                        checked={professionnel?.adresses.includes(adresse.id)}
                        onCheckedChange={() => toggleAdresse(adresse.id)}
                      />
                      <div className="ml-3 flex-1">
                        <Label htmlFor={`adresse-${adresse.id}`} className="font-medium cursor-pointer">
                          {adresse.nom}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {adresse.numeroCivique} {adresse.rue}, {adresse.ville}, {adresse.province}{" "}
                          {adresse.codePostal}
                        </p>
                      </div>
                    </div>
                  ))}

                  {adresses.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune adresse disponible. Veuillez d'abord ajouter des adresses.
                    </div>
                  )}
                </div>
              </div>

              {professionnel && professionnel.adresses.length > 0 && (
                <div>
                  <Label>Lieux sélectionnés</Label>
                  <div className="mt-2 space-y-2">
                    {professionnel.adresses.map((adresseId) => (
                      <div key={adresseId} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span>{getAdresseComplete(adresseId)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAdresse(adresseId)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {professionnel && professionnel.adresses.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-700 text-sm flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Ce professionnel sera disponible pour tous les lieux.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="horaires" className="space-y-4 pt-4">
              {professionnel && professionnel.adresses.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <p className="text-amber-700 text-sm flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Veuillez d'abord associer au moins un lieu de travail à ce professionnel avant de définir ses
                    horaires.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Horaires actuels</h3>
                      {professionnel && professionnel.horaires && professionnel.horaires.length > 0 ? (
                        <div className="mt-2 border rounded-md divide-y">
                          {professionnel.horaires.map((horaire) => (
                            <div key={horaire.id} className="flex items-center justify-between p-3">
                              <div className="flex-1">
                                <div className="font-medium">{horaire.jour}</div>
                                <div className="text-sm text-muted-foreground">
                                  {horaire.debut} - {horaire.fin} | {getAdresseComplete(horaire.adresseId)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => supprimerHoraire(horaire.id)}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-2 p-4 text-center text-muted-foreground border rounded-md">
                          Aucun horaire défini pour ce professionnel.
                        </div>
                      )}
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-4">Ajouter un horaire</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jour">Jour</Label>
                          <Select
                            value={nouvelHoraire.jour}
                            onValueChange={(value) => setNouvelHoraire({ ...nouvelHoraire, jour: value })}
                          >
                            <SelectTrigger id="jour">
                              <SelectValue placeholder="Sélectionner un jour" />
                            </SelectTrigger>
                            <SelectContent>
                              {joursDisponibles.map((jour) => (
                                <SelectItem key={jour} value={jour}>
                                  {jour}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="adresseId">Lieu</Label>
                          <Select
                            value={nouvelHoraire.adresseId}
                            onValueChange={(value) => setNouvelHoraire({ ...nouvelHoraire, adresseId: value })}
                          >
                            <SelectTrigger id="adresseId">
                              <SelectValue placeholder="Sélectionner un lieu" />
                            </SelectTrigger>
                            <SelectContent>
                              {professionnel?.adresses.map((adresseId) => {
                                const adresse = adresses.find((a) => a.id === adresseId)
                                return adresse ? (
                                  <SelectItem key={adresseId} value={adresseId}>
                                    {adresse.nom}
                                  </SelectItem>
                                ) : null
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="debut">Heure de début</Label>
                          <Input
                            id="debut"
                            type="time"
                            value={nouvelHoraire.debut}
                            onChange={(e) => setNouvelHoraire({ ...nouvelHoraire, debut: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fin">Heure de fin</Label>
                          <Input
                            id="fin"
                            type="time"
                            value={nouvelHoraire.fin}
                            onChange={(e) => setNouvelHoraire({ ...nouvelHoraire, fin: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={ajouterHoraire}
                        className="mt-4 w-full"
                        disabled={
                          !nouvelHoraire.jour || !nouvelHoraire.debut || !nouvelHoraire.fin || !nouvelHoraire.adresseId
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter cet horaire
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={sauvegarderProfessionnel}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alerte de confirmation de suppression */}
      <AlertDialog open={alerteSuppressionOuverte} onOpenChange={setAlerteSuppressionOuverte}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Attention : Suppression de professionnel</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Vous êtes sur le point de supprimer définitivement ce professionnel de la base de données.</p>
              <div className="rounded-md bg-amber-50 p-4 mt-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Conséquences de cette action :</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Tous les rendez-vous futurs avec ce professionnel seront annulés</li>
                        <li>Les clients associés à ce professionnel ne pourront plus le sélectionner</li>
                        <li>
                          L'historique des rendez-vous passés sera conservé mais marqué comme "professionnel supprimé"
                        </li>
                        <li>Cette action est irréversible et ne peut pas être annulée</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Êtes-vous absolument sûr de vouloir procéder à la suppression ?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={supprimerProfessionnel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
</PrivateLayout>
  )
}

