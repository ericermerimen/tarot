import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { Space_Mono, Noto_Sans_TC, Cormorant_Garamond } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ColorModeProvider } from '@/theme/ColorModeContext';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import '../globals.css';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-display',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

export const metadata: Metadata = {
  title: 'Mystical Dog Tarot | 神秘狗狗塔羅',
  description: 'Divine your future with cute dog-styled tarot cards. Experience mystical readings with adorable canine companions.',
  keywords: 'tarot, divination, fortune telling, dog tarot, 塔羅牌, 占卜, 算命, 狗狗塔羅',
  icons: {
    icon: '/favicon.svg',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${spaceMono.variable} ${cormorantGaramond.variable} ${notoSansTC.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ColorModeProvider>
            <ThemeRegistry>
              <Navigation />
              <main className="main-content">
                {children}
              </main>
              <Footer />
            </ThemeRegistry>
          </ColorModeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
