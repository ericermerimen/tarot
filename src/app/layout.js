import ThemeRegistry from '@/theme/ThemeRegistry';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/ParticleBackground';
import './globals.css';

export const metadata = {
  title: '🐕 Mystical Dog Tarot | 神秘狗狗塔羅',
  description: 'Divine your future with cute dog-styled tarot cards. Experience mystical readings with adorable canine companions. 用可愛的狗狗塔羅牌占卜你的未來，體驗神秘的命運指引。',
  keywords: 'tarot, divination, fortune telling, dog tarot, 塔羅牌, 占卜, 算命, 狗狗塔羅',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          <ParticleBackground />
          <Navigation />
          <main className="main-content">
            {children}
          </main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
