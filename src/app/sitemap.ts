import { MetadataRoute } from 'next';
import { type Locale, i18n } from '@/components/internationalization/config';

const locales: Locale[] = i18n.locales;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

// Define all your pages here
const pages = [
  '',        // home page
  '/about',
  '/pricing', 
  '/service',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  
  return pages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: currentDate,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page}`,
          ar: `${baseUrl}/ar${page}`,
        },
      },
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  );
}