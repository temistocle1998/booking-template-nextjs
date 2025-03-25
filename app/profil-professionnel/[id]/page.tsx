"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react"

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
  contact: {
    phone: string
    email: string
    website?: string
  }
  avatar: string
  coverImage?: string
  rating: number
  reviewCount: number
  clientTypes: string[]
  specialties: string[]
  services: Service[]
  availability: Availability[]
  bio: string
  experience: number
  education: Education[]
  certifications: string[]
  languages: string[]
  reviews: Review[]
  faq: FAQ[]
  locations: {
    id: string
    name: string
    address: string
    isMain: boolean
  }[]
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

type Education = {
  degree: string
  institution: string
  year: number
}

type Review = {
  id: string
  author: string
  avatar?: string
  rating: number
  date: string
  comment: string
}

type FAQ = {
  question: string
  answer: string
}

type TimeSlot = {
  time: string
  available: boolean
}

// Schémas de validation pour les formulaires
const clientTypeSchema = z.object({
  clientType: z.enum(["new", "existing"], {
    required_error: "Veuillez sélectionner un type de client",
  }),
})

// Ajouter un nouveau schéma de validation pour le lieu de rendez-vous après le schéma clientTypeSchema
const locationSchema = z.object({
  locationType: z.enum(["professional", "client", "video"], {
    required_error: "Veuillez sélectionner un lieu pour le rendez-vous",
  }),
  locationNote: z.string().optional(),
})

