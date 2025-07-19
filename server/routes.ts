import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateAIResponse, generateConversationTitle } from "./services/aiService";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Conversation routes
  app.post('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertConversationSchema.parse({
        ...req.body,
        userId
      });

      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create conversation" });
      }
    }
  });

  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getUserConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = parseInt(req.params.id);
      
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      const conversation = await storage.getConversationWithMessages(conversationId, userId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  app.put('/api/conversations/:id/title', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = parseInt(req.params.id);
      const { title } = req.body;

      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: "Title is required and must be a string" });
      }

      await storage.updateConversationTitle(conversationId, title, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating conversation title:", error);
      res.status(500).json({ message: "Failed to update conversation title" });
    }
  });

  // Message routes
  app.post('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = parseInt(req.params.id);
      
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }

      // Verify conversation belongs to user
      const conversation = await storage.getConversationWithMessages(conversationId, userId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const validatedMessage = insertMessageSchema.parse({
        ...req.body,
        conversationId
      });

      // Create user message
      const userMessage = await storage.createMessage(validatedMessage);

      // Generate AI response
      const conversationHistory = conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const aiResponse = await generateAIResponse(
        validatedMessage.content,
        conversation.category,
        conversationHistory
      );

      // Create AI response message
      const aiMessage = await storage.createMessage({
        conversationId,
        role: 'assistant',
        content: aiResponse
      });

      // If this is the first message, generate and update conversation title
      if (conversation.messages.length === 0) {
        const title = await generateConversationTitle(validatedMessage.content);
        await storage.updateConversationTitle(conversationId, title, userId);
      }

      res.json({
        userMessage,
        aiMessage
      });
    } catch (error) {
      console.error("Error creating message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create message and generate response" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
