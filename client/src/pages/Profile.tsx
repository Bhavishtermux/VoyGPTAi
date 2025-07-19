import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  User,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Brain,
  MessageCircle,
  Award
} from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 page-transition">
      {/* Header */}
      <header className="glass-nav p-4 flex items-center border-b border-slate-700/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="mr-4 text-slate-300 hover:text-white p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-semibold text-slate-50">Profile</h2>
          <p className="text-slate-400 text-sm">Your AI learning journey</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <CardTitle className="text-xl text-slate-50">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.email?.split('@')[0] || 'AI Learner'
              }
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Brand Builder
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-slate-400 mr-3" />
                <span className="text-slate-200">{user.email}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-slate-400 mr-3" />
              <span className="text-slate-200">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card border-slate-700/50">
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-50">0</div>
              <div className="text-sm text-slate-400">Conversations</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-slate-700/50">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-50">6</div>
              <div className="text-sm text-slate-400">AI Assistants</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress */}
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg text-slate-50 flex items-center">
              <Award className="w-5 h-5 text-yellow-400 mr-2" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Brand Strategy</span>
                <Badge variant="outline" className="text-slate-400 border-slate-600">Beginner</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">AI Writing Tools</span>
                <Badge variant="outline" className="text-slate-400 border-slate-600">Beginner</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Creative AI</span>
                <Badge variant="outline" className="text-slate-400 border-slate-600">Beginner</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start glass-card border-slate-600 text-slate-200 hover:bg-slate-700/40"
            onClick={() => toast({ title: "Coming Soon", description: "Settings will be available in the next update" })}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-600/50 text-red-400 hover:bg-red-600/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}