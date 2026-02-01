'use client';

import React from "react"

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Upload,
  File,
  X,
  ImageIcon,
  Code,
  Map,
  Wrench,
  Monitor,
  Shirt,
  Database,
  Loader2,
  Check,
} from 'lucide-react';
import type { User, ResourceCategory } from '@/types';

interface UploadFormProps {
  user: User;
}

const categories: { value: ResourceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'script', label: 'Script', icon: Code },
  { value: 'mapping', label: 'Mapping', icon: Map },
  { value: 'tool', label: 'Tool', icon: Wrench },
  { value: 'loading_screen', label: 'Loading Screen', icon: Monitor },
  { value: 'outfit', label: 'Tenue', icon: Shirt },
  { value: 'base', label: 'Base', icon: Database },
];

export function UploadForm({ user }: UploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '' as ResourceCategory | '',
    version: '1.0.0',
    tags: '',
  });
  
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Resource file dropzone
  const onResourceDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const allowedExtensions = ['.zip', '.rar', '.7z'];
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(ext)) {
        toast.error('Format de fichier non supporte. Utilisez .zip, .rar ou .7z');
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Maximum 100MB');
        return;
      }
      
      setResourceFile(file);
    }
  }, []);

  const { getRootProps: getResourceRootProps, getInputProps: getResourceInputProps, isDragActive: isResourceDragActive } = useDropzone({
    onDrop: onResourceDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
    },
    maxFiles: 1,
  });

  // Thumbnail dropzone
  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  // Additional images dropzone
  const onImagesDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, 5 - imageFiles.length);
    setImageFiles([...imageFiles, ...newFiles]);
    setImagePreviews([...imagePreviews, ...newFiles.map(f => URL.createObjectURL(f))]);
  }, [imageFiles, imagePreviews]);

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps, isDragActive: isImagesDragActive } = useDropzone({
    onDrop: onImagesDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }

    if (!formData.category) {
      toast.error('La categorie est requise');
      return;
    }

    if (!resourceFile) {
      toast.error('Le fichier de ressource est requis');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('longDescription', formData.longDescription);
      uploadData.append('category', formData.category);
      uploadData.append('version', formData.version);
      uploadData.append('tags', formData.tags);
      uploadData.append('resourceFile', resourceFile);
      
      if (thumbnailFile) {
        uploadData.append('thumbnail', thumbnailFile);
      }
      
      imageFiles.forEach((file, index) => {
        uploadData.append(`image_${index}`, file);
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/resources', {
        method: 'POST',
        body: uploadData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      toast.success('Ressource uploadee avec succes !');
      router.push(`/resources/${data.slug}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
          <CardDescription>
            Decrivez votre ressource pour aider les utilisateurs a la trouver
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                placeholder="Ex: ESX Job Mechanic"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ResourceCategory })}
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Selectionnez une categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        <cat.icon className="h-4 w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description courte *</Label>
            <Textarea
              id="description"
              placeholder="Une breve description de votre ressource..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-secondary/50 min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Description detaillee</Label>
            <Textarea
              id="longDescription"
              placeholder="Description complete avec instructions d'installation, fonctionnalites, etc. (Markdown supporte)"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="bg-secondary/50 min-h-[200px]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separes par des virgules)</Label>
              <Input
                id="tags"
                placeholder="esx, job, mechanic, roleplay"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="bg-secondary/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource File */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Fichier de ressource *</CardTitle>
          <CardDescription>
            Uploadez votre fichier (.zip, .rar, .7z) - Maximum 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getResourceRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isResourceDragActive
                ? 'border-primary bg-primary/10'
                : resourceFile
                ? 'border-green-500 bg-green-500/10'
                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
          >
            <input {...getResourceInputProps()} />
            {resourceFile ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{resourceFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(resourceFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResourceFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Glissez votre fichier ici ou cliquez pour parcourir
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Formats acceptes: .zip, .rar, .7z
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Miniature</CardTitle>
          <CardDescription>
            Une image representative de votre ressource (recommande: 800x450px)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getThumbnailRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isThumbnailDragActive
                ? 'border-primary bg-primary/10'
                : thumbnailFile
                ? 'border-green-500 bg-green-500/10'
                : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }`}
          >
            <input {...getThumbnailInputProps()} />
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  className="mx-auto max-h-48 rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThumbnailFile(null);
                    setThumbnailPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                    <ImageIcon className="h-7 w-7 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Glissez une image ou cliquez pour parcourir
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Images */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Images supplementaires</CardTitle>
          <CardDescription>
            Ajoutez jusqu&apos;a 5 captures d&apos;ecran (optionnel)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {imageFiles.length < 5 && (
              <div
                {...getImagesRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isImagesDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }`}
              >
                <input {...getImagesInputProps()} />
                <p className="text-sm text-muted-foreground">
                  Ajouter des images ({5 - imageFiles.length} restantes)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          * Champs obligatoires
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Upload en cours... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Publier la ressource
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
