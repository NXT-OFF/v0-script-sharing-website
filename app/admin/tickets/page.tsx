"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  User,
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: "bug" | "reclamation" | "question" | "autre";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Script expire mais toujours disponible",
    category: "reclamation",
    status: "open",
    priority: "high",
    user: { id: "1", username: "DarkRP_Master", avatar: "" },
    messages: [
      {
        id: "1",
        userId: "1",
        username: "DarkRP_Master",
        avatar: "",
        message:
          "Bonjour, le script 'Advanced MDT' a expire mais le lien de telechargement est toujours actif. Pouvez-vous verifier?",
        isAdmin: false,
        createdAt: "2024-03-15 10:30",
      },
    ],
    createdAt: "2024-03-15 10:30",
    updatedAt: "2024-03-15 10:30",
  },
  {
    id: "2",
    subject: "Probleme de telechargement",
    category: "bug",
    status: "in_progress",
    priority: "medium",
    user: { id: "2", username: "MapperPro", avatar: "" },
    messages: [
      {
        id: "1",
        userId: "2",
        username: "MapperPro",
        avatar: "",
        message:
          "Je n'arrive pas a telecharger les fichiers, j'ai une erreur 500.",
        isAdmin: false,
        createdAt: "2024-03-14 15:20",
      },
      {
        id: "2",
        userId: "admin",
        username: "Admin",
        avatar: "",
        message:
          "Bonjour, pouvez-vous me donner plus de details? Quel navigateur utilisez-vous?",
        isAdmin: true,
        createdAt: "2024-03-14 16:00",
      },
    ],
    createdAt: "2024-03-14 15:20",
    updatedAt: "2024-03-14 16:00",
  },
  {
    id: "3",
    subject: "Question sur les parrainages",
    category: "question",
    status: "resolved",
    priority: "low",
    user: { id: "3", username: "NewUser123", avatar: "" },
    messages: [
      {
        id: "1",
        userId: "3",
        username: "NewUser123",
        avatar: "",
        message: "Comment fonctionne le systeme de parrainage?",
        isAdmin: false,
        createdAt: "2024-03-13 09:00",
      },
      {
        id: "2",
        userId: "admin",
        username: "Admin",
        avatar: "",
        message:
          "Bonjour! Le systeme de parrainage vous permet d'obtenir des telechargements bonus. Partagez votre code de parrainage et gagnez 5 telechargements par nouvel inscrit!",
        isAdmin: true,
        createdAt: "2024-03-13 09:30",
      },
    ],
    createdAt: "2024-03-13 09:00",
    updatedAt: "2024-03-13 09:30",
  },
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId ? { ...t, status: newStatus as Ticket["status"] } : t
      )
    );
    toast.success("Statut mis a jour");
  };

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      userId: "admin",
      username: "Admin",
      avatar: "",
      message: replyMessage,
      isAdmin: true,
      createdAt: new Date().toLocaleString("fr-FR"),
    };

    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              status: t.status === "open" ? "in_progress" : t.status,
              updatedAt: new Date().toLocaleString("fr-FR"),
            }
          : t
      )
    );

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
    });

    setReplyMessage("");
    toast.success("Reponse envoyee");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Ouvert
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <MessageSquare className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolu
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <XCircle className="w-3 h-3 mr-1" />
            Ferme
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Haute
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Moyenne
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-muted text-muted-foreground">Basse</Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      bug: "bg-red-500/20 text-red-400 border-red-500/30",
      reclamation: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      question: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      autre: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = {
      bug: "Bug",
      reclamation: "Reclamation",
      question: "Question",
      autre: "Autre",
    };
    return <Badge className={colors[category]}>{labels[category]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Gestion des Tickets
        </h1>
        <p className="text-muted-foreground">
          Repondez aux demandes des utilisateurs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {tickets.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
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
                {tickets.filter((t) => t.status === "open").length}
              </p>
              <p className="text-sm text-muted-foreground">Ouverts</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {tickets.filter((t) => t.status === "in_progress").length}
              </p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {tickets.filter((t) => t.priority === "high").length}
              </p>
              <p className="text-sm text-muted-foreground">Priorite haute</p>
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
              placeholder="Rechercher par sujet ou utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="open">Ouverts</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="resolved">Resolus</SelectItem>
              <SelectItem value="closed">Fermes</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-40 bg-secondary border-border">
              <SelectValue placeholder="Categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="reclamation">Reclamation</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="glass rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Ticket</TableHead>
              <TableHead className="text-muted-foreground">Utilisateur</TableHead>
              <TableHead className="text-muted-foreground">Categorie</TableHead>
              <TableHead className="text-muted-foreground">Priorite</TableHead>
              <TableHead className="text-muted-foreground">Statut</TableHead>
              <TableHead className="text-muted-foreground">Derniere maj</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-border">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">
                      #{ticket.id} - {ticket.subject}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.messages.length} message(s)
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={ticket.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {ticket.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">
                      {ticket.user.username}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getCategoryBadge(ticket.category)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {ticket.updatedAt}
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
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Voir / Repondre
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(ticket.id, "resolved")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marquer resolu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(ticket.id, "closed")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Fermer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent className="glass border-border max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Ticket #{selectedTicket?.id}
            </DialogTitle>
            <DialogDescription>{selectedTicket?.subject}</DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 flex-wrap">
            {selectedTicket && getCategoryBadge(selectedTicket.category)}
            {selectedTicket && getPriorityBadge(selectedTicket.priority)}
            {selectedTicket && getStatusBadge(selectedTicket.status)}
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {selectedTicket?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isAdmin ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                    <AvatarFallback
                      className={`text-xs ${msg.isAdmin ? "bg-primary/20 text-primary" : "bg-secondary text-foreground"}`}
                    >
                      {msg.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 max-w-[80%] ${msg.isAdmin ? "text-right" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {msg.username}
                      </span>
                      {msg.isAdmin && (
                        <Badge className="bg-primary/20 text-primary text-xs">
                          Admin
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {msg.createdAt}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.isAdmin
                          ? "bg-primary/20 text-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Ecrire une reponse..."
              className="bg-secondary border-border resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Select
                value={selectedTicket?.status}
                onValueChange={(value) => {
                  if (selectedTicket) {
                    handleStatusChange(selectedTicket.id, value);
                    setSelectedTicket({ ...selectedTicket, status: value as Ticket["status"] });
                  }
                }}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Ouvert</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="resolved">Resolu</SelectItem>
                  <SelectItem value="closed">Ferme</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                Fermer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
