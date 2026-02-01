"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  ExternalLink,
  GripVertical,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  showInNav: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const mockPages: Page[] = [
  {
    id: "1",
    title: "Regles du Site",
    slug: "regles",
    content: "Contenu des regles...",
    isPublished: true,
    showInNav: true,
    order: 1,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "2",
    title: "FAQ",
    slug: "faq",
    content: "Questions frequentes...",
    isPublished: true,
    showInNav: true,
    order: 2,
    createdAt: "2024-01-20",
    updatedAt: "2024-03-08",
  },
  {
    id: "3",
    title: "Mentions Legales",
    slug: "mentions-legales",
    content: "Mentions legales...",
    isPublished: true,
    showInNav: false,
    order: 3,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "4",
    title: "Politique de Confidentialite",
    slug: "confidentialite",
    content: "Politique...",
    isPublished: false,
    showInNav: false,
    order: 4,
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
  },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    page: Page | null;
    isNew: boolean;
  }>({ open: false, page: null, isNew: false });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    page: Page | null;
  }>({ open: false, page: null });

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    isPublished: true,
    showInNav: false,
  });

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateDialog = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      isPublished: true,
      showInNav: false,
    });
    setEditDialog({ open: true, page: null, isNew: true });
  };

  const openEditDialog = (page: Page) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isPublished: page.isPublished,
      showInNav: page.showInNav,
    });
    setEditDialog({ open: true, page, isNew: false });
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug) {
      toast.error("Titre et slug sont obligatoires");
      return;
    }

    if (editDialog.isNew) {
      const newPage: Page = {
        id: Date.now().toString(),
        ...formData,
        order: pages.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setPages([...pages, newPage]);
      toast.success("Page creee avec succes");
    } else {
      setPages(
        pages.map((p) =>
          p.id === editDialog.page?.id
            ? { ...p, ...formData, updatedAt: new Date().toISOString().split("T")[0] }
            : p
        )
      );
      toast.success("Page mise a jour");
    }

    setEditDialog({ open: false, page: null, isNew: false });
  };

  const handleDelete = () => {
    if (!deleteDialog.page) return;
    setPages(pages.filter((p) => p.id !== deleteDialog.page?.id));
    toast.success("Page supprimee");
    setDeleteDialog({ open: false, page: null });
  };

  const togglePublish = (pageId: string) => {
    setPages(
      pages.map((p) =>
        p.id === pageId ? { ...p, isPublished: !p.isPublished } : p
      )
    );
    toast.success("Statut de publication mis a jour");
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestion des Pages
          </h1>
          <p className="text-muted-foreground">
            Creez et gerez les pages statiques du site
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Page
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pages.length}</p>
              <p className="text-sm text-muted-foreground">Total Pages</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pages.filter((p) => p.isPublished).length}
              </p>
              <p className="text-sm text-muted-foreground">Publiees</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <ExternalLink className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pages.filter((p) => p.showInNav).length}
              </p>
              <p className="text-sm text-muted-foreground">Dans la nav</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground w-10"></TableHead>
              <TableHead className="text-muted-foreground">Titre</TableHead>
              <TableHead className="text-muted-foreground">Slug</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="text-muted-foreground">Navigation</TableHead>
              <TableHead className="text-muted-foreground">Mise a jour</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id} className="border-border">
                <TableCell>
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {page.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-secondary px-2 py-1 rounded text-muted-foreground">
                    /{page.slug}
                  </code>
                </TableCell>
                <TableCell>
                  {page.isPublished ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Eye className="w-3 h-3 mr-1" />
                      Publiee
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Brouillon
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {page.showInNav ? (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Visible
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {page.updatedAt}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => openEditDialog(page)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/p/${page.slug}`, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => togglePublish(page.id)}>
                        {page.isPublished ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Depublier
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Publier
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ open: true, page })}
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

      {/* Edit/Create Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) =>
          setEditDialog({ open, page: null, isNew: false })
        }
      >
        <DialogContent className="glass border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editDialog.isNew ? "Creer une page" : "Modifier la page"}
            </DialogTitle>
            <DialogDescription>
              {editDialog.isNew
                ? "Creez une nouvelle page statique"
                : "Modifiez le contenu de la page"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: editDialog.isNew
                        ? generateSlug(e.target.value)
                        : formData.slug,
                    });
                  }}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contenu (Markdown)</Label>
              <Textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={10}
                className="bg-secondary border-border font-mono text-sm"
                placeholder="# Titre&#10;&#10;Votre contenu ici..."
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPublished: checked })
                  }
                />
                <Label>Publiee</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.showInNav}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, showInNav: checked })
                  }
                />
                <Label>Afficher dans la navigation</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setEditDialog({ open: false, page: null, isNew: false })
              }
            >
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editDialog.isNew ? "Creer" : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, page: null })}
      >
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer la page "{deleteDialog.page?.title}
              " ? Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, page: null })}
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
