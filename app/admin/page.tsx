"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building2,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Search,
  Download,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"

// Types
interface Utilisateur {
  id: string
  nom: string
  email: string
  type: "professionnel" | "administratif" | "client"
  statut: "actif" | "inactif" | "en attente"
  dateInscription: string
  avatar: string
}

interface Compagnie {
  id: string
  nom: string
  adresse: string
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
  montant: number
  dateDebut: string
  dateFin: string
  statut: "active" | "expirée" | "en attente"
  nombreUtilisateurs: number
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

interface RendezVous {
  id: string
  client: string
  professionnel: string
  service: string
  date: string
  heure: string
  statut: "confirmé" | "annulé" | "en attente" | "terminé"
}

// Données d'exemple
const statistiques: Statistique[] = [
  {
    label: "Utilisateurs totaux",
    valeur: 2458,
    pourcentage: 12.5,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Compagnies actives",
    valeur: 187,
    pourcentage: 8.2,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Rendez-vous mensuels",
    valeur: 12845,
    pourcentage: 3.7,
    tendance: "hausse",
    periode: "vs mois précédent",
  },
  {
    label: "Revenus mensuels",
    valeur: "$48,295",
    pourcentage: 2.3,
    tendance: "baisse",
    periode: "vs mois précédent",
  },
]

const revenusParMois: RevenusParPeriode[] = [
  { periode: "Jan", montant: 32450 },
  { periode: "Fév", montant: 35670 },
  { periode: "Mar", montant: 42300 },
  { periode: "Avr", montant: 38900 },
  { periode: "Mai", montant: 41200 },
  { periode: "Juin", montant: 45800 },
  { periode: "Juil", montant: 49500 },
  { periode: "Août", montant: 47200 },
  { periode: "Sep", montant: 50100 },
  { periode: "Oct", montant: 48295 },
  { periode: "Nov", montant: 0 },
  { periode: "Déc", montant: 0 },
]

const revenusParPlan: RevenusParPlan[] = [
  { plan: "Mensuel - Basic", montant: 12450, pourcentage: 25.8 },
  { plan: "Mensuel - Pro", montant: 18320, pourcentage: 37.9 },
  { plan: "Annuel - Basic", montant: 5825, pourcentage: 12.1 },
  { plan: "Annuel - Pro", montant: 11700, pourcentage: 24.2 },
]

const utilisateurs: Utilisateur[] = [
  {
    id: "1",
    nom: "Sophie Tremblay",
    email: "sophie.tremblay@example.com",
    type: "professionnel",
    statut: "actif",
    dateInscription: "15/03/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    nom: "Jean Dubois",
    email: "jean.dubois@example.com",
    type: "administratif",
    statut: "actif",
    dateInscription: "22/05/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    nom: "Marie Lavoie",
    email: "marie.lavoie@example.com",
    type: "client",
    statut: "actif",
    dateInscription: "10/07/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    nom: "Pierre Gagnon",
    email: "pierre.gagnon@example.com",
    type: "professionnel",
    statut: "inactif",
    dateInscription: "05/02/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    nom: "Isabelle Bergeron",
    email: "isabelle.bergeron@example.com",
    type: "client",
    statut: "en attente",
    dateInscription: "18/09/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const compagnies: Compagnie[] = [
  {
    id: "1",
    nom: "Clinique Santé Plus",
    adresse: "123 Rue Principale, Montréal, QC",
    nombreEmployes: 15,
    nombreClients: 450,
    statut: "active",
    dateCreation: "10/01/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    nom: "Centre Bien-Être Harmonie",
    adresse: "456 Boulevard St-Laurent, Québec, QC",
    nombreEmployes: 8,
    nombreClients: 320,
    statut: "active",
    dateCreation: "15/03/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    nom: "Physio Optimum",
    adresse: "789 Avenue du Parc, Laval, QC",
    nombreEmployes: 12,
    nombreClients: 380,
    statut: "active",
    dateCreation: "22/05/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    nom: "Massothérapie Détente",
    adresse: "234 Rue Notre-Dame, Gatineau, QC",
    nombreEmployes: 5,
    nombreClients: 180,
    statut: "inactive",
    dateCreation: "08/07/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    nom: "Clinique Dentaire Sourire",
    adresse: "567 Boulevard des Laurentides, Sherbrooke, QC",
    nombreEmployes: 10,
    nombreClients: 290,
    statut: "en attente",
    dateCreation: "12/09/2022",
    logo: "/placeholder.svg?height=40&width=40",
  },
]

const souscriptions: Souscription[] = [
  {
    id: "1",
    compagnieId: "1",
    compagnieNom: "Clinique Santé Plus",
    plan: "annuel",
    montant: 1200,
    dateDebut: "10/01/2023",
    dateFin: "10/01/2024",
    statut: "active",
    nombreUtilisateurs: 15,
  },
  {
    id: "2",
    compagnieId: "2",
    compagnieNom: "Centre Bien-Être Harmonie",
    plan: "mensuel",
    montant: 120,
    dateDebut: "15/09/2023",
    dateFin: "15/10/2023",
    statut: "active",
    nombreUtilisateurs: 8,
  },
  {
    id: "3",
    compagnieId: "3",
    compagnieNom: "Physio Optimum",
    plan: "annuel",
    montant: 960,
    dateDebut: "22/05/2023",
    dateFin: "22/05/2024",
    statut: "active",
    nombreUtilisateurs: 12,
  },
  {
    id: "4",
    compagnieId: "4",
    compagnieNom: "Massothérapie Détente",
    plan: "mensuel",
    montant: 80,
    dateDebut: "08/08/2023",
    dateFin: "08/09/2023",
    statut: "expirée",
    nombreUtilisateurs: 5,
  },
  {
    id: "5",
    compagnieId: "5",
    compagnieNom: "Clinique Dentaire Sourire",
    plan: "annuel",
    montant: 900,
    dateDebut: "12/09/2023",
    dateFin: "12/09/2024",
    statut: "en attente",
    nombreUtilisateurs: 10,
  },
]

const rendezVous: RendezVous[] = [
  {
    id: "1",
    client: "Marie Lavoie",
    professionnel: "Sophie Tremblay",
    service: "Consultation initiale",
    date: "15/10/2023",
    heure: "10:00",
    statut: "confirmé",
  },
  {
    id: "2",
    client: "Jean Martin",
    professionnel: "Pierre Gagnon",
    service: "Suivi mensuel",
    date: "16/10/2023",
    heure: "14:30",
    statut: "en attente",
  },
  {
    id: "3",
    client: "Lucie Fortin",
    professionnel: "Sophie Tremblay",
    service: "Traitement spécifique",
    date: "14/10/2023",
    heure: "09:15",
    statut: "terminé",
  },
  {
    id: "4",
    client: "Robert Lemieux",
    professionnel: "Pierre Gagnon",
    service: "Consultation initiale",
    date: "17/10/2023",
    heure: "11:45",
    statut: "annulé",
  },
  {
    id: "5",
    client: "Caroline Bouchard",
    professionnel: "Sophie Tremblay",
    service: "Suivi trimestriel",
    date: "18/10/2023",
    heure: "15:30",
    statut: "confirmé",
  },
]

export default function TableauDeBordSuperAdmin() {
  const [periodeStats, setPeriodeStats] = useState<string>("mois")
  const [recherche, setRecherche] = useState<string>("")
  const [filtreUtilisateurs, setFiltreUtilisateurs] = useState<string>("tous")
  const [filtreCompagnies, setFiltreCompagnies] = useState<string>("toutes")
  const [filtreSouscriptions, setFiltreSouscriptions] = useState<string>("toutes")

  // Filtrer les utilisateurs
  const utilisateursFiltres = utilisateurs.filter((user) => {
    const matchRecherche =
      user.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      user.email.toLowerCase().includes(recherche.toLowerCase())

    if (filtreUtilisateurs === "tous") return matchRecherche
    return matchRecherche && user.type === filtreUtilisateurs
  })

  // Filtrer les compagnies
  const compagniesFiltrees = compagnies.filter((company) => {
    const matchRecherche =
      company.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      company.adresse.toLowerCase().includes(recherche.toLowerCase())

    if (filtreCompagnies === "toutes") return matchRecherche
    return matchRecherche && company.statut === filtreCompagnies
  })

  // Filtrer les souscriptions
  const souscriptionsFiltrees = souscriptions.filter((sub) => {
    const matchRecherche = sub.compagnieNom.toLowerCase().includes(recherche.toLowerCase())

    if (filtreSouscriptions === "toutes") return matchRecherche
    return matchRecherche && sub.statut === filtreSouscriptions
  })

  // Obtenir la couleur du badge en fonction du statut
  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case "actif":
      case "active":
      case "confirmé":
      case "terminé":
        return "success"
      case "inactif":
      case "inactive":
      case "expirée":
      case "annulé":
        return "destructive"
      case "en attente":
        return "warning"
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

  // Obtenir l'icône de statut pour les rendez-vous
  const getRendezVousStatusIcon = (statut: string) => {
    switch (statut) {
      case "confirmé":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "annulé":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "en attente":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "terminé":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  // Calculer le montant total des revenus
  const totalRevenus = revenusParMois.reduce((acc, curr) => acc + curr.montant, 0)

  // Calculer le pourcentage pour le graphique
  const getPercentageWidth = (montant: number) => {
    const maxMontant = Math.max(...revenusParMois.map((r) => r.montant))
    return (montant / maxMontant) * 100
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Super Admin</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme et des métriques clés</p>
        </div>
        <div className="flex items-center space-x-2">
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
              {stat.label === "Utilisateurs totaux" && <Users className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Compagnies actives" && <Building2 className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Rendez-vous mensuels" && <Calendar className="h-4 w-4 text-muted-foreground" />}
              {stat.label === "Revenus mensuels" && <DollarSign className="h-4 w-4 text-muted-foreground" />}
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

      {/* Graphiques et tableaux */}
      <Tabs defaultValue="apercu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="compagnies">Compagnies</TabsTrigger>
          <TabsTrigger value="souscriptions">Souscriptions</TabsTrigger>
          <TabsTrigger value="rendez-vous">Rendez-vous</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="apercu" className="space-y-4">
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Derniers utilisateurs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Derniers utilisateurs</CardTitle>
                <CardDescription>Les 5 derniers utilisateurs inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {utilisateurs.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.nom} />
                        <AvatarFallback>{user.nom.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{user.nom}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={getStatutBadgeVariant(user.statut)}>{user.statut}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Voir tous les utilisateurs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dernières compagnies */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Dernières compagnies</CardTitle>
                <CardDescription>Les 5 dernières compagnies inscrites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {compagnies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={company.logo} alt={company.nom} />
                        <AvatarFallback>{company.nom.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{company.nom}</p>
                        <p className="text-xs text-muted-foreground">{company.nombreEmployes} employés</p>
                      </div>
                      <Badge variant={getStatutBadgeVariant(company.statut)}>{company.statut}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Voir toutes les compagnies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Derniers rendez-vous */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Derniers rendez-vous</CardTitle>
                <CardDescription>Les 5 derniers rendez-vous planifiés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rendezVous.slice(0, 5).map((rdv) => (
                    <div key={rdv.id} className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        {getRendezVousStatusIcon(rdv.statut)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{rdv.client}</p>
                        <p className="text-xs text-muted-foreground">
                          {rdv.date} à {rdv.heure} • {rdv.service}
                        </p>
                      </div>
                      <Badge variant={getStatutBadgeVariant(rdv.statut)}>{rdv.statut}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="w-full">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Voir tous les rendez-vous
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="utilisateurs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                  <CardDescription>Liste complète des utilisateurs de la plateforme</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                    />
                  </div>
                  <Select value={filtreUtilisateurs} onValueChange={setFiltreUtilisateurs}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les types</SelectItem>
                      <SelectItem value="professionnel">Professionnels</SelectItem>
                      <SelectItem value="administratif">Administratifs</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilisateursFiltres.length > 0 ? (
                    utilisateursFiltres.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.nom} />
                              <AvatarFallback>{user.nom.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.type}</Badge>
                        </TableCell>
                        <TableCell>{user.dateInscription}</TableCell>
                        <TableCell>
                          <Badge variant={getStatutBadgeVariant(user.statut)}>{user.statut}</Badge>
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
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun utilisateur trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Compagnies */}
        <TabsContent value="compagnies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Gestion des compagnies</CardTitle>
                  <CardDescription>Liste complète des compagnies inscrites</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                    />
                  </div>
                  <Select value={filtreCompagnies} onValueChange={setFiltreCompagnies}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toutes">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="inactive">Inactives</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Employés</TableHead>
                    <TableHead>Clients</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compagniesFiltrees.length > 0 ? (
                    compagniesFiltrees.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={company.logo} alt={company.nom} />
                              <AvatarFallback>{company.nom.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{company.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>{company.adresse}</TableCell>
                        <TableCell>{company.nombreEmployes}</TableCell>
                        <TableCell>{company.nombreClients}</TableCell>
                        <TableCell>{company.dateCreation}</TableCell>
                        <TableCell>
                          <Badge variant={getStatutBadgeVariant(company.statut)}>{company.statut}</Badge>
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
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Aucune compagnie trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Souscriptions */}
        <TabsContent value="souscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Gestion des souscriptions</CardTitle>
                  <CardDescription>Liste complète des souscriptions actives et passées</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                    />
                  </div>
                  <Select value={filtreSouscriptions} onValueChange={setFiltreSouscriptions}>
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toutes">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actives</SelectItem>
                      <SelectItem value="expirée">Expirées</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <TableHead>Utilisateurs</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {souscriptionsFiltrees.length > 0 ? (
                    souscriptionsFiltrees.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.compagnieNom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}</Badge>
                        </TableCell>
                        <TableCell>${sub.montant}</TableCell>
                        <TableCell>{sub.nombreUtilisateurs}</TableCell>
                        <TableCell>{sub.dateDebut}</TableCell>
                        <TableCell>{sub.dateFin}</TableCell>
                        <TableCell>
                          <Badge variant={getStatutBadgeVariant(sub.statut)}>{sub.statut}</Badge>
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
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Renouveler</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Rendez-vous */}
        <TabsContent value="rendez-vous" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Gestion des rendez-vous</CardTitle>
                  <CardDescription>Vue d'ensemble des rendez-vous sur la plateforme</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="pl-8 md:w-[200px] lg:w-[300px]"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Professionnel</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rendezVous.map((rdv) => (
                    <TableRow key={rdv.id}>
                      <TableCell className="font-medium">{rdv.client}</TableCell>
                      <TableCell>{rdv.professionnel}</TableCell>
                      <TableCell>{rdv.service}</TableCell>
                      <TableCell>{rdv.date}</TableCell>
                      <TableCell>{rdv.heure}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRendezVousStatusIcon(rdv.statut)}
                          <Badge variant={getStatutBadgeVariant(rdv.statut)}>{rdv.statut}</Badge>
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
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Confirmer</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}