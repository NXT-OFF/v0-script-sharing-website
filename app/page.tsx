import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { FeaturedSection } from '@/components/home/featured-section';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export default async function HomePage() {
  const user = await getCurrentUser();

  // Fetch featured/popular resources from database
  let resources = [];
  try {
    resources = await query(
      `SELECT r.*, u.username as author_username, u.discord_id as author_discord_id, u.avatar as author_avatar,
        (SELECT AVG(rating) FROM ratings WHERE resource_id = r.id) as average_rating,
        (SELECT COUNT(*) FROM ratings WHERE resource_id = r.id) as rating_count
       FROM resources r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.status = 'approved'
       ORDER BY r.downloads DESC, r.created_at DESC
       LIMIT 8`
    );
  } catch (error) {
    console.error('Error fetching resources:', error);
    resources = [];
  }

  // Transform database results to match Resource type
  const formattedResources = resources.map((r: any) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    category: r.category,
    version: r.version,
    thumbnail: r.thumbnail,
    downloads: r.downloads || 0,
    average_rating: r.average_rating || 0,
    rating_count: r.rating_count || 0,
    author: {
      id: r.author_id,
      username: r.author_username,
      discord_id: r.author_discord_id,
      avatar: r.author_avatar,
    },
    created_at: r.created_at,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection resources={formattedResources} />
      </main>
      <Footer />
    </div>
  );
}
