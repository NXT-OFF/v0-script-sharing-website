import React from "react"
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUser } from '@/lib/auth';
import { CommentSection } from '@/components/resources/comment-section';
import { RatingSection } from '@/components/resources/rating-section';
import {
  Download,
  Eye,
  Star,
  Heart,
  Share2,
  Flag,
  Calendar,
  HardDrive,
  Tag,
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
  ArrowLeft,
} from 'lucide-react';
import type { Resource, ResourceCategory } from '@/types';

const categoryIcons: Record<ResourceCategory, React.ComponentType<{ className?: string }>> = {
  script: Code,
  mapping: Map,
  tool: Wrench,
  loading_screen: Monitor,
  outfit: Shirt,
  base: Database,
};

const categoryLabels: Record<ResourceCategory, string> = {
  script: 'Script',
  mapping: 'Mapping',
  tool: 'Tool',
  loading_screen: 'Loading Screen',
  outfit: 'Tenue',
  base: 'Base',
};

// Mock data - will be replaced with DB queries
const mockResource: Resource = {
  id: '1',
  title: 'ESX Framework Complete',
  slug: 'esx-framework-complete',
  description: 'Le framework ESX complet avec toutes les fonctionnalites necessaires pour votre serveur FiveM.',
  long_description: `# ESX Framework Complete

Le framework ESX est la solution la plus complete pour creer un serveur roleplay FiveM professionnel.

## Fonctionnalites incluses

- Systeme de jobs complet
- Economie avancee
- Inventaire personnalise
- Systeme de vehicules
- Housing
- Et bien plus encore!

## Installation

1. Telechargez l'archive
2. Extrayez dans votre dossier resources
3. Configurez la base de donnees
4. Ajoutez les ressources dans server.cfg

## Support

Pour toute question, ouvrez un ticket sur notre plateforme.`,
  category: 'script',
  version: '1.9.0',
  author_id: '1',
  author: {
    id: '1',
    discord_id: '123',
    username: 'DevMaster',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: 'user',
    download_limit: 10,
    downloads_today: 0,
    referral_code: 'ABC123',
    referred_by: null,
    referral_bonus: 0,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  file_path: '/uploads/esx.zip',
  file_size: 15000000,
  thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
  ],
  download_count: 15420,
  view_count: 45000,
  average_rating: 4.8,
  rating_count: 342,
  is_featured: true,
  is_approved: true,
  expires_at: null,
  tags: ['esx', 'framework', 'roleplay', 'jobs', 'economy'],
  created_at: '2024-01-15',
  updated_at: '2024-02-01',
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { slug } = await params;

  // In production, fetch from database
  const resource = mockResource.slug === slug ? mockResource : null;

  if (!resource) {
    notFound();
  }

  const CategoryIcon = categoryIcons[resource.category];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Back Button */}
          <Link href="/resources" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour aux ressources
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CategoryIcon className="h-3 w-3" />
                    {categoryLabels[resource.category]}
                  </Badge>
                  {resource.is_featured && (
                    <Badge className="bg-primary/90">
                      <Star className="mr-1 h-3 w-3 fill-current" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline">v{resource.version}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                  {resource.title}
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  {resource.description}
                </p>
              </div>

              {/* Main Image */}
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <Image
                  src={resource.thumbnail || '/placeholder.jpg'}
                  alt={resource.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Image Gallery */}
              {resource.images && resource.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {resource.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-lg border border-border cursor-pointer hover:border-primary transition-colors"
                    >
                      <Image
                        src={image || '/placeholder.jpg'}
                        alt={`${resource.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Avis ({resource.rating_count})</TabsTrigger>
                  <TabsTrigger value="comments">Commentaires</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <Card className="glass">
                    <CardContent className="p-6 prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-foreground">
                        {resource.long_description || resource.description}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <RatingSection resourceId={resource.id} user={user} />
                </TabsContent>
                <TabsContent value="comments" className="mt-6">
                  <CommentSection resourceId={resource.id} user={user} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download Card */}
              <Card className="glass sticky top-20">
                <CardHeader>
                  <CardTitle>Telecharger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground">
                        <Download className="h-4 w-4 text-primary" />
                        {formatNumber(resource.download_count)}
                      </div>
                      <p className="text-xs text-muted-foreground">Telechargements</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground">
                        <Eye className="h-4 w-4 text-primary" />
                        {formatNumber(resource.view_count)}
                      </div>
                      <p className="text-xs text-muted-foreground">Vues</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-semibold text-foreground">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {resource.average_rating.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">{resource.rating_count} avis</p>
                    </div>
                  </div>

                  {/* Download Button */}
                  {user ? (
                    <Button className="w-full gap-2 glow-primary" size="lg">
                      <Download className="h-5 w-5" />
                      Telecharger
                    </Button>
                  ) : (
                    <Link href="/api/auth/discord" className="block">
                      <Button className="w-full gap-2 bg-transparent" size="lg" variant="outline">
                        Connectez-vous pour telecharger
                      </Button>
                    </Link>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                      <Heart className="h-4 w-4" />
                      Favoris
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        Taille
                      </span>
                      <span className="text-foreground">{formatFileSize(resource.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Version
                      </span>
                      <span className="text-foreground">{resource.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Mis a jour
                      </span>
                      <span className="text-foreground">{new Date(resource.updated_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.map((tag) => (
                          <Link key={tag} href={`/resources?search=${tag}`}>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                              #{tag}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Author Card */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Auteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/50">
                      <AvatarImage src={resource.author?.avatar || "/placeholder.svg"} alt={resource.author?.username} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {resource.author?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{resource.author?.username}</p>
                      <p className="text-sm text-muted-foreground capitalize">{resource.author?.role}</p>
                    </div>
                  </div>
                  <Link href={`/users/${resource.author_id}`}>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      Voir le profil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
