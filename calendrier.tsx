"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, ChevronLeft, ChevronRight, Menu, User, Search, X, Calendar, Clock } from "lucide-react"
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isToday,
  parseISO,
  isSameDay,
  subDays,
  addMonths,
  subMonths,
} from "date-fns"
import { fr } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types pour les rendez-vous et les disponibilités
type Appointment = {
  id: string
  title: string
  clientName: string
  clientAvatar?: string
  start: string // ISO string
  end: string // ISO string
  status: "confirmed" | "pending" | "cancelled"
  color?: string
}

type Availability = {
  dayOfWeek: number // 0 = dimanche, 1 = lundi, etc.
  startTime: string // format "HH:MM"
  endTime: string // format "HH:MM"
}

type Client = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    streetNumber: string
    unit?: string
    city: string
    province: string
    country: string
    postalCode: string
  }
  avatar?: string
}

type Dependent = {
  firstName: string
  lastName: string
  birthDate: string
  gender: "male" | "female" | "other"
}

// Ajouter cette nouvelle interface pour les services après les types existants
type Service = {
  id: string
  name: string
  duration: number // en minutes
  description?: string
}

export default function CalendrierDisponibilites() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("week")

  // États pour le modal de nouveau rendez-vous
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: string } | null>(null)
  const [appointmentType, setAppointmentType] = useState<"self" | "dependent">("self")
  const [newAppointmentTab, setNewAppointmentTab] = useState<"existing" | "new">("existing")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [searchClient, setSearchClient] = useState("")
  const [openClientSearch, setOpenClientSearch] = useState(false)

  // États pour le formulaire de nouveau client
  const [newClient, setNewClient] = useState<{
    firstName: string
    lastName: string
    email: string
    phone: string
    streetNumber: string
    street: string
    unit: string
    city: string
    province: string
    country: string
    postalCode: string
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetNumber: "",
    street: "",
    unit: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
  })

  // États pour le formulaire de personne à charge
  const [dependent, setDependent] = useState<{
    firstName: string
    lastName: string
    birthDate: string
    gender: "male" | "female" | "other"
  }>({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male",
  })

  // Données simulées pour les clients
  const clients: Client[] = [
    {
      id: "1",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@example.com",
      phone: "+33 6 12 34 56 78",
      address: {
        streetNumber: "123",
        street: "Rue de Paris",
        city: "Paris",
        province: "Île-de-France",
        country: "France",
        postalCode: "75001",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@example.com",
      phone: "+33 6 23 45 67 89",
      address: {
        streetNumber: "45",
        street: "Avenue Victor Hugo",
        unit: "3B",
        city: "Lyon",
        province: "Auvergne-Rhône-Alpes",
        country: "France",
        postalCode: "69002",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      firstName: "Emma",
      lastName: "Petit",
      email: "emma.petit@example.com",
      phone: "+33 6 34 56 78 90",
      address: {
        streetNumber: "8",
        street: "Boulevard Saint-Michel",
        city: "Marseille",
        province: "Provence-Alpes-Côte d'Azur",
        country: "France",
        postalCode: "13001",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      firstName: "Lucas",
      lastName: "Bernard",
      email: "lucas.bernard@example.com",
      phone: "+33 6 45 67 89 01",
      address: {
        streetNumber: "27",
        street: "Rue de la République",
        unit: "12",
        city: "Bordeaux",
        province: "Nouvelle-Aquitaine",
        country: "France",
        postalCode: "33000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      firstName: "Camille",
      lastName: "Roux",
      email: "camille.roux@example.com",
      phone: "+33 6 56 78 90 12",
      address: {
        streetNumber: "56",
        street: "Rue du Commerce",
        city: "Toulouse",
        province: "Occitanie",
        country: "France",
        postalCode: "31000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      firstName: "Alexandre",
      lastName: "Dupont",
      email: "alexandre.dupont@example.com",
      phone: "+33 6 67 89 01 23",
      address: {
        streetNumber: "12",
        street: "Place Bellecour",
        city: "Lyon",
        province: "Auvergne-Rhône-Alpes",
        country: "France",
        postalCode: "69002",
      },
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  // Ajouter cette liste de services après la déclaration des clients
  const services: Service[] = [
    {
      id: "massage-indien",
      name: "Massage indien",
      duration: 30,
      description: "Technique de massage traditionnelle indienne",
    },
    {
      id: "osteopathie",
      name: "Ostéopathie",
      duration: 90,
      description: "Séance complète d'ostéopathie",
    },
    {
      id: "consultation-standard",
      name: "Consultation standard",
      duration: 45,
      description: "Consultation de suivi régulier",
    },
    {
      id: "consultation-initiale",
      name: "Consultation initiale",
      duration: 60,
      description: "Première consultation avec bilan complet",
    },
    {
      id: "therapie-manuelle",
      name: "Thérapie manuelle",
      duration: 60,
      description: "Séance de thérapie manuelle",
    },
    {
      id: "suivi-rapide",
      name: "Suivi rapide",
      duration: 20,
      description: "Consultation de suivi courte",
    },
  ]

  // Ajouter un nouvel état pour le service sélectionné après les autres états
  const [selectedService, setSelectedService] = useState<string>("")

  // Calculer les dates de début et de fin de la semaine
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Commence le lundi
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }) // Finit le dimanche

  // Générer un tableau des jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Heures de travail (de 8h à 20h)
  const workingHours = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`)

  // Données simulées pour les disponibilités
  const availabilities: Availability[] = [
    { dayOfWeek: 1, startTime: "08:00", endTime: "12:00" }, // Lundi matin
    { dayOfWeek: 1, startTime: "14:00", endTime: "20:00" }, // Lundi après-midi
    { dayOfWeek: 2, startTime: "08:00", endTime: "12:00" }, // Mardi matin
    { dayOfWeek: 2, startTime: "14:00", endTime: "20:00" }, // Mardi après-midi
    { dayOfWeek: 3, startTime: "08:00", endTime: "12:00" }, // Mercredi matin
    { dayOfWeek: 3, startTime: "14:00", endTime: "20:00" }, // Mercredi après-midi
    { dayOfWeek: 4, startTime: "08:00", endTime: "12:00" }, // Jeudi matin
    { dayOfWeek: 4, startTime: "14:00", endTime: "20:00" }, // Jeudi après-midi
    { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" }, // Vendredi matin
    { dayOfWeek: 5, startTime: "14:00", endTime: "18:00" }, // Vendredi après-midi
    // Pas de disponibilité le week-end
  ]

  // Données simulées pour les rendez-vous
  const appointments: Appointment[] = [
    {
      id: "1",
      title: "Consultation initiale",
      clientName: "Sophie Martin",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-24T09:00:00", // Lundi 9h
      end: "2025-03-24T10:00:00", // Lundi 10h
      status: "confirmed",
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Suivi mensuel",
      clientName: "Thomas Dubois",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-24T15:30:00", // Lundi 15h30
      end: "2025-03-24T16:15:00", // Lundi 16h15
      status: "confirmed",
      color: "bg-green-500",
    },
    {
      id: "3",
      title: "Consultation spéciale",
      clientName: "Emma Petit",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-25T11:00:00", // Mardi 11h
      end: "2025-03-25T12:00:00", // Mardi 12h
      status: "confirmed",
      color: "bg-purple-500",
    },
    {
      id: "4",
      title: "Suivi trimestriel",
      clientName: "Lucas Bernard",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-26T14:00:00", // Mercredi 14h
      end: "2025-03-26T15:00:00", // Mercredi 15h
      status: "confirmed",
      color: "bg-yellow-500",
    },
    {
      id: "5",
      title: "Consultation initiale",
      clientName: "Camille Roux",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-27T16:30:00", // Jeudi 16h30
      end: "2025-03-27T17:30:00", // Jeudi 17h30
      status: "confirmed",
      color: "bg-pink-500",
    },
    {
      id: "6",
      title: "Suivi mensuel",
      clientName: "Alexandre Dupont",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      start: "2025-03-28T10:00:00", // Vendredi 10h
      end: "2025-03-28T10:45:00", // Vendredi 10h45
      status: "confirmed",
      color: "bg-indigo-500",
    },
  ]

  // Ajuster les dates des rendez-vous pour qu'elles correspondent à la semaine actuelle
  const adjustedAppointments = appointments.map((appointment) => {
    const originalDate = parseISO(appointment.start)
    const dayOfWeek = originalDate.getDay() === 0 ? 7 : originalDate.getDay() // Convertir dimanche (0) en 7
    const adjustedStartDate = addDays(weekStart, dayOfWeek - 1) // -1 car weekStart est déjà lundi

    const startHours = originalDate.getHours()
    const startMinutes = originalDate.getMinutes()
    const adjustedStartDateTime = new Date(adjustedStartDate)
    adjustedStartDateTime.setHours(startHours, startMinutes, 0, 0)

    const originalEndDate = parseISO(appointment.end)
    const endHours = originalEndDate.getHours()
    const endMinutes = originalEndDate.getMinutes()
    const adjustedEndDateTime = new Date(adjustedStartDate)
    adjustedEndDateTime.setHours(endHours, endMinutes, 0, 0)

    return {
      ...appointment,
      start: adjustedStartDateTime.toISOString(),
      end: adjustedEndDateTime.toISOString(),
    }
  })

  // Vérifier si une cellule contient un rendez-vous
  const getAppointmentForCell = (day: Date, hour: string) => {
    const hourNum = Number.parseInt(hour.split(":")[0])
    const cellStart = new Date(day)
    cellStart.setHours(hourNum, 0, 0, 0)

    return adjustedAppointments.find((appointment) => {
      const appointmentStart = parseISO(appointment.start)
      const appointmentEnd = parseISO(appointment.end)

      // Vérifier si le rendez-vous commence dans cette cellule
      return (
        isSameDay(appointmentStart, day) &&
        appointmentStart.getHours() <= hourNum &&
        appointmentEnd.getHours() > hourNum
      )
    })
  }

  // Vérifier si une cellule est disponible selon les disponibilités définies
  const isCellAvailable = (day: Date, hour: string) => {
    const dayOfWeek = day.getDay() === 0 ? 7 : day.getDay() // Convertir dimanche (0) en 7
    const hourNum = Number.parseInt(hour.split(":")[0])

    return availabilities.some((availability) => {
      if (availability.dayOfWeek !== dayOfWeek) return false

      const startHour = Number.parseInt(availability.startTime.split(":")[0])
      const endHour = Number.parseInt(availability.endTime.split(":")[0])

      return hourNum >= startHour && hourNum < endHour
    })
  }

  // Navigation entre les semaines
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const goToCurrentWeek = () => setCurrentDate(new Date())

  // Afficher les détails d'un rendez-vous
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
  }

  // Ouvrir le modal de nouveau rendez-vous
  const handleAvailableSlotClick = (day: Date, hour: string) => {
    const hourNum = Number.parseInt(hour.split(":")[0])
    const slotDate = new Date(day)
    slotDate.setHours(hourNum, 0, 0, 0)

    setSelectedSlot({ date: slotDate, hour })
    setShowNewAppointmentModal(true)
  }

  // Fermer le modal de nouveau rendez-vous
  const handleCloseNewAppointmentModal = () => {
    setShowNewAppointmentModal(false)
    setSelectedSlot(null)
    setAppointmentType("self")
    setNewAppointmentTab("existing")
    setSelectedClient(null)
    setSearchClient("")
    setNewClient({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetNumber: "",
      street: "",
      unit: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    })
    setDependent({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "male",
    })
    setSelectedService("")
  }

  // Soumettre le formulaire de nouveau rendez-vous
  const handleSubmitNewAppointment = (e: React.FormEvent) => {
    e.preventDefault()

    // Ici, vous implémenteriez la logique pour enregistrer le rendez-vous
    console.log("Nouveau rendez-vous:", {
      slot: selectedSlot,
      appointmentType,
      client: newAppointmentTab === "existing" ? clients.find((c) => c.id === selectedClient) : newClient,
      dependent: appointmentType === "dependent" ? dependent : null,
    })

    // Fermer le modal après soumission
    handleCloseNewAppointmentModal()

    // Afficher un message de confirmation (à implémenter)
    alert("Rendez-vous enregistré avec succès!")
  }

  // Filtrer les clients pour la recherche
  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.email.toLowerCase().includes(searchClient.toLowerCase()) ||
      client.phone.includes(searchClient),
  )

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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Calendrier
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Clients
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
                <h1 className="text-lg font-medium text-gray-900">Calendrier des disponibilités</h1>
                <p className="text-sm text-gray-500">Gérez vos disponibilités et rendez-vous</p>
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
            <Card>
              <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle>Calendrier hebdomadaire</CardTitle>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (currentView === "day") setCurrentDate(subDays(currentDate, 1))
                        else if (currentView === "week") setCurrentDate(subWeeks(currentDate, 1))
                        else setCurrentDate(subMonths(currentDate, 1))
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                      Aujourd'hui
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (currentView === "day") setCurrentDate(addDays(currentDate, 1))
                        else if (currentView === "week") setCurrentDate(addWeeks(currentDate, 1))
                        else setCurrentDate(addMonths(currentDate, 1))
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select
                    value={currentView}
                    onValueChange={(value: "day" | "week" | "month") => setCurrentView(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Affichage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Jour</SelectItem>
                      <SelectItem value="week">Semaine</SelectItem>
                      <SelectItem value="month">Mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <h2 className="text-lg font-semibold">
                    {currentView === "day"
                      ? format(currentDate, "EEEE d MMMM yyyy", { locale: fr })
                      : currentView === "week"
                        ? `${format(weekStart, "d MMMM", { locale: fr })} - ${format(weekEnd, "d MMMM yyyy", { locale: fr })}`
                        : format(currentDate, "MMMM yyyy", { locale: fr })}
                  </h2>
                </div>

                {/* Légende */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-gray-200"></div>
                    <span className="text-sm">Non disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-green-100"></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded bg-blue-500"></div>
                    <span className="text-sm">Rendez-vous confirmé</span>
                  </div>
                </div>

                {/* Calendrier pour desktop */}
                <div className="hidden md:block overflow-x-auto">
                  {currentView === "day" && (
                    <div className="min-w-[600px]">
                      {/* En-tête du jour */}
                      <div className="grid grid-cols-2 border-b">
                        <div className="py-2 text-center text-sm font-medium text-gray-500"></div>
                        <div
                          className={`py-2 text-center text-sm font-medium ${
                            isToday(currentDate) ? "bg-primary/10 text-primary" : "text-gray-500"
                          }`}
                        >
                          <div>{format(currentDate, "EEEE", { locale: fr })}</div>
                          <div>{format(currentDate, "d MMM", { locale: fr })}</div>
                        </div>
                      </div>

                      {/* Grille des heures et rendez-vous */}
                      <div className="grid grid-cols-2">
                        {/* Colonne des heures */}
                        <div className="border-r">
                          {workingHours.map((hour, index) => (
                            <div key={index} className="border-b py-6 px-2 text-right text-sm text-gray-500">
                              {hour}
                            </div>
                          ))}
                        </div>

                        {/* Colonne du jour */}
                        <div className="border-r">
                          {workingHours.map((hour, hourIndex) => {
                            const appointment = getAppointmentForCell(currentDate, hour)
                            const isAvailable = isCellAvailable(currentDate, hour)

                            return (
                              <div
                                key={hourIndex}
                                className={`relative border-b py-6 ${
                                  isAvailable && !appointment
                                    ? "bg-green-100 cursor-pointer hover:bg-green-200"
                                    : "bg-gray-200"
                                }`}
                                onClick={() => {
                                  if (isAvailable && !appointment) {
                                    handleAvailableSlotClick(currentDate, hour)
                                  }
                                }}
                              >
                                {appointment && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          className={`absolute inset-x-1 top-1 bottom-1 flex flex-col items-start rounded p-1 text-left text-xs text-white ${appointment.color || "bg-blue-500"}`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAppointmentClick(appointment)
                                          }}
                                        >
                                          <span className="font-medium">{appointment.title}</span>
                                          <span>{appointment.clientName}</span>
                                          <span>
                                            {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                            {format(parseISO(appointment.end), "HH:mm")}
                                          </span>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="space-y-1">
                                          <p className="font-medium">{appointment.title}</p>
                                          <p>Client: {appointment.clientName}</p>
                                          <p>
                                            Horaire: {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                            {format(parseISO(appointment.end), "HH:mm")}
                                          </p>
                                          <Badge
                                            variant="outline"
                                            className={`${
                                              appointment.status === "confirmed"
                                                ? "bg-green-500"
                                                : appointment.status === "pending"
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500"
                                            } text-white`}
                                          >
                                            {appointment.status === "confirmed"
                                              ? "Confirmé"
                                              : appointment.status === "pending"
                                                ? "En attente"
                                                : "Annulé"}
                                          </Badge>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentView === "week" && (
                    <div className="min-w-[800px]">
                      {/* En-têtes des jours */}
                      <div className="grid grid-cols-8 border-b">
                        <div className="py-2 text-center text-sm font-medium text-gray-500"></div>
                        {weekDays.map((day, index) => (
                          <div
                            key={index}
                            className={`py-2 text-center text-sm font-medium ${
                              isToday(day) ? "bg-primary/10 text-primary" : "text-gray-500"
                            }`}
                          >
                            <div>{format(day, "EEEE", { locale: fr })}</div>
                            <div>{format(day, "d MMM", { locale: fr })}</div>
                          </div>
                        ))}
                      </div>

                      {/* Grille des heures et rendez-vous */}
                      <div className="grid grid-cols-8">
                        {/* Colonne des heures */}
                        <div className="border-r">
                          {workingHours.map((hour, index) => (
                            <div key={index} className="border-b py-6 px-2 text-right text-sm text-gray-500">
                              {hour}
                            </div>
                          ))}
                        </div>

                        {/* Colonnes des jours */}
                        {weekDays.map((day, dayIndex) => (
                          <div key={dayIndex} className="border-r last:border-r-0">
                            {workingHours.map((hour, hourIndex) => {
                              const appointment = getAppointmentForCell(day, hour)
                              const isAvailable = isCellAvailable(day, hour)

                              return (
                                <div
                                  key={hourIndex}
                                  className={`relative border-b py-6 ${
                                    isAvailable && !appointment
                                      ? "bg-green-100 cursor-pointer hover:bg-green-200"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() => {
                                    if (isAvailable && !appointment) {
                                      handleAvailableSlotClick(day, hour)
                                    }
                                  }}
                                >
                                  {appointment && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className={`absolute inset-x-1 top-1 bottom-1 flex flex-col items-start rounded p-1 text-left text-xs text-white ${appointment.color || "bg-blue-500"}`}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleAppointmentClick(appointment)
                                            }}
                                          >
                                            <span className="font-medium">{appointment.title}</span>
                                            <span>{appointment.clientName}</span>
                                            <span>
                                              {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                              {format(parseISO(appointment.end), "HH:mm")}
                                            </span>
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="space-y-1">
                                            <p className="font-medium">{appointment.title}</p>
                                            <p>Client: {appointment.clientName}</p>
                                            <p>
                                              Horaire: {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                              {format(parseISO(appointment.end), "HH:mm")}
                                            </p>
                                            <Badge
                                              variant="outline"
                                              className={`${
                                                appointment.status === "confirmed"
                                                  ? "bg-green-500"
                                                  : appointment.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                              } text-white`}
                                            >
                                              {appointment.status === "confirmed"
                                                ? "Confirmé"
                                                : appointment.status === "pending"
                                                  ? "En attente"
                                                  : "Annulé"}
                                            </Badge>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentView === "month" && (
                    <div className="min-w-[800px]">
                      {/* Créer un calendrier mensuel */}
                      {(() => {
                        // Obtenir le premier jour du mois
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                        // Obtenir le dernier jour du mois
                        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                        // Obtenir le premier jour à afficher (peut être du mois précédent)
                        const startDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })
                        // Obtenir le dernier jour à afficher (peut être du mois suivant)
                        const endDay = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 })

                        // Créer un tableau de toutes les dates à afficher
                        const calendarDays = []
                        let day = startDay
                        while (day <= endDay) {
                          calendarDays.push(new Date(day))
                          day = addDays(day, 1)
                        }

                        // Diviser les jours en semaines
                        const weeks = []
                        for (let i = 0; i < calendarDays.length; i += 7) {
                          weeks.push(calendarDays.slice(i, i + 7))
                        }

                        return (
                          <div>
                            {/* En-têtes des jours de la semaine */}
                            <div className="grid grid-cols-7 border-b">
                              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (
                                <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
                                  {day}
                                </div>
                              ))}
                            </div>

                            {/* Grille des jours */}
                            <div className="grid grid-cols-7">
                              {calendarDays.map((day, index) => {
                                // Vérifier si le jour appartient au mois actuel
                                const isCurrentMonth = day.getMonth() === currentDate.getMonth()

                                // Trouver les rendez-vous pour ce jour
                                const dayAppointments = adjustedAppointments.filter((appointment) =>
                                  isSameDay(parseISO(appointment.start), day),
                                )

                                // Vérifier si le jour a des disponibilités
                                const hasAvailability = workingHours.some((hour) => isCellAvailable(day, hour))

                                return (
                                  <div
                                    key={index}
                                    className={`min-h-[100px] border p-1 ${
                                      isToday(day)
                                        ? "bg-primary/10"
                                        : isCurrentMonth
                                          ? hasAvailability
                                            ? "bg-green-50 cursor-pointer hover:bg-green-100"
                                            : "bg-white"
                                          : "bg-gray-100 text-gray-400"
                                    }`}
                                    onClick={() => {
                                      if (isCurrentMonth && hasAvailability) {
                                        setCurrentDate(day)
                                        setCurrentView("day")
                                      }
                                    }}
                                  >
                                    <div className="text-right text-sm font-medium">{format(day, "d")}</div>
                                    <div className="mt-1 space-y-1">
                                      {dayAppointments.slice(0, 3).map((appointment, appIndex) => (
                                        <button
                                          key={appIndex}
                                          className={`w-full truncate rounded px-1 py-0.5 text-left text-xs text-white ${appointment.color || "bg-blue-500"}`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleAppointmentClick(appointment)
                                          }}
                                        >
                                          {format(parseISO(appointment.start), "HH:mm")} {appointment.title}
                                        </button>
                                      ))}
                                      {dayAppointments.length > 3 && (
                                        <div className="text-xs text-gray-500 text-center">
                                          +{dayAppointments.length - 3} plus
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>

                {/* Calendrier pour mobile */}
                <div className="md:hidden">
                  {currentView === "day" && (
                    <div className="rounded-lg border bg-white shadow-sm">
                      <div
                        className={`rounded-t-lg px-4 py-2 ${
                          isToday(currentDate) ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        <h3 className="font-medium">{format(currentDate, "EEEE d MMMM", { locale: fr })}</h3>
                      </div>
                      <div className="divide-y">
                        {workingHours.map((hour, hourIndex) => {
                          const appointment = getAppointmentForCell(currentDate, hour)
                          const isAvailable = isCellAvailable(currentDate, hour)

                          return (
                            <div
                              key={hourIndex}
                              className={`flex items-center px-4 py-2 ${
                                isAvailable && !appointment
                                  ? "bg-green-100 cursor-pointer hover:bg-green-200"
                                  : "bg-gray-200"
                              }`}
                              onClick={() => {
                                if (isAvailable && !appointment) {
                                  handleAvailableSlotClick(currentDate, hour)
                                }
                              }}
                            >
                              <div className="w-16 text-sm font-medium text-gray-500">{hour}</div>
                              <div className="flex-1">
                                {appointment ? (
                                  <button
                                    className={`w-full rounded px-3 py-2 text-left text-white ${appointment.color || "bg-blue-500"}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAppointmentClick(appointment)
                                    }}
                                  >
                                    <div className="font-medium">{appointment.title}</div>
                                    <div className="text-sm">{appointment.clientName}</div>
                                    <div className="text-xs">
                                      {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                      {format(parseISO(appointment.end), "HH:mm")}
                                    </div>
                                  </button>
                                ) : isAvailable ? (
                                  <div className="text-sm text-gray-600">Disponible</div>
                                ) : (
                                  <div className="text-sm text-gray-600">Non disponible</div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {currentView === "week" && (
                    <div className="space-y-6">
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="rounded-lg border bg-white shadow-sm">
                          <div
                            className={`rounded-t-lg px-4 py-2 ${
                              isToday(day) ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            <h3 className="font-medium">{format(day, "EEEE d MMMM", { locale: fr })}</h3>
                          </div>
                          <div className="divide-y">
                            {workingHours.map((hour, hourIndex) => {
                              const appointment = getAppointmentForCell(day, hour)
                              const isAvailable = isCellAvailable(day, hour)

                              return (
                                <div
                                  key={hourIndex}
                                  className={`flex items-center px-4 py-2 ${
                                    isAvailable && !appointment
                                      ? "bg-green-100 cursor-pointer hover:bg-green-200"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() => {
                                    if (isAvailable && !appointment) {
                                      handleAvailableSlotClick(day, hour)
                                    }
                                  }}
                                >
                                  <div className="w-16 text-sm font-medium text-gray-500">{hour}</div>
                                  <div className="flex-1">
                                    {appointment ? (
                                      <button
                                        className={`w-full rounded px-3 py-2 text-left text-white ${appointment.color || "bg-blue-500"}`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleAppointmentClick(appointment)
                                        }}
                                      >
                                        <div className="font-medium">{appointment.title}</div>
                                        <div className="text-sm">{appointment.clientName}</div>
                                        <div className="text-xs">
                                          {format(parseISO(appointment.start), "HH:mm")} -{" "}
                                          {format(parseISO(appointment.end), "HH:mm")}
                                        </div>
                                      </button>
                                    ) : isAvailable ? (
                                      <div className="text-sm text-gray-600">Disponible</div>
                                    ) : (
                                      <div className="text-sm text-gray-600">Non disponible</div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentView === "month" && (
                    <div>
                      <h3 className="mb-2 font-medium text-center">
                        {format(currentDate, "MMMM yyyy", { locale: fr })}
                      </h3>
                      <div className="space-y-4">
                        {(() => {
                          // Obtenir le premier jour du mois
                          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                          // Obtenir le dernier jour du mois
                          const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                          // Obtenir le premier jour à afficher (peut être du mois précédent)
                          const startDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })
                          // Obtenir le dernier jour à afficher (peut être du mois suivant)
                          const endDay = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 })

                          // Créer un tableau de toutes les dates à afficher
                          const calendarDays = []
                          let day = startDay
                          while (day <= endDay) {
                            calendarDays.push(new Date(day))
                            day = addDays(day, 1)
                          }

                          // Diviser les jours en semaines
                          const weeks = []
                          for (let i = 0; i < calendarDays.length; i += 7) {
                            weeks.push(calendarDays.slice(i, i + 7))
                          }

                          return weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="rounded-lg border bg-white shadow-sm overflow-hidden">
                              <div className="grid grid-cols-7 divide-x">
                                {week.map((day, dayIndex) => {
                                  // Vérifier si le jour appartient au mois actuel
                                  const isCurrentMonth = day.getMonth() === currentDate.getMonth()

                                  // Trouver les rendez-vous pour ce jour
                                  const dayAppointments = adjustedAppointments.filter((appointment) =>
                                    isSameDay(parseISO(appointment.start), day),
                                  )

                                  // Vérifier si le jour a des disponibilités
                                  const hasAvailability = workingHours.some((hour) => isCellAvailable(day, hour))

                                  return (
                                    <div
                                      key={dayIndex}
                                      className={`p-1 min-h-[80px] ${
                                        isToday(day)
                                          ? "bg-primary/10"
                                          : isCurrentMonth
                                            ? hasAvailability
                                              ? "bg-green-50"
                                              : "bg-white"
                                            : "bg-gray-100 text-gray-400"
                                      }`}
                                      onClick={() => {
                                        if (isCurrentMonth) {
                                          setCurrentDate(day)
                                          setCurrentView("day")
                                        }
                                      }}
                                    >
                                      <div className="text-center text-sm font-medium">{format(day, "d")}</div>
                                      {dayAppointments.length > 0 && (
                                        <div className="mt-1 text-xs text-center text-primary font-medium">
                                          {dayAppointments.length} RDV
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal de détails du rendez-vous (simplifié) */}
                {selectedAppointment && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Détails du rendez-vous</h3>
                        <button
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          onClick={() => setSelectedAppointment(null)}
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Type de rendez-vous</p>
                          <p className="text-lg font-medium">{selectedAppointment.title}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Client</p>
                          <div className="mt-1 flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={selectedAppointment.clientAvatar}
                                alt={selectedAppointment.clientName}
                              />
                              <AvatarFallback>
                                {selectedAppointment.clientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-lg font-medium">{selectedAppointment.clientName}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date et heure</p>
                          <p className="text-lg">
                            {format(parseISO(selectedAppointment.start), "EEEE d MMMM yyyy", { locale: fr })}
                          </p>
                          <p className="text-lg">
                            {format(parseISO(selectedAppointment.start), "HH:mm")} -{" "}
                            {format(parseISO(selectedAppointment.end), "HH:mm")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Statut</p>
                          <Badge
                            variant="outline"
                            className={`mt-1 ${
                              selectedAppointment.status === "confirmed"
                                ? "bg-green-500"
                                : selectedAppointment.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            } text-white`}
                          >
                            {selectedAppointment.status === "confirmed"
                              ? "Confirmé"
                              : selectedAppointment.status === "pending"
                                ? "En attente"
                                : "Annulé"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setSelectedAppointment(null)}>
                            Fermer
                          </Button>
                          <Button className="flex-1">Modifier</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de nouveau rendez-vous */}
                {showNewAppointmentModal && selectedSlot && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 overflow-y-auto">
                    <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
                        <h3 className="text-base sm:text-lg font-medium">Nouveau rendez-vous</h3>
                        <button
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                          onClick={handleCloseNewAppointmentModal}
                        >
                          <X className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmitNewAppointment} className="p-4 sm:p-6">
                        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
                          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            <span className="text-sm sm:text-base font-medium">
                              {format(selectedSlot.date, "EEEE d MMMM yyyy", { locale: fr })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            <span className="text-sm sm:text-base font-medium">{selectedSlot.hour}</span>
                          </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                          <Label htmlFor="service-type" className="mb-1.5 sm:mb-2 block text-sm sm:text-base">
                            Type de service
                          </Label>
                          <Select value={selectedService} onValueChange={(value) => setSelectedService(value)}>
                            <SelectTrigger id="service-type" className="text-sm sm:text-base">
                              <SelectValue placeholder="Sélectionnez un service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id} className="text-sm sm:text-base">
                                  {service.name} ({service.duration} min)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedService && (
                            <div className="mt-1.5 sm:mt-2 space-y-1">
                              <p className="text-xs sm:text-sm text-gray-500">
                                {services.find((s) => s.id === selectedService)?.description}
                              </p>
                              <p className="text-xs sm:text-sm font-medium">
                                Durée: {services.find((s) => s.id === selectedService)?.duration} minutes
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Supprimer entièrement la section "Durée" du modal de nouveau rendez-vous */}

                        <div className="mb-4 sm:mb-6">
                          <Label className="mb-1.5 sm:mb-2 block text-sm sm:text-base">Ce rendez-vous est pour</Label>
                          <RadioGroup
                            value={appointmentType}
                            onValueChange={(value: "self" | "dependent") => setAppointmentType(value)}
                            className="space-y-1.5 sm:space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="self" id="self" />
                              <Label htmlFor="self" className="text-sm sm:text-base">
                                Moi-même
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="dependent" id="dependent" />
                              <Label htmlFor="dependent" className="text-sm sm:text-base">
                                Mon enfant ou une personne à charge
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Tabs
                          value={newAppointmentTab}
                          onValueChange={(value: "existing" | "new") => setNewAppointmentTab(value)}
                        >
                          <TabsList className="mb-4 w-full grid grid-cols-2">
                            <TabsTrigger value="existing" className="text-xs sm:text-sm">
                              Client existant
                            </TabsTrigger>
                            <TabsTrigger value="new" className="text-xs sm:text-sm">
                              Nouveau client
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="existing">
                            <div className="mb-4 sm:mb-6">
                              <Label className="mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Sélectionner un client
                              </Label>
                              <Popover open={openClientSearch} onOpenChange={setOpenClientSearch}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openClientSearch}
                                    className="w-full justify-between text-sm sm:text-base"
                                  >
                                    {selectedClient
                                      ? clients.find((client) => client.id === selectedClient)?.firstName +
                                        " " +
                                        clients.find((client) => client.id === selectedClient)?.lastName
                                      : "Rechercher un client..."}
                                    <Search className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandInput
                                      placeholder="Rechercher un client..."
                                      value={searchClient}
                                      onValueChange={setSearchClient}
                                      className="text-sm sm:text-base"
                                    />
                                    <CommandList>
                                      <CommandEmpty className="text-sm">Aucun client trouvé.</CommandEmpty>
                                      <CommandGroup>
                                        {filteredClients.map((client) => (
                                          <CommandItem
                                            key={client.id}
                                            value={client.id}
                                            onSelect={(value) => {
                                              setSelectedClient(value)
                                              setOpenClientSearch(false)
                                            }}
                                            className="text-sm sm:text-base"
                                          >
                                            <div className="flex items-center">
                                              <Avatar className="mr-2 h-5 w-5 sm:h-6 sm:w-6">
                                                <AvatarImage src={client.avatar} />
                                                <AvatarFallback>
                                                  {client.firstName[0]}
                                                  {client.lastName[0]}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span>
                                                {client.firstName} {client.lastName}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            {selectedClient && (
                              <div className="mb-4 sm:mb-6 rounded-lg border p-3 sm:p-4">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                                    <AvatarImage src={clients.find((c) => c.id === selectedClient)?.avatar} />
                                    <AvatarFallback>
                                      {clients.find((c) => c.id === selectedClient)?.firstName[0]}
                                      {clients.find((c) => c.id === selectedClient)?.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-sm sm:text-base">
                                      {clients.find((c) => c.id === selectedClient)?.firstName}{" "}
                                      {clients.find((c) => c.id === selectedClient)?.lastName}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {clients.find((c) => c.id === selectedClient)?.email}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {clients.find((c) => c.id === selectedClient)?.phone}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="new">
                            <div className="space-y-4 sm:space-y-6">
                              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="firstName" className="text-sm sm:text-base">
                                    Prénom
                                  </Label>
                                  <Input
                                    id="firstName"
                                    value={newClient.firstName}
                                    onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                                    required
                                    className="mt-1 text-sm sm:text-base"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="lastName" className="text-sm sm:text-base">
                                    Nom
                                  </Label>
                                  <Input
                                    id="lastName"
                                    value={newClient.lastName}
                                    onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                                    required
                                    className="mt-1 text-sm sm:text-base"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="email" className="text-sm sm:text-base">
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    required
                                    className="mt-1 text-sm sm:text-base"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="phone" className="text-sm sm:text-base">
                                    Téléphone
                                  </Label>
                                  <Input
                                    id="phone"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    required
                                    className="mt-1 text-sm sm:text-base"
                                  />
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">Adresse</h4>
                                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                  <div>
                                    <Label htmlFor="streetNumber" className="text-sm sm:text-base">
                                      Numéro
                                    </Label>
                                    <Input
                                      id="streetNumber"
                                      value={newClient.streetNumber}
                                      onChange={(e) => setNewClient({ ...newClient, streetNumber: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label htmlFor="street" className="text-sm sm:text-base">
                                      Nom de la rue
                                    </Label>
                                    <Input
                                      id="street"
                                      value={newClient.street}
                                      onChange={(e) => setNewClient({ ...newClient, street: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                                  <div>
                                    <Label htmlFor="unit" className="text-sm sm:text-base">
                                      Apt/Bureau
                                    </Label>
                                    <Input
                                      id="unit"
                                      value={newClient.unit}
                                      onChange={(e) => setNewClient({ ...newClient, unit: e.target.value })}
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <Label htmlFor="city" className="text-sm sm:text-base">
                                      Ville
                                    </Label>
                                    <Input
                                      id="city"
                                      value={newClient.city}
                                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
                                  <div>
                                    <Label htmlFor="province" className="text-sm sm:text-base">
                                      Province
                                    </Label>
                                    <Input
                                      id="province"
                                      value={newClient.province}
                                      onChange={(e) => setNewClient({ ...newClient, province: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="country" className="text-sm sm:text-base">
                                      Pays
                                    </Label>
                                    <Input
                                      id="country"
                                      value={newClient.country}
                                      onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="postalCode" className="text-sm sm:text-base">
                                      Code postal
                                    </Label>
                                    <Input
                                      id="postalCode"
                                      value={newClient.postalCode}
                                      onChange={(e) => setNewClient({ ...newClient, postalCode: e.target.value })}
                                      required
                                      className="mt-1 text-sm sm:text-base"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        {appointmentType === "dependent" && (
                          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6">
                            <h4 className="font-medium text-sm sm:text-base">Informations de la personne à charge</h4>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="dependentFirstName" className="text-sm sm:text-base">
                                  Prénom
                                </Label>
                                <Input
                                  id="dependentFirstName"
                                  value={dependent.firstName}
                                  onChange={(e) => setDependent({ ...dependent, firstName: e.target.value })}
                                  required
                                  className="mt-1 text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label htmlFor="dependentLastName" className="text-sm sm:text-base">
                                  Nom
                                </Label>
                                <Input
                                  id="dependentLastName"
                                  value={dependent.lastName}
                                  onChange={(e) => setDependent({ ...dependent, lastName: e.target.value })}
                                  required
                                  className="mt-1 text-sm sm:text-base"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="birthDate" className="text-sm sm:text-base">
                                  Date de naissance
                                </Label>
                                <Input
                                  id="birthDate"
                                  placeholder="01-01-2000"
                                  value={dependent.birthDate}
                                  onChange={(e) => setDependent({ ...dependent, birthDate: e.target.value })}
                                  required
                                  className="mt-1 text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <Label className="mb-1 sm:mb-2 block text-sm sm:text-base">Sexe</Label>
                                <RadioGroup
                                  value={dependent.gender}
                                  onValueChange={(value: "male" | "female" | "other") =>
                                    setDependent({ ...dependent, gender: value })
                                  }
                                  className="flex flex-wrap gap-x-3 sm:gap-x-4"
                                >
                                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male" className="text-sm sm:text-base">
                                      Masculin
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female" className="text-sm sm:text-base">
                                      Féminin
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other" className="text-sm sm:text-base">
                                      Autre
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseNewAppointmentModal}
                            className="w-full sm:w-auto text-sm sm:text-base"
                          >
                            Annuler
                          </Button>
                          <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base">
                            Enregistrer le rendez-vous
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

