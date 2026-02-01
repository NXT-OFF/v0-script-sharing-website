'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ResourceCard } from '@/components/resources/resource-card';
import { ArrowRight } from 'lucide-react';
import type { Resource } from '@/types';

interface FeaturedSectionProps {
  resources: Resource[];
}

export function FeaturedSection({ resources }: FeaturedSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Ressources populaires
            </h2>
            <p className="mt-2 text-muted-foreground">
              Les ressources les mieux notees par la communaute
            </p>
          </div>
          <Link href="/resources?sortBy=top_rated">
            <Button variant="outline" className="gap-2 bg-transparent">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Resources Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Empty State */}
        {resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg text-muted-foreground">
              Aucune ressource disponible pour le moment.
            </p>
            <Link href="/upload">
              <Button className="mt-4 gap-2">
                Etre le premier a uploader
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
