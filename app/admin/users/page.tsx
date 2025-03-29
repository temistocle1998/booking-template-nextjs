"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  MoreHorizontal,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Users,
  UserCog,
  Shield,
  Lock,
  Unlock,
  Mail,
  RefreshCw,
  Filter,
  X,
  Activity,
  History,
  Settings,
  User,
  Briefcase,
} from "lucide-react"
import PrivateLayout from "@/components/public/private-layout"

// Types
interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  type: "professionnel" | "administratif" | "client" | "super_admin"
  statut: "actif" | "inactif" | "en attente" | "bloqué" | "archivé"
  dateInscription: string
  derniereConnexion: string
  avatar: string
  role?: string
  permissions?: string[]
  adresse?: string
  ville?: string
  codePostal?: string
  pays?: string
  entreprise?: string
  poste?: string
  dateNaissance?: string
  notes?: string
  activites?: Activite[]
}

interface Activite {
  id: string
  type: "connexion" | "modification" | "creation" | "suppression" | "export" | "autre"
  description: string
  date: string
  ip?: string
  appareil?: string
}

interface Statistique {
  label: string
  valeur: number
  pourcentage?: number
  evolution?: "hausse" | "baisse" | "stable"
  icone: React.ReactNode
}

// Données d'exemple
const utilisateursData: Utilisateur[] = [
  {
    id: "1",
    nom: "Tremblay",
    prenom: "Sophie",
    email: "sophie.tremblay@example.com",
    telephone: "+1 (514) 555-1234",
    type: "professionnel",
    statut: "actif",
    dateInscription: "15/03/2023",
    derniereConnexion: "12/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel senior",
    permissions: ["gestion_clients", "gestion_rendez_vous", "gestion_services"],
    adresse: "123 Rue Principale",
    ville: "Montréal",
    codePostal: "H2X 1Y6",
    pays: "Canada",
    entreprise: "Clinique Santé Plus",
    poste: "Physiothérapeute",
    dateNaissance: "12/05/1985",
    notes: "Spécialiste en réadaptation sportive",
    activites: [
      {
        id: "a1",
        type: "connexion",
        description: "Connexion depuis un nouvel appareil",
        date: "12/10/2023 14:32",
        ip: "192.168.1.1",
        appareil: "iPhone 13 Pro, iOS 16.1",
      },
      {
        id: "a2",
        type: "modification",
        description: "Mise à jour des informations de profil",
        date: "10/10/2023 09:15",
        ip: "192.168.1.1",
        appareil: "MacBook Pro, Chrome 117",
      },
    ],
  },
  {
    id: "2",
    nom: "Dubois",
    prenom: "Jean",
    email: "jean.dubois@example.com",
    telephone: "+1 (514) 555-2345",
    type: "administratif",
    statut: "actif",
    dateInscription: "22/05/2023",
    derniereConnexion: "11/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Administrateur régional",
    permissions: ["gestion_utilisateurs", "gestion_professionnels", "gestion_finances"],
    adresse: "456 Boulevard Saint-Laurent",
    ville: "Québec",
    codePostal: "G1R 4P3",
    pays: "Canada",
    entreprise: "Gobering Inc.",
    poste: "Responsable administratif",
    dateNaissance: "03/11/1978",
    notes: "Responsable de la région Est",
    activites: [
      {
        id: "a3",
        type: "creation",
        description: "Création d'un nouveau professionnel",
        date: "11/10/2023 11:22",
        ip: "192.168.1.2",
        appareil: "Windows 11, Firefox 118",
      },
    ],
  },
  {
    id: "3",
    nom: "Lavoie",
    prenom: "Marie",
    email: "marie.lavoie@example.com",
    telephone: "+1 (514) 555-3456",
    type: "client",
    statut: "actif",
    dateInscription: "10/07/2023",
    derniereConnexion: "10/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "789 Avenue du Parc",
    ville: "Montréal",
    codePostal: "H2W 1S8",
    pays: "Canada",
    dateNaissance: "22/09/1990",
    notes: "Cliente régulière, préfère les rendez-vous matinaux",
    activites: [
      {
        id: "a4",
        type: "autre",
        description: "Prise de rendez-vous",
        date: "10/10/2023 08:45",
        ip: "192.168.1.3",
        appareil: "Android 13, Chrome Mobile",
      },
    ],
  },
  {
    id: "4",
    nom: "Gagnon",
    prenom: "Pierre",
    email: "pierre.gagnon@example.com",
    telephone: "+1 (514) 555-4567",
    type: "professionnel",
    statut: "inactif",
    dateInscription: "05/02/2023",
    derniereConnexion: "28/09/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel",
    permissions: ["gestion_clients", "gestion_rendez_vous"],
    adresse: "101 Rue Notre-Dame",
    ville: "Montréal",
    codePostal: "H2Y 1T2",
    pays: "Canada",
    entreprise: "Cabinet Bien-Être",
    poste: "Massothérapeute",
    dateNaissance: "17/03/1982",
    notes: "Compte temporairement désactivé à sa demande",
    activites: [
      {
        id: "a5",
        type: "modification",
        description: "Changement de statut (actif → inactif)",
        date: "28/09/2023 16:30",
        ip: "192.168.1.4",
        appareil: "iPad Air, Safari 16",
      },
    ],
  },
  {
    id: "5",
    nom: "Bergeron",
    prenom: "Isabelle",
    email: "isabelle.bergeron@example.com",
    telephone: "+1 (514) 555-5678",
    type: "client",
    statut: "en attente",
    dateInscription: "18/09/2023",
    derniereConnexion: "18/09/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "202 Rue Sherbrooke",
    ville: "Montréal",
    codePostal: "H2X 1E2",
    pays: "Canada",
    dateNaissance: "05/12/1995",
    notes: "En attente de vérification d'email",
    activites: [
      {
        id: "a6",
        type: "creation",
        description: "Création du compte",
        date: "18/09/2023 14:15",
        ip: "192.168.1.5",
        appareil: "Windows 10, Edge 117",
      },
    ],
  },
  {
    id: "6",
    nom: "Lévesque",
    prenom: "Robert",
    email: "robert.levesque@example.com",
    telephone: "+1 (514) 555-6789",
    type: "client",
    statut: "actif",
    dateInscription: "03/04/2023",
    derniereConnexion: "09/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "303 Boulevard René-Lévesque",
    ville: "Québec",
    codePostal: "G1R 2B3",
    pays: "Canada",
    dateNaissance: "30/07/1975",
    notes: "",
    activites: [
      {
        id: "a7",
        type: "connexion",
        description: "Connexion régulière",
        date: "09/10/2023 19:22",
        ip: "192.168.1.6",
        appareil: "Android 12, Samsung Browser",
      },
    ],
  },
  {
    id: "7",
    nom: "Côté",
    prenom: "Nathalie",
    email: "nathalie.cote@example.com",
    telephone: "+1 (514) 555-7890",
    type: "administratif",
    statut: "actif",
    dateInscription: "12/06/2023",
    derniereConnexion: "11/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Administrateur système",
    permissions: ["gestion_utilisateurs", "gestion_professionnels", "gestion_finances", "gestion_systeme"],
    adresse: "404 Rue Peel",
    ville: "Montréal",
    codePostal: "H3A 1W8",
    pays: "Canada",
    entreprise: "Gobering Inc.",
    poste: "Administrateur système",
    dateNaissance: "14/02/1988",
    notes: "Accès complet au système",
    activites: [
      {
        id: "a8",
        type: "modification",
        description: "Modification des paramètres système",
        date: "11/10/2023 10:05",
        ip: "192.168.1.7",
        appareil: "Windows 11, Chrome 117",
      },
      {
        id: "a9",
        type: "export",
        description: "Export des données utilisateurs",
        date: "10/10/2023 15:30",
        ip: "192.168.1.7",
        appareil: "Windows 11, Chrome 117",
      },
    ],
  },
  {
    id: "8",
    nom: "Bouchard",
    prenom: "Michel",
    email: "michel.bouchard@example.com",
    telephone: "+1 (514) 555-8901",
    type: "professionnel",
    statut: "bloqué",
    dateInscription: "25/01/2023",
    derniereConnexion: "15/08/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel",
    permissions: ["gestion_clients", "gestion_rendez_vous"],
    adresse: "505 Avenue du Mont-Royal",
    ville: "Montréal",
    codePostal: "H2J 2S4",
    pays: "Canada",
    entreprise: "Clinique Harmonie",
    poste: "Ostéopathe",
    dateNaissance: "22/11/1979",
    notes: "Compte bloqué suite à plusieurs plaintes de clients",
    activites: [
      {
        id: "a10",
        type: "autre",
        description: "Compte bloqué par l'administrateur",
        date: "15/08/2023 11:45",
        ip: "192.168.1.8",
        appareil: "iPhone 12, Safari 16",
      },
    ],
  },
  {
    id: "9",
    nom: "Gauthier",
    prenom: "Julie",
    email: "julie.gauthier@example.com",
    telephone: "+1 (514) 555-9012",
    type: "client",
    statut: "actif",
    dateInscription: "08/08/2023",
    derniereConnexion: "10/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "606 Rue Saint-Denis",
    ville: "Montréal",
    codePostal: "H2X 3L9",
    pays: "Canada",
    dateNaissance: "03/06/1992",
    notes: "",
    activites: [
      {
        id: "a11",
        type: "connexion",
        description: "Connexion régulière",
        date: "10/10/2023 20:15",
        ip: "192.168.1.9",
        appareil: "macOS, Safari 16.1",
      },
    ],
  },
  {
    id: "10",
    nom: "Roy",
    prenom: "François",
    email: "francois.roy@example.com",
    telephone: "+1 (514) 555-0123",
    type: "professionnel",
    statut: "actif",
    dateInscription: "17/07/2023",
    derniereConnexion: "12/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel",
    permissions: ["gestion_clients", "gestion_rendez_vous", "gestion_services"],
    adresse: "707 Boulevard de Maisonneuve",
    ville: "Montréal",
    codePostal: "H3A 1E1",
    pays: "Canada",
    entreprise: "Centre Équilibre",
    poste: "Chiropraticien",
    dateNaissance: "19/04/1984",
    notes: "",
    activites: [
      {
        id: "a12",
        type: "modification",
        description: "Mise à jour des services offerts",
        date: "11/10/2023 14:20",
        ip: "192.168.1.10",
        appareil: "Windows 10, Chrome 117",
      },
    ],
  },
  {
    id: "11",
    nom: "Fortin",
    prenom: "Caroline",
    email: "caroline.fortin@example.com",
    telephone: "+1 (514) 555-1234",
    type: "client",
    statut: "actif",
    dateInscription: "29/05/2023",
    derniereConnexion: "11/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "808 Rue Sainte-Catherine",
    ville: "Montréal",
    codePostal: "H3B 1E2",
    pays: "Canada",
    dateNaissance: "27/08/1988",
    notes: "Préfère les communications par SMS",
    activites: [
      {
        id: "a13",
        type: "autre",
        description: "Annulation de rendez-vous",
        date: "11/10/2023 09:30",
        ip: "192.168.1.11",
        appareil: "iPhone 13, iOS 16.1",
      },
    ],
  },
  {
    id: "12",
    nom: "Ouellet",
    prenom: "David",
    email: "david.ouellet@example.com",
    telephone: "+1 (514) 555-2345",
    type: "administratif",
    statut: "inactif",
    dateInscription: "14/03/2023",
    derniereConnexion: "20/09/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Administrateur junior",
    permissions: ["gestion_utilisateurs", "gestion_professionnels"],
    adresse: "909 Avenue Papineau",
    ville: "Montréal",
    codePostal: "H2K 4J5",
    pays: "Canada",
    entreprise: "Gobering Inc.",
    poste: "Assistant administratif",
    dateNaissance: "11/12/1991",
    notes: "En congé prolongé",
    activites: [
      {
        id: "a14",
        type: "modification",
        description: "Changement de statut (actif → inactif)",
        date: "20/09/2023 16:45",
        ip: "192.168.1.12",
        appareil: "Android 13, Chrome Mobile",
      },
    ],
  },
  {
    id: "13",
    nom: "Pelletier",
    prenom: "Stéphanie",
    email: "stephanie.pelletier@example.com",
    telephone: "+1 (514) 555-3456",
    type: "client",
    statut: "actif",
    dateInscription: "02/02/2023",
    derniereConnexion: "09/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "1010 Rue Rachel",
    ville: "Montréal",
    codePostal: "H2J 2J3",
    pays: "Canada",
    dateNaissance: "15/10/1986",
    notes: "",
    activites: [
      {
        id: "a15",
        type: "connexion",
        description: "Connexion régulière",
        date: "09/10/2023 12:10",
        ip: "192.168.1.13",
        appareil: "Windows 11, Edge 117",
      },
    ],
  },
  {
    id: "14",
    nom: "Bélanger",
    prenom: "Philippe",
    email: "philippe.belanger@example.com",
    telephone: "+1 (514) 555-4567",
    type: "professionnel",
    statut: "actif",
    dateInscription: "11/04/2023",
    derniereConnexion: "12/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel senior",
    permissions: ["gestion_clients", "gestion_rendez_vous", "gestion_services"],
    adresse: "1111 Boulevard Saint-Joseph",
    ville: "Montréal",
    codePostal: "H2J 1L3",
    pays: "Canada",
    entreprise: "Clinique Vitalité",
    poste: "Nutritionniste",
    dateNaissance: "08/07/1980",
    notes: "Spécialiste en nutrition sportive",
    activites: [
      {
        id: "a16",
        type: "modification",
        description: "Mise à jour des disponibilités",
        date: "12/10/2023 08:45",
        ip: "192.168.1.14",
        appareil: "MacBook Air, Chrome 117",
      },
    ],
  },
  {
    id: "15",
    nom: "Morin",
    prenom: "Valérie",
    email: "valerie.morin@example.com",
    telephone: "+1 (514) 555-5678",
    type: "client",
    statut: "en attente",
    dateInscription: "20/09/2023",
    derniereConnexion: "20/09/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "1212 Rue Ontario",
    ville: "Montréal",
    codePostal: "H2L 1R7",
    pays: "Canada",
    dateNaissance: "23/01/1994",
    notes: "En attente de confirmation téléphonique",
    activites: [
      {
        id: "a17",
        type: "creation",
        description: "Création du compte",
        date: "20/09/2023 11:30",
        ip: "192.168.1.15",
        appareil: "iPhone 12 Mini, iOS 16.0",
      },
    ],
  },
  {
    id: "16",
    nom: "Lefebvre",
    prenom: "Alexandre",
    email: "alexandre.lefebvre@example.com",
    telephone: "+1 (514) 555-6789",
    type: "super_admin",
    statut: "actif",
    dateInscription: "01/01/2023",
    derniereConnexion: "12/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Super Administrateur",
    permissions: ["tous"],
    adresse: "1313 Avenue du Mont-Royal",
    ville: "Montréal",
    codePostal: "H2J 1Y7",
    pays: "Canada",
    entreprise: "Gobering Inc.",
    poste: "Directeur technique",
    dateNaissance: "05/05/1982",
    notes: "Accès complet à toutes les fonctionnalités",
    activites: [
      {
        id: "a18",
        type: "modification",
        description: "Modification des paramètres globaux",
        date: "12/10/2023 09:15",
        ip: "192.168.1.16",
        appareil: "MacBook Pro, Safari 16.1",
      },
      {
        id: "a19",
        type: "autre",
        description: "Ajout d'un nouvel administrateur",
        date: "11/10/2023 14:30",
        ip: "192.168.1.16",
        appareil: "MacBook Pro, Safari 16.1",
      },
    ],
  },
  {
    id: "17",
    nom: "Girard",
    prenom: "Émilie",
    email: "emilie.girard@example.com",
    telephone: "+1 (514) 555-7890",
    type: "client",
    statut: "archivé",
    dateInscription: "15/12/2022",
    derniereConnexion: "03/05/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "1414 Rue Saint-Hubert",
    ville: "Montréal",
    codePostal: "H2L 3Y7",
    pays: "Canada",
    dateNaissance: "17/09/1989",
    notes: "Compte archivé à la demande de l'utilisateur",
    activites: [
      {
        id: "a20",
        type: "autre",
        description: "Demande d'archivage du compte",
        date: "03/05/2023 16:20",
        ip: "192.168.1.17",
        appareil: "Android 12, Chrome Mobile",
      },
    ],
  },
  {
    id: "18",
    nom: "Caron",
    prenom: "Mathieu",
    email: "mathieu.caron@example.com",
    telephone: "+1 (514) 555-8901",
    type: "professionnel",
    statut: "actif",
    dateInscription: "08/03/2023",
    derniereConnexion: "11/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Professionnel",
    permissions: ["gestion_clients", "gestion_rendez_vous"],
    adresse: "1515 Boulevard René-Lévesque",
    ville: "Montréal",
    codePostal: "H3G 1T7",
    pays: "Canada",
    entreprise: "Studio Zen",
    poste: "Coach sportif",
    dateNaissance: "29/03/1987",
    notes: "",
    activites: [
      {
        id: "a21",
        type: "connexion",
        description: "Connexion régulière",
        date: "11/10/2023 17:45",
        ip: "192.168.1.18",
        appareil: "iPad Pro, iPadOS 16.1",
      },
    ],
  },
  {
    id: "19",
    nom: "Beaulieu",
    prenom: "Catherine",
    email: "catherine.beaulieu@example.com",
    telephone: "+1 (514) 555-9012",
    type: "client",
    statut: "actif",
    dateInscription: "19/06/2023",
    derniereConnexion: "10/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    adresse: "1616 Rue Beaubien",
    ville: "Montréal",
    codePostal: "H2G 1M4",
    pays: "Canada",
    dateNaissance: "12/02/1993",
    notes: "",
    activites: [
      {
        id: "a22",
        type: "autre",
        description: "Prise de rendez-vous",
        date: "10/10/2023 13:20",
        ip: "192.168.1.19",
        appareil: "iPhone 13 Pro, iOS 16.1",
      },
    ],
  },
  {
    id: "20",
    nom: "Gosselin",
    prenom: "Patrick",
    email: "patrick.gosselin@example.com",
    telephone: "+1 (514) 555-0123",
    type: "administratif",
    statut: "actif",
    dateInscription: "27/02/2023",
    derniereConnexion: "12/10/2023",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Administrateur financier",
    permissions: ["gestion_finances", "gestion_rapports"],
    adresse: "1717 Avenue Laurier",
    ville: "Montréal",
    codePostal: "H2J 1B3",
    pays: "Canada",
    entreprise: "Gobering Inc.",
    poste: "Responsable financier",
    dateNaissance: "14/06/1981",
    notes: "Responsable des rapports financiers",
    activites: [
      {
        id: "a23",
        type: "export",
        description: "Export des données financières",
        date: "12/10/2023 10:30",
        ip: "192.168.1.20",
        appareil: "Windows 11, Chrome 117",
      },
    ],
  },
]

