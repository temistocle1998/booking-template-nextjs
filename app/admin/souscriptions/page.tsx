"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
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
  Building2,
  Users,
  CreditCard,
  RefreshCw,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  FileText,
  Mail,
  Phone,
  BarChart3,
  PieChart,
} from "lucide-react"
import PrivateLayout from "@/components/public/private-layout"

// Types
interface Compagnie {
  id: string
  nom: string
  adresse: string
  ville: string
  codePostal: string
  pays: string
  email: string
  telephone: string
  nombreEmployes: number
  nombreClients: number
  statut: "active" | "inactive" | "en attente"
  dateCreation: string
  logo: string
}

interface Souscription {
  id: string
  compagnieId: string
  compagnieNom: string
  plan: "mensuel" | "annuel"
  niveau: "basic" | "pro" | "enterprise"
  montant: number
  dateDebut: string
  dateFin: string
  statut: "active" | "expirée" | "en attente" | "annulée"
  nombreUtilisateurs: number
  methodePaiement: string
  dernierPaiement: string
  prochainPaiement: string | null
  renouvellementAuto: boolean
  historiquePaiements: HistoriquePaiement[]
  notes: string
}

interface HistoriquePaiement {
  id: string
  date: string
  montant: number
  methode: string
  statut: "réussi" | "échoué" | "remboursé"
  reference: string
}

interface Statistique {
  label: string
  valeur: string | number
  pourcentage: number
  tendance: "hausse" | "baisse" | "stable"
  periode: string
}

interface RevenusParPeriode {
  periode: string
  montant: number
}

interface RevenusParPlan {
  plan: string
  montant: number
  pourcentage: number
}

