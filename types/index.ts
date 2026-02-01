// User types
export interface User {
  id: string;
  discord_id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'moderator' | 'admin';
  download_limit: number;
  downloads_today: number;
  referral_code: string;
  referred_by: string | null;
  referral_bonus: number;
  created_at: string;
  updated_at: string;
}

// Resource types
export type ResourceCategory = 'script' | 'mapping' | 'tool' | 'loading_screen' | 'outfit' | 'base';

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  category: ResourceCategory;
  version: string;
  author_id: string;
  author?: User;
  file_path: string;
  file_size: number;
  thumbnail: string;
  images: string[];
  download_count: number;
  view_count: number;
  average_rating: number;
  rating_count: number;
  is_featured: boolean;
  is_approved: boolean;
  expires_at: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Comment types
export interface Comment {
  id: string;
  resource_id: string;
  user_id: string;
  user?: User;
  content: string;
  created_at: string;
  updated_at: string;
}

// Rating types
export interface Rating {
  id: string;
  resource_id: string;
  user_id: string;
  user?: User;
  rating: number;
  review: string;
  created_at: string;
}

// Favorite types
export interface Favorite {
  id: string;
  user_id: string;
  resource_id: string;
  resource?: Resource;
  created_at: string;
}

// Download types
export interface Download {
  id: string;
  user_id: string;
  resource_id: string;
  resource?: Resource;
  downloaded_at: string;
}

// Ticket types
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'bug' | 'feature' | 'support' | 'claim' | 'other';

export interface Ticket {
  id: string;
  user_id: string;
  user?: User;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  resource_id: string | null;
  resource?: Resource;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  user?: User;
  message: string;
  is_staff: boolean;
  created_at: string;
}

// Claim types (for expired resources)
export interface Claim {
  id: string;
  user_id: string;
  user?: User;
  resource_id: string;
  resource?: Resource;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

// Page types (for dynamic pages)
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Config types
export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  user_id: string;
  user?: User;
  upload_count: number;
  download_count: number;
  rating_average: number;
  rank: number;
}

// Session type
export interface Session {
  id: string;
  user_id: string;
  user?: User;
  token: string;
  expires_at: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface ResourceFilters {
  category?: ResourceCategory;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'top_rated' | 'most_downloaded';
  tags?: string[];
  author?: string;
  page?: number;
  limit?: number;
}
