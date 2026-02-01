import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FilterBar } from '@/components/resources/filter-bar';
import { ResourceCard } from '@/components/resources/resource-card';
import { getCurrentUser } from '@/lib/auth';
import type { Resource, ResourceCategory } from '@/types';

// Mock data for demonstration
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'ESX Framework Complete',
    slug: 'esx-framework-complete',
    description: 'Le framework ESX complet avec toutes les fonctionnalites necessaires pour votre serveur FiveM.',
    long_description: '',
    category: 'script',
    version: '1.9.0',
    author_id: '1',
    author: { id: '1', discord_id: '123', username: 'DevMaster', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'ABC123', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/esx.zip',
    file_size: 15000000,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    images: [],
    download_count: 15420,
    view_count: 45000,
    average_rating: 4.8,
    rating_count: 342,
    is_featured: true,
    is_approved: true,
    expires_at: null,
    tags: ['esx', 'framework', 'roleplay'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    title: 'Los Santos Police Station',
    slug: 'los-santos-police-station',
    description: 'Mapping complet du commissariat de Los Santos avec interieur detaille.',
    long_description: '',
    category: 'mapping',
    version: '2.1.0',
    author_id: '2',
    author: { id: '2', discord_id: '456', username: 'MapperPro', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'DEF456', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/police.zip',
    file_size: 25000000,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    images: [],
    download_count: 8750,
    view_count: 25000,
    average_rating: 4.6,
    rating_count: 189,
    is_featured: true,
    is_approved: true,
    expires_at: null,
    tags: ['mapping', 'police', 'interior'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    title: 'Animated Loading Screen',
    slug: 'animated-loading-screen',
    description: 'Ecran de chargement anime moderne avec barre de progression et musique.',
    long_description: '',
    category: 'loading_screen',
    version: '1.0.0',
    author_id: '3',
    author: { id: '3', discord_id: '789', username: 'Designer99', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'GHI789', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/loading.zip',
    file_size: 5000000,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
    images: [],
    download_count: 12300,
    view_count: 35000,
    average_rating: 4.9,
    rating_count: 456,
    is_featured: true,
    is_approved: true,
    expires_at: null,
    tags: ['loading', 'animated', 'modern'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '4',
    title: 'Police Uniforms Pack',
    slug: 'police-uniforms-pack',
    description: 'Pack complet de tenues de police avec plusieurs variantes et accessoires.',
    long_description: '',
    category: 'outfit',
    version: '3.0.0',
    author_id: '4',
    author: { id: '4', discord_id: '101', username: 'ClothMaker', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'JKL101', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/police-uniforms.zip',
    file_size: 45000000,
    thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=450&fit=crop',
    images: [],
    download_count: 6890,
    view_count: 18000,
    average_rating: 4.7,
    rating_count: 178,
    is_featured: false,
    is_approved: true,
    expires_at: null,
    tags: ['police', 'uniforms', 'eup'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '5',
    title: 'vRP Framework Base',
    slug: 'vrp-framework-base',
    description: 'Base complete vRP pour demarrer votre serveur roleplay.',
    long_description: '',
    category: 'base',
    version: '1.0.0',
    author_id: '5',
    author: { id: '5', discord_id: '102', username: 'FrameworkDev', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'MNO102', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/vrp.zip',
    file_size: 50000000,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
    images: [],
    download_count: 9500,
    view_count: 28000,
    average_rating: 4.5,
    rating_count: 234,
    is_featured: false,
    is_approved: true,
    expires_at: null,
    tags: ['vrp', 'base', 'framework'],
    created_at: '',
    updated_at: '',
  },
  {
    id: '6',
    title: 'Resource Manager Tool',
    slug: 'resource-manager-tool',
    description: 'Outil de gestion des ressources pour administrateurs de serveur.',
    long_description: '',
    category: 'tool',
    version: '2.0.0',
    author_id: '6',
    author: { id: '6', discord_id: '103', username: 'ToolMaker', email: '', avatar: '', role: 'user', download_limit: 10, downloads_today: 0, referral_code: 'PQR103', referred_by: null, referral_bonus: 0, created_at: '', updated_at: '' },
    file_path: '/uploads/resource-manager.zip',
    file_size: 8000000,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    images: [],
    download_count: 5600,
    view_count: 15000,
    average_rating: 4.4,
    rating_count: 145,
    is_featured: false,
    is_approved: true,
    expires_at: null,
    tags: ['tool', 'admin', 'management'],
    created_at: '',
    updated_at: '',
  },
];

interface PageProps {
  searchParams: Promise<{
    category?: ResourceCategory;
    search?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  
  // Filter resources based on search params
  let filteredResources = [...mockResources];
  
  if (params.category) {
    const categories = params.category.split(',') as ResourceCategory[];
    filteredResources = filteredResources.filter(r => categories.includes(r.category));
  }
  
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredResources = filteredResources.filter(r => 
      r.title.toLowerCase().includes(searchLower) ||
      r.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort resources
  switch (params.sortBy) {
    case 'popular':
      filteredResources.sort((a, b) => b.view_count - a.view_count);
      break;
    case 'top_rated':
      filteredResources.sort((a, b) => b.average_rating - a.average_rating);
      break;
    case 'most_downloaded':
      filteredResources.sort((a, b) => b.download_count - a.download_count);
      break;
    default:
      // newest first (using id as proxy)
      break;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Ressources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Explorez notre collection de ressources FiveM
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-12 bg-secondary/50 rounded-lg animate-pulse" />}>
              <FilterBar />
            </Suspense>
          </div>

          {/* Results count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredResources.length} ressource{filteredResources.length !== 1 ? 's' : ''} trouvee{filteredResources.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg text-muted-foreground">
                Aucune ressource ne correspond a vos criteres.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
