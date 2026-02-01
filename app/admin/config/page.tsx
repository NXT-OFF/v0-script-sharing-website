"use client";

import { useState } from "react";
import {
  Settings,
  Download,
  Users,
  Gift,
  Clock,
  Save,
  RefreshCw,
  Globe,
  Shield,
  Bell,
  Palette,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    // General
    siteName: "FiveM Hub",
    siteDescription: "Plateforme de partage de ressources FiveM",
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Downloads
    defaultDownloadLimit: 10,
    premiumDownloadLimit: 50,
    adminDownloadLimit: 999,
    downloadCooldown: 0,
    
    // Referrals
    referralBonusDownloads: 5,
    maxReferralBonus: 50,
    referralCodeLength: 8,
    
    // Resources
    autoApproveResources: false,
    resourceExpirationDays: 30,
    maxFileSize: 100,
    allowedFileTypes: ".zip,.rar,.7z",
    
    // Notifications
    emailNotifications: true,
    discordWebhook: "",
    notifyOnNewResource: true,
    notifyOnNewUser: true,
    
    // Security
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    requireEmailVerification: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Configuration sauvegardee avec succes");
    setIsSaving(false);
  };

  const updateConfig = (key: string, value: string | number | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuration</h1>
          <p className="text-muted-foreground">
            Parametres generaux du site
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass border-border">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="downloads" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Download className="w-4 h-4 mr-2" />
            Telechargements
          </TabsTrigger>
          <TabsTrigger value="referrals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Gift className="w-4 h-4 mr-2" />
            Parrainages
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Ressources
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            Securite
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Parametres Generaux
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nom du site</Label>
                <Input
                  value={config.siteName}
                  onChange={(e) => updateConfig("siteName", e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={config.siteDescription}
                  onChange={(e) =>
                    updateConfig("siteDescription", e.target.value)
                  }
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Mode maintenance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Desactiver l'acces au site pour les utilisateurs
                  </p>
                </div>
                <Switch
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) =>
                    updateConfig("maintenanceMode", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Inscriptions ouvertes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux nouveaux utilisateurs de s'inscrire
                  </p>
                </div>
                <Switch
                  checked={config.registrationEnabled}
                  onCheckedChange={(checked) =>
                    updateConfig("registrationEnabled", checked)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Downloads */}
        <TabsContent value="downloads">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Limites de Telechargement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Limite par defaut (utilisateurs)</Label>
                <Input
                  type="number"
                  value={config.defaultDownloadLimit}
                  onChange={(e) =>
                    updateConfig("defaultDownloadLimit", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Telechargements par jour pour les nouveaux utilisateurs
                </p>
              </div>

              <div className="space-y-2">
                <Label>Limite premium</Label>
                <Input
                  type="number"
                  value={config.premiumDownloadLimit}
                  onChange={(e) =>
                    updateConfig("premiumDownloadLimit", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Telechargements par jour pour les membres premium
                </p>
              </div>

              <div className="space-y-2">
                <Label>Limite admin</Label>
                <Input
                  type="number"
                  value={config.adminDownloadLimit}
                  onChange={(e) =>
                    updateConfig("adminDownloadLimit", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Telechargements par jour pour les administrateurs
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Delai entre telechargements (secondes)</Label>
              <Input
                type="number"
                value={config.downloadCooldown}
                onChange={(e) =>
                  updateConfig("downloadCooldown", parseInt(e.target.value))
                }
                className="bg-secondary border-border max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                0 = pas de delai
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Referrals */}
        <TabsContent value="referrals">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Systeme de Parrainage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Bonus par parrainage</Label>
                <Input
                  type="number"
                  value={config.referralBonusDownloads}
                  onChange={(e) =>
                    updateConfig(
                      "referralBonusDownloads",
                      parseInt(e.target.value)
                    )
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Telechargements bonus par parrainage reussi
                </p>
              </div>

              <div className="space-y-2">
                <Label>Bonus maximum</Label>
                <Input
                  type="number"
                  value={config.maxReferralBonus}
                  onChange={(e) =>
                    updateConfig("maxReferralBonus", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Limite maximale de bonus accumulables
                </p>
              </div>

              <div className="space-y-2">
                <Label>Longueur code parrainage</Label>
                <Input
                  type="number"
                  value={config.referralCodeLength}
                  onChange={(e) =>
                    updateConfig("referralCodeLength", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Nombre de caracteres du code
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Parametres des Ressources
            </h2>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">
                  Approbation automatique
                </p>
                <p className="text-sm text-muted-foreground">
                  Approuver automatiquement les nouvelles ressources
                </p>
              </div>
              <Switch
                checked={config.autoApproveResources}
                onCheckedChange={(checked) =>
                  updateConfig("autoApproveResources", checked)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Expiration (jours)</Label>
                <Input
                  type="number"
                  value={config.resourceExpirationDays}
                  onChange={(e) =>
                    updateConfig(
                      "resourceExpirationDays",
                      parseInt(e.target.value)
                    )
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  0 = pas d'expiration
                </p>
              </div>

              <div className="space-y-2">
                <Label>Taille max fichier (MB)</Label>
                <Input
                  type="number"
                  value={config.maxFileSize}
                  onChange={(e) =>
                    updateConfig("maxFileSize", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Extensions autorisees</Label>
                <Input
                  value={config.allowedFileTypes}
                  onChange={(e) =>
                    updateConfig("allowedFileTypes", e.target.value)
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Separees par des virgules
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Notifications email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des notifications par email
                  </p>
                </div>
                <Switch
                  checked={config.emailNotifications}
                  onCheckedChange={(checked) =>
                    updateConfig("emailNotifications", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Webhook Discord</Label>
                <Input
                  value={config.discordWebhook}
                  onChange={(e) =>
                    updateConfig("discordWebhook", e.target.value)
                  }
                  placeholder="https://discord.com/api/webhooks/..."
                  className="bg-secondary border-border"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Nouvelle ressource
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Notifier quand une nouvelle ressource est soumise
                  </p>
                </div>
                <Switch
                  checked={config.notifyOnNewResource}
                  onCheckedChange={(checked) =>
                    updateConfig("notifyOnNewResource", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Nouvel utilisateur
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Notifier quand un nouvel utilisateur s'inscrit
                  </p>
                </div>
                <Switch
                  checked={config.notifyOnNewUser}
                  onCheckedChange={(checked) =>
                    updateConfig("notifyOnNewUser", checked)
                  }
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="glass rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Securite
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tentatives de connexion max</Label>
                <Input
                  type="number"
                  value={config.maxLoginAttempts}
                  onChange={(e) =>
                    updateConfig("maxLoginAttempts", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Avant blocage du compte
                </p>
              </div>

              <div className="space-y-2">
                <Label>Duree de blocage (minutes)</Label>
                <Input
                  type="number"
                  value={config.lockoutDuration}
                  onChange={(e) =>
                    updateConfig("lockoutDuration", parseInt(e.target.value))
                  }
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">
                  Verification email obligatoire
                </p>
                <p className="text-sm text-muted-foreground">
                  Les utilisateurs doivent verifier leur email
                </p>
              </div>
              <Switch
                checked={config.requireEmailVerification}
                onCheckedChange={(checked) =>
                  updateConfig("requireEmailVerification", checked)
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
