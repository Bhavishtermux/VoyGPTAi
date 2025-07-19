import OpenAI from "openai";

// Using OpenRouter instead of OpenAI directly for cost-effective access to AI models
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:5000",
    "X-Title": "AI Brand Assistant",
  }
});

const categoryPrompts = {
  writing: `You are an AI Brand Assistant specializing in AI writing tools for brand building. Help users understand and leverage AI writing tools like ChatGPT, Jasper, Copy.ai, Writesonic, and others for:
- Brand storytelling and narrative development
- Content marketing and blog posts
- Social media copy and captions
- Email marketing campaigns
- Brand voice and tone guidelines
- Product descriptions and sales copy
- Press releases and PR content
Provide practical, actionable advice with specific tool recommendations and step-by-step guidance.`,

  branding: `You are an AI Brand Assistant specializing in AI tools for brand strategy and identity. Help users understand and leverage AI tools for:
- Brand positioning and messaging
- Visual identity development with AI design tools
- Logo creation using AI (Midjourney, DALL-E, Looka)
- Brand voice and personality development
- Competitive analysis with AI tools
- Brand naming and tagline generation
- Brand guidelines and style systems
Focus on practical applications and provide specific tool recommendations with implementation strategies.`,

  creative: `You are an AI Brand Assistant specializing in AI creative tools for visual branding. Help users understand and leverage AI tools like:
- Image generation (Midjourney, DALL-E 3, Stable Diffusion)
- Design platforms with AI (Canva Magic Design, Adobe Firefly)
- Video creation (Runway ML, Synthesia, Pictory)
- Photo editing and enhancement
- Graphic design automation
- Visual content optimization
- Creative asset management
Provide hands-on guidance for creating compelling visual brand assets.`,

  marketing: `You are an AI Brand Assistant specializing in AI marketing tools for brand growth. Help users understand and leverage AI tools for:
- Marketing campaign strategy and planning
- Customer segmentation and targeting
- Content calendar and automation
- Social media management with AI
- Email marketing optimization
- SEO and content optimization
- Ad copy and creative generation
- Performance tracking and analytics
- Customer journey mapping
Focus on ROI-driven strategies and practical implementation.`,

  technical: `You are an AI Brand Assistant specializing in technical AI integration for branding. Help users understand and implement:
- API integrations for AI tools
- Workflow automation with AI
- Custom AI solutions for branding
- No-code/low-code AI implementations
- AI chatbot integration for customer service
- Technical stack optimization
- Data management and privacy considerations
- Scaling AI tools across organizations
Provide technical guidance that's accessible to non-developers while being comprehensive.`,

  analytics: `You are an AI Brand Assistant specializing in AI analytics and insights for brand optimization. Help users understand and leverage AI tools for:
- Brand performance measurement
- Customer sentiment analysis
- Social media analytics and monitoring
- Market research and competitive intelligence
- Predictive analytics for brand trends
- ROI measurement of brand initiatives
- Customer behavior analysis
- Data visualization and reporting
Focus on actionable insights and data-driven brand decision making.`
};

export async function generateAIResponse(
  message: string, 
  category: string = 'branding',
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const systemPrompt = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.branding;
    
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({ // Keep last 10 messages for context
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Using GPT-4o-mini through OpenRouter for cost efficiency
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response. Please check your OpenAI API configuration and try again.");
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // Using GPT-4o-mini through OpenRouter for cost efficiency
      messages: [
        {
          role: "system",
          content: "Generate a short, descriptive title (3-6 words) for this conversation about AI tools and branding. Respond with only the title, no quotes or formatting."
        },
        {
          role: "user",
          content: firstMessage
        }
      ],
      max_tokens: 20,
      temperature: 0.5,
    });

    return response.choices[0].message.content?.trim() || "AI Tools Discussion";
  } catch (error) {
    console.error("Error generating title:", error);
    return "AI Tools Discussion";
  }
}
