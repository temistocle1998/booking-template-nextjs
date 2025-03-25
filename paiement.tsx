"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Menu, User, Check, Download, Lock, Calendar, CreditCard } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

// Types
type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  status: "completed" | "pending" | "failed"
  invoice?: string
}

export default function PagePaiements() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isYearly, setIsYearly] = useState(false)
  const [numberOfUsers, setNumberOfUsers] = useState("1")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false)
  const [activeTab, setActiveTab] = useState("abonnement")

  // États pour le formulaire de paiement
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCVC, setCardCVC] = useState("")
  const [cardName, setCardName] = useState("")

  // Prix et calculs
  const monthlyPrice = 10
  const yearlyPrice = 102 // prix annuel par utilisateur
  const basePrice = isYearly ? yearlyPrice : monthlyPrice
  const usersCount = Number.parseInt(numberOfUsers)
  const totalPrice = basePrice * usersCount
  const savingsPercentage = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100)

  // Date de début et de fin d'abonnement
  const startDate = new Date()
  const endDate = new Date()
  if (isYearly) {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }

  // Formater les dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Données simulées pour les transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "19 mars 2025",
      description: "Abonnement Starter Annuel - 1 utilisateur",
      amount: 102,
      status: "completed",
      invoice: "INV-2025-001",
    },
    {
      id: "2",
      date: "19 février 2025",
      description: "Abonnement Starter Mensuel - 3 utilisateurs",
      amount: 30,
      status: "completed",
      invoice: "INV-2025-002",
    },
    {
      id: "3",
      date: "19 janvier 2025",
      description: "Abonnement Starter Mensuel - 2 utilisateurs",
      amount: 20,
      status: "completed",
      invoice: "INV-2025-003",
    },
    {
      id: "4",
      date: "19 décembre 2024",
      description: "Abonnement Starter Mensuel - 1 utilisateur",
      amount: 10,
      status: "completed",
      invoice: "INV-2024-012",
    },
    {
      id: "5",
      date: "19 novembre 2024",
      description: "Abonnement Starter Mensuel - 1 utilisateur",
      amount: 10,
      status: "failed",
      invoice: "INV-2024-011",
    },
  ]

  // Formater le numéro de carte
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formater la date d'expiration
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Gérer la soumission du paiement
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simuler le traitement du paiement
    setTimeout(() => {
      setIsPaymentModalOpen(false)
      setIsSubscriptionActive(true)
      setActiveTab("abonnement")
    }, 1000)
  }

  // Annuler l'abonnement
  const handleCancelSubscription = () => {
    if (confirm("Êtes-vous sûr de vouloir annuler votre abonnement ?")) {
      setIsSubscriptionActive(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar pour desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
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
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sr-only">Fermer le menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="py-4">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Menu principal</p>
          </div>
          <nav className="space-y-1">
            <Link
              href="/dashboard-professionnel"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Tableau de bord
            </Link>
            <Link
              href="/calendrier-disponibilites"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Calendrier
            </Link>
            <Link
              href="/liste-clients"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Clients
            </Link>
            <Link
              href="/liste-services"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Services
            </Link>
            <Link href="#" className="flex items-center px-4 py-2.5 text-sm font-medium text-primary bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              Paiements
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Messages
            </Link>
          </nav>
          <div className="mt-6 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Paramètres</p>
          </div>
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <User className="mr-3 h-5 w-5" />
              Mon profil
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Paramètres
            </Link>
            <Link
              href="#"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Déconnexion
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay pour fermer le sidebar sur mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 md:ml-0">
                <h1 className="text-lg font-medium text-gray-900">Paiements</h1>
                <p className="text-sm text-gray-500">Gérez votre abonnement et vos paiements</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700">
                  <span className="sr-only">Notifications</span>
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    3
                  </span>
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center space-x-2 rounded-full text-gray-700 hover:text-gray-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Martin" />
                    <AvatarFallback>DM</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">Dr. Martin</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4 w-full max-w-md">
                <TabsTrigger value="abonnement" className="flex-1">
                  Abonnement actuel
                </TabsTrigger>
                <TabsTrigger value="historique" className="flex-1">
                  Historique des paiements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="abonnement" className="space-y-6">
                {isSubscriptionActive ? (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Abonnement actuel</CardTitle>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 bg-gray-100">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Verrouillé</span>
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Forfait</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 border-green-200">
                              Actif
                            </Badge>
                            <span className="font-medium">Starter {isYearly ? "Annuel" : "Mensuel"}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Prix par professionnel.le</h3>
                          <p className="mt-1 font-medium text-lg">{isYearly ? "102.00 $ / An" : "10.00 $ / Mois"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Nombre de professionnel.le.s</h3>
                          <div className="flex items-center mt-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5 text-gray-400"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span className="font-medium">{numberOfUsers}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Prix total</h3>
                          <p className="mt-1 font-medium text-lg">
                            {isYearly
                              ? `${yearlyPrice * usersCount}.00 $ / An`
                              : `${monthlyPrice * usersCount}.00 $ / Mois`}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Date de début</h3>
                          <div className="flex items-center mt-1">
                            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                            <span className="font-medium">{formatDate(startDate)}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Prochaine facturation</h3>
                          <div className="flex items-center mt-1">
                            <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                            <span className="font-medium">{formatDate(endDate)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="destructive" onClick={handleCancelSubscription}>
                        Annuler l'abonnement
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Abonnement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="plan-type">Forfait</Label>
                          <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm">Facturation {isYearly ? "annuelle" : "mensuelle"}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${!isYearly ? "font-medium" : ""}`}>Mensuel</span>
                              <Switch checked={isYearly} onCheckedChange={setIsYearly} id="billing-toggle" />
                              <span className={`text-sm ${isYearly ? "font-medium" : ""}`}>Annuel</span>
                            </div>
                          </div>
                          {isYearly && (
                            <p className="mt-2 text-sm text-primary font-medium">
                              Économisez {savingsPercentage}% avec la facturation annuelle
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="users-count" className="flex items-center">
                            Nombre de professionnel.le.s
                            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                              ?
                            </span>
                          </Label>
                          <Select value={numberOfUsers} onValueChange={setNumberOfUsers}>
                            <SelectTrigger id="users-count" className="mt-2">
                              <SelectValue placeholder="Sélectionner le nombre d'utilisateurs" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "utilisateur" : "utilisateurs"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Facturation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">L'offre Starter inclus :</h3>
                          <ul className="mt-4 space-y-3">
                            <li className="flex items-start">
                              <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>Gestion des rendez-vous</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>Accès à un tableau de bord simplifié</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>1 Soutien administratif</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>Rappels automatisés par courriel</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>Statistiques avancées et rapports personnalisés</span>
                            </li>
                          </ul>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Offre de base</span>
                            <div className="text-right">
                              <div className="font-medium">{basePrice}.00 $</div>
                              <div className="text-sm text-gray-500">/ {isYearly ? "an" : "mois"}</div>
                            </div>
                          </div>

                          {usersCount > 1 && (
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{usersCount - 1} Professionnel.le.s additionnel.le.s</span>
                              <div className="text-right">
                                <div className="font-medium">{basePrice * (usersCount - 1)}.00 $</div>
                                <div className="text-sm text-gray-500">/ {isYearly ? "an" : "mois"}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center font-medium text-lg">
                          <span>Dû aujourd'hui</span>
                          <span>{totalPrice}.00 $</span>
                        </div>

                        <div className="text-sm text-gray-500 text-right">*Les montants sont en CAD</div>

                        <Button className="w-full" onClick={() => setIsPaymentModalOpen(true)}>
                          Payer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="historique">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des transactions</CardTitle>
                    <CardDescription>
                      Consultez l'historique de vos paiements et téléchargez vos factures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Facture</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                Aucune transaction trouvée
                              </TableCell>
                            </TableRow>
                          ) : (
                            transactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.amount}.00 $</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      transaction.status === "completed"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : transaction.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                          : "bg-red-100 text-red-800 border-red-200"
                                    }`}
                                  >
                                    {transaction.status === "completed"
                                      ? "Complété"
                                      : transaction.status === "pending"
                                        ? "En attente"
                                        : "Échoué"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {transaction.invoice && transaction.status === "completed" && (
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Download className="h-4 w-4" />
                                      <span className="sr-only">Télécharger la facture</span>
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modal de paiement */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paiement</DialogTitle>
            <DialogDescription>Entrez vos informations de carte pour finaliser votre abonnement</DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Nom sur la carte</Label>
                <Input
                  id="card-name"
                  placeholder="Jean Dupont"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Numéro de carte</Label>
                <div className="relative">
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Date d'expiration</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Input
                    id="card-cvc"
                    placeholder="123"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center font-medium">
                <span>Total à payer:</span>
                <span>{totalPrice}.00 $</span>
              </div>
              <div className="text-sm text-gray-500">
                En cliquant sur "Payer", vous acceptez nos conditions générales d'utilisation et notre politique de
                confidentialité.
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Payer {totalPrice}.00 $</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

