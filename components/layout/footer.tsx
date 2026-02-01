import Link from 'next/link';
import { Code, Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient">FiveM Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme de partage de ressources FiveM la plus complete. Scripts, mappings, tools et plus encore.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-foreground">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/resources?category=script" className="text-muted-foreground hover:text-primary transition-colors">
                  Scripts
                </Link>
              </li>
              <li>
                <Link href="/resources?category=mapping" className="text-muted-foreground hover:text-primary transition-colors">
                  Mappings
                </Link>
              </li>
              <li>
                <Link href="/resources?category=tool" className="text-muted-foreground hover:text-primary transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/resources?category=loading_screen" className="text-muted-foreground hover:text-primary transition-colors">
                  Loading Screens
                </Link>
              </li>
              <li>
                <Link href="/resources?category=outfit" className="text-muted-foreground hover:text-primary transition-colors">
                  Tenues
                </Link>
              </li>
              <li>
                <Link href="/resources?category=base" className="text-muted-foreground hover:text-primary transition-colors">
                  Bases
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tickets/new" className="text-muted-foreground hover:text-primary transition-colors">
                  Ouvrir un ticket
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/claim" className="text-muted-foreground hover:text-primary transition-colors">
                  Reclamation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialite
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-muted-foreground hover:text-primary transition-colors">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FiveM Hub. Tous droits reserves.
            </p>
            <p className="text-sm text-muted-foreground">
              Fait avec passion pour la communaute FiveM
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
