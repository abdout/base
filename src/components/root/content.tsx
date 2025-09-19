import Hero from './hero';
import RootTabs from './tabs';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';
import {CardsDemo} from "@/components/template/cards";

interface RootContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function RootContent({ dictionary, params }: RootContentProps) {
    return (
        <>
            <Hero dictionary={dictionary} params={params} />
            <RootTabs dictionary={dictionary} />
            <CardsDemo dictionary={dictionary} />

        </>
    );
}
