import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Package,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Ticket,
  AlertTriangle,
} from 'lucide-react';

// Mock stats - will be replaced with actual DB queries
const stats = {
  totalUsers: 5420,
  usersTrend: 12.5,
  totalResources: 1523,
  resourcesTrend: 8.3,
  totalDownloads: 125680,
  downloadsTrend: 15.2,
  averageRating: 4.6,
  ratingTrend: 0.2,
  openTickets: 23,
  pendingClaims: 8,
};

const recentActivity = [
  { type: 'upload', user: 'DevMaster', resource: 'ESX Job Police v2', time: '5 min' },
  { type: 'download', user: 'GamerPro', resource: 'Los Santos Map', time: '12 min' },
  { type: 'rating', user: 'ServerAdmin', resource: 'Loading Screen Pack', time: '25 min' },
  { type: 'signup', user: 'NewPlayer123', resource: null, time: '1 heure' },
  { type: 'ticket', user: 'HelpMe', resource: 'Script Bug Report', time: '2 heures' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de votre plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{stats.usersTrend}% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ressources
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalResources.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{stats.resourcesTrend}% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Telechargements
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{stats.downloadsTrend}% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Note moyenne
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.averageRating.toFixed(1)}/5
            </div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{stats.ratingTrend} ce mois
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass border-yellow-500/30">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Ticket className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Tickets ouverts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{stats.openTickets}</div>
            <p className="text-sm text-muted-foreground">tickets en attente de reponse</p>
          </CardContent>
        </Card>

        <Card className="glass border-orange-500/30">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-lg">Reclamations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{stats.pendingClaims}</div>
            <p className="text-sm text-muted-foreground">reclamations en attente</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Activite recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    activity.type === 'upload'
                      ? 'bg-green-500/20 text-green-500'
                      : activity.type === 'download'
                      ? 'bg-blue-500/20 text-blue-500'
                      : activity.type === 'rating'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : activity.type === 'signup'
                      ? 'bg-purple-500/20 text-purple-500'
                      : 'bg-orange-500/20 text-orange-500'
                  }`}
                >
                  {activity.type === 'upload' && <Package className="h-5 w-5" />}
                  {activity.type === 'download' && <Download className="h-5 w-5" />}
                  {activity.type === 'rating' && <Star className="h-5 w-5" />}
                  {activity.type === 'signup' && <Users className="h-5 w-5" />}
                  {activity.type === 'ticket' && <Ticket className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-primary">{activity.user}</span>
                    {activity.type === 'upload' && ' a uploade '}
                    {activity.type === 'download' && ' a telecharge '}
                    {activity.type === 'rating' && ' a note '}
                    {activity.type === 'signup' && ' s\'est inscrit'}
                    {activity.type === 'ticket' && ' a ouvert un ticket: '}
                    {activity.resource && (
                      <span className="text-muted-foreground">{activity.resource}</span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">Il y a {activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
