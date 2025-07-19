import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ExternalLink, Sparkles } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('voyGPT-welcome-seen');
    
    if (!hasSeenWelcome) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('voyGPT-welcome-seen', 'true');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/voygpt', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700 text-slate-50">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-50 mb-2">
            Welcome to VoyGPT!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="glass-card border-slate-700/50 bg-slate-800/40">
            <CardContent className="p-5 text-center">
              <div className="mb-4">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-slate-50 mb-2">Your AI Brand Building Journey Starts Here</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  VoyGPT is your intelligent companion for mastering AI tools and building powerful brands. 
                  Get expert guidance across writing, strategy, creativity, marketing, tech integration, and analytics.
                </p>
              </div>
              
              <div className="border-t border-slate-700/50 pt-4">
                <p className="text-slate-400 text-sm mb-3">
                  Connect with us and stay updated on the latest AI tools and strategies:
                </p>
                <Button
                  onClick={handleInstagramClick}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-200 hover:bg-slate-700/40"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Owner On Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleClose}
            className="w-full bg-primary hover:bg-indigo-600 text-white font-semibold py-3"
          >
            Start My AI Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}