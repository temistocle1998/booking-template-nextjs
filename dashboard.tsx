"use client";

import { Input } from "@/components/ui/input";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Bell,
  CalendarIcon,
  CreditCard,
  DollarSign,
  Download,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PieChart,
  Settings,
  User,
  Users,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import PrivateLayout from "./components/public/private-layout";

export default function DashboardProfessionnel() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Données simulées pour les statistiques
  const stats = [
    {
      title: "Clients totaux",
      value: "248",
      change: "+12%",
      changeType: "positive",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Rendez-vous ce mois",
      value: "42",
      change: "+18%",
      changeType: "positive",
      icon: <CalendarIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Revenus mensuels",
      value: "$4,320",
      change: "+6.2%",
      changeType: "positive",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Taux d'occupation",
      value: "78%",
      change: "-2%",
      changeType: "negative",
      icon: <PieChart className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  // Données simulées pour les rendez-vous à venir
  const upcomingAppointments = [
    {
      id: 1,
      client: "Sophie Martin",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Aujourd'hui",
      time: "14:30 - 15:15",
      service: "Consultation initiale",
      status: "confirmed",
    },
    {
      id: 2,
      client: "Thomas Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Aujourd'hui",
      time: "16:00 - 16:45",
      service: "Suivi mensuel",
      status: "confirmed",
    },
    {
      id: 3,
      client: "Emma Petit",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Demain",
      time: "09:15 - 10:00",
      service: "Consultation initiale",
      status: "pending",
    },
    {
      id: 4,
      client: "Lucas Bernard",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Demain",
      time: "11:30 - 12:15",
      service: "Suivi trimestriel",
      status: "confirmed",
    },
    {
      id: 5,
      client: "Camille Roux",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "23 Mars",
      time: "15:00 - 15:45",
      service: "Consultation spéciale",
      status: "cancelled",
    },
  ];

  // Données simulées pour les clients récents
  const recentClients = [
    {
      id: 1,
      name: "Sophie Martin",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "sophie.martin@example.com",
      phone: "+33 6 12 34 56 78",
      lastVisit: "15 Mars 2025",
      status: "active",
    },
    {
      id: 2,
      name: "Thomas Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "thomas.dubois@example.com",
      phone: "+33 6 23 45 67 89",
      lastVisit: "12 Mars 2025",
      status: "active",
    },
    {
      id: 3,
      name: "Emma Petit",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "emma.petit@example.com",
      phone: "+33 6 34 56 78 90",
      lastVisit: "8 Mars 2025",
      status: "active",
    },
    {
      id: 4,
      name: "Lucas Bernard",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "lucas.bernard@example.com",
      phone: "+33 6 45 67 89 01",
      lastVisit: "5 Mars 2025",
      status: "inactive",
    },
    {
      id: 5,
      name: "Camille Roux",
      avatar: "/placeholder.svg?height=32&width=32",
      email: "camille.roux@example.com",
      phone: "+33 6 56 78 90 12",
      lastVisit: "28 Février 2025",
      status: "active",
    },
  ];

  // Données simulées pour les activités récentes
  const recentActivities = [
    {
      id: 1,
      type: "appointment_created",
      client: "Sophie Martin",
      time: "Il y a 2 heures",
      details: "a pris rendez-vous pour le 25 Mars à 14:30",
    },
    {
      id: 2,
      type: "appointment_completed",
      client: "Thomas Dubois",
      time: "Il y a 4 heures",
      details: "Rendez-vous terminé et facturé (85€)",
    },
    {
      id: 3,
      type: "appointment_cancelled",
      client: "Julie Leroy",
      time: "Il y a 1 jour",
      details: "a annulé son rendez-vous du 22 Mars",
    },
    {
      id: 4,
      type: "payment_received",
      client: "Marc Fournier",
      time: "Il y a 2 jours",
      details: "Paiement reçu pour la consultation du 18 Mars (120€)",
    },
    {
      id: 5,
      type: "client_message",
      client: "Emma Petit",
      time: "Il y a 3 jours",
      details: "vous a envoyé un message concernant son prochain rendez-vous",
    },
  ];

  // Données simulées pour le graphique des revenus
  const revenueData = [
    { month: "Jan", amount: 3200 },
    { month: "Fév", amount: 3800 },
    { month: "Mar", amount: 4320 },
    { month: "Avr", amount: 0 },
    { month: "Mai", amount: 0 },
    { month: "Juin", amount: 0 },
    { month: "Juil", amount: 0 },
    { month: "Août", amount: 0 },
    { month: "Sep", amount: 0 },
    { month: "Oct", amount: 0 },
    { month: "Nov", amount: 0 },
    { month: "Déc", amount: 0 },
  ];

  // Fonction pour obtenir la couleur du statut de rendez-vous
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Fonction pour obtenir le texte du statut de rendez-vous
  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return "Inconnu";
    }
  };

  // Fonction pour obtenir l'icône de l'activité récente
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "appointment_created":
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case "appointment_completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "appointment_cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "payment_received":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "client_message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <PrivateLayout>
      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Statistiques */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p
                    className={`text-xs ${
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.change} depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs pour les différentes sections */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="revenue">Revenus</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Rendez-vous à venir */}
                <Card className="col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Rendez-vous à venir</CardTitle>
                      <CardDescription>
                        Vos 5 prochains rendez-vous
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Voir tous
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={appointment.avatar}
                                alt={appointment.client}
                              />
                              <AvatarFallback>
                                {appointment.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {appointment.client}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-1 h-3 w-3" />
                                {appointment.date}, {appointment.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                appointment.status
                              )} text-white`}
                            >
                              {getStatusText(appointment.status)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Calendrier */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier</CardTitle>
                    <CardDescription>Mars 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {/* Activité récente */}
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>
                      Les 5 dernières activités sur votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4"
                        >
                          <div className="mt-0.5">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="font-medium">
                              <span className="text-primary">
                                {activity.client}
                              </span>{" "}
                              {activity.details}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenus mensuels */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenus mensuels</CardTitle>
                    <CardDescription>2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      {/* Graphique simplifié des revenus */}
                      <div className="flex h-full items-end space-x-2">
                        {revenueData.map((item, index) => (
                          <div
                            key={index}
                            className="relative flex flex-1 flex-col items-center"
                          >
                            <div
                              className="w-full bg-primary rounded-t"
                              style={{
                                height: `${(item.amount / 5000) * 100}%`,
                              }}
                            ></div>
                            <span className="mt-1 text-xs">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total 2025
                        </p>
                        <p className="text-2xl font-bold">$11,320</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Rendez-vous */}
            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tous les rendez-vous</CardTitle>
                    <CardDescription>
                      Gérez vos rendez-vous et votre planning
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="w-[200px] pl-8 md:w-[300px]"
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 border-b bg-gray-50 p-4 text-sm font-medium text-gray-500">
                      <div className="col-span-2">Client</div>
                      <div>Date</div>
                      <div>Heure</div>
                      <div>Service</div>
                      <div>Statut</div>
                    </div>
                    <div className="divide-y">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="grid grid-cols-6 items-center p-4"
                        >
                          <div className="col-span-2 flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={appointment.avatar}
                                alt={appointment.client}
                              />
                              <AvatarFallback>
                                {appointment.client
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {appointment.client}
                              </p>
                            </div>
                          </div>
                          <div>{appointment.date}</div>
                          <div>{appointment.time}</div>
                          <div>{appointment.service}</div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(
                                appointment.status
                              )} text-white`}
                            >
                              {getStatusText(appointment.status)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients */}
            <TabsContent value="clients" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tous les clients</CardTitle>
                    <CardDescription>
                      Gérez votre liste de clients
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Rechercher..."
                        className="w-[200px] pl-8 md:w-[300px]"
                      />
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 border-b bg-gray-50 p-4 text-sm font-medium text-gray-500">
                      <div className="col-span-2">Nom</div>
                      <div>Email</div>
                      <div>Téléphone</div>
                      <div>Dernière visite</div>
                      <div>Statut</div>
                    </div>
                    <div className="divide-y">
                      {recentClients.map((client) => (
                        <div
                          key={client.id}
                          className="grid grid-cols-6 items-center p-4"
                        >
                          <div className="col-span-2 flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={client.avatar}
                                alt={client.name}
                              />
                              <AvatarFallback>
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{client.name}</p>
                            </div>
                          </div>
                          <div className="truncate">{client.email}</div>
                          <div>{client.phone}</div>
                          <div>{client.lastVisit}</div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`${
                                client.status === "active"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              } text-white`}
                            >
                              {client.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenus */}
            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenus</CardTitle>
                    <CardDescription>
                      Analyse de vos revenus et paiements
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Graphique des revenus */}
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Revenus mensuels 2025
                      </h3>
                      <div className="h-[300px] w-full">
                        {/* Graphique simplifié des revenus */}
                        <div className="flex h-full items-end space-x-2">
                          {revenueData.map((item, index) => (
                            <div
                              key={index}
                              className="relative flex flex-1 flex-col items-center"
                            >
                              <div
                                className="w-full bg-primary rounded-t"
                                style={{
                                  height: `${(item.amount / 5000) * 100}%`,
                                }}
                              ></div>
                              <span className="mt-1 text-xs">{item.month}</span>
                              <span className="absolute -top-6 text-xs font-medium">
                                {item.amount > 0 ? `$${item.amount}` : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Statistiques des revenus */}
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-gray-500">
                          Revenus totaux 2025
                        </div>
                        <div className="mt-2 text-3xl font-bold">$11,320</div>
                        <div className="mt-1 text-sm text-green-500">
                          +12.5% vs 2024
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-gray-500">
                          Moyenne mensuelle
                        </div>
                        <div className="mt-2 text-3xl font-bold">$3,773</div>
                        <div className="mt-1 text-sm text-green-500">
                          +8.2% vs 2024
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="text-sm font-medium text-gray-500">
                          Prévision annuelle
                        </div>
                        <div className="mt-2 text-3xl font-bold">$45,280</div>
                        <div className="mt-1 text-sm text-green-500">
                          +15.3% vs 2024
                        </div>
                      </div>
                    </div>

                    {/* Transactions récentes */}
                    <div>
                      <h3 className="mb-4 text-lg font-medium">
                        Transactions récentes
                      </h3>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-5 border-b bg-gray-50 p-4 text-sm font-medium text-gray-500">
                          <div className="col-span-2">Client</div>
                          <div>Date</div>
                          <div>Montant</div>
                          <div>Statut</div>
                        </div>
                        <div className="divide-y">
                          {[
                            {
                              id: 1,
                              client: "Sophie Martin",
                              avatar: "/placeholder.svg?height=32&width=32",
                              date: "15 Mars 2025",
                              amount: "$85.00",
                              status: "completed",
                            },
                            {
                              id: 2,
                              client: "Thomas Dubois",
                              avatar: "/placeholder.svg?height=32&width=32",
                              date: "12 Mars 2025",
                              amount: "$120.00",
                              status: "completed",
                            },
                            {
                              id: 3,
                              client: "Emma Petit",
                              avatar: "/placeholder.svg?height=32&width=32",
                              date: "8 Mars 2025",
                              amount: "$75.00",
                              status: "pending",
                            },
                            {
                              id: 4,
                              client: "Lucas Bernard",
                              avatar: "/placeholder.svg?height=32&width=32",
                              date: "5 Mars 2025",
                              amount: "$150.00",
                              status: "completed",
                            },
                            {
                              id: 5,
                              client: "Camille Roux",
                              avatar: "/placeholder.svg?height=32&width=32",
                              date: "28 Février 2025",
                              amount: "$95.00",
                              status: "completed",
                            },
                          ].map((transaction) => (
                            <div
                              key={transaction.id}
                              className="grid grid-cols-5 items-center p-4"
                            >
                              <div className="col-span-2 flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={transaction.avatar}
                                    alt={transaction.client}
                                  />
                                  <AvatarFallback>
                                    {transaction.client
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {transaction.client}
                                  </p>
                                </div>
                              </div>
                              <div>{transaction.date}</div>
                              <div>{transaction.amount}</div>
                              <div>
                                <Badge
                                  variant="outline"
                                  className={`${
                                    transaction.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  } text-white`}
                                >
                                  {transaction.status === "completed"
                                    ? "Payé"
                                    : "En attente"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PrivateLayout>
  );
}
