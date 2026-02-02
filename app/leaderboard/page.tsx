import {
  Trophy,
  Medal,
  Crown,
  Star,
  Download,
  Upload,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatNumber } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

// Get Discord avatar URL
const getAvatarUrl = (discord_id: string, avatar: string) => {
  if (!discord_id || !avatar) return null;
  return `https://cdn.discordapp.com/avatars/${discord_id}/${avatar}.png?size=128`;
};

export default async function LeaderboardPage() {
  const user = await getCurrentUser();

  // Fetch top uploaders
  let topUploaders: any[] = [];
  try {
    topUploaders = await query(
      `SELECT u.id, u.username, u.discord_id, u.avatar,
        COUNT(r.id) as uploads,
        COALESCE(SUM(r.downloads), 0) as downloads_received,
        COALESCE((SELECT AVG(rt.rating) FROM ratings rt JOIN resources res ON rt.resource_id = res.id WHERE res.author_id = u.id), 0) as rating
       FROM users u
       LEFT JOIN resources r ON u.id = r.author_id AND r.status = 'approved'
       GROUP BY u.id
       HAVING uploads > 0
       ORDER BY uploads DESC, downloads_received DESC
       LIMIT 10`
    );
  } catch (error) {
    console.error('Error fetching top uploaders:', error);
  }

  // Fetch top resources
  let topResources: any[] = [];
  try {
    topResources = await query(
      `SELECT r.id, r.title, r.slug, r.category, r.downloads,
        u.username as author,
        COALESCE((SELECT AVG(rating) FROM ratings WHERE resource_id = r.id), 0) as rating
       FROM resources r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.status = 'approved'
       ORDER BY r.downloads DESC
       LIMIT 10`
    );
  } catch (error) {
    console.error('Error fetching top resources:', error);
  }

  // Fetch top downloaders
  let topDownloaders: any[] = [];
  try {
    topDownloaders = await query(
      `SELECT u.id, u.username, u.discord_id, u.avatar,
        COUNT(d.id) as downloads,
        (SELECT COUNT(*) FROM favorites WHERE user_id = u.id) as favorites
       FROM users u
       LEFT JOIN downloads d ON u.id = d.user_id
       GROUP BY u.id
       HAVING downloads > 0
       ORDER BY downloads DESC
       LIMIT 10`
    );
  } catch (error) {
    console.error('Error fetching top downloaders:', error);
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30";
      case 2:
        return "bg-gray-400/10 border-gray-400/30";
      case 3:
        return "bg-amber-600/10 border-amber-600/30";
      default:
        return "bg-secondary border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-yellow-500/20 mb-4">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Classement
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Decouvrez les meilleurs contributeurs et les ressources les plus
            populaires
          </p>
        </div>

        <Tabs defaultValue="uploaders" className="space-y-8">
          <TabsList className="glass border-border mx-auto flex w-fit">
            <TabsTrigger
              value="uploaders"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Upload className="w-4 h-4 mr-2" />
              Top Uploadeurs
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Star className="w-4 h-4 mr-2" />
              Top Ressources
            </TabsTrigger>
            <TabsTrigger
              value="downloaders"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Top Telechargeurs
            </TabsTrigger>
          </TabsList>

          {/* Top Uploaders */}
          <TabsContent value="uploaders">
            {topUploaders.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="order-2 md:order-1 md:mt-8">
                  <Card className={`glass border p-6 text-center ${getRankBg(2)}`}>
                    <Medal className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-gray-400">
                      <AvatarImage src={getAvatarUrl(topUploaders[1]?.discord_id, topUploaders[1]?.avatar) || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-400/20 text-gray-400">
                        {topUploaders[1]?.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-foreground">
                      {topUploaders[1]?.username || "N/A"}
                    </h3>
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <Upload className="w-4 h-4 inline mr-1" />
                        {topUploaders[1]?.uploads || 0} uploads
                      </p>
                      <p className="text-muted-foreground">
                        <Download className="w-4 h-4 inline mr-1" />
                        {formatNumber(topUploaders[1]?.downloads_received || 0)} DL
                      </p>
                    </div>
                  </Card>
                </div>

                {/* 1st Place */}
                <div className="order-1 md:order-2">
                  <Card className={`glass border p-6 text-center ${getRankBg(1)}`}>
                    <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-yellow-400">
                      <AvatarImage src={getAvatarUrl(topUploaders[0]?.discord_id, topUploaders[0]?.avatar) || "/placeholder.svg"} />
                      <AvatarFallback className="bg-yellow-400/20 text-yellow-400">
                        {topUploaders[0]?.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground">
                      {topUploaders[0]?.username || "N/A"}
                    </h3>
                    <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Champion
                    </Badge>
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <Upload className="w-4 h-4 inline mr-1" />
                        {topUploaders[0]?.uploads || 0} uploads
                      </p>
                      <p className="text-muted-foreground">
                        <Download className="w-4 h-4 inline mr-1" />
                        {formatNumber(topUploaders[0]?.downloads_received || 0)} DL
                      </p>
                      <p className="text-yellow-400">
                        <Star className="w-4 h-4 inline mr-1 fill-yellow-400" />
                        {Number(topUploaders[0]?.rating || 0).toFixed(1)} / 5
                      </p>
                    </div>
                  </Card>
                </div>

                {/* 3rd Place */}
                <div className="order-3 md:mt-12">
                  <Card className={`glass border p-6 text-center ${getRankBg(3)}`}>
                    <Medal className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-amber-600">
                      <AvatarImage src={getAvatarUrl(topUploaders[2]?.discord_id, topUploaders[2]?.avatar) || "/placeholder.svg"} />
                      <AvatarFallback className="bg-amber-600/20 text-amber-600">
                        {topUploaders[2]?.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-foreground">
                      {topUploaders[2]?.username || "N/A"}
                    </h3>
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <Upload className="w-4 h-4 inline mr-1" />
                        {topUploaders[2]?.uploads || 0} uploads
                      </p>
                      <p className="text-muted-foreground">
                        <Download className="w-4 h-4 inline mr-1" />
                        {formatNumber(topUploaders[2]?.downloads_received || 0)} DL
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Rest of the list */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {topUploaders.slice(3).map((uploader, index) => (
                  <div
                    key={uploader.id}
                    className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 4)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getAvatarUrl(uploader.discord_id, uploader.avatar) || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {uploader.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {uploader.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        {uploader.uploads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(uploader.downloads_received)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {Number(uploader.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topUploaders.length === 0 && (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun uploadeur pour le moment
                </p>
              </div>
            )}
          </TabsContent>

          {/* Top Resources */}
          <TabsContent value="resources">
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {topResources.map((resource, index) => (
                  <div
                    key={resource.id}
                    className={`p-4 flex items-center gap-4 ${index < 3 ? getRankBg(index + 1) : "hover:bg-secondary/50"} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {resource.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        par {resource.author}
                      </p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 capitalize">
                      {resource.category}
                    </Badge>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(resource.downloads)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {Number(resource.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topResources.length === 0 && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucune ressource pour le moment
                </p>
              </div>
            )}
          </TabsContent>

          {/* Top Downloaders */}
          <TabsContent value="downloaders">
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {topDownloaders.map((downloader, index) => (
                  <div
                    key={downloader.id}
                    className={`p-4 flex items-center gap-4 ${index < 3 ? getRankBg(index + 1) : "hover:bg-secondary/50"} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={getAvatarUrl(downloader.discord_id, downloader.avatar) || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {downloader.username?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {downloader.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(downloader.downloads)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-400" />
                        {downloader.favorites}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {topDownloaders.length === 0 && (
              <div className="text-center py-12">
                <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun telechargeur pour le moment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
