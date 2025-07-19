import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "@/components/BottomNavigation";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  MessageCircle,
  Clock,
  PenTool,
  Palette,
  Image,
  Megaphone,
  Code,
  BarChart3
} from "lucide-react";
import type { Conversation } from "@shared/schema";

const categoryIcons = {
  writing: PenTool,
  branding: Palette,
  creative: Image,
  marketing: Megaphone,
  technical: Code,
  analytics: BarChart3
};

const categoryTitles = {
  writing: 'Writing Tools',
  branding: 'Brand Strategy',
  creative: 'Image & Art',
  marketing: 'Marketing',
  technical: 'Tech Integration',
  analytics: 'Analytics'
};

export default function History() {
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

  // Get conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/conversations"],
    enabled: !!user,
    retry: false,
  });

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
          <h2 className="font-semibold text-slate-50">Conversation History</h2>
          <p className="text-slate-400 text-sm">Your AI learning sessions</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {conversationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full loading-spinner"></div>
            <span className="ml-3 text-slate-400">Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No Conversations Yet</h3>
            <p className="text-slate-400 mb-6">Start your first AI conversation to see it here</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-indigo-600">
                Start Learning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation: Conversation) => {
              const CategoryIcon = categoryIcons[conversation.category as keyof typeof categoryIcons] || MessageCircle;
              const categoryTitle = categoryTitles[conversation.category as keyof typeof categoryTitles] || conversation.category;
              
              return (
                <Link key={conversation.id} href={`/chat/${conversation.category}?id=${conversation.id}`}>
                  <Card className="glass-card border-slate-700/50 cursor-pointer hover:bg-slate-700/40 transition-all duration-200 scale-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                          <CategoryIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-50 truncate">{conversation.title}</h3>
                          <div className="flex items-center text-sm text-slate-400 mt-1">
                            <span className="capitalize">{categoryTitle}</span>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4 mr-1" />
                            <span>
                              {new Date(conversation.updatedAt || conversation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}