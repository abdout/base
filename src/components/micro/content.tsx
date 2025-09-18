import Hero from './hero';
import MicroTabs from './tabs';
import MicrosPage from './all';
import type { getDictionary } from '@/components/internationalization/dictionaries';
import type { Locale } from '@/components/internationalization/config';

interface MicroContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function MicroContent({ dictionary, params }: MicroContentProps) {
    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <MicroTabs dictionary={dictionary} />
            <MicrosPage />

        </>
    );
}