'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ScriptIcon3D, 
  MappingIcon3D, 
  ToolIcon3D, 
  LoadingScreenIcon3D 
} from '@/components/ui/icon-3d';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Nouvelle plateforme de ressources FiveM</span>
          </div>

          {/* Title */}
          <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            La plateforme{' '}
            <span className="text-gradient">ultime</span>
            {' '}pour vos ressources FiveM
          </h1>

          {/* Subtitle */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl text-pretty">
            Decouvrez et partagez des scripts, mappings, tools, loading screens et plus encore. 
            Rejoignez la communaute FiveM la plus active.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/resources">
              <Button size="lg" className="gap-2 glow-primary">
                Explorer les ressources
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api/auth/discord">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Connexion avec Discord
              </Button>
            </Link>
          </div>

          {/* 3D Icons */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 md:gap-10">
            <div className="flex flex-col items-center gap-3">
              <ScriptIcon3D size="lg" />
              <span className="text-sm font-medium text-muted-foreground">Scripts</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MappingIcon3D size="lg" />
              <span className="text-sm font-medium text-muted-foreground">Mappings</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <ToolIcon3D size="lg" />
              <span className="text-sm font-medium text-muted-foreground">Tools</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <LoadingScreenIcon3D size="lg" />
              <span className="text-sm font-medium text-muted-foreground">Loading Screens</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">1,500+</p>
              <p className="text-sm text-muted-foreground">Ressources</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">5,000+</p>
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground md:text-4xl">50,000+</p>
              <p className="text-sm text-muted-foreground">Telechargements</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary md:text-4xl">100%</p>
              <p className="text-sm text-muted-foreground">Gratuit</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
