"use client";

import { useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Download,
  Upload,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const mockTopUploaders = [
  {
    rank: 1,
    username: "DarkRP_Master",
    avatar: "",
    uploads: 156,
    downloads_received: 45678,
    rating: 4.9,
  },
  {
    rank: 2,
    username: "ScriptKing",
    avatar: "",
    uploads: 134,
    downloads_received: 38920,
    rating: 4.8,
  },
  {
    rank: 3,
    username: "MapperPro",
    avatar: "",
    uploads: 98,
    downloads_received: 29345,
    rating: 4.7,
  },
  {
    rank: 4,
    username: "CodeWizard",
    avatar: "",
    uploads: 87,
    downloads_received: 21890,
    rating: 4.6,
  },
  {
    rank: 5,
    username: "FiveMDev",
    avatar: "",
    uploads: 76,
    downloads_received: 18456,
    rating: 4.5,
  },
  {
    rank: 6,
    username: "MLOCreator",
    avatar: "",
    uploads: 65,
    downloads_received: 15234,
    rating: 4.4,
  },
  {
    rank: 7,
    username: "ScriptMaster",
    avatar: "",
    uploads: 54,
    downloads_received: 12890,
    rating: 4.3,
  },
  {
    rank: 8,
    username: "UIDesigner",
    avatar: "",
    uploads: 43,
    downloads_received: 9876,
    rating: 4.2,
  },
  {
    rank: 9,
    username: "LoadingPro",
    avatar: "",
    uploads: 32,
    downloads_received: 7654,
    rating: 4.1,
  },
  {
    rank: 10,
    username: "NewDev",
    avatar: "",
    uploads: 21,
    downloads_received: 5432,
    rating: 4.0,
  },
];

const mockTopDownloaders = [
  {
    rank: 1,
    username: "ServerOwner1",
    avatar: "",
    downloads: 2345,
    favorites: 123,
  },
  {
    rank: 2,
    username: "RPServer",
    avatar: "",
    downloads: 1987,
    favorites: 98,
  },
  {
    rank: 3,
    username: "CityLife",
    avatar: "",
    downloads: 1654,
    favorites: 87,
  },
  {
    rank: 4,
    username: "GrandRP",
    avatar: "",
    downloads: 1432,
    favorites: 76,
  },
  {
    rank: 5,
    username: "FrenchRP",
    avatar: "",
    downloads: 1234,
    favorites: 65,
  },
];

const mockTopResources = [
  {
    rank: 1,
    title: "Advanced Police MDT",
    author: "DarkRP_Master",
    category: "script",
    downloads: 12345,
    rating: 4.9,
  },
  {
    rank: 2,
    title: "Legion Square Revamp",
    author: "MapperPro",
    category: "mapping",
    downloads: 9876,
    rating: 4.8,
  },
  {
    rank: 3,
    title: "Modern Loading Screen",
    author: "UIDesigner",
    category: "loading",
    downloads: 8765,
    rating: 4.9,
  },
  {
    rank: 4,
    title: "Complete Admin Menu",
    author: "ScriptKing",
    category: "tool",
    downloads: 7654,
    rating: 4.7,
  },
  {
    rank: 5,
    title: "ESX Framework Base",
    author: "CodeWizard",
    category: "base",
    downloads: 6543,
    rating: 4.6,
  },
];

export default function LeaderboardPage() {
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
      <Navbar />

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
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <div className="order-2 md:order-1 md:mt-8">
                <Card
                  className={`glass border p-6 text-center ${getRankBg(2)}`}
                >
                  <Medal className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-gray-400">
                    <AvatarImage src={mockTopUploaders[1].avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gray-400/20 text-gray-400">
                      {mockTopUploaders[1].username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-foreground">
                    {mockTopUploaders[1].username}
                  </h3>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <Upload className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[1].uploads} uploads
                    </p>
                    <p className="text-muted-foreground">
                      <Download className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[1].downloads_received.toLocaleString()}{" "}
                      DL
                    </p>
                  </div>
                </Card>
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2">
                <Card
                  className={`glass border p-6 text-center ${getRankBg(1)}`}
                >
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-yellow-400">
                    <AvatarImage src={mockTopUploaders[0].avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-yellow-400/20 text-yellow-400">
                      {mockTopUploaders[0].username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg text-foreground">
                    {mockTopUploaders[0].username}
                  </h3>
                  <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Champion
                  </Badge>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <Upload className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[0].uploads} uploads
                    </p>
                    <p className="text-muted-foreground">
                      <Download className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[0].downloads_received.toLocaleString()}{" "}
                      DL
                    </p>
                    <p className="text-yellow-400">
                      <Star className="w-4 h-4 inline mr-1 fill-yellow-400" />
                      {mockTopUploaders[0].rating} / 5
                    </p>
                  </div>
                </Card>
              </div>

              {/* 3rd Place */}
              <div className="order-3 md:mt-12">
                <Card
                  className={`glass border p-6 text-center ${getRankBg(3)}`}
                >
                  <Medal className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                  <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-amber-600">
                    <AvatarImage src={mockTopUploaders[2].avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-amber-600/20 text-amber-600">
                      {mockTopUploaders[2].username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-foreground">
                    {mockTopUploaders[2].username}
                  </h3>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <Upload className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[2].uploads} uploads
                    </p>
                    <p className="text-muted-foreground">
                      <Download className="w-4 h-4 inline mr-1" />
                      {mockTopUploaders[2].downloads_received.toLocaleString()}{" "}
                      DL
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Rest of the list */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {mockTopUploaders.slice(3).map((user) => (
                  <div
                    key={user.rank}
                    className="p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {user.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        {user.uploads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {user.downloads_received.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {user.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Top Resources */}
          <TabsContent value="resources">
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {mockTopResources.map((resource) => (
                  <div
                    key={resource.rank}
                    className={`p-4 flex items-center gap-4 ${resource.rank <= 3 ? getRankBg(resource.rank) : "hover:bg-secondary/50"} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(resource.rank)}
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
                        {resource.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Top Downloaders */}
          <TabsContent value="downloaders">
            <div className="glass rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {mockTopDownloaders.map((user) => (
                  <div
                    key={user.rank}
                    className={`p-4 flex items-center gap-4 ${user.rank <= 3 ? getRankBg(user.rank) : "hover:bg-secondary/50"} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {user.username}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {user.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-400" />
                        {user.favorites}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
