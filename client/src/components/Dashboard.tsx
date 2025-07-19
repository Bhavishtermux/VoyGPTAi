import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { Link } from "wouter";
import { 
  PenTool, 
  Palette, 
  Image, 
  Megaphone, 
  Code, 
  BarChart3,
  User,
  LogOut
} from "lucide-react";

const categories = [
  {
    id: 'writing',
    title: 'Writing Tools',
    description: 'Generating creative content with AI writing assistants',
    icon: PenTool,
    color: 'bg-primary/20 text-primary'
  },
  {
    id: 'branding',
    title: 'Brand Strategy',
    description: 'Build powerful brand identity using AI tools',
    icon: Palette,
    color: 'bg-emerald-500/20 text-emerald-400'
  },
  {
    id: 'creative',
    title: 'Image & Art',
    description: 'Generating unique visual assets with AI',
    icon: Image,
    color: 'bg-pink-500/20 text-pink-400'
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'AI-powered marketing campaign strategies',
    icon: Megaphone,
    color: 'bg-orange-500/20 text-orange-400'
  },
  {
    id: 'technical',
    title: 'Tech Integration',
    description: 'Implementing AI tools in your workflow',
    icon: Code,
    color: 'bg-blue-500/20 text-blue-400'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'AI-driven insights and performance tracking',
    icon: BarChart3,
    color: 'bg-purple-500/20 text-purple-400'
  }
];

const filterOptions = ['All', 'Design', 'Creative', 'Technical'];

export default function Dashboard() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">AI Assistant</h1>
            <p className="text-slate-400 text-sm">Choose your learning path</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-slate-200"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {filterOptions.map((filter, index) => (
            <Badge
              key={filter}
              variant={index === 0 ? "default" : "secondary"}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer ${
                index === 0 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'glass-card bg-slate-700/40 text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link key={category.id} href={`/chat/${category.id}`}>
              <Card className="glass-card border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-all h-full">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-50">{category.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <BottomNavigation />
    </div>
  );
}
