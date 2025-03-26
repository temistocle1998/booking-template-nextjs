"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Search, ChevronLeft, ChevronRight, Filter, Star } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Types
type Professional = {
  id: string
  name: string
  firstName: string
  fullName: string
  profession: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  avatar?: string
  rating: number
  reviewCount: number
  clientTypes: string[]
  specialties: string[]
  services: Service[]
  availability: Availability[]
}

type Service = {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

type Availability = {
  dayOfWeek: number // 0 = dimanche, 1 = lundi, etc.
  startTime: string // format "HH:MM"
  endTime: string // format "HH:MM"
  interval: number // en minutes
}

type TimeSlot = {
  time: string
  available: boolean
}

// Type pour stocker les sélections de services par professionnel
type ServiceSelections = {
  [professionalId: string]: string // professionalId -> serviceId
}

export default function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // États pour la recherche
  const [address, setAddress] = useState(searchParams.get("address") || "")
  const [service, setService] = useState(searchParams.get("service") || "")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedServices, setSelectedServices] = useState<ServiceSelections>({})
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [distanceFilter, setDistanceFilter] = useState<string>("10")
  const [ratingFilter, setRatingFilter] = useState<string | null>(null)
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null)

  // États pour le modal de prise de rendez-vous
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState<{
    professionalId: string
    serviceId: string
    date: Date
    time: string
  } | null>(null)

  // Calculer les dates de début et de fin de la semaine
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Commence le lundi
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }) // Finit le dimanche

  // Générer un tableau des jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Navigation entre les semaines
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))

  // Données simulées pour les services
  const availableServices: Service[] = [
    { id: "massage-der", name: "Massage décontractant", duration: 25, price: 35 },
    { id: "massage-swe", name: "Massage suédois", duration: 60, price: 75 },
    { id: "massage-the", name: "Massage thérapeutique", duration: 45, price: 65 },
    { id: "osteo", name: "Ostéopathie", duration: 60, price: 90 },
    { id: "physio", name: "Physiothérapie", duration: 45, price: 70 },
    { id: "chiro", name: "Chiropratique", duration: 30, price: 60 },
    { id: "acupuncture", name: "Acupuncture", duration: 45, price: 65 },
    { id: "reflexo", name: "Réflexologie", duration: 30, price: 50 },
  ]

  // Données simulées pour les spécialités
  const specialties = [
    "Douleurs chroniques",
    "Rééducation sportive",
    "Stress et anxiété",
    "Problèmes posturaux",
    "Troubles du sommeil",
    "Migraines et céphalées",
    "Abus sexuel",
    "Automutilation",
    "Consommation d'alcool",
  ]

  // Données simulées pour les professionnels
  const professionals: Professional[] = [
    {
      id: "1",
      name: "Bèye",
      firstName: "Mamadou",
      fullName: "Mamadou Bèye",
      profession: "Massothérapeute",
      address: {
        street: "123 Rue Principale",
        city: "Thies",
        postalCode: "70000",
        country: "Sénégal",
      },
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.8,
      reviewCount: 124,
      clientTypes: ["Hommes", "Enfants", "Adolescents"],
      specialties: ["Abus sexuel", "Automutilation", "Consommation d'alcool"],
      services: [
        { id: "massage-der", name: "Massage décontractant", duration: 25, price: 35 },
        { id: "massage-swe", name: "Massage suédois", duration: 60, price: 75 },
      ],
      availability: [
        // Lundi
        { dayOfWeek: 1, startTime: "09:00", endTime: "13:00", interval: 25 },
        { dayOfWeek: 1, startTime: "13:00", endTime: "14:00", interval: 25 },
        // Mardi
        { dayOfWeek: 2, startTime: "09:00", endTime: "14:00", interval: 25 },
        // Mercredi
        { dayOfWeek: 3, startTime: "09:00", endTime: "12:00", interval: 25 },
        // Jeudi
        { dayOfWeek: 4, startTime: "09:00", endTime: "14:00", interval: 25 },
        // Vendredi
        { dayOfWeek: 5, startTime: "09:00", endTime: "14:00", interval: 25 },
        // Samedi
        { dayOfWeek: 6, startTime: "09:00", endTime: "12:00", interval: 25 },
        // Dimanche
        { dayOfWeek: 0, startTime: "09:00", endTime: "12:00", interval: 25 },
      ],
    },
    {
      id: "2",
      name: "Diallo",
      firstName: "Fatou",
      fullName: "Fatou Diallo",
      profession: "Ostéopathe",
      address: {
        street: "45 Avenue de la Liberté",
        city: "Dakar",
        postalCode: "10000",
        country: "Sénégal",
      },
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.9,
      reviewCount: 87,
      clientTypes: ["Femmes", "Personnes âgées"],
      specialties: ["Douleurs chroniques", "Problèmes posturaux", "Migraines et céphalées"],
      services: [
        { id: "osteo", name: "Ostéopathie", duration: 60, price: 90 },
        { id: "massage-the", name: "Massage thérapeutique", duration: 45, price: 65 },
      ],
      availability: [
        // Lundi
        { dayOfWeek: 1, startTime: "10:00", endTime: "16:00", interval: 30 },
        // Mardi
        { dayOfWeek: 2, startTime: "10:00", endTime: "16:00", interval: 30 },
        // Mercredi
        { dayOfWeek: 3, startTime: "10:00", endTime: "16:00", interval: 30 },
        // Jeudi
        { dayOfWeek: 4, startTime: "10:00", endTime: "16:00", interval: 30 },
        // Vendredi
        { dayOfWeek: 5, startTime: "10:00", endTime: "16:00", interval: 30 },
      ],
    },
    {
      id: "3",
      name: "Ndiaye",
      firstName: "Abdou",
      fullName: "Abdou Ndiaye",
      profession: "Physiothérapeute",
      address: {
        street: "78 Rue des Palmiers",
        city: "Saint-Louis",
        postalCode: "30000",
        country: "Sénégal",
      },
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.7,
      reviewCount: 56,
      clientTypes: ["Sportifs", "Adultes"],
      specialties: ["Rééducation sportive", "Douleurs chroniques"],
      services: [
        { id: "physio", name: "Physiothérapie", duration: 45, price: 70 },
        { id: "massage-the", name: "Massage thérapeutique", duration: 45, price: 65 },
      ],
      availability: [
        // Lundi
        { dayOfWeek: 1, startTime: "08:00", endTime: "18:00", interval: 45 },
        // Mardi
        { dayOfWeek: 2, startTime: "08:00", endTime: "18:00", interval: 45 },
        // Mercredi
        { dayOfWeek: 3, startTime: "08:00", endTime: "18:00", interval: 45 },
        // Jeudi
        { dayOfWeek: 4, startTime: "08:00", endTime: "18:00", interval: 45 },
        // Vendredi
        { dayOfWeek: 5, startTime: "08:00", endTime: "18:00", interval: 45 },
      ],
    },
    {
      id: "4",
      name: "Sow",
      firstName: "Aminata",
      fullName: "Aminata Sow",
      profession: "Acupunctrice",
      address: {
        street: "12 Boulevard de l'Indépendance",
        city: "Thies",
        postalCode: "70000",
        country: "Sénégal",
      },
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.6,
      reviewCount: 42,
      clientTypes: ["Adultes", "Personnes âgées"],
      specialties: ["Stress et anxiété", "Troubles du sommeil", "Migraines et céphalées"],
      services: [
        { id: "acupuncture", name: "Acupuncture", duration: 45, price: 65 },
        { id: "reflexo", name: "Réflexologie", duration: 30, price: 50 },
      ],
      availability: [
        // Lundi
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", interval: 45 },
        // Mercredi
        { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", interval: 45 },
        // Vendredi
        { dayOfWeek: 5, startTime: "09:00", endTime: "17:00", interval: 45 },
      ],
    },
    {
      id: "5",
      name: "Mbaye",
      firstName: "Omar",
      fullName: "Omar Mbaye",
      profession: "Chiropraticien",
      address: {
        street: "34 Rue du Marché",
        city: "Thies",
        postalCode: "70000",
        country: "Sénégal",
      },
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4.5,
      reviewCount: 38,
      clientTypes: ["Adultes", "Sportifs"],
      specialties: ["Problèmes posturaux", "Douleurs chroniques"],
      services: [
        { id: "chiro", name: "Chiropratique", duration: 30, price: 60 },
        { id: "massage-the", name: "Massage thérapeutique", duration: 45, price: 65 },
      ],
      availability: [
        // Mardi
        { dayOfWeek: 2, startTime: "08:00", endTime: "16:00", interval: 30 },
        // Jeudi
        { dayOfWeek: 4, startTime: "08:00", endTime: "16:00", interval: 30 },
        // Samedi
        { dayOfWeek: 6, startTime: "09:00", endTime: "13:00", interval: 30 },
      ],
    },
  ]

  // Schémas de validation pour les formulaires
  const clientTypeSchema = z.object({
    clientType: z.enum(["new", "existing"], {
      required_error: "Veuillez sélectionner un type de client",
    }),
  })

  const personalInfoSchema = z.object({
    firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    phone: z.string().min(10, { message: "Veuillez entrer un numéro de téléphone valide" }),
    appointmentFor: z.enum(["self", "other"], {
      required_error: "Veuillez sélectionner pour qui est le rendez-vous",
    }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })

  const addressSchema = z.object({
    streetNumber: z.string().min(1, { message: "Le numéro civique est requis" }),
    streetName: z.string().min(2, { message: "Le nom de la rue est requis" }),
    apartment: z.string().optional(),
    city: z.string().min(2, { message: "La ville est requise" }),
    province: z.string().min(2, { message: "La province est requise" }),
    country: z.string().min(2, { message: "Le pays est requis" }),
    postalCode: z.string().min(5, { message: "Le code postal est requis" }),
  })

  const dischargeSchema = z.object({
    dischargeAccepted: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter la décharge",
    }),
  })

  type ClientTypeFormValues = z.infer<typeof clientTypeSchema>
  type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>
  type AddressFormValues = z.infer<typeof addressSchema>
  type DischargeFormValues = z.infer<typeof dischargeSchema>

  // Formulaires
  const clientTypeForm = useForm<ClientTypeFormValues>({
    resolver: zodResolver(clientTypeSchema),
    defaultValues: {
      clientType: "new",
    },
  })

  const personalInfoForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      appointmentFor: "self",
      termsAccepted: false,
    },
  })

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetNumber: "",
      streetName: "",
      apartment: "",
      city: "",
      province: "",
      country: "Sénégal",
      postalCode: "",
    },
  })

  const dischargeForm = useForm<DischargeFormValues>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      dischargeAccepted: false,
    },
  })

  // Gestionnaires de soumission des formulaires
  const onClientTypeSubmit = (data: ClientTypeFormValues) => {
    console.log("Type de client:", data)
    setBookingStep(2)
  }

  const onPersonalInfoSubmit = (data: PersonalInfoFormValues) => {
    console.log("Informations personnelles:", data)
    setBookingStep(3)
  }

  const onAddressSubmit = (data: AddressFormValues) => {
    console.log("Adresse:", data)
    setBookingStep(4)
  }

  const onDischargeSubmit = (data: DischargeFormValues) => {
    console.log("Décharge acceptée:", data)

    // Ici, vous pourriez envoyer toutes les données au serveur
    const bookingData = {
      professional: selectedSlot?.professionalId,
      service: selectedSlot?.serviceId,
      date: selectedSlot?.date ? format(selectedSlot.date, "yyyy-MM-dd") : "",
      time: selectedSlot?.time,
      clientType: clientTypeForm.getValues(),
      personalInfo: personalInfoForm.getValues(),
      address: addressForm.getValues(),
      discharge: dischargeForm.getValues(),
    }

    console.log("Données de réservation complètes:", bookingData)

    // Passer à l'étape de confirmation au lieu de fermer le modal
    setBookingStep(5)
  }

  const finalizeBooking = () => {
    // Fermer le modal et réinitialiser les étapes
    setModalOpen(false)
    setBookingStep(1)

    // Réinitialiser les formulaires
    clientTypeForm.reset()
    personalInfoForm.reset()
    addressForm.reset()
    dischargeForm.reset()
  }

  // Fonction pour ouvrir le modal de réservation
  const openBookingModal = (professionalId: string, serviceId: string, date: Date, time: string) => {
    setSelectedSlot({
      professionalId,
      serviceId,
      date,
      time,
    })
    setModalOpen(true)
    setBookingStep(1)
  }

  // Filtrer les professionnels en fonction des critères de recherche
  const filteredProfessionals = professionals.filter((pro) => {
    // Filtre par adresse
    const addressMatch =
      !address ||
      pro.address.city.toLowerCase().includes(address.toLowerCase()) ||
      pro.address.street.toLowerCase().includes(address.toLowerCase())

    // Filtre par service
    const serviceMatch =
      !service ||
      pro.services.some(
        (s) =>
          s.name.toLowerCase().includes(service.toLowerCase()) || s.id.toLowerCase().includes(service.toLowerCase()),
      )

    // Filtre par note
    const ratingMatch = !ratingFilter || pro.rating >= Number.parseFloat(ratingFilter)

    // Filtre par spécialité
    const specialtyMatch =
      !specialtyFilter || pro.specialties.some((s) => s.toLowerCase() === specialtyFilter.toLowerCase())

    return addressMatch && serviceMatch && ratingMatch && specialtyMatch
  })

  // Pagination
  const itemsPerPage = 3
  const totalPages = Math.ceil(filteredProfessionals.length / itemsPerPage)
  const paginatedProfessionals = filteredProfessionals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  // Présélectionner le premier service pour chaque professionnel
  useEffect(() => {
    const newSelections: ServiceSelections = {}

    paginatedProfessionals.forEach((pro) => {
      if (pro.services.length > 0 && !selectedServices[pro.id]) {
        newSelections[pro.id] = pro.services[0].id
      }
    })

    if (Object.keys(newSelections).length > 0) {
      setSelectedServices((prev) => ({ ...prev, ...newSelections }))
    }
  }, [paginatedProfessionals])

  // Générer les créneaux horaires pour un professionnel et un jour donnés
  const generateTimeSlots = (professional: Professional, day: Date): TimeSlot[] => {
    const dayOfWeek = day.getDay() // 0 = dimanche, 1 = lundi, etc.

    // Trouver les disponibilités pour ce jour
    const dayAvailability = professional.availability.filter((a) => a.dayOfWeek === dayOfWeek)

    if (dayAvailability.length === 0) {
      return []
    }

    const slots: TimeSlot[] = []

    // Pour chaque plage de disponibilité ce jour-là
    dayAvailability.forEach((availability) => {
      const [startHour, startMinute] = availability.startTime.split(":").map(Number)
      const [endHour, endMinute] = availability.endTime.split(":").map(Number)

      let currentHour = startHour
      let currentMinute = startMinute

      // Générer des créneaux jusqu'à l'heure de fin
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`
        slots.push({
          time: timeString,
          available: true, // On pourrait vérifier ici si le créneau est déjà réservé
        })

        // Avancer au prochain créneau
        currentMinute += availability.interval
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60)
          currentMinute = currentMinute % 60
        }
      }
    })

    return slots
  }

  // Effectuer la recherche
  const handleSearch = () => {
    // Mise à jour de l'URL avec les paramètres de recherche
    const params = new URLSearchParams()
    if (address) params.set("address", address)
    if (service) params.set("service", service)

    router.push(`/recherche-professionnels?${params.toString()}`)

    // Réinitialiser la pagination
    setCurrentPage(1)
  }

  // Sélectionner un service pour un professionnel
  const handleSelectService = (proId: string, serviceId: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [proId]: serviceId,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recherche de professionnels</h1>
              <p className="text-gray-500">Trouvez un professionnel près de chez vous et prenez rendez-vous</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="outline">
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de recherche */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Adresse, ville ou code postal"
                  className="pl-10"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Service recherché (ex: massage, ostéopathie...)"
                  className="pl-10"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                Rechercher
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setFiltersOpen(!filtersOpen)}>
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Filtres avancés */}
          {filtersOpen && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="20">20 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note minimale</label>
                  <Select value={ratingFilter || "0"} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les notes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Toutes les notes</SelectItem>
                      <SelectItem value="4.5">4.5 et plus</SelectItem>
                      <SelectItem value="4">4 et plus</SelectItem>
                      <SelectItem value="3.5">3.5 et plus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <Select value={specialtyFilter || "all"} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les spécialités" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les spécialités</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDistanceFilter("10")
                    setRatingFilter(null)
                    setSpecialtyFilter(null)
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Résultats de recherche */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {filteredProfessionals.length} professionnel(s) trouvé(s)
            {address && ` près de "${address}"`}
            {service && ` pour "${service}"`}
          </h2>
          {filteredProfessionals.length > 0 && (
            <p className="text-gray-500">
              Les disponibilités sont affichées pour le premier service de chaque professionnel
            </p>
          )}
        </div>

        {/* Liste des professionnels */}
        {paginatedProfessionals.length > 0 ? (
          <div className="space-y-6">
            {paginatedProfessionals.map((professional) => (
              <Card key={professional.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Informations du professionnel */}
                    <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={professional.avatar} alt={professional.fullName} />
                          <AvatarFallback>
                            {professional.firstName[0]}
                            {professional.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold">{professional.fullName}</h3>
                          <p className="text-gray-500">{professional.profession}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{professional.address.city}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{professional.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({professional.reviewCount} avis)</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Clientèles :</p>
                          <p className="text-sm text-gray-600">{professional.clientTypes.join(", ")}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-blue-600">Traite :</p>
                          <p className="text-sm text-gray-600">{professional.specialties.join(", ")}</p>
                        </div>

                        <Button variant="outline" className="w-full mt-2" asChild>
                          <Link href={`/profil-professionnel/${professional.id}`}>Voir le profil</Link>
                        </Button>
                      </div>
                    </div>

                    {/* Services et disponibilités */}
                    <div className="lg:w-2/3">
                      {/* Sélection du service */}
                      <div className="p-4 bg-gray-50 border-b">
                        <Select
                          value={selectedServices[professional.id] || professional.services[0]?.id || ""}
                          onValueChange={(value) => handleSelectService(professional.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionnez un service" />
                          </SelectTrigger>
                          <SelectContent>
                            {professional.services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - {service.duration}mn ({service.price}€)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Calendrier des disponibilités */}
                      {selectedServices[professional.id] && (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-center">
                              <span className="font-medium">
                                {format(weekStart, "d MMMM", { locale: fr })} -{" "}
                                {format(weekEnd, "d MMMM yyyy", { locale: fr })}
                              </span>
                            </div>
                            <Button variant="outline" size="icon" onClick={goToNextWeek}>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Vue mobile - Sélecteur de jour */}
                          <div className="md:hidden mb-4">
                            <Select
                              value={selectedDayIndex?.toString() || "0"}
                              onValueChange={(value) => setSelectedDayIndex(Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionnez un jour" />
                              </SelectTrigger>
                              <SelectContent>
                                {weekDays.map((day, index) => (
                                  <SelectItem key={index} value={index.toString()}>
                                    {format(day, "EEEE d MMMM", { locale: fr })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Vue desktop - Grille des jours et créneaux */}
                          <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-[700px]">
                              {/* En-têtes des jours */}
                              <div className="grid grid-cols-7 gap-1 mb-1">
                                {weekDays.map((day, index) => (
                                  <div
                                    key={index}
                                    className={`text-center p-2 ${
                                      isToday(day) ? "bg-primary/10 text-primary font-medium rounded" : ""
                                    }`}
                                  >
                                    <div className="font-medium">{format(day, "EEEE", { locale: fr })}</div>
                                    <div className="text-sm">{format(day, "d MMM", { locale: fr })}</div>
                                  </div>
                                ))}
                              </div>

                              {/* Créneaux horaires - Vue desktop */}
                              <div className="grid grid-cols-7 gap-1">
                                {weekDays.map((day, dayIndex) => {
                                  const timeSlots = generateTimeSlots(professional, day)

                                  return (
                                    <div key={dayIndex} className="bg-blue-50 rounded p-1">
                                      {timeSlots.length > 0 ? (
                                        <div className="space-y-1">
                                          {timeSlots.map((slot, slotIndex) => (
                                            <Button
                                              key={slotIndex}
                                              variant="ghost"
                                              size="sm"
                                              className={`w-full text-center py-1 text-sm ${
                                                slot.available
                                                  ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                              }`}
                                              disabled={!slot.available}
                                              onClick={() => {
                                                if (slot.available) {
                                                  openBookingModal(
                                                    professional.id,
                                                    selectedServices[professional.id],
                                                    day,
                                                    slot.time,
                                                  )
                                                }
                                              }}
                                            >
                                              {slot.time}
                                            </Button>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="h-full flex items-center justify-center p-4">
                                          <p className="text-sm text-gray-500">Indisponible</p>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Vue mobile - Créneaux pour le jour sélectionné */}
                          <div className="md:hidden">
                            {selectedDayIndex !== null && (
                              <div className="bg-blue-50 rounded p-2">
                                <h4 className="font-medium text-center mb-2">
                                  {format(weekDays[selectedDayIndex], "EEEE d MMMM", { locale: fr })}
                                </h4>

                                {(() => {
                                  const timeSlots = generateTimeSlots(professional, weekDays[selectedDayIndex])

                                  if (timeSlots.length > 0) {
                                    return (
                                      <div className="grid grid-cols-2 gap-2">
                                        {timeSlots.map((slot, slotIndex) => (
                                          <Button
                                            key={slotIndex}
                                            variant="ghost"
                                            size="sm"
                                            className={`text-center py-1 text-sm ${
                                              slot.available
                                                ? "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            disabled={!slot.available}
                                            onClick={() => {
                                              if (slot.available) {
                                                openBookingModal(
                                                  professional.id,
                                                  selectedServices[professional.id],
                                                  weekDays[selectedDayIndex],
                                                  slot.time,
                                                )
                                              }
                                            }}
                                          >
                                            {slot.time}
                                          </Button>
                                        ))}
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <div className="flex items-center justify-center p-4">
                                        <p className="text-sm text-gray-500">Indisponible</p>
                                      </div>
                                    )
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1
                    // Afficher seulement les pages proches de la page actuelle
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentPage(page)
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }

                    // Ajouter des ellipses pour les pages non affichées
                    if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Aucun professionnel trouvé</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou d'élargir votre zone géographique.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setAddress("")
                setService("")
                setRatingFilter(null)
                setSpecialtyFilter(null)
                setDistanceFilter("10")
                handleSearch()
              }}
            >
              Réinitialiser la recherche
            </Button>
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">© 2025 Gobering. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Conditions générales
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de prise de rendez-vous */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 && "Êtes-vous un nouveau client ?"}
              {bookingStep === 2 && "Vos informations personnelles"}
              {bookingStep === 3 && "Votre adresse"}
              {bookingStep === 4 && "Acceptation de la décharge"}
              {bookingStep === 5 && "Confirmation de rendez-vous"}
            </DialogTitle>
            <DialogDescription>
              {bookingStep === 1 && "Veuillez nous indiquer si vous êtes déjà client chez nous."}
              {bookingStep === 2 && "Veuillez remplir vos informations personnelles."}
              {bookingStep === 3 && "Veuillez remplir votre adresse."}
              {bookingStep === 4 && "Veuillez lire et accepter la décharge."}
              {bookingStep === 5 && "Un email de confirmation vous a été envoyé."}
            </DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <p className="font-medium text-blue-800">Détails du rendez-vous :</p>
              <p className="text-sm text-blue-700">
                {professionals.find((p) => p.id === selectedSlot.professionalId)?.fullName} -{" "}
                {
                  professionals
                    .find((p) => p.id === selectedSlot.professionalId)
                    ?.services.find((s) => s.id === selectedSlot.serviceId)?.name
                }
              </p>
              <p className="text-sm text-blue-700">
                {format(selectedSlot.date, "EEEE d MMMM yyyy", { locale: fr })} à {selectedSlot.time}
              </p>
            </div>
          )}

          {bookingStep === 1 && (
            <Form {...clientTypeForm}>
              <form onSubmit={clientTypeForm.handleSubmit(onClientTypeSubmit)} className="space-y-6">
                <FormField
                  control={clientTypeForm.control}
                  name="clientType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="new" />
                            </FormControl>
                            <FormLabel className="font-normal">Je suis un nouveau client</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="existing" />
                            </FormControl>
                            <FormLabel className="font-normal">Je suis un client existant</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Continuer</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {bookingStep === 2 && (
            <Form {...personalInfoForm}>
              <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={personalInfoForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={personalInfoForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalInfoForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Téléphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalInfoForm.control}
                  name="appointmentFor"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Le rendez-vous est :</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="self" />
                            </FormControl>
                            <FormLabel className="font-normal">Pour moi-même</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Pour mon enfant ou une personne à charge</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalInfoForm.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          En complétant votre réservation, vous acceptez les conditions d'utilisation et l'avis de
                          confidentialité
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setBookingStep(1)}>
                    Retour
                  </Button>
                  <Button type="submit">Suivant</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {bookingStep === 3 && (
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="streetNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro civique</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="streetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la rue</FormLabel>
                        <FormControl>
                          <Input placeholder="Rue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={addressForm.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appartement (optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Appartement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addressForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={addressForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="Pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setBookingStep(2)}>
                    Retour
                  </Button>
                  <Button type="submit">Continuer</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {bookingStep === 4 && (
            <Form {...dischargeForm}>
              <form onSubmit={dischargeForm.handleSubmit(onDischargeSubmit)} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md max-h-[200px] overflow-y-auto">
                  <p className="text-sm text-gray-700">
                    Je comprends et j'accepte que les services fournis par le professionnel sont de nature thérapeutique
                    et ne remplacent pas les soins médicaux. Je déclare avoir divulgué toutes les informations
                    pertinentes concernant ma santé et m'engage à informer le professionnel de tout changement. Je
                    dégage le professionnel de toute responsabilité en cas de réaction indésirable ou de complication
                    liée au traitement.
                  </p>
                </div>
                <FormField
                  control={dischargeForm.control}
                  name="dischargeAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>J'accepte les termes de la décharge ci-dessus</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setBookingStep(3)}>
                    Retour
                  </Button>
                  <Button type="submit">Continuer</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {bookingStep === 5 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-green-800 font-medium mb-2">
                  Un mail vous a été envoyé pour confirmer votre demande de rendez-vous.
                </p>
                <p className="text-green-700 text-sm">Vous avez 15 minutes pour confirmer</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Date :</span>
                  <span>{selectedSlot?.date ? format(selectedSlot.date, "yyyy-MM-dd") : ""}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Heure :</span>
                  <span>{selectedSlot?.time}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Service :</span>
                  <span>
                    {selectedSlot?.serviceId &&
                      professionals
                        .find((p) => p.id === selectedSlot.professionalId)
                        ?.services.find((s) => s.id === selectedSlot.serviceId)?.name}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Prix :</span>
                  <span>
                    {selectedSlot?.serviceId &&
                      `${professionals.find((p) => p.id === selectedSlot.professionalId)?.services.find((s) => s.id === selectedSlot.serviceId)?.price} €`}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Avec :</span>
                  <span>{professionals.find((p) => p.id === selectedSlot?.professionalId)?.fullName}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Pour :</span>
                  <span>{`${personalInfoForm.getValues().firstName} ${personalInfoForm.getValues().lastName}`}</span>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={finalizeBooking}>Fermer</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

