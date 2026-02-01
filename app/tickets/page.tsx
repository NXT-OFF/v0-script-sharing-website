"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const mockTickets = [
  {
    id: "1",
    subject: "Probleme de telechargement",
    category: "bug",
    status: "in_progress",
    messages_count: 3,
    created_at: "2024-03-15 10:30",
    updated_at: "2024-03-15 14:00",
  },
  {
    id: "2",
    subject: "Question sur le parrainage",
    category: "question",
    status: "resolved",
    messages_count: 2,
    created_at: "2024-03-10 09:00",
    updated_at: "2024-03-10 11:30",
  },
  {
    id: "3",
    subject: "Script expire",
    category: "reclamation",
    status: "open",
    messages_count: 1,
    created_at: "2024-03-14 16:00",
    updated_at: "2024-03-14 16:00",
  },
];

export default function TicketsPage() {
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes Tickets</h1>
            <p className="text-muted-foreground">
              Gerez vos demandes de support
            </p>
          </div>
          <Button asChild>
            <Link href="/tickets/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Ticket
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockTickets.length}
                </p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </Card>
          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockTickets.filter((t) => t.status === "open").length}
                </p>
                <p className="text-sm text-muted-foreground">Ouverts</p>
              </div>
            </div>
          </Card>
          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <MessageSquare className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockTickets.filter((t) => t.status === "in_progress").length}
                </p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </Card>
          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockTickets.filter((t) => t.status === "resolved").length}
                </p>
                <p className="text-sm text-muted-foreground">Resolus</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tickets List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {mockTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-muted-foreground text-sm">
                        #{ticket.id}
                      </span>
                      <h3 className="font-medium text-foreground">
                        {ticket.subject}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {getCategoryBadge(ticket.category)}
                      {getStatusBadge(ticket.status)}
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.messages_count} messages
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Mis a jour: {ticket.updated_at}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {mockTickets.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Vous n'avez pas encore de tickets
            </p>
            <Button className="mt-4" asChild>
              <Link href="/tickets/new">Creer un ticket</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
