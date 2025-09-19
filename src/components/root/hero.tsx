import { PageHeader } from '@/components/atom/page-header';
import { Announcement } from '@/components/atom/announcement';
import { TwoButtons } from '@/components/atom/two-buttons';
import type { getDictionary } from '@/components/local/dictionaries';
import type { Locale } from '@/components/local/config';

interface HeroProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function Hero({ dictionary, params }: HeroProps) {
    return (
        <PageHeader
            announcement={<Announcement dictionary={dictionary} />}
            heading={dictionary.homepage?.heading || "Build your code library"}
            description={dictionary.homepage?.description || "A set of beautifully-designed, blazing-fast code. Works with your favorite frameworks. Open Source. Open Code."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.getStarted || "Get Started"}
                    primaryHref={`/${params.lang}/docs`}
                    secondaryLabel={dictionary.actions?.documentation || "Documentation"}
                    secondaryHref={`/${params.lang}/docs`}
                />
            }
        />
    );
}