// Données d'exemple
const compagnies: Compagnie[] = [
  {
    id: "1",
    nom: "Clinique Santé Plus",
    adresse: "123 Rue Principale",
    ville: "Montréal",
    codePostal: "H2X 1Y6",
    pays: "Canada",
    email: "contact@cliniquesanteplus.com",
    telephone: "+1 514-555-1234",
    nombreEmployes: 15,
    nombreClients: 450,
    statut: "active",
    dateCreation: "10/01/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    nom: "Centre Bien-Être Harmonie",
    adresse: "456 Boulevard St-Laurent",
    ville: "Québec",
    codePostal: "G1K 3B2",
    pays: "Canada",
    email: "info@centreharmonie.com",
    telephone: "+1 418-555-6789",
    nombreEmployes: 8,
    nombreClients: 320,
    statut: "active",
    dateCreation: "15/03/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    nom: "Physio Optimum",
    adresse: "789 Avenue du Parc",
    ville: "Laval",
    codePostal: "H7N 3W7",
    pays: "Canada",
    email: "contact@physiooptimum.com",
    telephone: "+1 450-555-4321",
    nombreEmployes: 12,
    nombreClients: 380,
    statut: "active",
    dateCreation: "22/05/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

const souscriptionsData: Souscription[] = [
  {
    id: "1",
    compagnieId: "1",
    compagnieNom: "Clinique Santé Plus",
    plan: "annuel",
    niveau: "pro",
    montant: 1200,
    dateDebut: "10/01/2023",
    dateFin: "10/01/2024",
    statut: "active",
    nombreUtilisateurs: 15,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "10/01/2023",
    prochainPaiement: "10/01/2024",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p1",
        date: "10/01/2023",
        montant: 1200,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-12345",
      },
      {
        id: "p2",
        date: "10/01/2022",
        montant: 1100,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-98765",
      },
    ],
    notes: "Client fidèle depuis 2 ans. A demandé une facture détaillée pour chaque paiement.",
  },
  {
    id: "2",
    compagnieId: "2",
    compagnieNom: "Centre Bien-Être Harmonie",
    plan: "mensuel",
    niveau: "basic",
    montant: 120,
    dateDebut: "15/09/2023",
    dateFin: "15/10/2023",
    statut: "active",
    nombreUtilisateurs: 8,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "15/09/2023",
    prochainPaiement: "15/10/2023",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p3",
        date: "15/09/2023",
        montant: 120,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-23456",
      },
      {
        id: "p4",
        date: "15/08/2023",
        montant: 120,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-34567",
      },
    ],
    notes: "A exprimé un intérêt pour passer au plan Pro dans les prochains mois.",
  },
  {
    id: "3",
    compagnieId: "3",
    compagnieNom: "Physio Optimum",
    plan: "annuel",
    niveau: "basic",
    montant: 960,
    dateDebut: "22/05/2023",
    dateFin: "22/05/2024",
    statut: "active",
    nombreUtilisateurs: 12,
    methodePaiement: "Virement bancaire",
    dernierPaiement: "22/05/2023",
    prochainPaiement: "22/05/2024",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p5",
        date: "22/05/2023",
        montant: 960,
        methode: "Virement bancaire",
        statut: "réussi",
        reference: "TRX-45678",
      },
    ],
    notes: "Préfère les virements bancaires pour tous les paiements.",
  },
  {
    id: "4",
    compagnieId: "4",
    compagnieNom: "Massothérapie Détente",
    plan: "mensuel",
    niveau: "basic",
    montant: 80,
    dateDebut: "08/08/2023",
    dateFin: "08/09/2023",
    statut: "expirée",
    nombreUtilisateurs: 5,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "08/08/2023",
    prochainPaiement: null,
    renouvellementAuto: false,
    historiquePaiements: [
      {
        id: "p6",
        date: "08/08/2023",
        montant: 80,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-56789",
      },
      {
        id: "p7",
        date: "08/07/2023",
        montant: 80,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-67890",
      },
    ],
    notes: "A décidé de ne pas renouveler en raison de contraintes budgétaires.",
  },
  {
    id: "5",
    compagnieId: "5",
    compagnieNom: "Clinique Dentaire Sourire",
    plan: "annuel",
    niveau: "pro",
    montant: 900,
    dateDebut: "12/09/2023",
    dateFin: "12/09/2024",
    statut: "en attente",
    nombreUtilisateurs: 10,
    methodePaiement: "En attente",
    dernierPaiement: "",
    prochainPaiement: null,
    renouvellementAuto: true,
    historiquePaiements: [],
    notes: "En attente de validation du paiement initial.",
  },
  {
    id: "6",
    compagnieId: "6",
    compagnieNom: "Centre Médical Familial",
    plan: "annuel",
    niveau: "enterprise",
    montant: 2400,
    dateDebut: "05/02/2023",
    dateFin: "05/02/2024",
    statut: "active",
    nombreUtilisateurs: 25,
    methodePaiement: "Virement bancaire",
    dernierPaiement: "05/02/2023",
    prochainPaiement: "05/02/2024",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p8",
        date: "05/02/2023",
        montant: 2400,
        methode: "Virement bancaire",
        statut: "réussi",
        reference: "TRX-78901",
      },
    ],
    notes: "Client premium avec support prioritaire.",
  },
  {
    id: "7",
    compagnieId: "7",
    compagnieNom: "Clinique Chiropratique Équilibre",
    plan: "mensuel",
    niveau: "pro",
    montant: 150,
    dateDebut: "18/09/2023",
    dateFin: "18/10/2023",
    statut: "active",
    nombreUtilisateurs: 7,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "18/09/2023",
    prochainPaiement: "18/10/2023",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p9",
        date: "18/09/2023",
        montant: 150,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-89012",
      },
    ],
    notes: "",
  },
  {
    id: "8",
    compagnieId: "8",
    compagnieNom: "Spa Tranquillité",
    plan: "annuel",
    niveau: "pro",
    montant: 1800,
    dateDebut: "30/03/2023",
    dateFin: "30/03/2024",
    statut: "active",
    nombreUtilisateurs: 15,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "30/03/2023",
    prochainPaiement: "30/03/2024",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p10",
        date: "30/03/2023",
        montant: 1800,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-90123",
      },
    ],
    notes: "A demandé une démo personnalisée des nouvelles fonctionnalités.",
  },
  {
    id: "9",
    compagnieId: "9",
    compagnieNom: "Centre Thérapeutique Renouveau",
    plan: "mensuel",
    niveau: "basic",
    montant: 100,
    dateDebut: "14/08/2023",
    dateFin: "14/09/2023",
    statut: "annulée",
    nombreUtilisateurs: 9,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "14/08/2023",
    prochainPaiement: null,
    renouvellementAuto: false,
    historiquePaiements: [
      {
        id: "p11",
        date: "14/08/2023",
        montant: 100,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-01234",
      },
      {
        id: "p12",
        date: "14/07/2023",
        montant: 100,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-12340",
      },
    ],
    notes: "Souscription annulée à la demande du client le 25/08/2023.",
  },
  {
    id: "10",
    compagnieId: "10",
    compagnieNom: "Clinique Podiatrique Pas à Pas",
    plan: "mensuel",
    niveau: "basic",
    montant: 90,
    dateDebut: "22/09/2023",
    dateFin: "22/10/2023",
    statut: "active",
    nombreUtilisateurs: 6,
    methodePaiement: "Carte de crédit",
    dernierPaiement: "22/09/2023",
    prochainPaiement: "22/10/2023",
    renouvellementAuto: true,
    historiquePaiements: [
      {
        id: "p13",
        date: "22/09/2023",
        montant: 90,
        methode: "Carte de crédit",
        statut: "réussi",
        reference: "TRX-23401",
      },
    ],
    notes: "",
  },
]

