import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedSection } from '@/components/home/featured-section';
import { getCurrentUser } from '@/lib/auth';
import type { Resource } from '@/types';

// Mock data for demonstration - will be replaced with DB queries
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
];

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection resources={mockResources} />
      </main>
      <Footer />
    </div>
  );
}
