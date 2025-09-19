import { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';
import { ChatbotContent } from './content';
import type { ChatbotProps } from './type';

interface ChatbotWrapperProps extends ChatbotProps {
  lang: Locale;
}

export async function Chatbot({ lang, ...props }: ChatbotWrapperProps) {
  const dictionary = await getDictionary(lang);
  
  return (
    <ChatbotContent 
      {...props} 
      dictionary={dictionary.chatbot}
    />
  );
}