"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  ArrowLeft,
  Send,
  AlertTriangle,
  Bug,
  HelpCircle,
  FileQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const categories = [
  {
    value: "bug",
    label: "Bug / Probleme technique",
    icon: Bug,
    description: "Signalez un probleme technique sur le site",
  },
  {
    value: "reclamation",
    label: "Reclamation",
    icon: AlertTriangle,
    description: "Script expire, contenu inapproprie, etc.",
  },
  {
    value: "question",
    label: "Question",
    icon: HelpCircle,
    description: "Posez une question sur le fonctionnement",
  },
  {
    value: "autre",
    label: "Autre",
    icon: FileQuestion,
    description: "Autre type de demande",
  },
];

export default function NewTicketPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    priority: "medium",
    subject: "",
    message: "",
    resourceSlug: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Ticket cree avec succes!");
    router.push("/tickets");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/tickets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux tickets
          </Link>
        </Button>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/20">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Nouveau Ticket
              </h1>
              <p className="text-muted-foreground">
                Decrivez votre probleme ou question
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <Label>Categorie *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, category: cat.value })
                    }
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.category === cat.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon
                        className={`w-5 h-5 ${
                          formData.category === cat.value
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {cat.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label>Priorite</Label>
              <RadioGroup
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-muted-foreground cursor-pointer">
                    Basse
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-yellow-400 cursor-pointer">
                    Moyenne
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-destructive cursor-pointer">
                    Haute
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Resource (if reclamation) */}
            {formData.category === "reclamation" && (
              <div className="space-y-2">
                <Label>Ressource concernee (optionnel)</Label>
                <Input
                  value={formData.resourceSlug}
                  onChange={(e) =>
                    setFormData({ ...formData, resourceSlug: e.target.value })
                  }
                  placeholder="Nom ou URL de la ressource"
                  className="bg-secondary border-border"
                />
              </div>
            )}

            {/* Subject */}
            <div className="space-y-2">
              <Label>Sujet *</Label>
              <Input
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Resumez votre demande en quelques mots"
                className="bg-secondary border-border"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.subject.length}/100
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Decrivez votre probleme ou question en detail..."
                className="bg-secondary border-border min-h-[150px]"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.message.length}/2000
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
