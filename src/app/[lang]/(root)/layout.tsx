import {SiteHeader} from "@/components/template/header-01/content";
import { getDictionary } from "@/components/local/dictionaries";
import { type Locale, localeConfig } from "@/components/local/config";
import {SiteFooter} from "@/components/template/footer-01/content";


export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params as { lang: Locale };
    const dictionary = await getDictionary(lang || 'en');

    return (
        <>
            <SiteHeader dictionary={dictionary} />
            {children}
            <SiteFooter dictionary={dictionary} />

        </>
    );
}