// Statistiques
const statistiquesUtilisateurs: Statistique[] = [
  {
    label: "Total utilisateurs",
    valeur: 1254,
    icone: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "Nouveaux (30j)",
    valeur: 87,
    pourcentage: 12.4,
    evolution: "hausse",
    icone: <UserPlus className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "Actifs",
    valeur: 978,
    pourcentage: 78.0,
    evolution: "stable",
    icone: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "Inactifs",
    valeur: 198,
    pourcentage: 15.8,
    evolution: "baisse",
    icone: <XCircle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "En attente",
    valeur: 45,
    pourcentage: 3.6,
    evolution: "hausse",
    icone: <Clock className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "Bloqués",
    valeur: 33,
    pourcentage: 2.6,
    evolution: "hausse",
    icone: <Lock className="h-4 w-4 text-muted-foreground" />,
  },
]

export default function AdminUtilisateurs() {
  const [recherche, setRecherche] = useState<string>("")
  const [filtreType, setFiltreType] = useState<string>("tous")
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [page, setPage] = useState<number>(1)
  const [utilisateursSelectionnes, setUtilisateursSelectionnes] = useState<string[]>([])
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<Utilisateur | null>(null)
  const [dialogSuppressionOuvert, setDialogSuppressionOuvert] = useState<boolean>(false)
  const [dialogDetailsOuvert, setDialogDetailsOuvert] = useState<boolean>(false)
  const [dialogEditionOuvert, setDialogEditionOuvert] = useState<boolean>(false)
  const [dialogActionsGroupeOuvert, setDialogActionsGroupeOuvert] = useState<boolean>(false)
  const [filtresAvancesOuverts, setFiltresAvancesOuverts] = useState<boolean>(false)
  const [ongletActif, setOngletActif] = useState<string>("tous")
  const { toast } = useToast()

  const elementsParPage = 10

  // Filtrer les utilisateurs
  const utilisateursFiltres = utilisateursData.filter((user) => {
    const matchRecherche =
      user.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      user.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      user.email.toLowerCase().includes(recherche.toLowerCase()) ||
      user.telephone.toLowerCase().includes(recherche.toLowerCase())

    const matchType = filtreType === "tous" || user.type === filtreType
    const matchStatut = filtreStatut === "tous" || user.statut === filtreStatut
    const matchOnglet =
      ongletActif === "tous" ||
      (ongletActif === "recents" &&
        new Date(user.dateInscription.split("/").reverse().join("-")) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (ongletActif === "actifs" && user.statut === "actif") ||
      (ongletActif === "inactifs" && user.statut === "inactif") ||
      (ongletActif === "en_attente" && user.statut === "en attente") ||
      (ongletActif === "bloques" && user.statut === "bloqué") ||
      (ongletActif === "archives" && user.statut === "archivé")

    return matchRecherche && matchType && matchStatut && matchOnglet
  })

  // Pagination
  const totalPages = Math.ceil(utilisateursFiltres.length / elementsParPage)
  const debut = (page - 1) * elementsParPage
  const fin = debut + elementsParPage
  const utilisateursPage = utilisateursFiltres.slice(debut, fin)

  // Obtenir la couleur du badge en fonction du statut
  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case "actif":
        return "success"
      case "inactif":
        return "secondary"
      case "en attente":
        return "warning"
      case "bloqué":
        return "destructive"
      case "archivé":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Obtenir l'icône de statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "actif":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "inactif":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "en attente":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "bloqué":
        return <Lock className="h-4 w-4 text-red-500" />
      case "archivé":
        return <History className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  // Obtenir l'icône de type d'utilisateur
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "professionnel":
        return <Briefcase className="h-4 w-4 text-blue-500" />
      case "administratif":
        return <UserCog className="h-4 w-4 text-purple-500" />
      case "client":
        return <User className="h-4 w-4 text-green-500" />
      case "super_admin":
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Obtenir l'icône d'activité
  const getActiviteIcon = (type: string) => {
    switch (type) {
      case "connexion":
        return <Unlock className="h-4 w-4 text-green-500" />
      case "modification":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "creation":
        return <Plus className="h-4 w-4 text-purple-500" />
      case "suppression":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "export":
        return <Download className="h-4 w-4 text-amber-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  // Gérer la sélection de tous les utilisateurs
  const handleSelectAll = () => {
    if (utilisateursSelectionnes.length === utilisateursPage.length) {
      setUtilisateursSelectionnes([])
    } else {
      setUtilisateursSelectionnes(utilisateursPage.map((user) => user.id))
    }
  }

  // Gérer la sélection d'un utilisateur
  const handleSelectUser = (id: string) => {
    if (utilisateursSelectionnes.includes(id)) {
      setUtilisateursSelectionnes(utilisateursSelectionnes.filter((userId) => userId !== id))
    } else {
      setUtilisateursSelectionnes([...utilisateursSelectionnes, id])
    }
  }

  // Gérer la suppression
  const handleSuppression = () => {
    // Logique de suppression à implémenter
    toast({
      title: "Utilisateur supprimé",
      description: `L'utilisateur ${utilisateurSelectionne?.prenom} ${utilisateurSelectionne?.nom} a été supprimé avec succès.`,
      variant: "default",
    })
    setDialogSuppressionOuvert(false)
    setUtilisateurSelectionne(null)
  }

  // Gérer les actions de groupe
  const handleActionsGroupe = (action: string) => {
    // Logique d'actions de groupe à implémenter
    const nombreUtilisateurs = utilisateursSelectionnes.length
    let message = ""

    switch (action) {
      case "activer":
        message = `${nombreUtilisateurs} utilisateurs ont été activés avec succès.`
        break
      case "desactiver":
        message = `${nombreUtilisateurs} utilisateurs ont été désactivés avec succès.`
        break
      case "supprimer":
        message = `${nombreUtilisateurs} utilisateurs ont été supprimés avec succès.`
        break
      case "exporter":
        message = `Les données de ${nombreUtilisateurs} utilisateurs ont été exportées avec succès.`
        break
      default:
        message = `Action effectuée sur ${nombreUtilisateurs} utilisateurs.`
    }

    toast({
      title: "Action de groupe effectuée",
      description: message,
      variant: "default",
    })
    setDialogActionsGroupeOuvert(false)
    setUtilisateursSelectionnes([])
  }

  // Gérer l'envoi du formulaire d'édition
  const handleSubmitEdition = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de mise à jour à implémenter
    toast({
      title: "Utilisateur mis à jour",
      description: `Les informations de ${utilisateurSelectionne?.prenom} ${utilisateurSelectionne?.nom} ont été mises à jour avec succès.`,
      variant: "default",
    })
    setDialogEditionOuvert(false)
  }

  // Réinitialiser les filtres
  const resetFiltres = () => {
    setRecherche("")
    setFiltreType("tous")
    setFiltreStatut("tous")
    setFiltresAvancesOuverts(false)
    setPage(1)
  }

  return (
   <PrivateLayout>
     <div className="container mx-auto py-6 space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration des utilisateurs</h1>
          <p className="text-muted-foreground">Gestion complète des utilisateurs de la plateforme</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          {utilisateursSelectionnes.length > 0 && (
            <Button variant="secondary" onClick={() => setDialogActionsGroupeOuvert(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Actions ({utilisateursSelectionnes.length})
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {statistiquesUtilisateurs.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                {stat.icone}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{stat.valeur.toLocaleString()}</div>
              {stat.pourcentage !== undefined && (
                <div className="flex items-center mt-1">
                  <span
                    className={`text-xs ${
                      stat.evolution === "hausse"
                        ? "text-green-500"
                        : stat.evolution === "baisse"
                          ? "text-red-500"
                          : "text-gray-500"
                    }`}
                  >
                    {stat.pourcentage}%{stat.evolution === "hausse" && " ↑"}
                    {stat.evolution === "baisse" && " ↓"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onglets */}
      <Tabs value={ongletActif} onValueChange={setOngletActif} className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tous" className="flex-1 md:flex-none">
            Tous
          </TabsTrigger>
          <TabsTrigger value="recents" className="flex-1 md:flex-none">
            Récents
          </TabsTrigger>
          <TabsTrigger value="actifs" className="flex-1 md:flex-none">
            Actifs
          </TabsTrigger>
          <TabsTrigger value="inactifs" className="flex-1 md:flex-none">
            Inactifs
          </TabsTrigger>
          <TabsTrigger value="en_attente" className="flex-1 md:flex-none">
            En attente
          </TabsTrigger>
          <TabsTrigger value="bloques" className="flex-1 md:flex-none">
            Bloqués
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex-1 md:flex-none">
            Archivés
          </TabsTrigger>
        </TabsList>

        <TabsContent value={ongletActif} className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <CardTitle>Utilisateurs ({utilisateursFiltres.length})</CardTitle>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                      value={recherche}
                      onChange={(e) => {
                        setRecherche(e.target.value)
                        setPage(1) // Réinitialiser la page lors d'une recherche
                      }}
                    />
                  </div>
                  <Select
                    value={filtreType}
                    onValueChange={(value) => {
                      setFiltreType(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Type d'utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="professionnel">Professionnels</SelectItem>
                      <SelectItem value="administratif">Administratifs</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filtreStatut}
                    onValueChange={(value) => {
                      setFiltreStatut(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="actif">Actifs</SelectItem>
                      <SelectItem value="inactif">Inactifs</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="bloqué">Bloqués</SelectItem>
                      <SelectItem value="archivé">Archivés</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFiltresAvancesOuverts(!filtresAvancesOuverts)}
                    className={filtresAvancesOuverts ? "bg-muted" : ""}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  {(recherche || filtreType !== "tous" || filtreStatut !== "tous" || filtresAvancesOuverts) && (
                    <Button variant="ghost" size="sm" onClick={resetFiltres}>
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>

              {/* Filtres avancés */}
              {filtresAvancesOuverts && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label htmlFor="date-inscription">Date d'inscription</Label>
                    <Select defaultValue="tous">
                      <SelectTrigger id="date-inscription">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Toutes les périodes</SelectItem>
                        <SelectItem value="7j">7 derniers jours</SelectItem>
                        <SelectItem value="30j">30 derniers jours</SelectItem>
                        <SelectItem value="90j">90 derniers jours</SelectItem>
                        <SelectItem value="annee">Cette année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="derniere-connexion">Dernière connexion</Label>
                    <Select defaultValue="tous">
                      <SelectTrigger id="derniere-connexion">
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Toutes les périodes</SelectItem>
                        <SelectItem value="7j">7 derniers jours</SelectItem>
                        <SelectItem value="30j">30 derniers jours</SelectItem>
                        <SelectItem value="90j">90 derniers jours</SelectItem>
                        <SelectItem value="inactif">Inactif (+ 90j)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select defaultValue="tous">
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les rôles</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="admin_junior">Admin junior</SelectItem>
                        <SelectItem value="pro_senior">Pro senior</SelectItem>
                        <SelectItem value="pro">Professionnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="permission">Permission</Label>
                    <Select defaultValue="tous">
                      <SelectTrigger id="permission">
                        <SelectValue placeholder="Permission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Toutes les permissions</SelectItem>
                        <SelectItem value="gestion_utilisateurs">Gestion utilisateurs</SelectItem>
                        <SelectItem value="gestion_professionnels">Gestion professionnels</SelectItem>
                        <SelectItem value="gestion_finances">Gestion finances</SelectItem>
                        <SelectItem value="gestion_systeme">Gestion système</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          utilisateursSelectionnes.length === utilisateursPage.length && utilisateursPage.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Sélectionner tous les utilisateurs"
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                    <TableHead className="hidden md:table-cell">Date d'inscription</TableHead>
                    <TableHead className="hidden lg:table-cell">Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilisateursPage.length > 0 ? (
                    utilisateursPage.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            checked={utilisateursSelectionnes.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                            aria-label={`Sélectionner ${user.prenom} ${user.nom}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={`${user.prenom} ${user.nom}`} />
                              <AvatarFallback>
                                {user.prenom.charAt(0)}
                                {user.nom.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.prenom} {user.nom}
                              </div>
                              {user.role && <div className="text-xs text-muted-foreground">{user.role}</div>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(user.type)}
                            <Badge variant="outline">{user.type}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{user.telephone}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.dateInscription}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.derniereConnexion}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getStatutIcon(user.statut)}
                            <Badge variant={getStatutBadgeVariant(user.statut)}>{user.statut}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setUtilisateurSelectionne(user)
                                  setDialogDetailsOuvert(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setUtilisateurSelectionne(user)
                                  setDialogEditionOuvert(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              {user.statut === "actif" ? (
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Désactiver
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Activer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Réinitialiser le mot de passe
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer un email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setUtilisateurSelectionne(user)
                                  setDialogSuppressionOuvert(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        Aucun utilisateur trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(page > 1 ? page - 1 : 1)}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        // Afficher seulement les pages proches de la page actuelle
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink isActive={pageNum === page} onClick={() => setPage(pageNum)}>
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          (pageNum === page - 2 && page > 3) ||
                          (pageNum === page + 2 && page < totalPages - 2)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        return null
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={dialogSuppressionOuvert} onOpenChange={setDialogSuppressionOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <strong>
                {utilisateurSelectionne?.prenom} {utilisateurSelectionne?.nom}
              </strong>{" "}
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
            <p className="text-amber-800 text-sm font-medium mb-2">Cette action entraînera :</p>
            <ul className="text-amber-700 text-sm space-y-1 list-disc pl-5">
              <li>La suppression définitive du compte utilisateur</li>
              <li>La révocation de tous les accès à la plateforme</li>
              {utilisateurSelectionne?.type === "professionnel" && (
                <li>L'annulation de tous les rendez-vous futurs associés à ce professionnel</li>
              )}
              {utilisateurSelectionne?.type === "administratif" && (
                <li>La perte des droits d'administration sur les ressources gérées</li>
              )}
              <li>La conservation des données historiques pour des raisons légales</li>
              <li className="font-semibold">Cette action est irréversible</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogSuppressionOuvert(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleSuppression}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails utilisateur */}
      <Dialog open={dialogDetailsOuvert} onOpenChange={setDialogDetailsOuvert}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>Informations complètes sur l'utilisateur</DialogDescription>
          </DialogHeader>
          {utilisateurSelectionne && (
            <Tabs defaultValue="informations" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="informations">Informations</TabsTrigger>
                <TabsTrigger value="activites">Activités</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="informations" className="space-y-4 mt-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={utilisateurSelectionne.avatar}
                      alt={`${utilisateurSelectionne.prenom} ${utilisateurSelectionne.nom}`}
                    />
                    <AvatarFallback>
                      {utilisateurSelectionne.prenom.charAt(0)}
                      {utilisateurSelectionne.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">
                      {utilisateurSelectionne.prenom} {utilisateurSelectionne.nom}
                    </h3>
                    <p className="text-sm text-muted-foreground">{utilisateurSelectionne.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeIcon(utilisateurSelectionne.type)}
                      <Badge variant="outline">{utilisateurSelectionne.type}</Badge>
                      <Badge variant={getStatutBadgeVariant(utilisateurSelectionne.statut)}>
                        {utilisateurSelectionne.statut}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Informations personnelles</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                        <p>{utilisateurSelectionne.telephone}</p>
                      </div>
                      {utilisateurSelectionne.dateNaissance && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
                          <p>{utilisateurSelectionne.dateNaissance}</p>
                        </div>
                      )}
                      {utilisateurSelectionne.adresse && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                          <p>{utilisateurSelectionne.adresse}</p>
                          <p>
                            {utilisateurSelectionne.codePostal}, {utilisateurSelectionne.ville}
                          </p>
                          <p>{utilisateurSelectionne.pays}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Informations du compte</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date d'inscription</p>
                        <p>{utilisateurSelectionne.dateInscription}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Dernière connexion</p>
                        <p>{utilisateurSelectionne.derniereConnexion}</p>
                      </div>
                      {utilisateurSelectionne.role && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                          <p>{utilisateurSelectionne.role}</p>
                        </div>
                      )}
                      {utilisateurSelectionne.entreprise && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Entreprise</p>
                          <p>{utilisateurSelectionne.entreprise}</p>
                        </div>
                      )}
                      {utilisateurSelectionne.poste && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Poste</p>
                          <p>{utilisateurSelectionne.poste}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ID</p>
                        <p className="text-xs">{utilisateurSelectionne.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activites" className="mt-4">
                <ScrollArea className="h-[300px]">
                  {utilisateurSelectionne.activites && utilisateurSelectionne.activites.length > 0 ? (
                    <div className="space-y-4">
                      {utilisateurSelectionne.activites.map((activite) => (
                        <div key={activite.id} className="flex items-start space-x-3 border-b pb-3">
                          <div className="bg-muted rounded-full p-1.5">{getActiviteIcon(activite.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{activite.description}</p>
                              <p className="text-xs text-muted-foreground">{activite.date}</p>
                            </div>
                            {(activite.ip || activite.appareil) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {activite.ip && `IP: ${activite.ip}`}
                                {activite.ip && activite.appareil && " | "}
                                {activite.appareil && `Appareil: ${activite.appareil}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Aucune activité enregistrée</p>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="permissions" className="mt-4">
                {utilisateurSelectionne.permissions && utilisateurSelectionne.permissions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {utilisateurSelectionne.permissions.includes("tous") ? (
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-red-500" />
                            <p className="font-medium">Accès complet (Super Admin)</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Cet utilisateur dispose d'un accès complet à toutes les fonctionnalités du système.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Gestion des utilisateurs</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_utilisateurs")}
                                  disabled
                                />
                                <Label>Gestion des utilisateurs</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_professionnels")}
                                  disabled
                                />
                                <Label>Gestion des professionnels</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_clients")}
                                  disabled
                                />
                                <Label>Gestion des clients</Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Gestion des services</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_rendez_vous")}
                                  disabled
                                />
                                <Label>Gestion des rendez-vous</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_services")}
                                  disabled
                                />
                                <Label>Gestion des services</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_finances")}
                                  disabled
                                />
                                <Label>Gestion des finances</Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Administration</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_rapports")}
                                  disabled
                                />
                                <Label>Gestion des rapports</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={utilisateurSelectionne.permissions.includes("gestion_systeme")}
                                  disabled
                                />
                                <Label>Gestion du système</Label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucune permission spécifique</p>
                )}
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted rounded-md p-4">
                    <p className="text-sm">
                      {utilisateurSelectionne.notes || "Aucune note disponible pour cet utilisateur."}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="new-note">Ajouter une note</Label>
                    <Textarea id="new-note" placeholder="Saisissez une nouvelle note..." className="mt-1" />
                    <Button size="sm" className="mt-2">
                      Enregistrer la note
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogDetailsOuvert(false)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                setDialogDetailsOuvert(false)
                setDialogEditionOuvert(true)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition utilisateur */}
      <Dialog open={dialogEditionOuvert} onOpenChange={setDialogEditionOuvert}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifier les informations de l'utilisateur</DialogDescription>
          </DialogHeader>
          {utilisateurSelectionne && (
            <form onSubmit={handleSubmitEdition}>
              <Tabs defaultValue="informations" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="informations">Informations</TabsTrigger>
                  <TabsTrigger value="adresse">Adresse</TabsTrigger>
                  <TabsTrigger value="professionnel">Professionnel</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="informations" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={utilisateurSelectionne.avatar}
                        alt={`${utilisateurSelectionne.prenom} ${utilisateurSelectionne.nom}`}
                      />
                      <AvatarFallback>
                        {utilisateurSelectionne.prenom.charAt(0)}
                        {utilisateurSelectionne.nom.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Changer la photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="prenom">Prénom</Label>
                        <Input id="prenom" defaultValue={utilisateurSelectionne.prenom} />
                      </div>
                      <div>
                        <Label htmlFor="nom">Nom</Label>
                        <Input id="nom" defaultValue={utilisateurSelectionne.nom} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={utilisateurSelectionne.email} />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input id="telephone" defaultValue={utilisateurSelectionne.telephone} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date-naissance">Date de naissance</Label>
                        <Input
                          id="date-naissance"
                          type="text"
                          defaultValue={utilisateurSelectionne.dateNaissance || ""}
                          placeholder="JJ/MM/AAAA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type d'utilisateur</Label>
                        <Select defaultValue={utilisateurSelectionne.type}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professionnel">Professionnel</SelectItem>
                            <SelectItem value="administratif">Administratif</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="statut">Statut</Label>
                        <Select defaultValue={utilisateurSelectionne.statut}>
                          <SelectTrigger id="statut">
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                            <SelectItem value="en attente">En attente</SelectItem>
                            <SelectItem value="bloqué">Bloqué</SelectItem>
                            <SelectItem value="archivé">Archivé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          defaultValue={utilisateurSelectionne.notes || ""}
                          placeholder="Notes sur l'utilisateur"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="adresse" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adresse">Adresse</Label>
                      <Input
                        id="adresse"
                        defaultValue={utilisateurSelectionne.adresse || ""}
                        placeholder="Rue et numéro"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ville">Ville</Label>
                      <Input id="ville" defaultValue={utilisateurSelectionne.ville || ""} placeholder="Ville" />
                    </div>
                    <div>
                      <Label htmlFor="code-postal">Code postal</Label>
                      <Input
                        id="code-postal"
                        defaultValue={utilisateurSelectionne.codePostal || ""}
                        placeholder="Code postal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pays">Pays</Label>
                      <Select defaultValue={utilisateurSelectionne.pays || "Canada"}>
                        <SelectTrigger id="pays">
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Belgique">Belgique</SelectItem>
                          <SelectItem value="Suisse">Suisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="professionnel" className="space-y-4 mt-4">
                  {utilisateurSelectionne.type === "professionnel" ||
                  utilisateurSelectionne.type === "administratif" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entreprise">Entreprise</Label>
                        <Input
                          id="entreprise"
                          defaultValue={utilisateurSelectionne.entreprise || ""}
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <Label htmlFor="poste">Poste</Label>
                        <Input
                          id="poste"
                          defaultValue={utilisateurSelectionne.poste || ""}
                          placeholder="Titre du poste"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Select defaultValue={utilisateurSelectionne.role || ""}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            {utilisateurSelectionne.type === "professionnel" ? (
                              <>
                                <SelectItem value="Professionnel">Professionnel</SelectItem>
                                <SelectItem value="Professionnel senior">Professionnel senior</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="Administrateur junior">Administrateur junior</SelectItem>
                                <SelectItem value="Administrateur régional">Administrateur régional</SelectItem>
                                <SelectItem value="Administrateur système">Administrateur système</SelectItem>
                                <SelectItem value="Administrateur financier">Administrateur financier</SelectItem>
                                <SelectItem value="Super Administrateur">Super Administrateur</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">
                        Ces informations ne sont disponibles que pour les utilisateurs de type professionnel ou
                        administratif.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tous-droits" />
                      <Label htmlFor="tous-droits" className="font-medium">
                        Accès complet (Super Admin)
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Attention : cette option donne un accès complet à toutes les fonctionnalités du système.
                    </p>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Gestion des utilisateurs</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-utilisateurs"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_utilisateurs")}
                            />
                            <Label htmlFor="perm-gestion-utilisateurs">Gestion des utilisateurs</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-professionnels"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_professionnels")}
                            />
                            <Label htmlFor="perm-gestion-professionnels">Gestion des professionnels</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-clients"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_clients")}
                            />
                            <Label htmlFor="perm-gestion-clients">Gestion des clients</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Gestion des services</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-rendez-vous"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_rendez_vous")}
                            />
                            <Label htmlFor="perm-gestion-rendez-vous">Gestion des rendez-vous</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-services"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_services")}
                            />
                            <Label htmlFor="perm-gestion-services">Gestion des services</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-finances"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_finances")}
                            />
                            <Label htmlFor="perm-gestion-finances">Gestion des finances</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Administration</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-rapports"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_rapports")}
                            />
                            <Label htmlFor="perm-gestion-rapports">Gestion des rapports</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="perm-gestion-systeme"
                              defaultChecked={utilisateurSelectionne.permissions?.includes("gestion_systeme")}
                            />
                            <Label htmlFor="perm-gestion-systeme">Gestion du système</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" type="button" onClick={() => setDialogEditionOuvert(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog d'actions de groupe */}
      <Dialog open={dialogActionsGroupeOuvert} onOpenChange={setDialogActionsGroupeOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actions de groupe</DialogTitle>
            <DialogDescription>
              Appliquer une action sur {utilisateursSelectionnes.length} utilisateur(s) sélectionné(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <RadioGroup defaultValue="activer">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="activer" id="activer" />
                <Label htmlFor="activer">Activer les utilisateurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desactiver" id="desactiver" />
                <Label htmlFor="desactiver">Désactiver les utilisateurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exporter" id="exporter" />
                <Label htmlFor="exporter">Exporter les données</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Envoyer un email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="supprimer" id="supprimer" />
                <Label htmlFor="supprimer" className="text-destructive">
                  Supprimer les utilisateurs
                </Label>
              </div>
            </RadioGroup>

            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                Cette action sera appliquée aux {utilisateursSelectionnes.length} utilisateurs sélectionnés. Veuillez
                confirmer pour continuer.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogActionsGroupeOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={() => handleActionsGroupe("activer")}>Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
   </PrivateLayout>
  )
}