const personalInfoSchema = z
  .object({
    firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
    phone: z.string().min(10, { message: "Veuillez entrer un numéro de téléphone valide" }),
    appointmentFor: z.enum(["self", "other"], {
      required_error: "Veuillez sélectionner pour qui est le rendez-vous",
    }),
    // Champs conditionnels pour le dépendant
    dependentFirstName: z
      .string()
      .min(2, { message: "Le prénom doit contenir au moins 2 caractères" })
      .optional()
      .refine((val) => val === undefined || val.length >= 2, {
        message: "Le prénom doit contenir au moins 2 caractères",
      }),
    dependentLastName: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
      .optional()
      .refine((val) => val === undefined || val.length >= 2, {
        message: "Le prénom doit contenir au moins 2 caractères",
      }),
    dependentBirthDate: z
      .string()
      .optional()
      .refine((val) => val === undefined || val.length > 0, {
        message: "La date de naissance est requise",
      }),
    dependentGender: z.enum(["male", "female", "other"]).optional(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine(
    (data) => {
      // Si le rendez-vous est pour un dépendant, les champs du dépendant sont obligatoires
      if (data.appointmentFor === "other") {
        return (
          !!data.dependentFirstName && !!data.dependentLastName && !!data.dependentBirthDate && !!data.dependentGender
        )
      }
      return true
    },
    {
      message: "Veuillez remplir tous les champs du dépendant",
      path: ["dependentFirstName"], // Le message s'affichera sous ce champ
    },
  )

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
// Ajouter le type pour les valeurs du formulaire de lieu
type LocationFormValues = z.infer<typeof locationSchema>
type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>
type AddressFormValues = z.infer<typeof addressSchema>
type DischargeFormValues = z.infer<typeof dischargeSchema>

// Données simulées pour un professionnel
const professionalData: Professional = {
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
  contact: {
    phone: "+221 77 123 45 67",
    email: "mamadou.beye@example.com",
    website: "www.mamadoubeye-massage.sn",
  },
  avatar: "/placeholder.svg?height=200&width=200",
  coverImage: "/placeholder.svg?height=400&width=1200",
  rating: 4.8,
  reviewCount: 124,
  clientTypes: ["Hommes", "Femmes", "Enfants", "Adolescents", "Personnes âgées"],
  specialties: [
    "Massage thérapeutique",
    "Massage sportif",
    "Massage relaxant",
    "Massage aux pierres chaudes",
    "Réflexologie",
  ],
  services: [
    {
      id: "massage-der",
      name: "Massage décontractant",
      duration: 25,
      price: 35,
      description: "Un massage rapide pour soulager les tensions musculaires et favoriser la détente.",
    },
    {
      id: "massage-swe",
      name: "Massage suédois",
      duration: 60,
      price: 75,
      description:
        "Technique de massage complète qui vise à dissoudre les tensions et à raffermir les muscles et les articulations.",
    },
    {
      id: "massage-the",
      name: "Massage thérapeutique",
      duration: 45,
      price: 65,
      description: "Massage ciblé pour traiter des problèmes spécifiques comme les douleurs chroniques.",
    },
    {
      id: "massage-pie",
      name: "Massage aux pierres chaudes",
      duration: 75,
      price: 90,
      description:
        "Utilisation de pierres volcaniques chaudes pour détendre les muscles en profondeur et favoriser la circulation.",
    },
    {
      id: "reflexo",
      name: "Réflexologie plantaire",
      duration: 30,
      price: 45,
      description: "Stimulation des points réflexes des pieds pour rééquilibrer l'énergie du corps.",
    },
  ],
  availability: [
    // Lundi
    { dayOfWeek: 1, startTime: "09:00", endTime: "13:00", interval: 25 },
    { dayOfWeek: 1, startTime: "14:00", endTime: "18:00", interval: 25 },
    // Mardi
    { dayOfWeek: 2, startTime: "09:00", endTime: "13:00", interval: 25 },
    { dayOfWeek: 2, startTime: "14:00", endTime: "18:00", interval: 25 },
    // Mercredi
    { dayOfWeek: 3, startTime: "09:00", endTime: "13:00", interval: 25 },
    { dayOfWeek: 3, startTime: "14:00", endTime: "18:00", interval: 25 },
    // Jeudi
    { dayOfWeek: 4, startTime: "09:00", endTime: "13:00", interval: 25 },
    { dayOfWeek: 4, startTime: "14:00", endTime: "18:00", interval: 25 },
    // Vendredi
    { dayOfWeek: 5, startTime: "09:00", endTime: "13:00", interval: 25 },
    { dayOfWeek: 5, startTime: "14:00", endTime: "17:00", interval: 25 },
    // Samedi
    { dayOfWeek: 6, startTime: "10:00", endTime: "15:00", interval: 25 },
  ],
  bio: "Massothérapeute certifié avec plus de 10 ans d'expérience, je me spécialise dans diverses techniques de massage thérapeutique et relaxant. Mon approche est personnalisée pour répondre aux besoins spécifiques de chaque client, qu'il s'agisse de soulager des douleurs chroniques, de réduire le stress ou simplement de se détendre. Je suis passionné par mon métier et je m'engage à offrir un service de qualité dans un environnement calme et apaisant.",
  experience: 10,
  education: [
    {
      degree: "Diplôme en Massothérapie",
      institution: "École de Massage de Dakar",
      year: 2013,
    },
    {
      degree: "Certification en Réflexologie",
      institution: "Institut International de Réflexologie",
      year: 2015,
    },
    {
      degree: "Formation en Massage aux Pierres Chaudes",
      institution: "Centre de Formation en Bien-être",
      year: 2017,
    },
  ],
  certifications: [
    "Certification en Massage Suédois",
    "Certification en Massage Thérapeutique",
    "Certification en Réflexologie Plantaire",
    "Certification en Massage aux Pierres Chaudes",
  ],
  languages: ["Français", "Wolof", "Anglais"],
  reviews: [
    {
      id: "1",
      author: "Sophie Martin",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2025-02-15",
      comment:
        "Excellent massage thérapeutique ! Mamadou a su cibler exactement les zones douloureuses et m'a donné de bons conseils pour éviter les tensions à l'avenir. Je recommande vivement.",
    },
    {
      id: "2",
      author: "Thomas Dubois",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2025-01-28",
      comment:
        "J'ai essayé le massage aux pierres chaudes et c'était une expérience incroyable. L'ambiance était parfaite et je me suis senti complètement détendu. Mamadou est très professionnel et attentif.",
    },
    {
      id: "3",
      author: "Emma Petit",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "2025-01-10",
      comment:
        "Très bon massage suédois. Le cadre est agréable et Mamadou est à l'écoute des besoins. J'aurais aimé un peu plus de pression sur certaines zones, mais dans l'ensemble c'était très bien.",
    },
    {
      id: "4",
      author: "Lucas Bernard",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-12-05",
      comment:
        "Je souffrais de douleurs chroniques au dos depuis des années et après quelques séances avec Mamadou, je ressens déjà une nette amélioration. Sa technique est précise et efficace.",
    },
    {
      id: "5",
      author: "Camille Roux",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-11-20",
      comment:
        "La réflexologie plantaire proposée par Mamadou est exceptionnelle. J'ai senti un regain d'énergie immédiat et une amélioration de mon sommeil. Je reviendrai régulièrement !",
    },
  ],
  locations: [
    {
      id: "cabinet-1",
      name: "Cabinet principal",
      address: "123 Rue Principale, Thies, 70000, Sénégal",
      isMain: true,
    },
    {
      id: "cabinet-2",
      name: "Cabinet secondaire",
      address: "45 Avenue de la Liberté, Dakar, 10000, Sénégal",
      isMain: false,
    },
  ],
  faq: [
    
  ]
}

export default function ProfilProfessionnel() {
  const params = useParams()
  const professionalId = params.id as string

  // États pour la prise de rendez-vous
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{
    serviceId: string
    date: Date
    time: string
  } | null>(null)

  // États pour le modal de prise de rendez-vous
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState(1)

  // Calculer les dates de début et de fin de la semaine
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Commence le lundi
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }) // Finit le dimanche

  // Générer un tableau des jours de la semaine
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Navigation entre les semaines
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))

  // Formulaires
  const clientTypeForm = useForm<ClientTypeFormValues>({
    resolver: zodResolver(clientTypeSchema),
    defaultValues: {
      clientType: "new",
    },
  })

  // Ajouter le formulaire de lieu dans la fonction ProfilProfessionnel
  const locationForm = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      locationType: "professional",
      locationNote: "",
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
      dependentFirstName: "",
      dependentLastName: "",
      dependentBirthDate: "",
      dependentGender: undefined,
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
  // Modifier la fonction onClientTypeSubmit pour passer à l'étape de sélection du lieu
  const onClientTypeSubmit = (data: ClientTypeFormValues) => {
    console.log("Type de client:", data)
    setBookingStep(2)
  }

  // Ajouter le gestionnaire de soumission pour le formulaire de lieu
  const onLocationSubmit = (data: LocationFormValues) => {
    console.log("Lieu du rendez-vous:", data)
    setBookingStep(3)
  }

  // Modifier la fonction onPersonalInfoSubmit pour passer à l'étape de l'adresse
  const onPersonalInfoSubmit = (data: PersonalInfoFormValues) => {
    console.log("Informations personnelles:", data)
    setBookingStep(4)
  }

  // Modifier la fonction onAddressSubmit pour passer à l'étape de la décharge
  const onAddressSubmit = (data: AddressFormValues) => {
    console.log("Adresse:", data)
    setBookingStep(5)
  }

  // Modifier la fonction onDischargeSubmit pour passer à l'étape de confirmation
  const onDischargeSubmit = (data: DischargeFormValues) => {
    console.log("Décharge acceptée:", data)

    // Ici, vous pourriez envoyer toutes les données au serveur
    const bookingData = {
      professional: professionalId,
      service: selectedSlot?.serviceId,
      date: selectedSlot?.date ? format(selectedSlot.date, "yyyy-MM-dd") : "",
      time: selectedSlot?.time,
      clientType: clientTypeForm.getValues(),
      location: locationForm.getValues(),
      personalInfo: personalInfoForm.getValues(),
      address: addressForm.getValues(),
      discharge: dischargeForm.getValues(),
    }

    console.log("Données de réservation complètes:", bookingData)

    // Passer à l'étape de confirmation
    setBookingStep(6)
  }

  const finalizeBooking = () => {
    // Fermer le modal et réinitialiser les étapes
    setModalOpen(false)
    setBookingStep(1)

    // Réinitialiser les formulaires
    clientTypeForm.reset()
    locationForm.reset()
    personalInfoForm.reset()
    addressForm.reset()
    dischargeForm.reset()
  }

  // Générer les créneaux horaires pour un jour donné
  const generateTimeSlots = (day: Date): TimeSlot[] => {
    const dayOfWeek = day.getDay() // 0 = dimanche, 1 = lundi, etc.

    // Trouver les disponibilités pour ce jour
    const dayAvailability = professionalData.availability.filter((a) => a.dayOfWeek === dayOfWeek)

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

  // Fonction pour ouvrir le modal de réservation
  const openBookingModal = (serviceId: string, date: Date, time: string) => {
    setSelectedSlot({
      serviceId,
      date,
      time,
    })
    setModalOpen(true)
    setBookingStep(1)
  }

  // Initialiser le service sélectionné au premier chargement
  useEffect(() => {
    if (professionalData.services.length > 0 && !selectedService) {
      setSelectedService(professionalData.services[0].id)
    }
  }, [])

  // Ajouter un effet pour réinitialiser les champs du dépendant lorsque l'utilisateur change le type de rendez-vous
  useEffect(() => {
    const subscription = personalInfoForm.watch((value, { name }) => {
      if (name === "appointmentFor" && value.appointmentFor === "self") {
        personalInfoForm.setValue("dependentFirstName", "")
        personalInfoForm.setValue("dependentLastName", "")
        personalInfoForm.setValue("dependentBirthDate", "")
        personalInfoForm.setValue("dependentGender", undefined)
      }
    })

    return () => subscription.unsubscribe()
  }, [personalInfoForm])

  // Calculer la note moyenne
  const averageRating =
    professionalData.reviews.reduce((acc, review) => acc + review.rating, 0) / professionalData.reviews.length

  // Calculer la distribution des notes
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = professionalData.reviews.filter((review) => review.rating === rating).length
    const percentage = (count / professionalData.reviews.length) * 100
    return { rating, count, percentage }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec image de couverture */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full bg-gray-200 overflow-hidden">
        {professionalData.coverImage && (
          <Image
            src={professionalData.coverImage || "/placeholder.svg"}
            alt={`Couverture de ${professionalData.fullName}`}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
          <Button asChild variant="outline" size="sm" className="bg-white/90 hover:bg-white">
            <Link href="/recherche-professionnels">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la recherche
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Informations du professionnel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* En-tête du profil */}
              <div className="p-6 pb-0 relative">
                {/* Améliorer l'en-tête du profil pour les mobiles */}
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-shrink-0 -mt-24 md:-mt-32 mb-4 md:mb-0 md:mr-6 z-10">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md mx-auto md:mx-0">
                      <AvatarImage src={professionalData.avatar} alt={professionalData.fullName} />
                      <AvatarFallback>
                        {professionalData.firstName[0]}
                        {professionalData.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl font-bold">{professionalData.fullName}</h1>
                        <p className="text-gray-600">{professionalData.profession}</p>
                        <div className="flex items-center mt-1 justify-center md:justify-start">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="font-medium">{professionalData.rating}</span>
                            <span className="text-gray-500 ml-1">({professionalData.reviewCount} avis)</span>
                          </div>
                          <span className="mx-2 text-gray-300">•</span>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-gray-600">{professionalData.address.city}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-2 justify-center md:justify-end">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Heart className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Favoris</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Share2 className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Partager</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Onglets d'information */}
                <Tabs defaultValue="about" className="mt-6">
                  {/* Améliorer la responsivité des onglets */}
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="about">À propos</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="reviews">Avis</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  </TabsList>

                  {/* Onglet À propos */}
                  <TabsContent value="about" className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Biographie</h2>
                      <p className="text-gray-700">{professionalData.bio}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Spécialités</h2>
                      <div className="flex flex-wrap gap-2">
                        {professionalData.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Clientèles</h2>
                      <div className="flex flex-wrap gap-2">
                        {professionalData.clientTypes.map((clientType, index) => (
                          <Badge key={index} variant="outline">
                            {clientType}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Formation et certifications</h2>
                      <div className="space-y-4">
                        {professionalData.education.map((edu, index) => (
                          <div key={index} className="flex items-start">
                            <GraduationCap className="h-5 w-5 text-primary mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-sm text-gray-600">
                                {edu.institution}, {edu.year}
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <p className="font-medium mb-2">Certifications</p>
                          <ul className="space-y-1">
                            {professionalData.certifications.map((cert, index) => (
                              <li key={index} className="flex items-start">
                                <Award className="h-4 w-4 text-primary mr-2 mt-0.5" />
                                <span className="text-sm">{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Expérience</h2>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-primary mr-2" />
                        <span>{professionalData.experience} ans d'expérience professionnelle</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Langues parlées</h2>
                      <div className="flex flex-wrap gap-2">
                        {professionalData.languages.map((language, index) => (
                          <Badge key={index} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold mb-2">Coordonnées</h2>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                          <span>
                            {professionalData.address.street}, {professionalData.address.city},{" "}
                            {professionalData.address.postalCode}, {professionalData.address.country}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{professionalData.contact.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-400 mr-2" />
                          <span>{professionalData.contact.email}</span>
                        </div>
                        {professionalData.contact.website && (
                          <div className="flex items-center">
                            <Globe className="h-5 w-5 text-gray-400 mr-2" />
                            <span>{professionalData.contact.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Onglet Services */}
                  <TabsContent value="services" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {professionalData.services.map((service) => (
                        <Card key={service.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription>
                              {service.duration} min • {service.price} €
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                            <Button
                              onClick={() => {
                                setSelectedService(service.id)
                                document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" })
                              }}
                              className="w-full"
                            >
                              Réserver
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Onglet Avis */}
                  <TabsContent value="reviews" className="space-y-6">
                    {/* Améliorer la responsivité de la section des avis */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
                          <div className="text-4xl font-bold text-gray-900 mr-4">{averageRating.toFixed(1)}</div>
                          <div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Basé sur {professionalData.reviews.length} avis
                            </p>
                          </div>
                        </div>
                        <div className="flex-1 max-w-xs mx-auto md:mx-0">
                          {ratingDistribution.map((item) => (
                            <div key={item.rating} className="flex items-center mb-1">
                              <div className="w-8 text-sm text-gray-600">{item.rating} ★</div>
                              <div className="flex-1 mx-2">
                                <Progress value={item.percentage} className="h-2" />
                              </div>
                              <div className="w-8 text-sm text-gray-600 text-right">{item.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {professionalData.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={review.avatar} alt={review.author} />
                              <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="font-medium">{review.author}</p>
                                  <div className="flex items-center mt-1">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating ? "text-yellow-400" : "text-gray-300"
                                          }`}
                                          fill={i < review.rating ? "currentColor" : "none"}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                                  {format(new Date(review.date), "d MMMM yyyy", { locale: fr })}
                                </p>
                              </div>
                              <p className="mt-2 text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Onglet FAQ */}
                  <TabsContent value="faq" className="space-y-4">
                    {professionalData.faq.map((item, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Prise de rendez-vous */}
          <div id="booking-section" className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Prendre rendez-vous</h2>

              {/* Sélection du service */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <Select value={selectedService || ""} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionalData.services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - {service.duration}min ({service.price}€)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <>
                  {/* Affichage des détails du service sélectionné */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">
                      {professionalData.services.find((s) => s.id === selectedService)?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Durée: {professionalData.services.find((s) => s.id === selectedService)?.duration} minutes
                    </p>
                    <p className="text-sm text-gray-600">
                      Prix: {professionalData.services.find((s) => s.id === selectedService)?.price} €
                    </p>
                  </div>

                  {/* Calendrier des disponibilités */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
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

                    {/* Grille des jours */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {weekDays.map((day, index) => (
                        <Button
                          key={index}
                          variant={selectedDayIndex === index ? "default" : "outline"}
                          className={`p-1 h-auto flex flex-col items-center ${isToday(day) ? "border-primary" : ""}`}
                          onClick={() => setSelectedDayIndex(index)}
                        >
                          <span className="text-xs font-normal">{format(day, "EEE", { locale: fr })}</span>
                          <span className="text-sm">{format(day, "d")}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Créneaux horaires pour le jour sélectionné */}
                    {selectedDayIndex !== null && (
                      <ScrollArea className="h-48 rounded-md border p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {(() => {
                            const timeSlots = generateTimeSlots(weekDays[selectedDayIndex])

                            if (timeSlots.length > 0) {
                              return timeSlots.map((slot, slotIndex) => (
                                <Button
                                  key={slotIndex}
                                  variant="ghost"
                                  size="sm"
                                  className={`text-center py-1 text-sm ${
                                    slot.available
                                      ? "hover:bg-primary/20"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }`}
                                  disabled={!slot.available}
                                  onClick={() => {
                                    if (slot.available && selectedService) {
                                      openBookingModal(selectedService, weekDays[selectedDayIndex], slot.time)
                                    }
                                  }}
                                >
                                  {slot.time}
                                </Button>
                              ))
                            } else {
                              return (
                                <div className="col-span-2 flex items-center justify-center p-4 text-gray-500">
                                  Aucune disponibilité ce jour
                                </div>
                              )
                            }
                          })()}
                        </div>
                      </ScrollArea>
                    )}

                    {selectedDayIndex === null && (
                      <div className="h-48 rounded-md border p-4 flex items-center justify-center text-gray-500">
                        Sélectionnez un jour pour voir les disponibilités
                      </div>
                    )}
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Confirmation instantanée - Réservez maintenant pour garantir votre créneau
                      </p>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Annulation gratuite jusqu'à 24 heures avant le rendez-vous
                      </p>
                    </div>
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        Veuillez arriver 10 minutes avant l'heure de votre rendez-vous
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de prise de rendez-vous */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {/* Améliorer la responsivité du modal */}
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 1 && "Êtes-vous un nouveau client ?"}
              {bookingStep === 2 && "Lieu du rendez-vous"}
              {bookingStep === 3 && "Vos informations personnelles"}
              {bookingStep === 4 && "Votre adresse"}
              {bookingStep === 5 && "Acceptation de la décharge"}
              {bookingStep === 6 && "Confirmation de rendez-vous"}
            </DialogTitle>
            <DialogDescription>
              {bookingStep === 1 && "Veuillez nous indiquer si vous êtes déjà client chez nous."}
              {bookingStep === 2 && "Veuillez sélectionner où vous souhaitez rencontrer le professionnel."}
              {bookingStep === 3 && "Veuillez remplir vos informations personnelles."}
              {bookingStep === 4 && "Veuillez remplir votre adresse."}
              {bookingStep === 5 && "Veuillez lire et accepter la décharge."}
              {bookingStep === 6 && "Un email de confirmation vous a été envoyé."}
            </DialogDescription>
          </DialogHeader>

          {selectedSlot && (
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <p className="font-medium text-blue-800">Détails du rendez-vous :</p>
              <p className="text-sm text-blue-700">
                {professionalData.fullName} -{" "}
                {professionalData.services.find((s) => s.id === selectedSlot.serviceId)?.name}
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

          {/* Ajouter le formulaire de sélection du lieu après le formulaire de type de client */}
          {bookingStep === 2 && (
            <Form {...locationForm}>
              <form onSubmit={locationForm.handleSubmit(onLocationSubmit)} className="space-y-6">
                <FormField
                  control={locationForm.control}
                  name="locationType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Où souhaitez-vous rencontrer le professionnel ?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="professional" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Au cabinet du professionnel</FormLabel>
                              <div className="text-sm text-gray-500">
                                <div className="mt-2 space-y-2">
                                  {professionalData.locations.map((location) => (
                                    <div key={location.id} className="flex items-start">
                                      <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-700">{location.name}</p>
                                        <p className="text-xs text-gray-500">{location.address}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="client" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">À votre domicile</FormLabel>
                              <p className="text-sm text-gray-500">
                                Le professionnel se déplacera à l'adresse que vous indiquerez. Des frais supplémentaires
                                peuvent s'appliquer selon la distance.
                              </p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="video" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium">Consultation vidéo</FormLabel>
                              <p className="text-sm text-gray-500">
                                Consultation à distance par vidéoconférence. Un lien vous sera envoyé avant le
                                rendez-vous.
                              </p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={locationForm.control}
                  name="locationNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes supplémentaires concernant le lieu (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informations complémentaires sur l'accès, le stationnement, etc."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
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

                {/* Champs conditionnels pour le dépendant */}
                {personalInfoForm.watch("appointmentFor") === "other" && (
                  <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900">Informations du dépendant</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="dependentFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom du dépendant" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="dependentLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom du dépendant" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={personalInfoForm.control}
                        name="dependentBirthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="dependentGender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sexe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le sexe" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Masculin</SelectItem>
                                <SelectItem value="female">Féminin</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

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
                  <Button type="button" variant="outline" onClick={() => setBookingStep(2)}>
                    Retour
                  </Button>
                  <Button type="submit">Suivant</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {bookingStep === 4 && (
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
                  <Button type="button" variant="outline" onClick={() => setBookingStep(3)}>
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
                  <Button type="button" variant="outline" onClick={() => setBookingStep(4)}>
                    Retour
                  </Button>
                  <Button type="submit">Continuer</Button>
                </DialogFooter>
              </form>
            </Form>
          )}

          {/* Mettre à jour l'écran de confirmation pour afficher les informations du dépendant si applicable */}
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
                      professionalData.services.find((s) => s.id === selectedSlot.serviceId)?.name}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Prix :</span>
                  <span>
                    {selectedSlot?.serviceId &&
                      `${professionalData.services.find((s) => s.id === selectedSlot.serviceId)?.price} €`}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Avec :</span>
                  <span>{professionalData.fullName}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Pour :</span>
                  <span>
                    {personalInfoForm.getValues().appointmentFor === "self"
                      ? `${personalInfoForm.getValues().firstName} ${personalInfoForm.getValues().lastName}`
                      : `${personalInfoForm.getValues().dependentFirstName} ${personalInfoForm.getValues().dependentLastName} (dépendant)`}
                  </span>
                </div>

                {personalInfoForm.getValues().appointmentFor === "other" && (
                  <>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Date de naissance :</span>
                      <span>{personalInfoForm.getValues().dependentBirthDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Sexe :</span>
                      <span>
                        {(() => {
                          const gender = personalInfoForm.getValues().dependentGender
                          if (gender === "male") return "Masculin"
                          if (gender === "female") return "Féminin"
                          if (gender === "other") return "Autre"
                          return ""
                        })()}
                      </span>
                    </div>
                  </>
                )}
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