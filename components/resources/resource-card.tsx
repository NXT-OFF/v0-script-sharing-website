'use client';

import React from "react"

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Download,
  Eye,
  Star,
  Heart,
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
} from 'lucide-react';
import type { Resource, ResourceCategory } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  onFavorite?: (resourceId: string) => void;
  isFavorited?: boolean;
}

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

const categoryColors: Record<ResourceCategory, string> = {
  script: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  mapping: 'bg-green-500/20 text-green-400 border-green-500/30',
  tool: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  loading_screen: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  outfit: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  base: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export function ResourceCard({ resource, onFavorite, isFavorited = false }: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const CategoryIcon = categoryIcons[resource.category];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onFavorite?.(resource.id);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Link href={`/resources/${resource.slug}`}>
      <Card
        className="group relative overflow-hidden glass glass-hover card-3d transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={resource.thumbnail || '/placeholder-resource.jpg'}
            alt={resource.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-80' : 'opacity-60'
            }`}
          />

          {/* Category Badge */}
          <div className="absolute left-3 top-3">
            <Badge className={`${categoryColors[resource.category]} border flex items-center gap-1.5`}>
              <CategoryIcon className="h-3 w-3" />
              {categoryLabels[resource.category]}
            </Badge>
          </div>

          {/* Featured Badge */}
          {resource.is_featured && (
            <div className="absolute right-3 top-3">
              <Badge className="bg-primary/90 text-primary-foreground border-primary/50">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-3 bottom-3 h-9 w-9 rounded-full transition-all duration-300 ${
              favorited
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : 'bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-red-500'
            } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleFavorite}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          {/* Title & Author */}
          <div className="mb-3">
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              par {resource.author?.username || 'Inconnu'}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {resource.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {formatNumber(resource.download_count)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatNumber(resource.view_count)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span>{resource.average_rating.toFixed(1)}</span>
              <span className="text-muted-foreground/60">({resource.rating_count})</span>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {resource.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  +{resource.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
