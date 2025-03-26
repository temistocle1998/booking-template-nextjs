"use client";

import { Textarea } from "@/components/ui/textarea";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Menu,
  User,
  Search,
  MoreHorizontal,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PrivateLayout from "./components/public/private-layout";

// Types
type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    streetNumber: string;
    unit?: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  avatar?: string;
  status: "active" | "inactive";
  lastVisit?: string;
  nextAppointment?: string;
  totalAppointments: number;
  notes?: string;
  createdAt: string;
};

export default function ListeClients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<"name" | "lastVisit" | "appointments">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

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
      status: "active",
      lastVisit: "15 Mars 2025",
      nextAppointment: "28 Mars 2025",
      totalAppointments: 8,
      notes: "Préfère les rendez-vous en matinée. Allergique au latex.",
      createdAt: "10 Janvier 2024",
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
      status: "active",
      lastVisit: "12 Mars 2025",
      nextAppointment: "2 Avril 2025",
      totalAppointments: 5,
      notes: "A des problèmes de dos chroniques.",
      createdAt: "15 Février 2024",
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
      status: "active",
      lastVisit: "8 Mars 2025",
      nextAppointment: "22 Mars 2025",
      totalAppointments: 3,
      notes: "Première consultation pour douleurs cervicales.",
      createdAt: "5 Mars 2024",
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
      status: "inactive",
      lastVisit: "5 Mars 2025",
      totalAppointments: 2,
      notes: "A annulé son dernier rendez-vous.",
      createdAt: "20 Janvier 2024",
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
      status: "active",
      lastVisit: "28 Février 2025",
      nextAppointment: "30 Mars 2025",
      totalAppointments: 6,
      notes: "Suivi régulier pour rééducation après fracture.",
      createdAt: "12 Décembre 2023",
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
      status: "active",
      lastVisit: "20 Février 2025",
      nextAppointment: "25 Mars 2025",
      totalAppointments: 4,
      notes: "Patient sportif, traitement pour tendinite.",
      createdAt: "5 Janvier 2024",
    },
    {
      id: "7",
      firstName: "Léa",
      lastName: "Moreau",
      email: "lea.moreau@example.com",
      phone: "+33 6 78 90 12 34",
      address: {
        streetNumber: "34",
        street: "Avenue des Champs-Élysées",
        city: "Paris",
        province: "Île-de-France",
        country: "France",
        postalCode: "75008",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      lastVisit: "10 Mars 2025",
      nextAppointment: "5 Avril 2025",
      totalAppointments: 7,
      notes: "Traitement pour lombalgie chronique.",
      createdAt: "15 Novembre 2023",
    },
    {
      id: "8",
      firstName: "Hugo",
      lastName: "Leroy",
      email: "hugo.leroy@example.com",
      phone: "+33 6 89 01 23 45",
      address: {
        streetNumber: "78",
        street: "Rue de la Paix",
        city: "Nice",
        province: "Provence-Alpes-Côte d'Azur",
        country: "France",
        postalCode: "06000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "inactive",
      lastVisit: "2 Février 2025",
      totalAppointments: 1,
      notes: "Premier rendez-vous pour évaluation.",
      createdAt: "20 Février 2024",
    },
    {
      id: "9",
      firstName: "Chloé",
      lastName: "Fournier",
      email: "chloe.fournier@example.com",
      phone: "+33 6 90 12 34 56",
      address: {
        streetNumber: "45",
        street: "Boulevard Haussmann",
        unit: "5A",
        city: "Paris",
        province: "Île-de-France",
        country: "France",
        postalCode: "75009",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      lastVisit: "18 Mars 2025",
      nextAppointment: "1 Avril 2025",
      totalAppointments: 9,
      notes: "Suivi régulier pour arthrose.",
      createdAt: "10 Octobre 2023",
    },
    {
      id: "10",
      firstName: "Louis",
      lastName: "Girard",
      email: "louis.girard@example.com",
      phone: "+33 6 01 23 45 67",
      address: {
        streetNumber: "23",
        street: "Rue Gambetta",
        city: "Lille",
        province: "Hauts-de-France",
        country: "France",
        postalCode: "59000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      lastVisit: "5 Mars 2025",
      nextAppointment: "26 Mars 2025",
      totalAppointments: 3,
      notes: "Traitement pour entorse de la cheville.",
      createdAt: "25 Janvier 2024",
    },
    {
      id: "11",
      firstName: "Manon",
      lastName: "Lambert",
      email: "manon.lambert@example.com",
      phone: "+33 6 12 34 56 78",
      address: {
        streetNumber: "67",
        street: "Avenue Jean Jaurès",
        city: "Montpellier",
        province: "Occitanie",
        country: "France",
        postalCode: "34000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "active",
      lastVisit: "12 Mars 2025",
      nextAppointment: "29 Mars 2025",
      totalAppointments: 5,
      notes: "Suivi pour rééducation post-opératoire.",
      createdAt: "5 Décembre 2023",
    },
    {
      id: "12",
      firstName: "Jules",
      lastName: "Mercier",
      email: "jules.mercier@example.com",
      phone: "+33 6 23 45 67 89",
      address: {
        streetNumber: "89",
        street: "Rue de la Liberté",
        city: "Dijon",
        province: "Bourgogne-Franche-Comté",
        country: "France",
        postalCode: "21000",
      },
      avatar: "/placeholder.svg?height=32&width=32",
      status: "inactive",
      lastVisit: "25 Février 2025",
      totalAppointments: 2,
      notes: "A reporté son dernier rendez-vous.",
      createdAt: "15 Janvier 2024",
    },
  ];

  // Filtrer les clients en fonction de la recherche et du filtre de statut
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);

    const matchesStatus =
      filterStatus === "all" || client.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Trier les clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === "lastVisit") {
      // Tri simple par date de dernière visite (pour l'exemple)
      const dateA = a.lastVisit || "";
      const dateB = b.lastVisit || "";
      return sortOrder === "asc"
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    } else if (sortBy === "appointments") {
      return sortOrder === "asc"
        ? a.totalAppointments - b.totalAppointments
        : b.totalAppointments - a.totalAppointments;
    }
    return 0;
  });

  // Pagination
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = sortedClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(sortedClients.length / clientsPerPage);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Formulaire pour ajouter/modifier un client
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetNumber: string;
    street: string;
    unit: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    status: "active" | "inactive";
    notes: string;
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
    status: "active",
    notes: "",
  });

  // Initialiser le formulaire pour la modification
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      streetNumber: client.address.streetNumber,
      street: client.address.street,
      unit: client.address.unit || "",
      city: client.address.city,
      province: client.address.province,
      country: client.address.country,
      postalCode: client.address.postalCode,
      status: client.status,
      notes: client.notes || "",
    });
    setIsEditClientDialogOpen(true);
  };

  // Réinitialiser le formulaire pour l'ajout
  const handleAddClient = () => {
    setFormData({
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
      status: "active",
      notes: "",
    });
    setIsAddClientDialogOpen(true);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    // Logique pour ajouter ou modifier un client
    console.log("Soumission du formulaire:", { isEdit, formData });

    // Fermer les dialogues
    if (isEdit) {
      setIsEditClientDialogOpen(false);
    } else {
      setIsAddClientDialogOpen(false);
    }

    // Réinitialiser le client sélectionné
    setSelectedClient(null);
  };

  // Gérer la suppression d'un client
  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = () => {
    // Logique pour supprimer un client
    console.log("Suppression du client:", selectedClient);
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  return (
    <PrivateLayout>
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <CardTitle>Liste des clients</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Rechercher un client..."
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
                      <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            filterStatus === "all" ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        Tous
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("active")}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            filterStatus === "active"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Actifs
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFilterStatus("inactive")}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            filterStatus === "inactive"
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        Inactifs
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={handleAddClient}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Nouveau client
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
                                  setSortOrder(
                                    sortOrder === "asc" ? "desc" : "asc"
                                  );
                                } else {
                                  setSortBy("name");
                                  setSortOrder("asc");
                                }
                              }}
                            >
                              <span>Nom</span>
                              {sortBy === "name" &&
                                (sortOrder === "asc" ? (
                                  <ChevronRight className="h-4 w-4" />
                                ) : (
                                  <ChevronLeft className="h-4 w-4" />
                                ))}
                            </button>
                          </TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>
                            <button
                              className="flex items-center space-x-1"
                              onClick={() => {
                                if (sortBy === "lastVisit") {
                                  setSortOrder(
                                    sortOrder === "asc" ? "desc" : "asc"
                                  );
                                } else {
                                  setSortBy("lastVisit");
                                  setSortOrder("asc");
                                }
                              }}
                            >
                              <span>Dernière visite</span>
                              {sortBy === "lastVisit" &&
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
                                if (sortBy === "appointments") {
                                  setSortOrder(
                                    sortOrder === "asc" ? "desc" : "asc"
                                  );
                                } else {
                                  setSortBy("appointments");
                                  setSortOrder("asc");
                                }
                              }}
                            >
                              <span>Rendez-vous</span>
                              {sortBy === "appointments" &&
                                (sortOrder === "asc" ? (
                                  <ChevronRight className="h-4 w-4" />
                                ) : (
                                  <ChevronLeft className="h-4 w-4" />
                                ))}
                            </button>
                          </TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentClients.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center py-8 text-gray-500"
                            >
                              Aucun client trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentClients.map((client) => (
                            <TableRow key={client.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={client.avatar}
                                      alt={`${client.firstName} ${client.lastName}`}
                                    />
                                    <AvatarFallback>
                                      {client.firstName[0]}
                                      {client.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {client.firstName} {client.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Client depuis {client.createdAt}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm">
                                    <Mail className="mr-2 h-3.5 w-3.5 text-gray-500" />
                                    <span className="truncate max-w-[150px]">
                                      {client.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Phone className="mr-2 h-3.5 w-3.5 text-gray-500" />
                                    <span>{client.phone}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {client.lastVisit || "Jamais"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span>{client.totalAppointments}</span>
                                  {client.nextAppointment && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-100 text-blue-800 border-blue-200"
                                    >
                                      Prochain: {client.nextAppointment}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    client.status === "active"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {client.status === "active"
                                    ? "Actif"
                                    : "Inactif"}
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
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => setSelectedClient(client)}
                                    >
                                      <User className="mr-2 h-4 w-4" />
                                      <span>Voir les détails</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditClient(client)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Modifier</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClient(client)}
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
                  {sortedClients.length > clientsPerPage && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              paginate(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            // Logique pour afficher les pages autour de la page courante
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => paginate(pageNum)}
                                  isActive={currentPage === pageNum}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              paginate(Math.min(totalPages, currentPage + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </TabsContent>

                <TabsContent value="cartes" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentClients.map((client) => (
                      <Card key={client.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={client.avatar}
                                  alt={`${client.firstName} ${client.lastName}`}
                                />
                                <AvatarFallback>
                                  {client.firstName[0]}
                                  {client.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">
                                  {client.firstName} {client.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Client depuis {client.createdAt}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center text-sm">
                                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                                <span className="truncate">{client.email}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                <span>{client.phone}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                <span className="truncate">
                                  {client.address.city},{" "}
                                  {client.address.country}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={`${
                                  client.status === "active"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                }`}
                              >
                                {client.status === "active"
                                  ? "Actif"
                                  : "Inactif"}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {client.totalAppointments} rendez-vous
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t flex divide-x">
                            <button
                              className="flex-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                              onClick={() => setSelectedClient(client)}
                            >
                              <User className="mr-1 h-4 w-4" />
                              Détails
                            </button>
                            <button
                              className="flex-1 p-2 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center"
                              onClick={() => handleEditClient(client)}
                            >
                              <Edit className="mr-1 h-4 w-4" />
                              Modifier
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination pour la vue en cartes */}
                  {sortedClients.length > clientsPerPage && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              paginate(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <PaginationItem key={i}>
                                <PaginationLink
                                  onClick={() => paginate(pageNum)}
                                  isActive={currentPage === pageNum}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              paginate(Math.min(totalPages, currentPage + 1))
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                  Affichage de {indexOfFirstClient + 1}-
                  {Math.min(indexOfLastClient, sortedClients.length)} sur{" "}
                  {sortedClients.length} clients
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

      {selectedClient && !isEditClientDialogOpen && !isDeleteDialogOpen && (
        <Dialog
          open={!!selectedClient}
          onOpenChange={() => setSelectedClient(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails du client</DialogTitle>
              <DialogDescription>
                Informations complètes sur {selectedClient.firstName}{" "}
                {selectedClient.lastName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedClient.avatar}
                    alt={`${selectedClient.firstName} ${selectedClient.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedClient.firstName[0]}
                    {selectedClient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Client depuis {selectedClient.createdAt}
                  </p>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      selectedClient.status === "active"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {selectedClient.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Coordonnées
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p>
                          {selectedClient.address.streetNumber}{" "}
                          {selectedClient.address.street}
                          {selectedClient.address.unit
                            ? `, ${selectedClient.address.unit}`
                            : ""}
                        </p>
                        <p>
                          {selectedClient.address.city},{" "}
                          {selectedClient.address.province}
                        </p>
                        <p>
                          {selectedClient.address.postalCode},{" "}
                          {selectedClient.address.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Rendez-vous
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total des rendez-vous:</span>
                      <span className="font-medium">
                        {selectedClient.totalAppointments}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dernière visite:</span>
                      <span className="font-medium">
                        {selectedClient.lastVisit || "Jamais"}
                      </span>
                    </div>
                    {selectedClient.nextAppointment && (
                      <div className="flex items-center justify-between">
                        <span>Prochain rendez-vous:</span>
                        <span className="font-medium">
                          {selectedClient.nextAppointment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedClient.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-2 text-sm">{selectedClient.notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                Fermer
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditClient(selectedClient);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Nouveau rendez-vous
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un nouveau client
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adresse</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Numéro"
                      value={formData.streetNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          streetNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Rue"
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <Input
                  placeholder="Appartement/Bureau (optionnel)"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Ville"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Province/Région"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Code postal"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Pays"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Informations supplémentaires sur le client"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddClientDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter le client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditClientDialogOpen}
        onOpenChange={setIsEditClientDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations de {selectedClient?.firstName}{" "}
              {selectedClient?.lastName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, true)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">Prénom</Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Nom</Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Adresse</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="Numéro"
                      value={formData.streetNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          streetNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Rue"
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <Input
                  placeholder="Appartement/Bureau (optionnel)"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Ville"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Province/Région"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Code postal"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Pays"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (optionnel)</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Informations supplémentaires sur le client"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditClientDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="py-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedClient.avatar}
                    alt={`${selectedClient.firstName} ${selectedClient.lastName}`}
                  />
                  <AvatarFallback>
                    {selectedClient.firstName[0]}
                    {selectedClient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedClient.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteClient}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PrivateLayout>
  );
}
