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
            heading={dictionary.vibepage?.heading || "Vibe Coding Made Easy"}
            description={dictionary.vibepage?.description || "Awesome vibes for your coding experience. Utilize into your apps. Works with all AI Agents. Open Source. Free forever."}
            actions={
                <TwoButtons
                    primaryLabel={dictionary.actions?.browseVibes || "Browse Vibes"}
                    primaryHref={`/${params.lang}/vibes`}
                    secondaryLabel={dictionary.actions?.addVibe || "Add a vibe"}
                    secondaryHref={`/${params.lang}/vibes/new`}
                />
            }
        />
    );
}