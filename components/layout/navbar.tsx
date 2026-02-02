'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  Home,
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
  Upload,
  User,
  Settings,
  LogOut,
  Shield,
  Heart,
  Ticket,
  Trophy,
  Search,
} from 'lucide-react';
import type { User as UserType } from '@/types';

interface NavbarProps {
  user: UserType | null;
}

const categories = [
  { name: 'Scripts', href: '/resources?category=script', icon: Code },
  { name: 'Mappings', href: '/resources?category=mapping', icon: Map },
  { name: 'Tools', href: '/resources?category=tool', icon: Wrench },
  { name: 'Loading Screens', href: '/resources?category=loading_screen', icon: Monitor },
  { name: 'Tenues', href: '/resources?category=outfit', icon: Shirt },
  { name: 'Bases', href: '/resources?category=base', icon: Database },
];

// Get Discord avatar URL
const getAvatarUrl = (user: UserType | null) => {
  if (!user?.discord_id || !user?.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png?size=128`;
};

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const avatarUrl = getAvatarUrl(user);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 glow-primary">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-gradient hidden sm:block">FiveM Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                'gap-2 text-muted-foreground hover:text-foreground',
                pathname === '/' && 'bg-secondary text-foreground'
              )}
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                <Database className="h-4 w-4" />
                Ressources
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48 glass">
              {categories.map((category) => (
                <DropdownMenuItem key={category.href} asChild>
                  <Link href={category.href} className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/leaderboard">
            <Button
              variant="ghost"
              className={cn(
                'gap-2 text-muted-foreground hover:text-foreground',
                pathname === '/leaderboard' && 'bg-secondary text-foreground'
              )}
            >
              <Trophy className="h-4 w-4" />
              Classement
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher des ressources..."
              className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/upload" className="hidden sm:block">
                <Button variant="default" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/50">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.username}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/favorites" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Favoris
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/tickets" className="flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      Mes Tickets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 text-primary">
                          <Shield className="h-4 w-4" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/logout" className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/api/auth/discord">
              <Button className="gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Connexion Discord
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-border/50">
          <div className="space-y-1 px-4 py-3">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm"
              />
            </div>

            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Home className="h-4 w-4" />
                Accueil
              </div>
            </Link>

            <div className="py-2">
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase">Ressources</p>
              {categories.map((category) => (
                <Link key={category.href} href={category.href} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Trophy className="h-4 w-4" />
                Classement
              </div>
            </Link>

            {user && (
              <Link href="/upload" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-primary text-primary-foreground">
                  <Upload className="h-4 w-4" />
                  Upload
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
