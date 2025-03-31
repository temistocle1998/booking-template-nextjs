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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Edit, Trash2, MapPin, Tag, User } from "lucide-react";
import PrivateLayout from "@/components/public/private-layout";

// Type pour une adresse
interface Adresse {
  id: string;
  nom: string;
  numeroCivique: string;
  rue: string;
  appartement: string;
  ville: string;
  province: string;
  codePostal: string;
  latitude: string;
  longitude: string;
}

// Données d'exemple
const adressesInitiales: Adresse[] = [
  {
    id: "1",
    nom: "Siège social",
    numeroCivique: "123",
    rue: "Boulevard Saint-Laurent",
    appartement: "",
    ville: "Montréal",
    province: "Québec",
    codePostal: "H2T 1R7",
    latitude: "45.5169",
    longitude: "-73.5923",
  },
  {
    id: "2",
    nom: "Succursale Rive-Sud",
    numeroCivique: "456",
    rue: "Boulevard Taschereau",
    appartement: "Suite 200",
    ville: "Brossard",
    province: "Québec",
    codePostal: "J4Z 1A7",
    latitude: "45.4631",
    longitude: "-73.4660",
  },
  {
    id: "3",
    nom: "Bureau Laval",
    numeroCivique: "789",
    rue: "Boulevard Le Corbusier",
    appartement: "301",
    ville: "Laval",
    province: "Québec",
    codePostal: "H7S 2K9",
    latitude: "45.5581",
    longitude: "-73.7445",
  },
];

