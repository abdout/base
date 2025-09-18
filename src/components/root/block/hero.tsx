import { PageHeader } from '@/components/atom/page-header';
import { Announcement } from '@/components/atom/announcement';
import { TwoButtons } from '@/components/atom/two-buttons';
import type { getDictionary } from '@/components/internationalization/dictionaries';
import type { Locale } from '@/components/internationalization/config';

interface HeroProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  params: { lang: Locale };
}

export default function Hero({ dictionary, params }: HeroProps) {
    return (
        <PageHeader
            announcement={<Announcement dictionary={dictionary} />}
            heading={dictionary.blockpage?.heading || "Building Blocks for the Web"}
            description={dictionary.blockpage?.description || "Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Open Code."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.browseBlocks || "Browse Blocks"}
                    primaryHref={`/${params.lang}/blocks`}
                    secondaryLabel={dictionary.actions?.addBlock || "Add a block"}
                    secondaryHref={`/${params.lang}/blocks/new`}
                />
            }
        />
    );
}