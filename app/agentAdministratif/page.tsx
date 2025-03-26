"use client";

import type React from "react";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarIcon,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PrivateLayout from "@/components/public/private-layout";

// Interface pour les agents administratifs
interface AgentAdministratif {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  fonction: string;
  niveauAcces: "standard" | "avancé" | "administrateur";
  permissions: string[];
  dateEmbauche: Date;
  statut: "actif" | "inactif";
}

// Données d'exemple
const agentsInitiaux: AgentAdministratif[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@gobering.com",
    telephone: "514-555-1234",
    fonction: "Responsable administrative",
    niveauAcces: "administrateur",
    permissions: [
      "gestion_utilisateurs",
      "gestion_rendez_vous",
      "gestion_facturation",
      "gestion_rapports",
    ],
    dateEmbauche: new Date("2020-03-15"),
    statut: "actif",
  },
  {
    id: "2",
    nom: "Tremblay",
    prenom: "Jean",
    email: "jean.tremblay@gobering.com",
    telephone: "514-555-2345",
    fonction: "Assistant administratif",
    niveauAcces: "standard",
    permissions: ["gestion_rendez_vous"],
    dateEmbauche: new Date("2021-06-10"),
    statut: "actif",
  },
  {
    id: "3",
    nom: "Lavoie",
    prenom: "Sophie",
    email: "sophie.lavoie@gobering.com",
    telephone: "514-555-3456",
    fonction: "Coordinatrice administrative",
    niveauAcces: "avancé",
    permissions: ["gestion_rendez_vous", "gestion_facturation"],
    dateEmbauche: new Date("2019-11-05"),
    statut: "actif",
  },
  {
    id: "4",
    nom: "Gagnon",
    prenom: "Philippe",
    email: "philippe.gagnon@gobering.com",
    telephone: "514-555-4567",
    fonction: "Gestionnaire de bureau",
    niveauAcces: "avancé",
    permissions: [
      "gestion_rendez_vous",
      "gestion_facturation",
      "gestion_rapports",
    ],
    dateEmbauche: new Date("2018-09-20"),
    statut: "inactif",
  },
  {
    id: "5",
    nom: "Bergeron",
    prenom: "Isabelle",
    email: "isabelle.bergeron@gobering.com",
    telephone: "514-555-5678",
    fonction: "Réceptionniste",
    niveauAcces: "standard",
    permissions: ["gestion_rendez_vous"],
    dateEmbauche: new Date("2022-01-15"),
    statut: "actif",
  },
];

// Liste des permissions disponibles
const permissionsDisponibles = [
  { id: "gestion_utilisateurs", label: "Gestion des utilisateurs" },
  { id: "gestion_rendez_vous", label: "Gestion des rendez-vous" },
  { id: "gestion_facturation", label: "Gestion de la facturation" },
  { id: "gestion_rapports", label: "Gestion des rapports" },
  { id: "gestion_services", label: "Gestion des services" },
  { id: "gestion_professionnels", label: "Gestion des professionnels" },
  { id: "gestion_adresses", label: "Gestion des adresses" },
];

