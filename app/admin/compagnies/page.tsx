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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
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
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  BarChart3,
  FileText,
  RefreshCw,
  Ban,
  CreditCard,
  Settings,
  Shield,
} from "lucide-react"
import PrivateLayout from "@/components/public/private-layout"

// Types
interface Compagnie {
  id: string
  nom: string
  adresse: string
  ville: string
  province: string
  codePostal: string
  telephone: string
  email: string
  siteWeb: string
  nombreEmployes: number
  nombreClients: number
  nombreRendezVous: number
  statut: "active" | "inactive" | "en attente" | "suspendue"
  dateCreation: string
  dateDerniereModification: string
  logo: string
  secteurActivite: string
  description: string
  contactPrincipal: {
    nom: string
    titre: string
    email: string
    telephone: string
  }
  abonnement: {
    plan: string
    dateDebut: string
    dateFin: string
    montantMensuel: number
    statut: string
  }
  facturation: {
    methode: string
    adresseFacturation: string
    dernierPaiement: string
    montantDernierPaiement: number
    prochainPaiement: string
  }
  notes: string
  tauxUtilisation: number
  verificationComplete: boolean
}

// Données d'exemple
const compagniesData: Compagnie[] = [
  {
    id: "C001",
    nom: "Clinique Santé Plus",
    adresse: "123 Rue Principale",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2X 1A1",
    telephone: "+1 (514) 555-1234",
    email: "contact@cliniquesanteplus.com",
    siteWeb: "www.cliniquesanteplus.com",
    nombreEmployes: 15,
    nombreClients: 450,
    nombreRendezVous: 120,
    statut: "active",
    dateCreation: "10/01/2022",
    dateDerniereModification: "15/03/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Santé",
    description: "Clinique médicale offrant des services de médecine générale et spécialisée.",
    contactPrincipal: {
      nom: "Marie Tremblay",
      titre: "Directrice administrative",
      email: "m.tremblay@cliniquesanteplus.com",
      telephone: "+1 (514) 555-1235",
    },
    abonnement: {
      plan: "Premium",
      dateDebut: "10/01/2022",
      dateFin: "10/01/2024",
      montantMensuel: 199.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "123 Rue Principale, Montréal, QC H2X 1A1",
      dernierPaiement: "10/03/2023",
      montantDernierPaiement: 199.99,
      prochainPaiement: "10/04/2023",
    },
    notes:
      "Client fidèle depuis le lancement. Intéressé par l'extension des fonctionnalités de gestion des dossiers patients.",
    tauxUtilisation: 87,
    verificationComplete: true,
  },
  {
    id: "C002",
    nom: "Centre Bien-Être Harmonie",
    adresse: "456 Boulevard St-Laurent",
    ville: "Québec",
    province: "QC",
    codePostal: "G1R 2T3",
    telephone: "+1 (418) 555-2345",
    email: "info@centreharmonie.com",
    siteWeb: "www.centreharmonie.com",
    nombreEmployes: 8,
    nombreClients: 320,
    nombreRendezVous: 85,
    statut: "active",
    dateCreation: "15/03/2022",
    dateDerniereModification: "22/02/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Bien-être",
    description: "Centre de bien-être offrant des services de massage, yoga et méditation.",
    contactPrincipal: {
      nom: "Jean Lapointe",
      titre: "Propriétaire",
      email: "j.lapointe@centreharmonie.com",
      telephone: "+1 (418) 555-2346",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "15/03/2022",
      dateFin: "15/03/2024",
      montantMensuel: 99.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "456 Boulevard St-Laurent, Québec, QC G1R 2T3",
      dernierPaiement: "15/03/2023",
      montantDernierPaiement: 99.99,
      prochainPaiement: "15/04/2023",
    },
    notes: "A demandé des formations supplémentaires pour son personnel.",
    tauxUtilisation: 72,
    verificationComplete: true,
  },
  {
    id: "C003",
    nom: "Physio Optimum",
    adresse: "789 Avenue du Parc",
    ville: "Laval",
    province: "QC",
    codePostal: "H7N 3W7",
    telephone: "+1 (450) 555-3456",
    email: "contact@physiooptimum.com",
    siteWeb: "www.physiooptimum.com",
    nombreEmployes: 12,
    nombreClients: 380,
    nombreRendezVous: 95,
    statut: "active",
    dateCreation: "22/05/2022",
    dateDerniereModification: "10/01/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Physiothérapie",
    description: "Clinique de physiothérapie spécialisée dans la réadaptation sportive.",
    contactPrincipal: {
      nom: "Sophie Bergeron",
      titre: "Directrice clinique",
      email: "s.bergeron@physiooptimum.com",
      telephone: "+1 (450) 555-3457",
    },
    abonnement: {
      plan: "Premium",
      dateDebut: "22/05/2022",
      dateFin: "22/05/2024",
      montantMensuel: 199.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "789 Avenue du Parc, Laval, QC H7N 3W7",
      dernierPaiement: "22/03/2023",
      montantDernierPaiement: 199.99,
      prochainPaiement: "22/04/2023",
    },
    notes:
      "Utilise intensivement le module de suivi des patients. Intéressé par l'intégration avec leur logiciel de facturation.",
    tauxUtilisation: 93,
    verificationComplete: true,
  },
  {
    id: "C004",
    nom: "Massothérapie Détente",
    adresse: "234 Rue Notre-Dame",
    ville: "Gatineau",
    province: "QC",
    codePostal: "J8P 6Y2",
    telephone: "+1 (819) 555-4567",
    email: "info@massotherapiedetente.com",
    siteWeb: "www.massotherapiedetente.com",
    nombreEmployes: 5,
    nombreClients: 180,
    nombreRendezVous: 45,
    statut: "inactive",
    dateCreation: "08/07/2022",
    dateDerniereModification: "05/12/2022",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Massothérapie",
    description: "Studio de massothérapie offrant divers types de massages thérapeutiques.",
    contactPrincipal: {
      nom: "Michel Dupuis",
      titre: "Propriétaire",
      email: "m.dupuis@massotherapiedetente.com",
      telephone: "+1 (819) 555-4568",
    },
    abonnement: {
      plan: "Starter",
      dateDebut: "08/07/2022",
      dateFin: "08/07/2023",
      montantMensuel: 49.99,
      statut: "Expiré",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "234 Rue Notre-Dame, Gatineau, QC J8P 6Y2",
      dernierPaiement: "08/12/2022",
      montantDernierPaiement: 49.99,
      prochainPaiement: "N/A",
    },
    notes: "Compte inactif depuis janvier 2023. Tentatives de contact sans réponse.",
    tauxUtilisation: 23,
    verificationComplete: true,
  },
  {
    id: "C005",
    nom: "Clinique Dentaire Sourire",
    adresse: "567 Boulevard des Laurentides",
    ville: "Sherbrooke",
    province: "QC",
    codePostal: "J1H 3V5",
    telephone: "+1 (819) 555-5678",
    email: "contact@cliniquesourire.com",
    siteWeb: "www.cliniquesourire.com",
    nombreEmployes: 10,
    nombreClients: 290,
    nombreRendezVous: 75,
    statut: "en attente",
    dateCreation: "12/09/2022",
    dateDerniereModification: "12/09/2022",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Dentisterie",
    description: "Clinique dentaire familiale offrant des soins généraux et esthétiques.",
    contactPrincipal: {
      nom: "Pierre Lafontaine",
      titre: "Dentiste propriétaire",
      email: "p.lafontaine@cliniquesourire.com",
      telephone: "+1 (819) 555-5679",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "En attente",
      dateFin: "En attente",
      montantMensuel: 99.99,
      statut: "En attente",
    },
    facturation: {
      methode: "En attente",
      adresseFacturation: "567 Boulevard des Laurentides, Sherbrooke, QC J1H 3V5",
      dernierPaiement: "N/A",
      montantDernierPaiement: 0,
      prochainPaiement: "N/A",
    },
    notes: "En attente de vérification des documents d'entreprise. Relance prévue le 20/04/2023.",
    tauxUtilisation: 0,
    verificationComplete: false,
  },
  {
    id: "C006",
    nom: "Centre Médical Familial",
    adresse: "890 Rue Wellington",
    ville: "Montréal",
    province: "QC",
    codePostal: "H3C 1T4",
    telephone: "+1 (514) 555-6789",
    email: "info@centremedicalfamilial.com",
    siteWeb: "www.centremedicalfamilial.com",
    nombreEmployes: 20,
    nombreClients: 650,
    nombreRendezVous: 150,
    statut: "active",
    dateCreation: "05/02/2022",
    dateDerniereModification: "18/03/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Médecine familiale",
    description: "Centre médical offrant des services de médecine familiale et pédiatrique.",
    contactPrincipal: {
      nom: "Isabelle Côté",
      titre: "Administratrice",
      email: "i.cote@centremedicalfamilial.com",
      telephone: "+1 (514) 555-6790",
    },
    abonnement: {
      plan: "Enterprise",
      dateDebut: "05/02/2022",
      dateFin: "05/02/2025",
      montantMensuel: 299.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "890 Rue Wellington, Montréal, QC H3C 1T4",
      dernierPaiement: "05/03/2023",
      montantDernierPaiement: 299.99,
      prochainPaiement: "05/04/2023",
    },
    notes: "Client premium avec contrat de 3 ans. Utilise tous les modules disponibles.",
    tauxUtilisation: 96,
    verificationComplete: true,
  },
  {
    id: "C007",
    nom: "Clinique Chiropratique Équilibre",
    adresse: "123 Boulevard René-Lévesque",
    ville: "Québec",
    province: "QC",
    codePostal: "G1R 4P3",
    telephone: "+1 (418) 555-7890",
    email: "contact@chiroequilibre.com",
    siteWeb: "www.chiroequilibre.com",
    nombreEmployes: 7,
    nombreClients: 240,
    nombreRendezVous: 60,
    statut: "active",
    dateCreation: "18/04/2022",
    dateDerniereModification: "02/02/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Chiropratique",
    description: "Clinique de chiropratique spécialisée dans les ajustements vertébraux et la santé du dos.",
    contactPrincipal: {
      nom: "François Lemieux",
      titre: "Chiropraticien en chef",
      email: "f.lemieux@chiroequilibre.com",
      telephone: "+1 (418) 555-7891",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "18/04/2022",
      dateFin: "18/04/2024",
      montantMensuel: 99.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "123 Boulevard René-Lévesque, Québec, QC G1R 4P3",
      dernierPaiement: "18/03/2023",
      montantDernierPaiement: 99.99,
      prochainPaiement: "18/04/2023",
    },
    notes: "Satisfait du service. A recommandé la plateforme à deux autres cliniques.",
    tauxUtilisation: 81,
    verificationComplete: true,
  },
  {
    id: "C008",
    nom: "Spa Tranquillité",
    adresse: "456 Rue Principale",
    ville: "Trois-Rivières",
    province: "QC",
    codePostal: "G8Z 2E4",
    telephone: "+1 (819) 555-8901",
    email: "info@spatranquillite.com",
    siteWeb: "www.spatranquillite.com",
    nombreEmployes: 15,
    nombreClients: 420,
    nombreRendezVous: 110,
    statut: "active",
    dateCreation: "30/03/2022",
    dateDerniereModification: "15/01/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Spa et bien-être",
    description: "Spa de luxe offrant des soins du visage, massages et services d'hydrothérapie.",
    contactPrincipal: {
      nom: "Nathalie Simard",
      titre: "Directrice",
      email: "n.simard@spatranquillite.com",
      telephone: "+1 (819) 555-8902",
    },
    abonnement: {
      plan: "Premium",
      dateDebut: "30/03/2022",
      dateFin: "30/03/2024",
      montantMensuel: 199.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "456 Rue Principale, Trois-Rivières, QC G8Z 2E4",
      dernierPaiement: "30/03/2023",
      montantDernierPaiement: 199.99,
      prochainPaiement: "30/04/2023",
    },
    notes: "Utilise principalement les fonctionnalités de réservation en ligne et de rappels automatiques.",
    tauxUtilisation: 78,
    verificationComplete: true,
  },
  {
    id: "C009",
    nom: "Centre Thérapeutique Renouveau",
    adresse: "789 Avenue Cartier",
    ville: "Laval",
    province: "QC",
    codePostal: "H7V 1J3",
    telephone: "+1 (450) 555-9012",
    email: "contact@centrerenouveau.com",
    siteWeb: "www.centrerenouveau.com",
    nombreEmployes: 9,
    nombreClients: 280,
    nombreRendezVous: 70,
    statut: "inactive",
    dateCreation: "14/06/2022",
    dateDerniereModification: "20/12/2022",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Thérapie",
    description: "Centre offrant des services de psychothérapie et de counseling.",
    contactPrincipal: {
      nom: "Robert Gagnon",
      titre: "Thérapeute principal",
      email: "r.gagnon@centrerenouveau.com",
      telephone: "+1 (450) 555-9013",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "14/06/2022",
      dateFin: "14/06/2023",
      montantMensuel: 99.99,
      statut: "Expiré",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "789 Avenue Cartier, Laval, QC H7V 1J3",
      dernierPaiement: "14/12/2022",
      montantDernierPaiement: 99.99,
      prochainPaiement: "N/A",
    },
    notes: "A mentionné des difficultés financières. Prévoir une offre de réactivation avec tarif réduit.",
    tauxUtilisation: 45,
    verificationComplete: true,
  },
  {
    id: "C010",
    nom: "Clinique Podiatrique Pas à Pas",
    adresse: "234 Boulevard Taschereau",
    ville: "Longueuil",
    province: "QC",
    codePostal: "J4K 2X1",
    telephone: "+1 (450) 555-0123",
    email: "info@cliniquepasapas.com",
    siteWeb: "www.cliniquepasapas.com",
    nombreEmployes: 6,
    nombreClients: 210,
    nombreRendezVous: 55,
    statut: "active",
    dateCreation: "22/07/2022",
    dateDerniereModification: "10/03/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Podiatrie",
    description: "Clinique podiatrique spécialisée dans les soins des pieds et la biomécanique.",
    contactPrincipal: {
      nom: "Lucie Tremblay",
      titre: "Podiatre",
      email: "l.tremblay@cliniquepasapas.com",
      telephone: "+1 (450) 555-0124",
    },
    abonnement: {
      plan: "Starter",
      dateDebut: "22/07/2022",
      dateFin: "22/07/2023",
      montantMensuel: 49.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "234 Boulevard Taschereau, Longueuil, QC J4K 2X1",
      dernierPaiement: "22/03/2023",
      montantDernierPaiement: 49.99,
      prochainPaiement: "22/04/2023",
    },
    notes: "Envisage de passer au plan Standard pour accéder à plus de fonctionnalités.",
    tauxUtilisation: 92,
    verificationComplete: true,
  },
  {
    id: "C011",
    nom: "Centre Visuel Optique Plus",
    adresse: "567 Rue Sherbrooke",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2L 1K2",
    telephone: "+1 (514) 555-1234",
    email: "contact@optiqueplus.com",
    siteWeb: "www.optiqueplus.com",
    nombreEmployes: 8,
    nombreClients: 350,
    nombreRendezVous: 90,
    statut: "active",
    dateCreation: "09/05/2022",
    dateDerniereModification: "25/02/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Optométrie",
    description: "Centre d'optométrie offrant des examens de la vue et vente de lunettes et lentilles.",
    contactPrincipal: {
      nom: "André Morin",
      titre: "Optométriste",
      email: "a.morin@optiqueplus.com",
      telephone: "+1 (514) 555-1235",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "09/05/2022",
      dateFin: "09/05/2024",
      montantMensuel: 99.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "567 Rue Sherbrooke, Montréal, QC H2L 1K2",
      dernierPaiement: "09/03/2023",
      montantDernierPaiement: 99.99,
      prochainPaiement: "09/04/2023",
    },
    notes: "Utilise principalement le module de gestion des rendez-vous et des rappels.",
    tauxUtilisation: 76,
    verificationComplete: true,
  },
  {
    id: "C012",
    nom: "Clinique Médicale Express",
    adresse: "890 Boulevard Laurier",
    ville: "Québec",
    province: "QC",
    codePostal: "G1V 2L2",
    telephone: "+1 (418) 555-2345",
    email: "info@cliniqueexpress.com",
    siteWeb: "www.cliniqueexpress.com",
    nombreEmployes: 25,
    nombreClients: 780,
    nombreRendezVous: 200,
    statut: "suspendue",
    dateCreation: "15/01/2022",
    dateDerniereModification: "01/03/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Médecine",
    description: "Clinique médicale sans rendez-vous offrant des services d'urgence mineure.",
    contactPrincipal: {
      nom: "Dr. Philippe Lavoie",
      titre: "Médecin-chef",
      email: "p.lavoie@cliniqueexpress.com",
      telephone: "+1 (418) 555-2346",
    },
    abonnement: {
      plan: "Enterprise",
      dateDebut: "15/01/2022",
      dateFin: "15/01/2025",
      montantMensuel: 299.99,
      statut: "Suspendu",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "890 Boulevard Laurier, Québec, QC G1V 2L2",
      dernierPaiement: "15/02/2023",
      montantDernierPaiement: 299.99,
      prochainPaiement: "Suspendu",
    },
    notes: "Compte suspendu temporairement à la demande du client pendant rénovations. Reprise prévue en mai 2023.",
    tauxUtilisation: 0,
    verificationComplete: true,
  },
  {
    id: "C013",
    nom: "Clinique d'Acupuncture Équilibre",
    adresse: "123 Rue Saint-Denis",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2X 3L9",
    telephone: "+1 (514) 555-3456",
    email: "contact@acupunctureequilibre.com",
    siteWeb: "www.acupunctureequilibre.com",
    nombreEmployes: 4,
    nombreClients: 180,
    nombreRendezVous: 40,
    statut: "active",
    dateCreation: "03/08/2022",
    dateDerniereModification: "15/02/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Acupuncture",
    description: "Clinique d'acupuncture traditionnelle chinoise et médecine alternative.",
    contactPrincipal: {
      nom: "Li Wei",
      titre: "Acupuncteur",
      email: "l.wei@acupunctureequilibre.com",
      telephone: "+1 (514) 555-3457",
    },
    abonnement: {
      plan: "Starter",
      dateDebut: "03/08/2022",
      dateFin: "03/08/2023",
      montantMensuel: 49.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Carte de crédit",
      adresseFacturation: "123 Rue Saint-Denis, Montréal, QC H2X 3L9",
      dernierPaiement: "03/03/2023",
      montantDernierPaiement: 49.99,
      prochainPaiement: "03/04/2023",
    },
    notes: "Petit cabinet en croissance. Intéressé par les fonctionnalités de marketing par courriel.",
    tauxUtilisation: 68,
    verificationComplete: true,
  },
  {
    id: "C014",
    nom: "Centre de Réadaptation PhysioVie",
    adresse: "456 Avenue du Mont-Royal",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2J 1W8",
    telephone: "+1 (514) 555-4567",
    email: "info@physiovie.com",
    siteWeb: "www.physiovie.com",
    nombreEmployes: 14,
    nombreClients: 410,
    nombreRendezVous: 105,
    statut: "active",
    dateCreation: "12/04/2022",
    dateDerniereModification: "20/03/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Réadaptation",
    description: "Centre de réadaptation physique spécialisé dans la récupération post-traumatique.",
    contactPrincipal: {
      nom: "Caroline Dubois",
      titre: "Directrice clinique",
      email: "c.dubois@physiovie.com",
      telephone: "+1 (514) 555-4568",
    },
    abonnement: {
      plan: "Premium",
      dateDebut: "12/04/2022",
      dateFin: "12/04/2024",
      montantMensuel: 199.99,
      statut: "Actif",
    },
    facturation: {
      methode: "Prélèvement bancaire",
      adresseFacturation: "456 Avenue du Mont-Royal, Montréal, QC H2J 1W8",
      dernierPaiement: "12/03/2023",
      montantDernierPaiement: 199.99,
      prochainPaiement: "12/04/2023",
    },
    notes: "Client satisfait. A demandé des fonctionnalités supplémentaires pour le suivi des exercices des patients.",
    tauxUtilisation: 89,
    verificationComplete: true,
  },
  {
    id: "C015",
    nom: "Clinique Vétérinaire Ami des Animaux",
    adresse: "789 Boulevard Saint-Michel",
    ville: "Montréal",
    province: "QC",
    codePostal: "H2A 3L7",
    telephone: "+1 (514) 555-5678",
    email: "contact@vetamidesanimaux.com",
    siteWeb: "www.vetamidesanimaux.com",
    nombreEmployes: 11,
    nombreClients: 520,
    nombreRendezVous: 130,
    statut: "en attente",
    dateCreation: "25/02/2023",
    dateDerniereModification: "25/02/2023",
    logo: "/placeholder.svg?height=40&width=40",
    secteurActivite: "Vétérinaire",
    description: "Clinique vétérinaire pour animaux de compagnie offrant des soins préventifs et curatifs.",
    contactPrincipal: {
      nom: "Dr. Martin Leclerc",
      titre: "Vétérinaire en chef",
      email: "m.leclerc@vetamidesanimaux.com",
      telephone: "+1 (514) 555-5679",
    },
    abonnement: {
      plan: "Standard",
      dateDebut: "En attente",
      dateFin: "En attente",
      montantMensuel: 99.99,
      statut: "En attente",
    },
    facturation: {
      methode: "En attente",
      adresseFacturation: "789 Boulevard Saint-Michel, Montréal, QC H2A 3L7",
      dernierPaiement: "N/A",
      montantDernierPaiement: 0,
      prochainPaiement: "N/A",
    },
    notes: "Nouveau client en attente de validation. Documents reçus, vérification en cours.",
    tauxUtilisation: 0,
    verificationComplete: false,
  },
]

