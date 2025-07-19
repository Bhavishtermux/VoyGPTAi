import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, Zap } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/90 to-indigo-900/30 geometric-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-slate-900/70 to-indigo-900/20"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo */}
        <div className="w-32 h-32 mb-8 glass-card rounded-full flex items-center justify-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-slate-50">
            Welcome to<br />
            <span className="text-primary">AI Brand Assistant</span>
          </h1>
          <p className="text-slate-300 text-lg px-4 max-w-md leading-relaxed">
            Your intelligent companion for mastering AI tools and building powerful brands
          </p>
        </div>
        
        {/* Login Button */}
        <Button 
          onClick={handleLogin}
          className="w-full max-w-sm bg-primary hover:bg-indigo-600 text-white font-semibold py-6 px-8 rounded-xl transition-all duration-200 mb-8 text-lg"
        >
          <Sparkles className="w-5 h-5 mr-3" />
          Start Learning
        </Button>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          <Card className="glass-card border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-primary mr-3" />
                <span className="text-sm text-slate-200">AI-Powered Brand Guidance</span>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Zap className="w-5 h-5 text-primary mr-3" />
                <span className="text-sm text-slate-200">Complete AI Tools Education</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
