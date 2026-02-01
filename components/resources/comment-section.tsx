'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Send, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User, Comment } from '@/types';

interface CommentSectionProps {
  resourceId: string;
  user: User | null;
}

// Mock comments data
const mockComments: Comment[] = [
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
    content: 'Super framework ! Je l\'utilise sur mon serveur depuis 2 mois et il fonctionne parfaitement.',
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-20T10:30:00Z',
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
      role: 'moderator',
      download_limit: 20,
      downloads_today: 0,
      referral_code: 'MOD123',
      referred_by: null,
      referral_bonus: 5,
      created_at: '',
      updated_at: '',
    },
    content: 'Excellente ressource, tres bien documentee. L\'installation est simple et rapide.',
    created_at: '2024-01-18T15:45:00Z',
    updated_at: '2024-01-18T15:45:00Z',
  },
];

export function CommentSection({ resourceId, user }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Vous devez etre connecte pour commenter');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Le commentaire ne peut pas etre vide');
      return;
    }

    setIsSubmitting(true);
    
    // In production, this would be an API call
    const comment: Comment = {
      id: Date.now().toString(),
      resource_id: resourceId,
      user_id: user.id,
      user: user,
      content: newComment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setIsSubmitting(false);
    toast.success('Commentaire ajoute');
  };

  const handleDelete = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
    toast.success('Commentaire supprime');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <Card className="glass">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] bg-secondary/50"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  <Send className="h-4 w-4" />
                  Publier
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Connectez-vous pour laisser un commentaire
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Aucun commentaire pour le moment. Soyez le premier a commenter !
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="glass">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.username} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {comment.user?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {comment.user?.username}
                        </span>
                        {comment.user?.role !== 'user' && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded capitalize">
                            {comment.user?.role}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      {user && (user.id === comment.user_id || user.role === 'admin') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.id === comment.user_id && (
                              <DropdownMenuItem>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(comment.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
