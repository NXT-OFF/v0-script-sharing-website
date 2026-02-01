import React from "react"
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Mock pages - in production, fetch from database
const mockPages: Record<
  string,
  { title: string; content: string; isPublished: boolean }
> = {
  regles: {
    title: "Regles du Site",
    content: `# Regles du Site

## 1. Respect
- Respectez tous les membres de la communaute
- Pas d'insultes, de harcelement ou de discrimination

## 2. Contenu
- Ne partagez que du contenu dont vous etes l'auteur ou que vous avez le droit de partager
- Les scripts voles ou leakes sont strictement interdits
- Incluez des credits pour les ressources utilisees

## 3. Qualite
- Testez vos scripts avant de les partager
- Fournissez une documentation claire
- Repondez aux questions des utilisateurs

## 4. Telechargements
- Respectez les limites de telechargement
- N'abusez pas du systeme de parrainage

## 5. Signalement
- Signalez tout contenu inapproprie
- Utilisez le systeme de tickets pour les problemes`,
    isPublished: true,
  },
  faq: {
    title: "FAQ",
    content: `# Questions Frequentes

## Comment telecharger une ressource ?
Connectez-vous avec votre compte Discord, puis cliquez sur le bouton "Telecharger" sur la page de la ressource.

## Combien de telechargements par jour ?
Par defaut, vous avez 10 telechargements par jour. Ce nombre peut etre augmente via le systeme de parrainage.

## Comment fonctionne le parrainage ?
Partagez votre code de parrainage. Pour chaque nouvel inscrit utilisant votre code, vous gagnez 5 telechargements bonus supplementaires.

## Comment partager une ressource ?
Cliquez sur "Upload" dans le menu, remplissez le formulaire et attendez l'approbation d'un moderateur.

## Ma ressource a ete rejetee, pourquoi ?
Les ressources peuvent etre rejetees pour plusieurs raisons :
- Contenu vole ou leake
- Qualite insuffisante
- Documentation manquante
- Non-respect des regles`,
    isPublished: true,
  },
  "mentions-legales": {
    title: "Mentions Legales",
    content: `# Mentions Legales

## Editeur du site
FiveM Hub
Contact: admin@fivemhub.com

## Hebergement
Heberge sur un serveur Proxmox VE

## Propriete intellectuelle
Les ressources partagees sur ce site appartiennent a leurs auteurs respectifs.

## Donnees personnelles
Les donnees collectees sont utilisees uniquement pour le fonctionnement du site.
Vous pouvez demander la suppression de vos donnees a tout moment.`,
    isPublished: true,
  },
};

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = mockPages[slug];

  if (!page || !page.isPublished) {
    notFound();
  }

  // Simple markdown to HTML (basic implementation)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-foreground mb-6">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("- ")) {
        currentList.push(line.slice(2));
      } else if (line.trim() === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={i} className="text-muted-foreground mb-4">
            {line}
          </p>
        );
      }
    }

    flushList();
    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="glass rounded-2xl p-8">
          {renderContent(page.content)}
        </div>
      </main>

      <Footer />
    </div>
  );
}
