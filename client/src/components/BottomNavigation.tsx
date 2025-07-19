import { Button } from "@/components/ui/button";
import { Home, MessageCircle, History, User } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav px-6 py-4 border-t border-slate-700/50">
      <div className="flex justify-around items-center">
        <Button
          variant="ghost"
          className={`flex flex-col items-center p-2 ${
            isActive("/") ? "text-primary" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex flex-col items-center p-2 ${
            isActive("/chat") ? "text-primary" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs">AI Assistants</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-200"
        >
          <History className="w-5 h-5 mb-1" />
          <span className="text-xs">History</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center p-2 text-slate-400 hover:text-slate-200"
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  );
}
