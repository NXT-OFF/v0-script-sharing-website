'use client';

import React from "react"

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  ScriptIcon3D,
  MappingIcon3D,
  ToolIcon3D,
  LoadingScreenIcon3D,
  OutfitIcon3D,
  BaseIcon3D,
} from '@/components/ui/icon-3d';
import { ArrowRight } from 'lucide-react';
import type { ResourceCategory } from '@/types';

interface CategoryItem {
  category: ResourceCategory;
  name: string;
  description: string;
  count: number;
  Icon: React.ComponentType<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>;
}

const categories: CategoryItem[] = [
  {
    category: 'script',
    name: 'Scripts',
    description: 'Scripts Lua et JavaScript pour enrichir votre serveur',
    count: 450,
    Icon: ScriptIcon3D,
  },
  {
    category: 'mapping',
    name: 'Mappings',
    description: 'Maps et interieurs personnalises pour vos serveurs',
    count: 320,
    Icon: MappingIcon3D,
  },
  {
    category: 'tool',
    name: 'Tools',
    description: 'Outils et utilitaires pour developper plus facilement',
    count: 180,
    Icon: ToolIcon3D,
  },
  {
    category: 'loading_screen',
    name: 'Loading Screens',
    description: 'Ecrans de chargement animes et personnalisables',
    count: 250,
    Icon: LoadingScreenIcon3D,
  },
  {
    category: 'outfit',
    name: 'Tenues',
    description: 'Vetements et uniformes pour vos personnages',
    count: 200,
    Icon: OutfitIcon3D,
  },
  {
    category: 'base',
    name: 'Bases',
    description: 'Frameworks et bases completes pour demarrer',
    count: 100,
    Icon: BaseIcon3D,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Explorer par categorie
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Trouvez exactement ce dont vous avez besoin parmi nos nombreuses categories de ressources
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.category} href={`/resources?category=${category.category}`}>
              <Card className="group glass glass-hover h-full transition-all duration-300">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <category.Icon size="lg" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-primary">{category.count}</span> ressources
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
