'use client';

import React from "react"

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
} from 'lucide-react';
import type { ResourceCategory } from '@/types';

const categories: { value: ResourceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'script', label: 'Scripts', icon: Code },
  { value: 'mapping', label: 'Mappings', icon: Map },
  { value: 'tool', label: 'Tools', icon: Wrench },
  { value: 'loading_screen', label: 'Loading Screens', icon: Monitor },
  { value: 'outfit', label: 'Tenues', icon: Shirt },
  { value: 'base', label: 'Bases', icon: Database },
];

const sortOptions = [
  { value: 'newest', label: 'Plus recents' },
  { value: 'popular', label: 'Populaires' },
  { value: 'top_rated', label: 'Mieux notes' },
  { value: 'most_downloaded', label: 'Plus telecharges' },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<ResourceCategory[]>(
    (searchParams.get('category')?.split(',') as ResourceCategory[]) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    params.set('page', '1');
    router.push(`/resources?${params.toString()}`);
  }, [router, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: search || null });
  };

  const handleCategoryToggle = (category: ResourceCategory) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    updateFilters({ category: newCategories.length > 0 ? newCategories.join(',') : null });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSortBy('newest');
    router.push('/resources');
  };

  const hasActiveFilters = search || selectedCategories.length > 0 || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des ressources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </form>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Categories
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrer par categorie</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => handleCategoryToggle(category.value)}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => {
            const cat = categories.find((c) => c.value === category);
            return (
              <Badge
                key={category}
                variant="secondary"
                className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => handleCategoryToggle(category)}
              >
                {cat && <cat.icon className="h-3 w-3" />}
                {cat?.label}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
