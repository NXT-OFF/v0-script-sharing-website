'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import type { User, Rating } from '@/types';

interface RatingSectionProps {
  resourceId: string;
  user: User | null;
}

// Mock ratings data
const mockRatings: Rating[] = [
  {
    id: '1',
    resource_id: '1',
    user_id: '2',
    user: {
      id: '2',
      discord_id: '456',
      username: 'GamerPro',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      role: 'user',
      download_limit: 10,
      downloads_today: 0,
      referral_code: 'XYZ789',
      referred_by: null,
      referral_bonus: 0,
      created_at: '',
      updated_at: '',
    },
    rating: 5,
    review: 'Parfait ! Exactement ce dont j\'avais besoin pour mon serveur.',
    created_at: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    resource_id: '1',
    user_id: '3',
    user: {
      id: '3',
      discord_id: '789',
      username: 'ServerAdmin',
      email: '',
      avatar: '',
      role: 'user',
      download_limit: 10,
      downloads_today: 0,
      referral_code: 'MOD123',
      referred_by: null,
      referral_bonus: 0,
      created_at: '',
      updated_at: '',
    },
    rating: 4,
    review: 'Tres bonne ressource, quelques petits ajustements a faire mais globalement excellent.',
    created_at: '2024-01-18T15:45:00Z',
  },
];

// Rating distribution mock
const ratingDistribution = {
  5: 180,
  4: 100,
  3: 40,
  2: 15,
  1: 7,
};

function StarRating({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hoverRating || rating)
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function RatingSection({ resourceId, user }: RatingSectionProps) {
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalRatings = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);
  const averageRating = Object.entries(ratingDistribution).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0) / totalRatings;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez etre connecte pour noter');
      return;
    }

    if (userRating === 0) {
      toast.error('Veuillez selectionner une note');
      return;
    }

    setIsSubmitting(true);
    
    const rating: Rating = {
      id: Date.now().toString(),
      resource_id: resourceId,
      user_id: user.id,
      user: user,
      rating: userRating,
      review: userReview,
      created_at: new Date().toISOString(),
    };

    setRatings([rating, ...ratings]);
    setUserRating(0);
    setUserReview('');
    setIsSubmitting(false);
    toast.success('Avis ajoute');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Average Rating */}
            <div className="text-center md:border-r md:border-border md:pr-8">
              <div className="text-5xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mt-2">
                <StarRating rating={Math.round(averageRating)} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {totalRatings} avis
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star as keyof typeof ratingDistribution];
                const percentage = (count / totalRatings) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-muted-foreground">{star}</span>
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="w-12 text-sm text-muted-foreground text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review */}
      {user ? (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Donner votre avis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Votre note</p>
                <StarRating rating={userRating} onRate={setUserRating} interactive />
              </div>
              <Textarea
                placeholder="Partagez votre experience avec cette ressource (optionnel)..."
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                className="min-h-[100px] bg-secondary/50"
              />
              <Button type="submit" disabled={isSubmitting}>
                Publier mon avis
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Connectez-vous pour laisser un avis
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {ratings.map((rating) => (
          <Card key={rating.id} className="glass">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={rating.user?.avatar || "/placeholder.svg"} alt={rating.user?.username} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {rating.user?.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">
                        {rating.user?.username}
                      </span>
                      <StarRating rating={rating.rating} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(rating.created_at)}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="mt-2 text-sm text-foreground">
                      {rating.review}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