const statistiques: Statistique[] = [
  {
    label: "Souscriptions actives",
    valeur: 78,
    pourcentage: 5.4,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Revenus mensuels",
    valeur: "$12,450",
    pourcentage: 8.2,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Taux de renouvellement",
    valeur: "92%",
    pourcentage: 1.5,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Taux d'annulation",
    valeur: "3.2%",
    pourcentage: 0.8,
    tendance: "baisse",
    periode: "vs mois précédent",
  },
]

const revenusParMois: RevenusParPeriode[] = [
  { periode: "Jan", montant: 8450 },
  { periode: "Fév", montant: 9200 },
  { periode: "Mar", montant: 10100 },
  { periode: "Avr", montant: 9800 },
  { periode: "Mai", montant: 10500 },
  { periode: "Juin", montant: 11200 },
  { periode: "Juil", montant: 11800 },
  { periode: "Août", montant: 11500 },
  { periode: "Sep", montant: 12450 },
  { periode: "Oct", montant: 0 },
  { periode: "Nov", montant: 0 },
  { periode: "Déc", montant: 0 },
]

const revenusParPlan: RevenusParPlan[] = [
  { plan: "Mensuel - Basic", montant: 3200, pourcentage: 25.7 },
  { plan: "Mensuel - Pro", montant: 2850, pourcentage: 22.9 },
  { plan: "Annuel - Basic", montant: 2400, pourcentage: 19.3 },
  { plan: "Annuel - Pro", montant: 2800, pourcentage: 22.5 },
  { plan: "Annuel - Enterprise", montant: 1200, pourcentage: 9.6 },
]

