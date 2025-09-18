import Hero from './hero';
import BlockTabs from './tabs';
import BlocksPage from './all';
import type { getDictionary } from '@/components/internationalization/dictionaries';
import type { Locale } from '@/components/internationalization/config';

interface BlockContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function BlockContent({ dictionary, params }: BlockContentProps) {
    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <BlockTabs dictionary={dictionary} />
            <BlocksPage />

        </>
    );
}