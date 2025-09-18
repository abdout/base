# Chatbot Component

A modern, modular AI chatbot component for Next.js applications with server actions, voice input, and multi-language support.

## ✨ Current Features

- 🎨 **Ultra-Minimal Design** - Clean interface without timestamps or typing indicators
- 🎙️ **Voice Input** - Speech-to-text functionality with Web Speech API
- 🌍 **Internationalization** - Built-in English/Arabic support with RTL
- 🚀 **Server Actions** - Modern Next.js server actions instead of API routes
- 📱 **Fully Responsive** - Works perfectly on all devices
- ⚡ **TypeScript** - Full type safety throughout
- 🎯 **Quick Actions** - Pre-configured question buttons
- 🖼️ **Custom Robot Icon** - Animated robot avatar instead of generic chat icon
- 🔄 **Non-Streaming** - Simple message-response pattern for reliability

## 📦 Installation

### 1. Copy Component

Copy the entire `chatbot` folder to your project:

```bash
# Copy the chatbot folder to your components directory
cp -r chatbot your-project/src/components/
```

### 2. Install Dependencies

```bash
# Required dependencies
pnpm add ai @ai-sdk/groq lucide-react clsx tailwind-merge
pnpm add @formatjs/intl-localematcher negotiator
pnpm add -D @types/negotiator

# UI Components (shadcn/ui)
npx shadcn@latest add button scroll-area avatar
```

### 3. Add Robot Image

Copy the robot.png image to your public folder:
```bash
cp robot.png your-project/public/
```

### 4. Set up Server Action

The chatbot uses server actions (not API routes). The action is already included in `actions.ts`:

```typescript
// src/components/chatbot/actions.ts
'use server';

import { createGroq } from '@ai-sdk/groq';
import { generateText, CoreMessage } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || ''
});

export async function sendMessage(messages: CoreMessage[]) {
  // Implementation included in component
}
```

### 5. Add Environment Variables

```bash
# .env.local
GROQ_API_KEY=your_groq_api_key_here
```

## 🚀 Usage

### Basic Integration

```tsx
import { Chatbot } from '@/components/chatbot';

export default function App() {
  return (
    <div>
      <h1>My App</h1>
      <Chatbot />
    </div>
  );
}
```

### With Dictionary (for i18n)

```tsx
import { ChatbotContent } from '@/components/chatbot/content.tsx';

// Pass dictionary for translations
<ChatbotContent 
  dictionary={{
    openChat: 'Open chat',
    closeChat: 'Close chat',
    placeholder: 'Type your message...',
    // ... other translations
  }}
/>
```

### Custom Configuration

```tsx
import { Chatbot } from '@/components/chatbot';

const config = {
  position: 'bottom-right',
  welcomeMessage: 'Hi! How can I help you today?',
  placeholder: 'Ask me anything...',
  api: {
    systemPrompt: 'You are a helpful assistant.',
  },
};

<Chatbot config={config} />
```

## 🎯 Current Implementation Details

### UI Characteristics
- **No typing indicators** - Messages appear instantly
- **No timestamps** - Clean message bubbles
- **Large icons** - 48px send and voice icons
- **Minimal spacing** - Compact input area
- **Robot avatar** - Custom PNG image for chat button

### Voice Input
- Uses Web Speech API
- Supports English and Arabic recognition
- Visual feedback when listening (red pulsing icon)

### Quick Actions
The chat window shows 4 pre-configured buttons when empty:
- 💰 Pricing
- 📦 Services  
- ⏱️ Timeline
- ℹ️ About Us

### Message Handling
- Server action for AI responses
- Non-streaming responses using `generateText`
- Groq's Llama 3.1 8B model by default
- Short, practical responses (2-3 sentences max)

## 📁 File Structure

```
src/components/chatbot/
├── index.ts              # Main exports
├── chatbot.tsx          # Wrapper component
├── content.tsx          # Main logic component
├── chat-window.tsx      # Chat UI window
├── chat-button.tsx      # Floating button with robot
├── use-chatbot.ts       # Custom React hook
├── actions.ts           # Server actions (NEW)
├── icons.tsx            # Custom SVG icons
├── type.ts              # TypeScript types
├── constant.ts          # Default configurations
├── utils.ts             # Helper utilities
└── README.md            # This file
```

## 🛠️ Configuration Options

```typescript
interface ChatbotConfig {
  // Position
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  // Content
  welcomeMessage?: string;
  placeholder?: string;
  
  // Language
  locale?: 'en' | 'ar';
  
  // API Configuration
  api?: {
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  };
}
```

## 🔧 Customization Examples

### E-commerce Support Bot

```tsx
const ecommerceConfig = {
  api: {
    systemPrompt: `You are an e-commerce assistant. Help with:
    - Product recommendations
    - Order tracking
    - Returns and refunds
    Always be helpful and concise.`,
  },
};
```

### Technical Documentation Helper

```tsx
const docsConfig = {
  position: 'bottom-left',
  api: {
    systemPrompt: `You are a documentation assistant. 
    Provide code examples and explanations.
    Keep answers technical but clear.`,
  },
};
```

## 🐛 Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
# Ensure all types are installed
pnpm add -D @types/react @types/react-dom @types/negotiator
```

**Missing dependencies:**
```bash
# Install all required packages
pnpm add ai @ai-sdk/groq @formatjs/intl-localematcher negotiator
```

### Runtime Issues

**"Groq API key not configured":**
- Add `GROQ_API_KEY` to `.env.local`
- Restart development server

**Voice input not working:**
- Ensure HTTPS or localhost
- Check browser microphone permissions
- Verify Web Speech API support

## 🚨 Important Notes

1. **Server Actions Required** - This component uses Next.js server actions, not API routes
2. **No Streaming** - Uses `generateText` for simplicity and reliability
3. **No Loading States** - Messages appear instantly without typing indicators
4. **Image Required** - Needs `/public/robot.png` for the chat button

## 📝 Recent Changes

- ✅ Removed all typing indicators
- ✅ Removed timestamps from messages
- ✅ Switched to server actions from API routes
- ✅ Added voice input functionality
- ✅ Implemented quick action buttons
- ✅ Updated to non-streaming responses
- ✅ Added custom robot avatar

## 🤝 Contributing

Feel free to customize this component for your needs. The modular structure makes it easy to modify individual parts without affecting the whole system.

## 📄 License

MIT License - Free to use in your projects