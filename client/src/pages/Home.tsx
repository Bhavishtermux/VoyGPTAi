import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useState } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  return <Dashboard />;
}