export default function AdminSouscriptions() {
  const [recherche, setRecherche] = useState<string>("")
  const [filtrePlan, setFiltrePlan] = useState<string>("tous")
  const [filtreNiveau, setFiltreNiveau] = useState<string>("tous")
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [page, setPage] = useState<number>(1)
  const [souscriptionSelectionnee, setSouscriptionSelectionnee] = useState<Souscription | null>(null)
  const [compagnieSelectionnee, setCompagnieSelectionnee] = useState<Compagnie | null>(null)
  const [dialogSuppressionOuvert, setDialogSuppressionOuvert] = useState<boolean>(false)
  const [dialogDetailsOuvert, setDialogDetailsOuvert] = useState<boolean>(false)
  const [dialogRenouvellementOuvert, setDialogRenouvellementOuvert] = useState<boolean>(false)
  const [dialogModificationOuvert, setDialogModificationOuvert] = useState<boolean>(false)
  const [dialogCompagnieOuvert, setDialogCompagnieOuvert] = useState<boolean>(false)
  const [periodeStats, setPeriodeStats] = useState<string>("mois")
  const [ongletActif, setOngletActif] = useState<string>("souscriptions")
  // Ajouter cette variable d'état pour le nombre d'éléments par page
  const [elementsParPage, setElementsParPage] = useState<number>(10)

  // Remplacer la ligne const elementsParPage = 10 par la référence à la variable d'état

  // Ajouter cette fonction pour gérer le changement du nombre d'éléments par page
  const handleChangeElementsParPage = (value: string) => {
    setElementsParPage(Number(value))
    setPage(1) // Réinitialiser à la première page lors du changement
  }

  const elementsParPageConst = 10

  // Filtrer les souscriptions
  const souscriptionsFiltrees = souscriptionsData.filter((sub) => {
    const matchRecherche =
      sub.compagnieNom.toLowerCase().includes(recherche.toLowerCase()) ||
      sub.id.toLowerCase().includes(recherche.toLowerCase())

    const matchPlan = filtrePlan === "tous" || sub.plan === filtrePlan
    const matchNiveau = filtreNiveau === "tous" || sub.niveau === filtreNiveau
    const matchStatut = filtreStatut === "tous" || sub.statut === filtreStatut

    return matchRecherche && matchPlan && matchNiveau && matchStatut
  })

  // Pagination
  const totalPages = Math.ceil(souscriptionsFiltrees.length / elementsParPage)
  const debut = (page - 1) * elementsParPage
  const fin = debut + elementsParPage
  const souscriptionsPage = souscriptionsFiltrees.slice(debut, fin)

  // Obtenir la couleur du badge en fonction du statut
  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case "active":
        return "success"
      case "expirée":
      case "annulée":
        return "destructive"
      case "en attente":
        return "warning"
      default:
        return "secondary"
    }
  }

  // Obtenir l'icône de statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "expirée":
      case "annulée":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "en attente":
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  // Obtenir la couleur du badge en fonction du niveau
  const getNiveauBadgeVariant = (niveau: string) => {
    switch (niveau) {
      case "basic":
        return "secondary"
      case "pro":
        return "default"
      case "enterprise":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Obtenir l'icône de tendance
  const getTendanceIcon = (tendance: string) => {
    if (tendance === "hausse") {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />
    } else if (tendance === "baisse") {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />
    }
    return null
  }

  // Obtenir la couleur de tendance
  const getTendanceColor = (tendance: string) => {
    if (tendance === "hausse") {
      return "text-green-500"
    } else if (tendance === "baisse") {
      return "text-red-500"
    }
    return "text-gray-500"
  }

  // Obtenir la couleur du badge pour le statut de paiement
  const getStatutPaiementBadgeVariant = (statut: string) => {
    switch (statut) {
      case "réussi":
        return "success"
      case "échoué":
        return "destructive"
      case "remboursé":
        return "warning"
      default:
        return "secondary"
    }
  }

  // Gérer la suppression
  const handleSuppression = () => {
    // Logique de suppression à implémenter
    console.log(`Annulation de la souscription ${souscriptionSelectionnee?.id}`)
    setDialogSuppressionOuvert(false)
    setSouscriptionSelectionnee(null)
  }

  // Gérer le renouvellement
  const handleRenouvellement = () => {
    // Logique de renouvellement à implémenter
    console.log(`Renouvellement de la souscription ${souscriptionSelectionnee?.id}`)
    setDialogRenouvellementOuvert(false)
    setSouscriptionSelectionnee(null)
  }

  // Gérer la modification
  const handleModification = () => {
    // Logique de modification à implémenter
    console.log(`Modification de la souscription ${souscriptionSelectionnee?.id}`)
    setDialogModificationOuvert(false)
    setSouscriptionSelectionnee(null)
  }

  // Calculer le montant total des revenus
  const totalRevenus = revenusParMois.reduce((acc, curr) => acc + curr.montant, 0)

  // Calculer le pourcentage pour le graphique
  const getPercentageWidth = (montant: number) => {
    const maxMontant = Math.max(...revenusParMois.map((r) => r.montant))
    return maxMontant > 0 ? (montant / maxMontant) * 100 : 0
  }

  // Trouver les informations de la compagnie
  const trouverCompagnie = (compagnieId: string) => {
    return compagnies.find((c) => c.id === compagnieId) || null
  }

  return (
    <PrivateLayout>
        <div className="container mx-auto py-6 space-y-8 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des souscriptions</h1>
          <p className="text-muted-foreground">Administration des souscriptions et abonnements des compagnies</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={periodeStats} onValueChange={setPeriodeStats}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jour">Aujourd'hui</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
              <SelectItem value="trimestre">Ce trimestre</SelectItem>
              <SelectItem value="annee">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle souscription
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statistiques.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.label === "Souscriptions actives" && <Users className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Revenus mensuels" && <DollarSign className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Taux de renouvellement" && <RefreshCw className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Taux d'annulation" && <XCircle className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.valeur}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`flex items-center ${getTendanceColor(stat.tendance)}`}>
                  {getTendanceIcon(stat.tendance)}
                  {stat.pourcentage}% {stat.periode}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onglets */}
      <Tabs value={ongletActif} onValueChange={setOngletActif} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="souscriptions">Souscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
        </TabsList>

        {/* Onglet Souscriptions */}
        <TabsContent value="souscriptions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <CardTitle>Souscriptions ({souscriptionsFiltrees.length})</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 w-full md:w-[200px]"
                      value={recherche}
                      onChange={(e) => {
                        setRecherche(e.target.value)
                        setPage(1) // Réinitialiser la page lors d'une recherche
                      }}
                    />
                  </div>
                  <Select
                    value={filtrePlan}
                    onValueChange={(value) => {
                      setFiltrePlan(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[130px]">
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les plans</SelectItem>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                      <SelectItem value="annuel">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filtreNiveau}
                    onValueChange={(value) => {
                      setFiltreNiveau(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[130px]">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les niveaux</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filtreStatut}
                    onValueChange={(value) => {
                      setFiltreStatut(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-full md:w-[130px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="expirée">Expirées</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="annulée">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compagnie</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="hidden md:table-cell">Utilisateurs</TableHead>
                    <TableHead className="hidden md:table-cell">Date de début</TableHead>
                    <TableHead className="hidden md:table-cell">Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {souscriptionsPage.length > 0 ? (
                    souscriptionsPage.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{sub.compagnieNom}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">{sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}</Badge>
                            <Badge variant={getNiveauBadgeVariant(sub.niveau)}>
                              {sub.niveau.charAt(0).toUpperCase() + sub.niveau.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>${sub.montant}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{sub.nombreUtilisateurs}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{sub.dateDebut}</TableCell>
                        <TableCell className="hidden md:table-cell">{sub.dateFin}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getStatutIcon(sub.statut)}
                            <Badge variant={getStatutBadgeVariant(sub.statut)}>{sub.statut}</Badge>
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
                                  setSouscriptionSelectionnee(sub)
                                  setDialogDetailsOuvert(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSouscriptionSelectionnee(sub)
                                  setDialogModificationOuvert(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const compagnie = trouverCompagnie(sub.compagnieId)
                                  if (compagnie) {
                                    setCompagnieSelectionnee(compagnie)
                                    setDialogCompagnieOuvert(true)
                                  }
                                }}
                              >
                                <Building2 className="mr-2 h-4 w-4" />
                                Voir la compagnie
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {(sub.statut === "expirée" || sub.statut === "annulée") && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSouscriptionSelectionnee(sub)
                                    setDialogRenouvellementOuvert(true)
                                  }}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Renouveler
                                </DropdownMenuItem>
                              )}
                              {sub.statut === "active" && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSouscriptionSelectionnee(sub)
                                    setDialogSuppressionOuvert(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Annuler
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Aucune souscription trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {souscriptionsFiltrees.length > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                    <div>
                      Affichage de {debut + 1} à {Math.min(fin, souscriptionsFiltrees.length)} sur{" "}
                      {souscriptionsFiltrees.length} souscriptions
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <span>Éléments par page:</span>
                      <Select value={elementsParPage.toString()} onValueChange={handleChangeElementsParPage}>
                        <SelectTrigger className="w-[80px] h-8">
                          <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage(1)}
                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                            aria-label="Aller à la première page"
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          // Afficher seulement certaines pages pour éviter une pagination trop longue
                          if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink
                                  isActive={pageNum === page}
                                  onClick={() => setPage(pageNum)}
                                  aria-label={`Page ${pageNum}`}
                                >
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
                            onClick={() => setPage(totalPages)}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                            aria-label="Aller à la dernière page"
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Graphique des revenus */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenus</CardTitle>
                <CardDescription>Revenus mensuels pour l'année en cours</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                  <div className="flex h-[250px] items-end space-x-2">
                    {revenusParMois.map((revenu, index) => (
                      <div key={index} className="relative flex w-full flex-1 flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-t"
                          style={{
                            height: `${getPercentageWidth(revenu.montant)}%`,
                          }}
                        ></div>
                        <span className="mt-2 text-xs">{revenu.periode}</span>
                        <span className="absolute -top-6 text-xs font-medium">
                          {revenu.montant > 0 ? `$${revenu.montant.toLocaleString()}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total des revenus</p>
                    <p className="text-xl font-bold">${totalRevenus.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger le rapport
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribution des revenus par plan */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Distribution des revenus</CardTitle>
                <CardDescription>Répartition des revenus par type de plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenusParPlan.map((plan, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{plan.plan}</p>
                        <p className="text-sm text-muted-foreground">
                          ${plan.montant.toLocaleString()} ({plan.pourcentage}%)
                        </p>
                      </div>
                      <Progress value={plan.pourcentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Statistiques par plan */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques par plan</CardTitle>
                <CardDescription>Nombre de souscriptions par type de plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex items-center justify-center space-x-2">
                    <PieChart className="h-16 w-16 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Graphique non disponible en prévisualisation</p>
                      <p className="text-xs text-muted-foreground">Données réelles disponibles en production</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taux de conversion */}
            <Card>
              <CardHeader>
                <CardTitle>Taux de conversion</CardTitle>
                <CardDescription>Conversion des essais gratuits en abonnements payants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="flex items-center justify-center space-x-2">
                    <BarChart3 className="h-16 w-16 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Graphique non disponible en prévisualisation</p>
                      <p className="text-xs text-muted-foreground">Données réelles disponibles en production</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmation d'annulation */}
      <Dialog open={dialogSuppressionOuvert} onOpenChange={setDialogSuppressionOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirmer l'annulation
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler la souscription de{" "}
              <strong>{souscriptionSelectionnee?.compagnieNom}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
            <p className="text-amber-800 text-sm font-medium mb-2">Cette action entraînera :</p>
            <ul className="text-amber-700 text-sm space-y-1 list-disc pl-5">
              <li>L'arrêt immédiat de la souscription</li>
              <li>La désactivation du renouvellement automatique</li>
              <li>L'accès aux services jusqu'à la fin de la période payée</li>
              <li>Aucun remboursement ne sera effectué pour la période en cours</li>
              <li className="font-semibold">Cette action est irréversible</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogSuppressionOuvert(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleSuppression}>
              Confirmer l'annulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de renouvellement */}
      <Dialog open={dialogRenouvellementOuvert} onOpenChange={setDialogRenouvellementOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 text-primary" />
              Renouveler la souscription
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de renouveler la souscription de{" "}
              <strong>{souscriptionSelectionnee?.compagnieNom}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="font-medium">
                  {souscriptionSelectionnee?.plan.charAt(0).toUpperCase() + souscriptionSelectionnee?.plan.slice(1)} -{" "}
                  {souscriptionSelectionnee?.niveau.charAt(0).toUpperCase() + souscriptionSelectionnee?.niveau.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant</p>
                <p className="font-medium">${souscriptionSelectionnee?.montant}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                <p className="font-medium">{souscriptionSelectionnee?.nombreUtilisateurs}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Renouvellement auto</p>
                <Select defaultValue="true">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activé</SelectItem>
                    <SelectItem value="false">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Méthode de paiement</p>
              <Select
                defaultValue={souscriptionSelectionnee?.methodePaiement === "Carte de crédit" ? "cc" : "virement"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc">Carte de crédit</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogRenouvellementOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={handleRenouvellement}>Confirmer le renouvellement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails souscription */}
      <Dialog open={dialogDetailsOuvert} onOpenChange={setDialogDetailsOuvert}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la souscription</DialogTitle>
            <DialogDescription>Informations complètes sur la souscription</DialogDescription>
          </DialogHeader>
          {souscriptionSelectionnee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">{souscriptionSelectionnee.compagnieNom}</h3>
                <Badge variant={getStatutBadgeVariant(souscriptionSelectionnee.statut)}>
                  {souscriptionSelectionnee.statut}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {souscriptionSelectionnee.plan.charAt(0).toUpperCase() + souscriptionSelectionnee.plan.slice(1)}
                    </Badge>
                    <Badge variant={getNiveauBadgeVariant(souscriptionSelectionnee.niveau)}>
                      {souscriptionSelectionnee.niveau.charAt(0).toUpperCase() +
                        souscriptionSelectionnee.niveau.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Montant</p>
                  <p>${souscriptionSelectionnee.montant}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Période</p>
                  <p>
                    Du {souscriptionSelectionnee.dateDebut} au {souscriptionSelectionnee.dateFin}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{souscriptionSelectionnee.nombreUtilisateurs}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Méthode de paiement</p>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{souscriptionSelectionnee.methodePaiement}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Renouvellement auto</p>
                  <p>{souscriptionSelectionnee.renouvellementAuto ? "Activé" : "Désactivé"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dernier paiement</p>
                  <p>{souscriptionSelectionnee.dernierPaiement || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prochain paiement</p>
                  <p>{souscriptionSelectionnee.prochainPaiement || "N/A"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Historique des paiements</h4>
                {souscriptionSelectionnee.historiquePaiements.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="hidden md:table-cell">Référence</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {souscriptionSelectionnee.historiquePaiements.map((paiement) => (
                          <TableRow key={paiement.id}>
                            <TableCell>{paiement.date}</TableCell>
                            <TableCell>${paiement.montant}</TableCell>
                            <TableCell>{paiement.methode}</TableCell>
                            <TableCell>
                              <Badge variant={getStatutPaiementBadgeVariant(paiement.statut)}>{paiement.statut}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">{paiement.reference}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun historique de paiement disponible.</p>
                )}
              </div>

              {souscriptionSelectionnee.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm p-3 bg-muted rounded-md">{souscriptionSelectionnee.notes}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground">ID de souscription: {souscriptionSelectionnee.id}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogDetailsOuvert(false)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                setDialogDetailsOuvert(false)
                if (souscriptionSelectionnee) {
                  setSouscriptionSelectionnee(souscriptionSelectionnee)
                  setDialogModificationOuvert(true)
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={dialogModificationOuvert} onOpenChange={setDialogModificationOuvert}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier la souscription</DialogTitle>
            <DialogDescription>
              Modifier les détails de la souscription de {souscriptionSelectionnee?.compagnieNom}
            </DialogDescription>
          </DialogHeader>
          {souscriptionSelectionnee && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Select defaultValue={souscriptionSelectionnee.plan}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Sélectionner un plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensuel">Mensuel</SelectItem>
                      <SelectItem value="annuel">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niveau">Niveau</Label>
                  <Select defaultValue={souscriptionSelectionnee.niveau}>
                    <SelectTrigger id="niveau">
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="montant">Montant ($)</Label>
                  <Input id="montant" type="number" defaultValue={souscriptionSelectionnee.montant} min="0" step="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="utilisateurs">Nombre d'utilisateurs</Label>
                  <Input
                    id="utilisateurs"
                    type="number"
                    defaultValue={souscriptionSelectionnee.nombreUtilisateurs}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input id="dateDebut" type="text" defaultValue={souscriptionSelectionnee.dateDebut} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFin">Date de fin</Label>
                  <Input id="dateFin" type="text" defaultValue={souscriptionSelectionnee.dateFin} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="methodePaiement">Méthode de paiement</Label>
                  <Select
                    defaultValue={
                      souscriptionSelectionnee.methodePaiement === "Carte de crédit"
                        ? "cc"
                        : souscriptionSelectionnee.methodePaiement === "Virement bancaire"
                          ? "virement"
                          : "autre"
                    }
                  >
                    <SelectTrigger id="methodePaiement">
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cc">Carte de crédit</SelectItem>
                      <SelectItem value="virement">Virement bancaire</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select defaultValue={souscriptionSelectionnee.statut}>
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expirée">Expirée</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="renouvellementAuto" defaultChecked={souscriptionSelectionnee.renouvellementAuto} />
                <Label htmlFor="renouvellementAuto">Renouvellement automatique</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" defaultValue={souscriptionSelectionnee.notes} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogModificationOuvert(false)}>
              Annuler
            </Button>
            <Button onClick={handleModification}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails compagnie */}
      <Dialog open={dialogCompagnieOuvert} onOpenChange={setDialogCompagnieOuvert}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la compagnie</DialogTitle>
            <DialogDescription>Informations complètes sur la compagnie</DialogDescription>
          </DialogHeader>
          {compagnieSelectionnee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={compagnieSelectionnee.logo} alt={compagnieSelectionnee.nom} />
                  <AvatarFallback>{compagnieSelectionnee.nom.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{compagnieSelectionnee.nom}</h3>
                  <Badge variant={getStatutBadgeVariant(compagnieSelectionnee.statut)}>
                    {compagnieSelectionnee.statut}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                  <p>
                    {compagnieSelectionnee.adresse}, {compagnieSelectionnee.ville}
                  </p>
                  <p>
                    {compagnieSelectionnee.codePostal}, {compagnieSelectionnee.pays}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{compagnieSelectionnee.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{compagnieSelectionnee.telephone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Employés</p>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{compagnieSelectionnee.nombreEmployes}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clients</p>
                  <p>{compagnieSelectionnee.nombreClients}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                  <p>{compagnieSelectionnee.dateCreation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-xs">{compagnieSelectionnee.id}</p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <p className="text-sm font-medium">Souscriptions associées</p>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir toutes
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogCompagnieOuvert(false)}>
              Fermer
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier la compagnie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PrivateLayout>
  )
}

