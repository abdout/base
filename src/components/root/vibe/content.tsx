import Hero from './hero';
import VibeTabs from './tabs';
import VibesPage from './all';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface VibeContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function VibeContent({ dictionary, params }: VibeContentProps) {
    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <VibeTabs dictionary={dictionary} />
            <VibesPage />

        </>
    );
}