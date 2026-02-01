"use client";

import React from "react"

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Star,
  FileCode,
  Map,
  Wrench,
  Monitor,
  Database,
  Shirt,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: {
    username: string;
    avatar: string;
  };
  status: "pending" | "approved" | "rejected";
  downloads: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  expires_at: string | null;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Advanced Police MDT System",
    slug: "advanced-police-mdt",
    category: "script",
    author: { username: "DarkRP_Master", avatar: "" },
    status: "approved",
    downloads: 1234,
    rating: 4.8,
    reviews_count: 45,
    created_at: "2024-03-10",
    expires_at: null,
  },
  {
    id: "2",
    title: "Legion Square Revamp",
    slug: "legion-square-revamp",
    category: "mapping",
    author: { username: "MapperPro", avatar: "" },
    status: "pending",
    downloads: 0,
    rating: 0,
    reviews_count: 0,
    created_at: "2024-03-15",
    expires_at: null,
  },
  {
    id: "3",
    title: "Animated Loading Screen",
    slug: "animated-loading",
    category: "loading",
    author: { username: "UIDesigner", avatar: "" },
    status: "approved",
    downloads: 567,
    rating: 4.2,
    reviews_count: 23,
    created_at: "2024-03-08",
    expires_at: "2024-04-08",
  },
  {
    id: "4",
    title: "Stolen Script Pack",
    slug: "stolen-scripts",
    category: "script",
    author: { username: "Cheater123", avatar: "" },
    status: "rejected",
    downloads: 0,
    rating: 0,
    reviews_count: 0,
    created_at: "2024-03-12",
    expires_at: null,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  script: <FileCode className="w-4 h-4" />,
  mapping: <Map className="w-4 h-4" />,
  tool: <Wrench className="w-4 h-4" />,
  loading: <Monitor className="w-4 h-4" />,
  base: <Database className="w-4 h-4" />,
  clothing: <Shirt className="w-4 h-4" />,
};

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    resource: Resource | null;
  }>({ open: false, resource: null });

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || resource.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || resource.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusChange = async (resourceId: string, newStatus: string) => {
    toast.success(`Ressource ${newStatus === "approved" ? "approuvee" : "rejetee"}`);
  };

  const handleDelete = async () => {
    if (!deleteDialog.resource) return;
    toast.success("Ressource supprimee");
    setDeleteDialog({ open: false, resource: null });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuve
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejete
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      script: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      mapping: "bg-green-500/20 text-green-400 border-green-500/30",
      tool: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      loading: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      base: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      clothing: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    };

    return (
      <Badge className={colors[category] || "bg-muted"}>
        {categoryIcons[category]}
        <span className="ml-1 capitalize">{category}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Gestion des Ressources
        </h1>
        <p className="text-muted-foreground">
          Approuvez, modifiez ou supprimez les ressources
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <FileCode className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockResources.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Ressources</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockResources.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockResources.filter((r) => r.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approuvees</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockResources.reduce((sum, r) => sum + r.downloads, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Telechargements</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="script">Scripts</SelectItem>
              <SelectItem value="mapping">Mappings</SelectItem>
              <SelectItem value="tool">Tools</SelectItem>
              <SelectItem value="loading">Loading</SelectItem>
              <SelectItem value="base">Bases</SelectItem>
              <SelectItem value="clothing">Tenues</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuve</SelectItem>
              <SelectItem value="rejected">Rejete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Ressource</TableHead>
              <TableHead className="text-muted-foreground">Categorie</TableHead>
              <TableHead className="text-muted-foreground">Auteur</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="text-muted-foreground">Stats</TableHead>
              <TableHead className="text-muted-foreground">Expiration</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((resource) => (
              <TableRow key={resource.id} className="border-border">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">
                      {resource.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      /{resource.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(resource.category)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={resource.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {resource.author.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">
                      {resource.author.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(resource.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{resource.downloads}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-foreground">
                        {resource.rating > 0 ? resource.rating.toFixed(1) : "N/A"}
                      </span>
                      <span className="text-muted-foreground">
                        ({resource.reviews_count})
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {resource.expires_at ? (
                    <span className="text-yellow-400 text-sm">
                      {resource.expires_at}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {resource.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(resource.id, "approved")
                            }
                            className="text-primary"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approuver
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(resource.id, "rejected")
                            }
                            className="text-destructive"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          setDeleteDialog({ open: true, resource })
                        }
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, resource: null })}
      >
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer "{deleteDialog.resource?.title}"
              ? Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, resource: null })}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
