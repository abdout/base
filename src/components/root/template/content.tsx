import Hero from './hero';
import TemplateTabs from './tabs';
import TemplatesPage from './all';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface TemplateContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function TemplateContent({ dictionary, params }: TemplateContentProps) {
    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <TemplateTabs dictionary={dictionary} />
            <TemplatesPage />

        </>
    );
}