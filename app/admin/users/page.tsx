"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  Ban,
  CheckCircle,
  Download,
  Users,
  Crown,
  UserX,
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: "user" | "moderator" | "admin";
  status: "active" | "banned" | "suspended";
  downloads_today: number;
  download_limit: number;
  total_downloads: number;
  total_uploads: number;
  referral_code: string;
  referrals_count: number;
  created_at: string;
  last_login: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "DarkRP_Master",
    email: "darkrp@example.com",
    avatar: "",
    role: "admin",
    status: "active",
    downloads_today: 5,
    download_limit: 999,
    total_downloads: 234,
    total_uploads: 45,
    referral_code: "DARK2024",
    referrals_count: 12,
    created_at: "2024-01-15",
    last_login: "2024-03-15 14:30",
  },
  {
    id: "2",
    username: "ScriptKing",
    email: "script@example.com",
    avatar: "",
    role: "moderator",
    status: "active",
    downloads_today: 3,
    download_limit: 50,
    total_downloads: 156,
    total_uploads: 23,
    referral_code: "KING2024",
    referrals_count: 8,
    created_at: "2024-02-20",
    last_login: "2024-03-14 09:15",
  },
  {
    id: "3",
    username: "MapperPro",
    email: "mapper@example.com",
    avatar: "",
    role: "user",
    status: "active",
    downloads_today: 8,
    download_limit: 10,
    total_downloads: 89,
    total_uploads: 5,
    referral_code: "MAP2024",
    referrals_count: 2,
    created_at: "2024-03-01",
    last_login: "2024-03-15 11:00",
  },
  {
    id: "4",
    username: "Cheater123",
    email: "banned@example.com",
    avatar: "",
    role: "user",
    status: "banned",
    downloads_today: 0,
    download_limit: 0,
    total_downloads: 12,
    total_uploads: 0,
    referral_code: "BAN2024",
    referrals_count: 0,
    created_at: "2024-03-10",
    last_login: "2024-03-12 16:45",
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDownloadLimit, setEditDownloadLimit] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    toast.success(`Role mis a jour vers ${newRole}`);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    toast.success(`Statut mis a jour vers ${newStatus}`);
  };

  const handleUpdateDownloadLimit = async () => {
    if (!selectedUser) return;
    toast.success(
      `Limite de telechargement mise a jour: ${editDownloadLimit}`
    );
    setEditDialogOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Moderateur
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Users className="w-3 h-3 mr-1" />
            Utilisateur
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <Ban className="w-3 h-3 mr-1" />
            Banni
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-warning/20 text-yellow-400 border-yellow-500/30">
            <UserX className="w-3 h-3 mr-1" />
            Suspendu
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Gestion des Utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Gerez les utilisateurs, leurs roles et permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockUsers.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Utilisateurs</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Crown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockUsers.filter((u) => u.role === "admin").length}
              </p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockUsers.filter((u) => u.role === "moderator").length}
              </p>
              <p className="text-sm text-muted-foreground">Moderateurs</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <Ban className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {mockUsers.filter((u) => u.status === "banned").length}
              </p>
              <p className="text-sm text-muted-foreground">Bannis</p>
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
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderateur</SelectItem>
              <SelectItem value="user">Utilisateur</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="banned">Banni</SelectItem>
              <SelectItem value="suspended">Suspendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Utilisateur</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="text-muted-foreground">Telechargements</TableHead>
              <TableHead className="text-muted-foreground">Uploads</TableHead>
              <TableHead className="text-muted-foreground">Parrainages</TableHead>
              <TableHead className="text-muted-foreground">Inscription</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.username}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {user.downloads_today}/{user.download_limit}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({user.total_downloads} total)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  {user.total_uploads}
                </TableCell>
                <TableCell>
                  <div className="text-foreground">
                    <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">
                      {user.referral_code}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({user.referrals_count})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.created_at}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setEditDownloadLimit(user.download_limit.toString());
                          setEditDialogOpen(true);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Modifier limite DL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "admin")}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                        Promouvoir Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "moderator")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Promouvoir Moderateur
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, "user")}
                      >
                        <ShieldOff className="w-4 h-4 mr-2" />
                        Retrograder Utilisateur
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === "banned" ? (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, "active")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Debannir
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, "banned")}
                          className="text-destructive"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          Bannir
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Download Limit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>Modifier la limite de telechargement</DialogTitle>
            <DialogDescription>
              Modifier la limite quotidienne pour {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Limite quotidienne</Label>
              <Input
                type="number"
                value={editDownloadLimit}
                onChange={(e) => setEditDownloadLimit(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Limite actuelle: {selectedUser?.download_limit} telechargements/jour
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateDownloadLimit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
