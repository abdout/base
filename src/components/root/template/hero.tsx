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
            heading={dictionary.templatepage?.heading || "Templates for the Web"}
            description={dictionary.templatepage?.description || "Clean, modern templates. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.browseTemplates || "Browse Templates"}
                    primaryHref={`/${params.lang}/templates`}
                    secondaryLabel={dictionary.actions?.addTemplate || "Add a template"}
                    secondaryHref={`/${params.lang}/templates/new`}
                />
            }
        />
    );
}