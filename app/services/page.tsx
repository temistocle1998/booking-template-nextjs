"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Menu,
  User,
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Clock,
  Edit,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  DollarSign,
  Tag,
  Archive,
} from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import PrivateLayout from "@/components/public/private-layout"

// Types
type Service = {
  id: string
  name: string
  duration: number // en minutes
  price: number
  currency: "CAD" | "USD"
  category: "soin" | "massage" | "autre" | string
  status: "published" | "archived"
  description?: string
  createdAt: string
}

export default function ListeServices() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [servicesPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<"name" | "price" | "duration">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterCategory, setFilterCategory] = useState<"all" | "soin" | "massage" | "autre">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "archived">("all")

  // Données simulées pour les services
  const services: Service[] = [
    {
      id: "1",
      name: "Massage thérapeutique",
      duration: 60,
      price: 85,
      currency: "CAD",
      category: "massage",
      status: "published",
      description: "Massage complet du corps pour soulager les tensions musculaires et améliorer la circulation.",
      createdAt: "15 Janvier 2025",
    },
    {
      id: "2",
      name: "Massage des tissus profonds",
      duration: 90,
      price: 120,
      currency: "CAD",
      category: "massage",
      status: "published",
      description: "Technique de massage qui cible les couches profondes des muscles et du tissu conjonctif.",
      createdAt: "20 Janvier 2025",
    },
    {
      id: "3",
      name: "Massage suédois",
      duration: 60,
      price: 75,
      currency: "CAD",
      category: "massage",
      status: "published",
      description: "Massage doux qui utilise de longs mouvements fluides pour détendre le corps et l'esprit.",
      createdAt: "25 Janvier 2025",
    },
    {
      id: "4",
      name: "Soin du visage",
      duration: 45,
      price: 65,
      currency: "CAD",
      category: "soin",
      status: "published",
      description: "Nettoyage en profondeur, exfoliation et hydratation pour une peau éclatante.",
      createdAt: "5 Février 2025",
    },
    {
      id: "5",
      name: "Soin du dos",
      duration: 30,
      price: 50,
      currency: "CAD",
      category: "soin",
      status: "published",
      description: "Traitement ciblé pour nettoyer et purifier la peau du dos.",
      createdAt: "10 Février 2025",
    },
    {
      id: "6",
      name: "Réflexologie plantaire",
      duration: 45,
      price: 70,
      currency: "CAD",
      category: "autre",
      status: "published",
      description:
        "Technique de massage des pieds qui stimule des points de pression correspondant à différentes parties du corps.",
      createdAt: "15 Février 2025",
    },
    {
      id: "7",
      name: "Massage aux pierres chaudes",
      duration: 75,
      price: 95,
      currency: "CAD",
      category: "massage",
      status: "published",
      description:
        "Utilisation de pierres lisses et chaudes placées sur des points spécifiques du corps pour détendre les muscles.",
      createdAt: "20 Février 2025",
    },
    {
      id: "8",
      name: "Consultation initiale",
      duration: 60,
      price: 100,
      currency: "CAD",
      category: "autre",
      status: "published",
      description: "Première consultation pour évaluer vos besoins et établir un plan de traitement personnalisé.",
      createdAt: "25 Février 2025",
    },
    {
      id: "9",
      name: "Massage sportif",
      duration: 60,
      price: 90,
      currency: "USD",
      category: "massage",
      status: "published",
      description:
        "Massage conçu pour les athlètes, ciblant les groupes musculaires spécifiques utilisés dans le sport.",
      createdAt: "1 Mars 2025",
    },
    {
      id: "10",
      name: "Aromathérapie",
      duration: 60,
      price: 85,
      currency: "CAD",
      category: "soin",
      status: "published",
      description: "Massage utilisant des huiles essentielles pour améliorer le bien-être physique et émotionnel.",
      createdAt: "5 Mars 2025",
    },
    {
      id: "11",
      name: "Massage prénatal",
      duration: 60,
      price: 80,
      currency: "CAD",
      category: "massage",
      status: "published",
      description: "Massage doux spécialement conçu pour les femmes enceintes.",
      createdAt: "10 Mars 2025",
    },
    {
      id: "12",
      name: "Thérapie cranio-sacrale",
      duration: 45,
      price: 75,
      currency: "CAD",
      category: "autre",
      status: "archived",
      description: "Approche thérapeutique douce qui se concentre sur le système cranio-sacral.",
      createdAt: "15 Mars 2025",
    },
    {
      id: "13",
      name: "Forfait massage mensuel",
      duration: 60,
      price: 300,
      currency: "CAD",
      category: "massage",
      status: "archived",
      description: "Forfait de 4 massages à utiliser dans le mois.",
      createdAt: "20 Mars 2025",
    },
  ]

  // Filtrer les services en fonction de la recherche et des filtres
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === "all" || service.category === filterCategory
    const matchesStatus = filterStatus === "all" || service.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Trier les services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price
    } else if (sortBy === "duration") {
      return sortOrder === "asc" ? a.duration - b.duration : b.duration - a.duration
    }
    return 0
  })

  // Pagination
  const indexOfLastService = currentPage * servicesPerPage
  const indexOfFirstService = indexOfLastService - servicesPerPage
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService)
  const totalPages = Math.ceil(sortedServices.length / servicesPerPage)

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Ajouter un nouvel état pour la pause après rendez-vous dans la section des états
  const [formData, setFormData] = useState<{
    name: string
    duration: number
    price: number
    currency: "CAD" | "USD"
    category: string
    status: "published" | "archived"
    description: string
    hasCooldown: boolean
    cooldownMinutes: number
  }>({
    name: "",
    duration: 60,
    price: 0,
    currency: "CAD",
    category: "massage",
    status: "published",
    description: "",
    hasCooldown: false,
    cooldownMinutes: 15,
  })

  // Initialiser le formulaire pour la modification
  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      currency: service.currency,
      category: service.category,
      status: service.status,
      description: service.description || "",
      hasCooldown: false,
      cooldownMinutes: 15,
    })
    setIsEditServiceDialogOpen(true)
  }

  // Réinitialiser le formulaire pour l'ajout
  const handleAddService = () => {
    setFormData({
      name: "",
      duration: 60,
      price: 0,
      currency: "CAD",
      category: "massage",
      status: "published",
      description: "",
      hasCooldown: false,
      cooldownMinutes: 15,
    })
    setIsAddServiceDialogOpen(true)
  }

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault()
    // Logique pour ajouter ou modifier un service
    console.log("Soumission du formulaire:", { isEdit, formData })

    // Fermer les dialogues
    if (isEdit) {
      setIsEditServiceDialogOpen(false)
    } else {
      setIsAddServiceDialogOpen(false)
    }

    // Réinitialiser le service sélectionné
    setSelectedService(null)
  }

  // Gérer la suppression d'un service
  const handleDeleteService = (service: Service) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteService = () => {
    // Logique pour supprimer un service
    console.log("Suppression du service:", selectedService)
    setIsDeleteDialogOpen(false)
    setSelectedService(null)
  }

  // Formater le prix avec la devise
  const formatPrice = (price: number, currency: "CAD" | "USD") => {
    return `${price} $${currency}`
  }

  // Formater la durée en heures et minutes
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
    }
  }

  return (
    <PrivateLayout>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle>Liste des services</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher un service..."
                      className="w-full pl-8 sm:w-[200px] md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                          <span className="sr-only">Filtrer</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                          <Check className={`mr-2 h-4 w-4 ${filterCategory === "all" ? "opacity-100" : "opacity-0"}`} />
                          Toutes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterCategory("massage")}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterCategory === "massage" ? "opacity-100" : "opacity-0"}`}
                          />
                          Massage
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterCategory("soin")}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterCategory === "soin" ? "opacity-100" : "opacity-0"}`}
                          />
                          Soin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterCategory("autre")}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterCategory === "autre" ? "opacity-100" : "opacity-0"}`}
                          />
                          Autre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                          <Check className={`mr-2 h-4 w-4 ${filterStatus === "all" ? "opacity-100" : "opacity-0"}`} />
                          Tous
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("published")}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterStatus === "published" ? "opacity-100" : "opacity-0"}`}
                          />
                          Publiés
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                          <Check
                            className={`mr-2 h-4 w-4 ${filterStatus === "archived" ? "opacity-100" : "opacity-0"}`}
                          />
                          Archivés
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={handleAddService}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau service
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="liste" className="w-full">
                  <TabsList className="mb-4 grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="liste">Liste</TabsTrigger>
                    <TabsTrigger value="cartes">Cartes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="liste" className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">
                              <button
                                className="flex items-center space-x-1"
                                onClick={() => {
                                  if (sortBy === "name") {
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                                  } else {
                                    setSortBy("name")
                                    setSortOrder("asc")
                                  }
                                }}
                              >
                                <span>Nom du service</span>
                                {sortBy === "name" &&
                                  (sortOrder === "asc" ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                  ))}
                              </button>
                            </TableHead>
                            <TableHead>
                              <button
                                className="flex items-center space-x-1"
                                onClick={() => {
                                  if (sortBy === "duration") {
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                                  } else {
                                    setSortBy("duration")
                                    setSortOrder("asc")
                                  }
                                }}
                              >
                                <span>Durée</span>
                                {sortBy === "duration" &&
                                  (sortOrder === "asc" ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                  ))}
                              </button>
                            </TableHead>
                            <TableHead>
                              <button
                                className="flex items-center space-x-1"
                                onClick={() => {
                                  if (sortBy === "price") {
                                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                                  } else {
                                    setSortBy("price")
                                    setSortOrder("asc")
                                  }
                                }}
                              >
                                <span>Prix</span>
                                {sortBy === "price" &&
                                  (sortOrder === "asc" ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                  ))}
                              </button>
                            </TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentServices.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                Aucun service trouvé
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentServices.map((service) => (
                              <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div className="font-medium">{service.name}</div>
                                    {service.description && (
                                      <div className="text-xs text-gray-500 truncate max-w-[250px]">
                                        {service.description}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>{formatDuration(service.duration)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>{formatPrice(service.price, service.currency)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={`${
                                      service.status === "published"
                                        ? "bg-green-100 text-green-800 border-green-200"
                                        : "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}
                                  >
                                    {service.status === "published" ? "Publié" : "Archivé"}
                                  </Badge>
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
                                      <DropdownMenuItem onClick={() => handleEditService(service)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Modifier</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedService(service)
                                          setFormData({
                                            ...formData,
                                            status: service.status === "published" ? "archived" : "published",
                                          })
                                          handleEditService({
                                            ...service,
                                            status: service.status === "published" ? "archived" : "published",
                                          })
                                        }}
                                      >
                                        {service.status === "published" ? (
                                          <>
                                            <Archive className="mr-2 h-4 w-4" />
                                            <span>Archiver</span>
                                          </>
                                        ) : (
                                          <>
                                            <Check className="mr-2 h-4 w-4" />
                                            <span>Publier</span>
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteService(service)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Supprimer</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {sortedServices.length > servicesPerPage && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => paginate(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Logique pour afficher les pages autour de la page courante
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink onClick={() => paginate(pageNum)} isActive={currentPage === pageNum}>
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </TabsContent>

                  <TabsContent value="cartes" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentServices.map((service) => (
                        <Card key={service.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-6">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{service.name}</h3>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    service.status === "published"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {service.status === "published" ? "Publié" : "Archivé"}
                                </Badge>
                              </div>

                              {service.description && (
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                              )}

                              <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="rounded-md bg-gray-50 p-2">
                                  <div className="text-xs text-gray-500">Durée</div>
                                  <div className="flex items-center text-sm font-medium">
                                    <Clock className="mr-1 h-3.5 w-3.5 text-gray-500" />
                                    {formatDuration(service.duration)}
                                  </div>
                                </div>
                                <div className="rounded-md bg-gray-50 p-2">
                                  <div className="text-xs text-gray-500">Prix</div>
                                  <div className="flex items-center text-sm font-medium">
                                    <DollarSign className="mr-1 h-3.5 w-3.5 text-gray-500" />
                                    {formatPrice(service.price, service.currency)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                  {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                                </Badge>
                              </div>
                            </div>

                            <div className="border-t flex divide-x">
                              <button
                                className="flex-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                                onClick={() => handleEditService(service)}
                              >
                                <Edit className="mr-1 h-4 w-4" />
                                Modifier
                              </button>
                              <button
                                className="flex-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                                onClick={() => handleDeleteService(service)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Supprimer
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination pour la vue en cartes */}
                    {sortedServices.length > servicesPerPage && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => paginate(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink onClick={() => paginate(pageNum)} isActive={currentPage === pageNum}>
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          {totalPages > 5 && currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}

                          <PaginationItem>
                            <PaginationNext
                              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Affichage de {indexOfFirstService + 1}-{Math.min(indexOfLastService, sortedServices.length)} sur{" "}
                    {sortedServices.length} services
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Importer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

      {/* Modal d'ajout de service */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau service</DialogTitle>
            <DialogDescription>Remplissez les informations pour créer un nouveau service</DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du service</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="massage">Massage</SelectItem>
                      <SelectItem value="soin">Soin</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: "CAD" | "USD") => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAD">$CAD</SelectItem>
                      <SelectItem value="USD">$USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "published" | "archived") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée du service"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="has-cooldown" className="cursor-pointer">
                    Je veux une pause après les rendez-vous pour ce service
                  </Label>
                  <Switch
                    id="has-cooldown"
                    checked={formData.hasCooldown}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasCooldown: checked })}
                  />
                </div>

                {formData.hasCooldown && (
                  <div className="mt-2">
                    <Label htmlFor="cooldown-minutes">Durée de la pause (minutes)</Label>
                    <Input
                      id="cooldown-minutes"
                      type="number"
                      min="5"
                      step="5"
                      value={formData.cooldownMinutes}
                      onChange={(e) => setFormData({ ...formData, cooldownMinutes: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cette pause sera automatiquement ajoutée après chaque rendez-vous pour ce service.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddServiceDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter le service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de modification de service */}
      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
            <DialogDescription>Modifiez les informations du service {selectedService?.name}</DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, true)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du service</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Durée (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="massage">Massage</SelectItem>
                      <SelectItem value="soin">Soin</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Prix</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-currency">Devise</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value: "CAD" | "USD") => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="edit-currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAD">$CAD</SelectItem>
                      <SelectItem value="USD">$USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "published" | "archived") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (optionnel)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée du service"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-has-cooldown" className="cursor-pointer">
                    Je veux une pause après les rendez-vous pour ce service
                  </Label>
                  <Switch
                    id="edit-has-cooldown"
                    checked={formData.hasCooldown}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasCooldown: checked })}
                  />
                </div>

                {formData.hasCooldown && (
                  <div className="mt-2">
                    <Label htmlFor="edit-cooldown-minutes">Durée de la pause (minutes)</Label>
                    <Input
                      id="edit-cooldown-minutes"
                      type="number"
                      min="5"
                      step="5"
                      value={formData.cooldownMinutes}
                      onChange={(e) => setFormData({ ...formData, cooldownMinutes: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cette pause sera automatiquement ajoutée après chaque rendez-vous pour ce service.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditServiceDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="py-4">
              <div>
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDuration(selectedService.duration)} -{" "}
                  {formatPrice(selectedService.price, selectedService.currency)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteService}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </PrivateLayout>
  )
}