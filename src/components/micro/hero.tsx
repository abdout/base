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
            heading={dictionary.micropage?.heading || "Micro Services for the Web"}
            description={dictionary.micropage?.description || "Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.browseMicros || "Browse Micros"}
                    primaryHref={`/${params.lang}/micros`}
                    secondaryLabel={dictionary.actions?.addMicro || "Add a micro"}
                    secondaryHref={`/${params.lang}/micros/new`}
                />
            }
        />
    );
}