export default function GestionAgentsAdministratifs() {
  const [agents, setAgents] = useState<AgentAdministratif[]>(agentsInitiaux);
  const [agentFiltre, setAgentFiltre] = useState<string>("");
  const [agentCourant, setAgentCourant] = useState<AgentAdministratif | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;

  // État pour le formulaire
  const [formData, setFormData] = useState<Omit<AgentAdministratif, "id">>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    fonction: "",
    niveauAcces: "standard",
    permissions: [],
    dateEmbauche: new Date(),
    statut: "actif",
  });

  // Filtrer les agents en fonction de la recherche
  const agentsFiltres = agents.filter(
    (agent) =>
      agent.nom.toLowerCase().includes(agentFiltre.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(agentFiltre.toLowerCase()) ||
      agent.email.toLowerCase().includes(agentFiltre.toLowerCase()) ||
      agent.fonction.toLowerCase().includes(agentFiltre.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(agentsFiltres.length / itemsPerPage);
  const agentsAffiches = agentsFiltres.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Ouvrir le modal pour ajouter un agent
  const ouvrirModalAjout = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      fonction: "",
      niveauAcces: "standard",
      permissions: [],
      dateEmbauche: new Date(),
      statut: "actif",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour éditer un agent
  const ouvrirModalEdition = (agent: AgentAdministratif) => {
    setAgentCourant(agent);
    setFormData({
      nom: agent.nom,
      prenom: agent.prenom,
      email: agent.email,
      telephone: agent.telephone,
      fonction: agent.fonction,
      niveauAcces: agent.niveauAcces,
      permissions: agent.permissions,
      dateEmbauche: agent.dateEmbauche,
      statut: agent.statut,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer les changements de niveau d'accès
  const handleNiveauAccesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      niveauAcces: value as "standard" | "avancé" | "administrateur",
    }));
  };

  // Gérer les changements de statut
  const handleStatutChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      statut: value as "actif" | "inactif",
    }));
  };

  // Gérer les changements de date d'embauche
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, dateEmbauche: date }));
    }
  };

  // Gérer les changements de permissions
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, permissions: [...prev.permissions, permissionId] };
      } else {
        return {
          ...prev,
          permissions: prev.permissions.filter((id) => id !== permissionId),
        };
      }
    });
  };

  // Sauvegarder un agent (ajout ou modification)
  const sauvegarderAgent = () => {
    if (isEditMode && agentCourant) {
      // Mise à jour d'un agent existant
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === agentCourant.id
            ? { ...formData, id: agentCourant.id }
            : agent
        )
      );
    } else {
      // Ajout d'un nouvel agent
      const nouvelAgent: AgentAdministratif = {
        ...formData,
        id: `${agents.length + 1}`,
      };
      setAgents((prev) => [...prev, nouvelAgent]);
    }
    setIsModalOpen(false);
  };

  // Supprimer un agent
  const supprimerAgent = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  // Obtenir le libellé d'une permission
  const getPermissionLabel = (permissionId: string) => {
    const permission = permissionsDisponibles.find(
      (p) => p.id === permissionId
    );
    return permission ? permission.label : permissionId;
  };

  return (
    <PrivateLayout>
      <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6">
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Gestion des agents administratifs
            </h1>
            <Button onClick={ouvrirModalAjout}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un agent
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un agent..."
                className="pl-8"
                value={agentFiltre}
                onChange={(e) => setAgentFiltre(e.target.value)}
              />
              {agentFiltre && (
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-9 w-9 p-0"
                  onClick={() => setAgentFiltre("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Effacer la recherche</span>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Fonction</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Niveau d'accès</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentsAffiches.length > 0 ? (
                  agentsAffiches.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">
                        {agent.prenom} {agent.nom}
                      </TableCell>
                      <TableCell>{agent.fonction}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            agent.niveauAcces === "administrateur"
                              ? "destructive"
                              : agent.niveauAcces === "avancé"
                              ? "default"
                              : "outline"
                          }
                        >
                          {agent.niveauAcces}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            agent.statut === "actif" ? "success" : "secondary"
                          }
                        >
                          {agent.statut}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => ouvrirModalEdition(agent)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive">
                                  Attention : Suppression d'agent administratif
                                </AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2">
                                  <p>
                                    Vous êtes sur le point de supprimer
                                    définitivement cet agent administratif de la
                                    base de données.
                                  </p>
                                  <div className="rounded-md bg-amber-50 p-4 mt-2">
                                    <div className="flex">
                                      <div className="flex-shrink-0">
                                        <svg
                                          className="h-5 w-5 text-amber-400"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          aria-hidden="true"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                      <div className="ml-3">
                                        <h3 className="text-sm font-medium text-amber-800">
                                          Conséquences de cette action :
                                        </h3>
                                        <div className="mt-2 text-sm text-amber-700">
                                          <ul className="list-disc space-y-1 pl-5">
                                            <li>
                                              Tous les accès de cet agent au
                                              système seront immédiatement
                                              révoqués
                                            </li>
                                            <li>
                                              Les tâches assignées à cet agent
                                              devront être réassignées
                                              manuellement
                                            </li>
                                            <li>
                                              L'historique des actions
                                              effectuées par cet agent sera
                                              conservé
                                            </li>
                                            <li>
                                              Cette action est irréversible et
                                              ne peut pas être annulée
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="font-medium mt-2">
                                    Êtes-vous absolument sûr de vouloir procéder
                                    à la suppression ?
                                  </p>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => supprimerAgent(agent.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer définitivement
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun agent trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Modal pour ajouter/modifier un agent */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? "Modifier un agent administratif"
                    : "Ajouter un agent administratif"}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="informations" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="informations">Informations</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>

                <TabsContent value="informations" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fonction">Fonction</Label>
                    <Input
                      id="fonction"
                      name="fonction"
                      value={formData.fonction}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="niveauAcces">Niveau d'accès</Label>
                      <Select
                        value={formData.niveauAcces}
                        onValueChange={handleNiveauAccesChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="avancé">Avancé</SelectItem>
                          <SelectItem value="administrateur">
                            Administrateur
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statut">Statut</Label>
                      <Select
                        value={formData.statut}
                        onValueChange={handleStatutChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actif">Actif</SelectItem>
                          <SelectItem value="inactif">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date d'embauche</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dateEmbauche && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dateEmbauche ? (
                            format(formData.dateEmbauche, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dateEmbauche}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium">
                        Permissions de l'agent
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {permissionsDisponibles.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(
                              permission.id
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                permission.id,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-normal"
                          >
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button onClick={sauvegarderAgent}>
                  {isEditMode ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </PrivateLayout>
  );
}