export default function GestionAdresses() {
  const [adresses, setAdresses] = useState<Adresse[]>(adressesInitiales);
  const [adresseActuelle, setAdresseActuelle] = useState<Adresse | null>(null);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [alerteSuppressionOuverte, setAlerteSuppressionOuverte] =
    useState(false);
  const [adresseASupprimer, setAdresseASupprimer] = useState<string | null>(
    null
  );
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const adressesParPage = 5;

  // Filtrer les adresses en fonction de la recherche
  const adressesFiltrees = adresses.filter(
    (adresse) =>
      adresse.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      adresse.ville.toLowerCase().includes(recherche.toLowerCase()) ||
      adresse.rue.toLowerCase().includes(recherche.toLowerCase())
  );

  // Pagination
  const indexDerniereAdresse = page * adressesParPage;
  const indexPremiereAdresse = indexDerniereAdresse - adressesParPage;
  const adressesActuelles = adressesFiltrees.slice(
    indexPremiereAdresse,
    indexDerniereAdresse
  );
  const totalPages = Math.ceil(adressesFiltrees.length / adressesParPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Formulaire vide pour nouvelle adresse
  const nouvelleAdresseVide: Adresse = {
    id: "",
    nom: "",
    numeroCivique: "",
    rue: "",
    appartement: "",
    ville: "",
    province: "",
    codePostal: "",
    latitude: "",
    longitude: "",
  };

  // Ouvrir le modal pour ajouter une adresse
  const ajouterAdresse = () => {
    setAdresseActuelle({ ...nouvelleAdresseVide, id: Date.now().toString() });
    setModalOuvert(true);
  };

  // Ouvrir le modal pour modifier une adresse
  const modifierAdresse = (id: string) => {
    const adresse = adresses.find((a) => a.id === id);
    if (adresse) {
      setAdresseActuelle({ ...adresse });
      setModalOuvert(true);
    }
  };

  // Confirmer la suppression d'une adresse
  const confirmerSuppression = (id: string) => {
    setAdresseASupprimer(id);
    setAlerteSuppressionOuverte(true);
  };

  // Supprimer une adresse
  const supprimerAdresse = () => {
    if (adresseASupprimer) {
      setAdresses(adresses.filter((a) => a.id !== adresseASupprimer));
      setAlerteSuppressionOuverte(false);
      setAdresseASupprimer(null);
    }
  };

  // Sauvegarder une adresse (ajout ou modification)
  const sauvegarderAdresse = () => {
    if (adresseActuelle) {
      // Vérifier si c'est une nouvelle adresse ou une modification
      const index = adresses.findIndex((a) => a.id === adresseActuelle.id);

      if (index !== -1) {
        // Modification
        const nouvellesAdresses = [...adresses];
        nouvellesAdresses[index] = adresseActuelle;
        setAdresses(nouvellesAdresses);
      } else {
        // Ajout
        setAdresses([...adresses, adresseActuelle]);
      }

      setModalOuvert(false);
      setAdresseActuelle(null);
    }
  };

  // Mettre à jour les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (adresseActuelle) {
      setAdresseActuelle({
        ...adresseActuelle,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <PrivateLayout>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center">
                  <MapPin className="mr-2 h-6 w-6" />
                  Gestion des adresses
                </CardTitle>
                <CardDescription>
                  Gérez les adresses de votre entreprise
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={recherche}
                    onChange={(e) => {
                      setRecherche(e.target.value);
                      setPage(1); // Réinitialiser à la première page lors d'une recherche
                    }}
                  />
                </div>
                <Button onClick={ajouterAdresse} className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une adresse
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Adresse
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Ville
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Code postal
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adressesActuelles.length > 0 ? (
                    adressesActuelles.map((adresse) => (
                      <TableRow key={adresse.id}>
                        <TableCell className="font-medium">
                          {adresse.nom}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {adresse.numeroCivique} {adresse.rue}
                          {adresse.appartement &&
                            `, App. ${adresse.appartement}`}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {adresse.ville}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {adresse.codePostal}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => modifierAdresse(adresse.id)}
                              aria-label="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => confirmerSuppression(adresse.id)}
                              className="text-destructive"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Aucune adresse trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            onClick={() => setPage(p)}
                            isActive={page === p}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal pour ajouter/modifier une adresse */}
        <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {adresseActuelle &&
                adresses.some((a) => a.id === adresseActuelle.id)
                  ? "Modifier l'adresse"
                  : "Ajouter une adresse"}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'adresse ci-dessous.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="nom">Nom de l'établissement</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={adresseActuelle?.nom || ""}
                    onChange={handleChange}
                    placeholder="Siège social, Succursale, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numeroCivique">Numéro Civique</Label>
                  <Input
                    id="numeroCivique"
                    name="numeroCivique"
                    value={adresseActuelle?.numeroCivique || ""}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="rue">Nom de la rue</Label>
                  <Input
                    id="rue"
                    name="rue"
                    value={adresseActuelle?.rue || ""}
                    onChange={handleChange}
                    placeholder="Boulevard Saint-Laurent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="appartement">App. / Suite (optionnel)</Label>
                  <Input
                    id="appartement"
                    name="appartement"
                    value={adresseActuelle?.appartement || ""}
                    onChange={handleChange}
                    placeholder="Suite 200"
                  />
                </div>
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    name="ville"
                    value={adresseActuelle?.ville || ""}
                    onChange={handleChange}
                    placeholder="Montréal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    name="province"
                    value={adresseActuelle?.province || ""}
                    onChange={handleChange}
                    placeholder="Québec"
                  />
                </div>
                <div>
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    name="codePostal"
                    value={adresseActuelle?.codePostal || ""}
                    onChange={handleChange}
                    placeholder="H2T 1R7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude (optionnel)</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    value={adresseActuelle?.latitude || ""}
                    onChange={handleChange}
                    placeholder="45.5169"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (optionnel)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    value={adresseActuelle?.longitude || ""}
                    onChange={handleChange}
                    placeholder="-73.5923"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOuvert(false)}>
                Annuler
              </Button>
              <Button onClick={sauvegarderAdresse}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Alerte de confirmation de suppression */}
        <AlertDialog
          open={alerteSuppressionOuverte}
          onOpenChange={setAlerteSuppressionOuverte}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir supprimer cette adresse?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cette adresse sera définitivement
                supprimée de notre système.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={supprimerAdresse}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PrivateLayout>
  );
}
