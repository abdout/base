import type { Metadata } from "next";
import "../globals.css";
import { fontSans, fontMono, fontRubik } from "@/components/atom/fonts";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale, localeConfig } from "@/components/internationalization/config";
import { ThemeProvider } from "@/components/atom/theme-provider"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const config = localeConfig[lang];

  return {
    title: dictionary.metadata?.title || "Codebase",
    description: dictionary.metadata?.description || "Codebase for business automation",
    other: {
      'accept-language': lang,
    },
    alternates: {
      languages: {
        'en': '/en',
        'ar': '/ar',
        'x-default': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;

    // Fallback to default locale if config not found
    const config = localeConfig[lang] || localeConfig['en'];
    const isRTL = config.dir === 'rtl';
    const dictionary = await getDictionary(lang || 'en');

    // Use Rubik font for Arabic, Geist for English
    const fontClass = lang === 'ar' ? fontRubik.className : fontSans.className;

    return (
        <html lang={lang} dir={config.dir} suppressHydrationWarning>
            <body className={`${fontClass} antialiased`} suppressHydrationWarning>
                <ThemeProvider>
                    <div className="layout-container">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return Object.keys(localeConfig).map((lang) => ({ lang }));
}
