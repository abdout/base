import {SiteHeader} from "@/components/template/header-01/content";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale, localeConfig } from "@/components/internationalization/config";
import {SiteFooter} from "@/components/template/footer-01/content";


export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang || 'en');

    return (
        <>
            <SiteHeader dictionary={dictionary} />
            {children}
            <SiteFooter dictionary={dictionary} />

        </>
    );
}

