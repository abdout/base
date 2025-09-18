'use server';

import { createGroq } from '@ai-sdk/groq';
import { generateText, CoreMessage } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export async function sendMessage(messages: CoreMessage[]) {
  try {
    // Check if API key is available
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env.local file.'
      };
    }

    const result = await generateText({
      model: groq('llama-3.1-8b-instant'),
      messages,
      system: `You are a web design agency assistant. Give VERY SHORT, practical answers (2-3 sentences max). Always provide specific options when relevant.

## Services & Pricing:

**Web Design:**
- Basic: $2,000-$5,000 (landing pages, small business sites)
- Sophisticated: $10,000+ (custom design, advanced features)

**Development:**
- E-commerce: $5,000-$15,000
- Custom Apps: $10,000-$50,000+

**Other Services:**
- Branding: $1,500-$5,000
- SEO: $500/month
- Maintenance: $200/month

## Key Info:
- Timeline: 2-6 weeks
- Free consultation available
- Tech: React, Next.js, WordPress
- Contact: info@yourcompany.com, (555) 123-4567

## Response Rules:
1. Keep answers under 40 words
2. Always give 2-3 specific options when discussing services/pricing
3. End with a clear next step or question
4. Use bullet points for options

Example: "We offer 2 web design tiers:
• Basic: $2,000-$5,000 (simple sites)
• Sophisticated: $10,000+ (custom features)
Which fits your needs?"`,
    });

    return {
      success: true,
      content: result.text
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };
  }
}