// Statistiques
const statistiques = {
  totalCompagnies: compagniesData.length,
  compagniesActives: compagniesData.filter((c) => c.statut === "active").length,
  compagniesInactives: compagniesData.filter((c) => c.statut === "inactive").length,
  compagniesEnAttente: compagniesData.filter((c) => c.statut === "en attente").length,
  compagniesSuspendues: compagniesData.filter((c) => c.statut === "suspendue").length,
  revenuMensuel: compagniesData.reduce((total, c) => {
    if (c.abonnement.statut === "Actif") {
      return total + c.abonnement.montantMensuel
    }
    return total
  }, 0),
  nombreEmployesTotal: compagniesData.reduce((total, c) => total + c.nombreEmployes, 0),
  nombreClientsTotal: compagniesData.reduce((total, c) => total + c.nombreClients, 0),
  nombreRendezVousTotal: compagniesData.reduce((total, c) => total + c.nombreRendezVous, 0),
  tauxUtilisationMoyen: Math.round(
    compagniesData.reduce((total, c) => total + c.tauxUtilisation, 0) / compagniesData.length,
  ),
}

// Distribution par secteur
const secteurs = compagniesData.reduce(
  (acc, company) => {
    acc[company.secteurActivite] = (acc[company.secteurActivite] || 0) + 1
    return acc
  },
  {} as Record<string, number>,
)

