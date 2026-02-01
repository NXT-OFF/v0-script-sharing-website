"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Download,
  Heart,
  Upload,
  Star,
  Gift,
  Copy,
  Check,
  TrendingUp,
  Clock,
  FileCode,
  ExternalLink,
  Settings,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Mock user data
const mockUser = {
  id: "1",
  username: "DarkRP_Master",
  email: "darkrp@example.com",
  avatar: "",
  role: "user" as const,
  downloads_today: 7,
  download_limit: 10,
  bonus_downloads: 5,
  total_downloads: 156,
  total_uploads: 12,
  referral_code: "DARK2024",
  referrals_count: 3,
  created_at: "2024-01-15",
};

const mockFavorites = [
  {
    id: "1",
    title: "Advanced Police MDT",
    category: "script",
    rating: 4.8,
    downloads: 1234,
    thumbnail: "",
    slug: "advanced-police-mdt",
  },
  {
    id: "2",
    title: "Legion Square Revamp",
    category: "mapping",
    rating: 4.5,
    downloads: 567,
    thumbnail: "",
    slug: "legion-square-revamp",
  },
  {
    id: "3",
    title: "Modern Loading Screen",
    category: "loading",
    rating: 4.9,
    downloads: 890,
    thumbnail: "",
    slug: "modern-loading-screen",
  },
];

const mockDownloadHistory = [
  {
    id: "1",
    title: "Advanced Police MDT",
    category: "script",
    downloaded_at: "2024-03-15 14:30",
    slug: "advanced-police-mdt",
  },
  {
    id: "2",
    title: "Animated Loading Screen",
    category: "loading",
    downloaded_at: "2024-03-14 09:15",
    slug: "animated-loading",
  },
  {
    id: "3",
    title: "Custom HUD Pack",
    category: "tool",
    downloaded_at: "2024-03-13 18:45",
    slug: "custom-hud-pack",
  },
];

const mockUploads = [
  {
    id: "1",
    title: "My Custom Script",
    category: "script",
    status: "approved",
    downloads: 45,
    rating: 4.2,
    created_at: "2024-03-01",
    slug: "my-custom-script",
  },
  {
    id: "2",
    title: "Police Station MLO",
    category: "mapping",
    status: "pending",
    downloads: 0,
    rating: 0,
    created_at: "2024-03-14",
    slug: "police-station-mlo",
  },
];

export default function DashboardPage() {
  const [copiedCode, setCopiedCode] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(mockUser.referral_code);
    setCopiedCode(true);
    toast.success("Code de parrainage copie!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadProgress =
    ((mockUser.downloads_today) /
      (mockUser.download_limit + mockUser.bonus_downloads)) *
    100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage src={mockUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {mockUser.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {mockUser.username}
                </h1>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Membre
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Membre depuis le {mockUser.created_at}
              </p>

              {/* Download Limit Progress */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Telechargements aujourd'hui
                  </span>
                  <span className="text-foreground font-medium">
                    {mockUser.downloads_today} /{" "}
                    {mockUser.download_limit + mockUser.bonus_downloads}
                  </span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
                {mockUser.bonus_downloads > 0 && (
                  <p className="text-xs text-primary mt-1">
                    +{mockUser.bonus_downloads} telechargements bonus (parrainage)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/tickets/new">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Parametres
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockUser.total_downloads}
                </p>
                <p className="text-sm text-muted-foreground">Telechargements</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockUser.total_uploads}
                </p>
                <p className="text-sm text-muted-foreground">Uploads</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-pink-500/20">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockFavorites.length}
                </p>
                <p className="text-sm text-muted-foreground">Favoris</p>
              </div>
            </div>
          </Card>

          <Card className="glass border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Gift className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockUser.referrals_count}
                </p>
                <p className="text-sm text-muted-foreground">Parrainages</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Referral Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Systeme de Parrainage
              </h2>
              <p className="text-muted-foreground mt-1">
                Partagez votre code et gagnez des telechargements bonus pour
                chaque nouvel inscrit!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <code className="bg-secondary px-4 py-2 rounded-lg font-mono text-lg text-foreground">
                {mockUser.referral_code}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyReferralCode}
                className="shrink-0 bg-transparent"
              >
                {copiedCode ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  Parrainages reussis:
                </span>
                <span className="font-medium text-foreground">
                  {mockUser.referrals_count}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Bonus gagnes:</span>
                <span className="font-medium text-foreground">
                  +{mockUser.referrals_count * 5} telechargements
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="glass border-border">
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favoris
            </TabsTrigger>
            <TabsTrigger
              value="downloads"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
            <TabsTrigger
              value="uploads"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Upload className="w-4 h-4 mr-2" />
              Mes Uploads
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockFavorites.map((item) => (
                <Card
                  key={item.id}
                  className="glass border-border overflow-hidden group"
                >
                  <div className="aspect-video bg-secondary relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileCode className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                    >
                      <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <Badge className="bg-primary/20 text-primary border-primary/30 capitalize">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        asChild
                      >
                        <Link href={`/resources/${item.slug}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {mockFavorites.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Vous n'avez pas encore de favoris
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/resources">Decouvrir les ressources</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {mockDownloadHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <FileCode className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {item.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.downloaded_at}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/resources/${item.slug}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {mockDownloadHistory.length === 0 && (
              <div className="text-center py-12">
                <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun telechargement pour le moment
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/resources">Decouvrir les ressources</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Uploads Tab */}
          <TabsContent value="uploads">
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link href="/upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Nouvelle ressource
                </Link>
              </Button>
            </div>

            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {mockUploads.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <Upload className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {item.category}
                          </Badge>
                          <Badge
                            className={
                              item.status === "approved"
                                ? "bg-primary/20 text-primary"
                                : item.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-destructive/20 text-destructive"
                            }
                          >
                            {item.status === "approved"
                              ? "Approuve"
                              : item.status === "pending"
                                ? "En attente"
                                : "Rejete"}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {item.downloads}
                          </span>
                          {item.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              {item.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/resources/${item.slug}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {mockUploads.length === 0 && (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Vous n'avez pas encore partage de ressources
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/upload">Partager une ressource</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
