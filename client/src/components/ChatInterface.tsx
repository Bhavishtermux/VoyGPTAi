import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreVertical,
  Brain,
  User,
  PenTool,
  Palette,
  Image,
  Megaphone,
  Code,
  BarChart3,
  Camera
} from "lucide-react";
import type { ConversationWithMessages, Message } from "@shared/schema";

const categoryIcons = {
  writing: PenTool,
  branding: Palette,
  creative: Image,
  marketing: Megaphone,
  instagram: Camera,
  technical: Code,
  analytics: BarChart3
};

const categoryTitles = {
  writing: 'AI Writing Assistant',
  branding: 'Brand Strategy AI',
  creative: 'Creative AI Tools',
  marketing: 'Marketing AI Expert',
  instagram: 'Instagram Growth Expert',
  technical: 'Technical Integration',
  analytics: 'AI Analytics Guide'
};

const suggestedMessages = {
  writing: [
    "Getting started with AI writing tools",
    "Best practices for brand storytelling",
    "How to maintain brand voice with AI"
  ],
  branding: [
    "Brand identity with AI",
    "AI tools for logo design",
    "Building brand guidelines"
  ],
  creative: [
    "AI image generation for brands",
    "Visual content strategies",
    "Creative workflow automation"
  ],
  marketing: [
    "AI marketing campaigns",
    "Content automation strategies",
    "Customer targeting with AI"
  ],
  instagram: [
    "Analyze @username account growth",
    "Content strategy recommendations",
    "Best posting times and hashtags"
  ],
  technical: [
    "AI tool integration",
    "Workflow automation setup",
    "Technical implementation guide"
  ],
  analytics: [
    "Brand performance metrics",
    "AI analytics tools",
    "Data-driven brand decisions"
  ]
};

export default function ChatInterface() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Get conversation data
  const { data: conversation, isLoading: conversationLoading } = useQuery({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId && !!user,
    retry: false,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (data: { title: string; category: string }) => {
      const response = await apiRequest("POST", "/api/conversations", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setConversationId(data.id);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { role: string; content: string }) => {
      if (!conversationId) throw new Error("No conversation ID");
      const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isTyping]);

  // Initialize conversation if needed
  useEffect(() => {
    if (user && category && !conversationId && !createConversationMutation.isPending) {
      createConversationMutation.mutate({
        title: "New Conversation",
        category: category
      });
    }
  }, [user, category, conversationId, createConversationMutation]);

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending || !conversationId) return;

    const messageContent = message.trim();
    setMessage("");
    setIsTyping(true);

    sendMessageMutation.mutate({
      role: "user",
      content: messageContent
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedMessage = (suggestedText: string) => {
    setMessage(suggestedText);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Brain;
  const categoryTitle = categoryTitles[category as keyof typeof categoryTitles] || "AI Assistant";
  const suggestions = suggestedMessages[category as keyof typeof suggestedMessages] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col page-transition">
      {/* Header */}
      <header className="glass-nav p-4 flex items-center border-b border-slate-700/50 safe-area-inset-top">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mr-4 text-slate-300 hover:text-white p-3 touch-target active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center flex-1">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
            <CategoryIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-50 text-lg">{categoryTitle}</h2>
            <p className="text-slate-400 text-base">Specialized in AI tools & branding</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white p-3 touch-target"
        >
          <MoreVertical className="w-6 h-6" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {/* Welcome Message */}
        <div className="mb-6 chat-message">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <CategoryIcon className="w-4 h-4 text-white" />
            </div>
            <Card className="glass-card border-slate-700/50 max-w-[85%]">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed text-slate-200 mb-3">
                  Hi! I'm your {categoryTitle}. I specialize in helping you understand and leverage AI tools for building powerful brands. What would you like to learn about today?
                </p>
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSuggestedMessage(suggestion)}
                        className="bg-primary/20 text-primary hover:bg-primary/30 text-xs px-3 py-1 h-auto"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Conversation Messages */}
        {conversation?.messages?.map((msg: Message) => (
          <div key={msg.id} className={`mb-6 chat-message ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            {msg.role === 'assistant' ? (
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <CategoryIcon className="w-4 h-4 text-white" />
                </div>
                <Card className="glass-card border-slate-700/50 max-w-[85%]">
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-end justify-end">
                <Card className="bg-primary max-w-[85%]">
                  <CardContent className="p-4">
                    <p className="text-sm text-white whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </CardContent>
                </Card>
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0 overflow-hidden">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="You" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="mb-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                <CategoryIcon className="w-4 h-4 text-white" />
              </div>
              <Card className="glass-card border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-indicator"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-indicator" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-indicator" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 glass-nav p-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white p-2"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={category === 'instagram' ? "Analyze @username or ask about growth strategies..." : "Ask about AI tools for branding..."}
              className="bg-slate-700/40 glass-card border-slate-600/50 text-white placeholder-slate-400 focus:ring-primary/50"
              disabled={sendMessageMutation.isPending || !conversationId}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending || !conversationId}
            className="w-10 h-10 bg-primary hover:bg-indigo-600 p-0"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
