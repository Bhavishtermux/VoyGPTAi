import { Button } from "@/components/ui/button";
import { Home, MessageCircle, History, User } from "lucide-react";
import { useLocation, Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav px-4 py-3 border-t border-slate-700/50 safe-area-inset-bottom">
      <div className="flex justify-around items-center">
        <Link href="/">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-3 transition-all duration-200 touch-target active:scale-95 ${
              isActive("/") ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={`flex flex-col items-center p-3 transition-all duration-200 touch-target active:scale-95 ${
            isActive("/chat") ? "text-primary" : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => {
            window.location.href = "/chat/writing";
          }}
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">AI Assistants</span>
        </Button>
        <Link href="/history">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-3 transition-all duration-200 touch-target active:scale-95 ${
              isActive("/history") ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <History className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">History</span>
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="ghost"
            className={`flex flex-col items-center p-3 transition-all duration-200 touch-target active:scale-95 ${
              isActive("/profile") ? "text-primary" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