// Distribution par plan
const plans = compagniesData.reduce(
  (acc, company) => {
    const plan = company.abonnement.plan
    if (plan !== "En attente") {
      acc[plan] = (acc[plan] || 0) + 1
    }
    return acc
  },
  {} as Record<string, number>,
)

export default function AdminCompagnies() {
  const [recherche, setRecherche] = useState<string>("")
  const [filtreSecteur, setFiltreSecteur] = useState<string>("tous")
  const [filtreStatut, setFiltreStatut] = useState<string>("tous")
  const [filtrePlan, setFiltrePlan] = useState<string>("tous")
  const [page, setPage] = useState<number>(1)
  const [elementsParPage, setElementsParPage] = useState<number>(10)
  const [compagnieSelectionnee, setCompagnieSelectionnee] = useState<Compagnie | null>(null)
  const [dialogSuppressionOuvert, setDialogSuppressionOuvert] = useState<boolean>(false)
  const [dialogDetailsOuvert, setDialogDetailsOuvert] = useState<boolean>(false)
  const [dialogModificationOuvert, setDialogModificationOuvert] = useState<boolean>(false)
  const [ongletActif, setOngletActif] = useState<string>("liste")
  const [colonnesSelectionnees, setColonnesSelectionnees] = useState<string[]>([
    "nom",
    "secteurActivite",
    "statut",
    "nombreEmployes",
    "abonnement",
    "tauxUtilisation",
  ])
  const [dialogColonnesOuvert, setDialogColonnesOuvert] = useState<boolean>(false)

  // Liste des colonnes disponibles
  const colonnesDisponibles = [
    { id: "nom", label: "Nom" },
    { id: "secteurActivite", label: "Secteur d'activité" },
    { id: "adresse", label: "Adresse" },
    { id: "contact", label: "Contact" },
    { id: "nombreEmployes", label: "Employés" },
    { id: "nombreClients", label: "Clients" },
    { id: "nombreRendezVous", label: "Rendez-vous" },
    { id: "statut", label: "Statut" },
    { id: "abonnement", label: "Abonnement" },
    { id: "dateCreation", label: "Date de création" },
    { id: "tauxUtilisation", label: "Utilisation" },
  ]

  // Filtrer les compagnies
  const compagniesFiltrees = compagniesData.filter((company) => {
    const matchRecherche =
      company.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      company.adresse.toLowerCase().includes(recherche.toLowerCase()) ||
      company.ville.toLowerCase().includes(recherche.toLowerCase()) ||
      company.email.toLowerCase().includes(recherche.toLowerCase()) ||
      company.secteurActivite.toLowerCase().includes(recherche.toLowerCase())

    const matchSecteur = filtreSecteur === "tous" || company.secteurActivite === filtreSecteur
    const matchStatut = filtreStatut === "tous" || company.statut === filtreStatut
    const matchPlan = filtrePlan === "tous" || company.abonnement.plan === filtrePlan

    return matchRecherche && matchSecteur && matchStatut && matchPlan
  })

  // Pagination
  const totalPages = Math.ceil(compagniesFiltrees.length / elementsParPage)
  const debut = (page - 1) * elementsParPage
  const fin = debut + elementsParPage
  const compagniesPage = compagniesFiltrees.slice(debut, fin)

  // Obtenir la couleur du badge en fonction du statut
  const getStatutBadgeVariant = (statut: string) => {
    switch (statut) {
      case "active":
        return "success"
      case "inactive":
        return "destructive"
      case "en attente":
        return "warning"
      case "suspendue":
        return "secondary"
      default:
        return "secondary"
    }
  }

  // Obtenir l'icône de statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "en attente":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "suspendue":
        return <Ban className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  // Obtenir la couleur du badge en fonction du plan
  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Starter":
        return "default"
      case "Standard":
        return "secondary"
      case "Premium":
        return "primary"
      case "Enterprise":
        return "success"
      case "En attente":
        return "outline"
      default:
        return "default"
    }
  }

  // Gérer la suppression
  const handleSuppression = () => {
    // Logique de suppression à implémenter
    console.log(`Suppression de la compagnie ${compagnieSelectionnee?.nom}`)
    setDialogSuppressionOuvert(false)
    setCompagnieSelectionnee(null)
  }

  // Gérer la modification des colonnes affichées
  const handleToggleColonne = (id: string) => {
    setColonnesSelectionnees((prev) => {
      if (prev.includes(id)) {
        return prev.filter((colId) => colId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Vérifier si une colonne est visible
  const isColonneVisible = (id: string) => {
    return colonnesSelectionnees.includes(id)
  }

  // Obtenir les secteurs uniques pour le filtre
  const secteursUniques = Array.from(new Set(compagniesData.map((c) => c.secteurActivite)))

  // Obtenir les plans uniques pour le filtre
  const plansUniques = Array.from(
    new Set(compagniesData.map((c) => c.abonnement.plan).filter((p) => p !== "En attente")),
  )

  return (
   <PrivateLayout>
     <div className="container mx-auto py-6 space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administration des compagnies</h1>
          <p className="text-muted-foreground">Gestion complète des compagnies inscrites sur la plateforme</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une compagnie
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button variant="outline" onClick={() => setDialogColonnesOuvert(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Colonnes
          </Button>
        </div>
      </div>

      <Tabs value={ongletActif} onValueChange={setOngletActif} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-3">
          <TabsTrigger value="liste">
            <FileText className="mr-2 h-4 w-4" />
            Liste des compagnies
          </TabsTrigger>
          <TabsTrigger value="statistiques">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Shield className="mr-2 h-4 w-4" />
            Vérification
          </TabsTrigger>
        </TabsList>

        {/* Onglet Liste des compagnies */}
        <TabsContent value="liste" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <CardTitle>Compagnies ({compagniesFiltrees.length})</CardTitle>
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
                  <div className="flex flex-wrap gap-2">
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
                        <SelectItem value="active">Actives</SelectItem>
                        <SelectItem value="inactive">Inactives</SelectItem>
                        <SelectItem value="en attente">En attente</SelectItem>
                        <SelectItem value="suspendue">Suspendues</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={filtreSecteur}
                      onValueChange={(value) => {
                        setFiltreSecteur(value)
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Secteur d'activité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les secteurs</SelectItem>
                        {secteursUniques.map((secteur) => (
                          <SelectItem key={secteur} value={secteur}>
                            {secteur}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filtrePlan}
                      onValueChange={(value) => {
                        setFiltrePlan(value)
                        setPage(1)
                      }}
                    >
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tous">Tous les plans</SelectItem>
                        {plansUniques.map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isColonneVisible("nom") && <TableHead>Nom</TableHead>}
                      {isColonneVisible("secteurActivite") && <TableHead>Secteur</TableHead>}
                      {isColonneVisible("adresse") && <TableHead>Adresse</TableHead>}
                      {isColonneVisible("contact") && <TableHead>Contact</TableHead>}
                      {isColonneVisible("nombreEmployes") && <TableHead>Employés</TableHead>}
                      {isColonneVisible("nombreClients") && <TableHead>Clients</TableHead>}
                      {isColonneVisible("nombreRendezVous") && <TableHead>Rendez-vous</TableHead>}
                      {isColonneVisible("statut") && <TableHead>Statut</TableHead>}
                      {isColonneVisible("abonnement") && <TableHead>Abonnement</TableHead>}
                      {isColonneVisible("dateCreation") && <TableHead>Date création</TableHead>}
                      {isColonneVisible("tauxUtilisation") && <TableHead>Utilisation</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compagniesPage.length > 0 ? (
                      compagniesPage.map((company) => (
                        <TableRow key={company.id}>
                          {isColonneVisible("nom") && (
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={company.logo} alt={company.nom} />
                                  <AvatarFallback>{company.nom.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{company.nom}</span>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("secteurActivite") && (
                            <TableCell>
                              <Badge variant="outline">{company.secteurActivite}</Badge>
                            </TableCell>
                          )}
                          {isColonneVisible("adresse") && (
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {company.ville}, {company.province}
                                </span>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("contact") && (
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{company.telephone}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{company.email}</span>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("nombreEmployes") && (
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{company.nombreEmployes}</span>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("nombreClients") && (
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{company.nombreClients}</span>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("nombreRendezVous") && (
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{company.nombreRendezVous}</span>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("statut") && (
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                {getStatutIcon(company.statut)}
                                <Badge variant={getStatutBadgeVariant(company.statut)}>{company.statut}</Badge>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("abonnement") && (
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={getPlanBadgeVariant(company.abonnement.plan)}>
                                  {company.abonnement.plan}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {company.abonnement.statut === "Actif" ? (
                                    <span>Expire: {company.abonnement.dateFin}</span>
                                  ) : (
                                    <span>{company.abonnement.statut}</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {isColonneVisible("dateCreation") && (
                            <TableCell>
                              <div className="text-sm">{company.dateCreation}</div>
                            </TableCell>
                          )}
                          {isColonneVisible("tauxUtilisation") && (
                            <TableCell>
                              <div className="space-y-1">
                                <Progress value={company.tauxUtilisation} className="h-2" />
                                <div className="text-xs text-right">{company.tauxUtilisation}%</div>
                              </div>
                            </TableCell>
                          )}
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
                                    setCompagnieSelectionnee(company)
                                    setDialogDetailsOuvert(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCompagnieSelectionnee(company)
                                    setDialogModificationOuvert(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Changer le statut
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Gérer l'abonnement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setCompagnieSelectionnee(company)
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
                        <TableCell colSpan={12} className="h-24 text-center">
                          Aucune compagnie trouvée.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination améliorée */}
              {compagniesFiltrees.length > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-sm text-muted-foreground">
                    Affichage de {debut + 1} à {Math.min(fin, compagniesFiltrees.length)} sur{" "}
                    {compagniesFiltrees.length} compagnies
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Éléments par page</span>
                    <Select
                      value={elementsParPage.toString()}
                      onValueChange={(value) => {
                        setElementsParPage(Number(value))
                        setPage(1) // Réinitialiser à la première page
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={elementsParPage.toString()} />
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

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(1)}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                          aria-label="Aller à la première page"
                        />
                      </PaginationItem>
                      {/* <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage(page > 1 ? page - 1 : 1)}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                          aria-label="Aller à la page précédente"
                        />
                      </PaginationItem> */}

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
                          aria-label="Aller à la page suivante"
                        />
                      </PaginationItem>
                      {/* <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage(totalPages)}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                          aria-label="Aller à la dernière page"
                        />
                      </PaginationItem> */}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="statistiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compagnies actives</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistiques.compagniesActives}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((statistiques.compagniesActives / statistiques.totalCompagnies) * 100)}% du total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenu mensuel</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistiques.revenuMensuel.toFixed(2)} $</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(statistiques.revenuMensuel / statistiques.compagniesActives)} $ par compagnie active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taux d'utilisation moyen</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistiques.tauxUtilisationMoyen}%</div>
                <Progress value={statistiques.tauxUtilisationMoyen} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compagnies en attente</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistiques.compagniesEnAttente}</div>
                <p className="text-xs text-muted-foreground">Nécessitent une vérification</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribution par secteur d'activité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(secteurs).map(([secteur, nombre]) => (
                    <div key={secteur} className="flex items-center">
                      <div className="w-1/3 font-medium truncate">{secteur}</div>
                      <div className="w-2/3 flex items-center gap-2">
                        <div className="flex-1">
                          <Progress value={(nombre / statistiques.totalCompagnies) * 100} className="h-2" />
                        </div>
                        <div className="text-sm text-muted-foreground w-12 text-right">{nombre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution par plan d'abonnement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(plans).map(([plan, nombre]) => (
                    <div key={plan} className="flex items-center">
                      <div className="w-1/3 font-medium">
                        <Badge variant={getPlanBadgeVariant(plan)}>{plan}</Badge>
                      </div>
                      <div className="w-2/3 flex items-center gap-2">
                        <div className="flex-1">
                          <Progress
                            value={(nombre / (statistiques.totalCompagnies - statistiques.compagniesEnAttente)) * 100}
                            className="h-2"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground w-12 text-right">{nombre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques globales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Compagnies</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-2xl font-bold">{statistiques.totalCompagnies}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{statistiques.compagniesActives}</div>
                      <div className="text-xs text-muted-foreground">Actives</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{statistiques.compagniesInactives}</div>
                      <div className="text-xs text-muted-foreground">Inactives</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-600">{statistiques.compagniesSuspendues}</div>
                      <div className="text-xs text-muted-foreground">Suspendues</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Utilisateurs</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-2xl font-bold">{statistiques.nombreEmployesTotal}</div>
                      <div className="text-xs text-muted-foreground">Employés</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{statistiques.nombreClientsTotal}</div>
                      <div className="text-xs text-muted-foreground">Clients</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(statistiques.nombreEmployesTotal / statistiques.compagniesActives)}
                      </div>
                      <div className="text-xs text-muted-foreground">Employés/compagnie</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(statistiques.nombreClientsTotal / statistiques.compagniesActives)}
                      </div>
                      <div className="text-xs text-muted-foreground">Clients/compagnie</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Activité</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-2xl font-bold">{statistiques.nombreRendezVousTotal}</div>
                      <div className="text-xs text-muted-foreground">Rendez-vous</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {Math.round(statistiques.nombreRendezVousTotal / statistiques.compagniesActives)}
                      </div>
                      <div className="text-xs text-muted-foreground">RDV/compagnie</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round(statistiques.revenuMensuel)}</div>
                      <div className="text-xs text-muted-foreground">Revenu mensuel ($)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{Math.round(statistiques.revenuMensuel * 12)}</div>
                      <div className="text-xs text-muted-foreground">Revenu annuel ($)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Vérification */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compagnies en attente de vérification</CardTitle>
              <CardDescription>
                Ces compagnies ont besoin d'une vérification avant de pouvoir utiliser pleinement la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compagnie</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compagniesData
                    .filter((c) => c.statut === "en attente" || !c.verificationComplete)
                    .map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={company.logo} alt={company.nom} />
                              <AvatarFallback>{company.nom.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{company.nom}</div>
                              <div className="text-xs text-muted-foreground">{company.secteurActivite}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{company.dateCreation}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{company.contactPrincipal.nom}</div>
                            <div className="text-xs text-muted-foreground">{company.contactPrincipal.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPlanBadgeVariant(company.abonnement.plan)}>
                            {company.abonnement.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="warning">En attente</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              Détails
                            </Button>
                            <Button size="sm">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Vérifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {compagniesData.filter((c) => c.statut === "en attente" || !c.verificationComplete).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucune compagnie en attente de vérification.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processus de vérification</CardTitle>
              <CardDescription>Étapes à suivre pour vérifier une nouvelle compagnie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Vérification des informations de l'entreprise</h4>
                    <p className="text-sm text-muted-foreground">
                      Vérifier que les informations fournies correspondent à une entreprise légalement enregistrée.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Validation des coordonnées</h4>
                    <p className="text-sm text-muted-foreground">
                      Confirmer que l'adresse email et le numéro de téléphone sont valides et appartiennent à
                      l'entreprise.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Vérification des informations de paiement</h4>
                    <p className="text-sm text-muted-foreground">
                      S'assurer que les informations de facturation et de paiement sont correctes et valides.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Approbation finale</h4>
                    <p className="text-sm text-muted-foreground">
                      Approuver la compagnie et activer son compte avec le plan d'abonnement sélectionné.
                    </p>
                  </div>
                </div>
              </div>
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
              Êtes-vous sûr de vouloir supprimer la compagnie <strong>{compagnieSelectionnee?.nom}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
            <p className="text-amber-800 text-sm font-medium mb-2">Cette action entraînera :</p>
            <ul className="text-amber-700 text-sm space-y-1 list-disc pl-5">
              <li>La suppression définitive de la compagnie et de son profil</li>
              <li>La désactivation de tous les comptes utilisateurs associés</li>
              <li>L'annulation de tous les rendez-vous futurs</li>
              <li>La perte d'accès à tous les services de la plateforme</li>
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

      {/* Dialog de détails compagnie */}
      <Dialog open={dialogDetailsOuvert} onOpenChange={setDialogDetailsOuvert}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails de la compagnie</DialogTitle>
            <DialogDescription>Informations complètes sur la compagnie</DialogDescription>
          </DialogHeader>
          {compagnieSelectionnee && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={compagnieSelectionnee.logo} alt={compagnieSelectionnee.nom} />
                  <AvatarFallback>{compagnieSelectionnee.nom.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{compagnieSelectionnee.nom}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatutBadgeVariant(compagnieSelectionnee.statut)}>
                      {compagnieSelectionnee.statut}
                    </Badge>
                    <Badge variant="outline">{compagnieSelectionnee.secteurActivite}</Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                    <Globe className="h-3 w-3" />
                    <a
                      href={`https://${compagnieSelectionnee.siteWeb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {compagnieSelectionnee.siteWeb}
                    </a>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Informations générales</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">ID:</div>
                        <div className="text-sm">{compagnieSelectionnee.id}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">Date de création:</div>
                        <div className="text-sm">{compagnieSelectionnee.dateCreation}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">Dernière modification:</div>
                        <div className="text-sm">{compagnieSelectionnee.dateDerniereModification}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm font-medium">Taux d'utilisation:</div>
                        <div className="text-sm flex items-center">
                          <Progress value={compagnieSelectionnee.tauxUtilisation} className="h-2 w-20 mr-2" />
                          {compagnieSelectionnee.tauxUtilisation}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Adresse</h4>
                    <p className="text-sm">{compagnieSelectionnee.adresse}</p>
                    <p className="text-sm">
                      {compagnieSelectionnee.ville}, {compagnieSelectionnee.province} {compagnieSelectionnee.codePostal}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact principal</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{compagnieSelectionnee.contactPrincipal.nom}</p>
                      <p className="text-sm text-muted-foreground">{compagnieSelectionnee.contactPrincipal.titre}</p>
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{compagnieSelectionnee.contactPrincipal.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{compagnieSelectionnee.contactPrincipal.telephone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p className="text-sm">{compagnieSelectionnee.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Abonnement</h4>
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant={getPlanBadgeVariant(compagnieSelectionnee.abonnement.plan)}>
                          {compagnieSelectionnee.abonnement.plan}
                        </Badge>
                        <Badge
                          variant={compagnieSelectionnee.abonnement.statut === "Actif" ? "success" : "destructive"}
                        >
                          {compagnieSelectionnee.abonnement.statut}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="grid grid-cols-2 gap-1">
                          <div className="font-medium">Date de début:</div>
                          <div>{compagnieSelectionnee.abonnement.dateDebut}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="font-medium">Date de fin:</div>
                          <div>{compagnieSelectionnee.abonnement.dateFin}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="font-medium">Montant mensuel:</div>
                          <div>{compagnieSelectionnee.abonnement.montantMensuel.toFixed(2)} $</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Facturation</h4>
                    <div className="space-y-1 text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Méthode:</div>
                        <div>{compagnieSelectionnee.facturation.methode}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Adresse de facturation:</div>
                        <div>{compagnieSelectionnee.facturation.adresseFacturation}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Dernier paiement:</div>
                        <div>{compagnieSelectionnee.facturation.dernierPaiement}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Montant:</div>
                        <div>{compagnieSelectionnee.facturation.montantDernierPaiement.toFixed(2)} $</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Prochain paiement:</div>
                        <div>{compagnieSelectionnee.facturation.prochainPaiement}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Statistiques</h4>
                    <div className="space-y-1 text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Nombre d'employés:</div>
                        <div>{compagnieSelectionnee.nombreEmployes}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Nombre de clients:</div>
                        <div>{compagnieSelectionnee.nombreClients}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="font-medium">Nombre de rendez-vous:</div>
                        <div>{compagnieSelectionnee.nombreRendezVous}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                    <p className="text-sm">{compagnieSelectionnee.notes}</p>
                  </div>
                </div>
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
                setDialogModificationOuvert(true)
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Modifier la compagnie</DialogTitle>
            <DialogDescription>Modifier les informations de la compagnie</DialogDescription>
          </DialogHeader>
          {compagnieSelectionnee && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de la compagnie</Label>
                  <Input id="nom" defaultValue={compagnieSelectionnee.nom} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secteur">Secteur d'activité</Label>
                  <Input id="secteur" defaultValue={compagnieSelectionnee.secteurActivite} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select defaultValue={compagnieSelectionnee.statut}>
                    <SelectTrigger id="statut">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="en attente">En attente</SelectItem>
                      <SelectItem value="suspendue">Suspendue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Site web</Label>
                  <Input id="site" defaultValue={compagnieSelectionnee.siteWeb} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Adresse</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input id="adresse" defaultValue={compagnieSelectionnee.adresse} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ville">Ville</Label>
                    <Input id="ville" defaultValue={compagnieSelectionnee.ville} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input id="province" defaultValue={compagnieSelectionnee.province} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codePostal">Code postal</Label>
                    <Input id="codePostal" defaultValue={compagnieSelectionnee.codePostal} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact principal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNom">Nom</Label>
                    <Input id="contactNom" defaultValue={compagnieSelectionnee.contactPrincipal.nom} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTitre">Titre</Label>
                    <Input id="contactTitre" defaultValue={compagnieSelectionnee.contactPrincipal.titre} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" defaultValue={compagnieSelectionnee.contactPrincipal.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactTelephone">Téléphone</Label>
                    <Input id="contactTelephone" defaultValue={compagnieSelectionnee.contactPrincipal.telephone} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Abonnement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plan</Label>
                    <Select defaultValue={compagnieSelectionnee.abonnement.plan}>
                      <SelectTrigger id="plan">
                        <SelectValue placeholder="Sélectionner un plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Starter">Starter</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="statutAbonnement">Statut de l'abonnement</Label>
                    <Select defaultValue={compagnieSelectionnee.abonnement.statut}>
                      <SelectTrigger id="statutAbonnement">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Expiré">Expiré</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début</Label>
                    <Input id="dateDebut" defaultValue={compagnieSelectionnee.abonnement.dateDebut} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFin">Date de fin</Label>
                    <Input id="dateFin" defaultValue={compagnieSelectionnee.abonnement.dateFin} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="montantMensuel">Montant mensuel ($)</Label>
                    <Input
                      id="montantMensuel"
                      type="number"
                      defaultValue={compagnieSelectionnee.abonnement.montantMensuel}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Statistiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEmployes">Nombre d'employés</Label>
                    <Input id="nombreEmployes" type="number" defaultValue={compagnieSelectionnee.nombreEmployes} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreClients">Nombre de clients</Label>
                    <Input id="nombreClients" type="number" defaultValue={compagnieSelectionnee.nombreClients} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombreRendezVous">Nombre de rendez-vous</Label>
                    <Input id="nombreRendezVous" type="number" defaultValue={compagnieSelectionnee.nombreRendezVous} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={compagnieSelectionnee.description} rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" defaultValue={compagnieSelectionnee.notes} rows={3} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="verificationComplete" defaultChecked={compagnieSelectionnee.verificationComplete} />
                  <Label htmlFor="verificationComplete">Vérification complète</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cochez cette case si tous les documents et informations de la compagnie ont été vérifiés.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogModificationOuvert(false)}>
              Annuler
            </Button>
            <Button>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de sélection des colonnes */}
      <Dialog open={dialogColonnesOuvert} onOpenChange={setDialogColonnesOuvert}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Colonnes affichées</DialogTitle>
            <DialogDescription>Sélectionnez les colonnes que vous souhaitez afficher dans le tableau</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {colonnesDisponibles.map((colonne) => (
              <div key={colonne.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`colonne-${colonne.id}`}
                  checked={isColonneVisible(colonne.id)}
                  onCheckedChange={() => handleToggleColonne(colonne.id)}
                />
                <Label htmlFor={`colonne-${colonne.id}`}>{colonne.label}</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogColonnesOuvert(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
   </PrivateLayout>
  )
}

