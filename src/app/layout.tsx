import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AUTOBLOG_PROFILE } from '@/lib/autoblog-profile';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'My_Blog_Makes_Neil_Proud',
  description: 'Template configurável de blog automatizado.',
  icons: { icon: AUTOBLOG_PROFILE.brand.logoUrl },
};

export const viewport: Viewport = { themeColor: AUTOBLOG_PROFILE.theme.primary };

// Preconnect ao host do Supabase — imagens de capa saem do Storage (LCP).
// Env malformada não pode derrubar o build: guard defensivo.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
      : null;
  } catch {
    return null;
  }
})();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Cores do tema saem do perfil — cada instalação customiza sem tocar em CSS.
  const themeVars = {
    '--app-background': AUTOBLOG_PROFILE.theme.background,
    '--app-foreground': AUTOBLOG_PROFILE.theme.foreground,
    '--app-muted': AUTOBLOG_PROFILE.theme.muted,
    '--app-primary': AUTOBLOG_PROFILE.theme.primary,
    '--app-border': AUTOBLOG_PROFILE.theme.border,
    '--app-card': AUTOBLOG_PROFILE.theme.card,
    '--app-destructive': AUTOBLOG_PROFILE.theme.destructive,
  } as React.CSSProperties;

  const gaMeasurementId = AUTOBLOG_PROFILE.integrations.googleAnalyticsMeasurementId;

  return (
    <html lang="pt-BR" className={`${inter.variable} ${inter.className} motion-safe:scroll-smooth`}>
      <head>
        {supabaseHost && <link rel="preconnect" href={`https://${supabaseHost}`} />}
        {gaMeasurementId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaMeasurementId}');`,
              }}
            />
          </>
        )}
      </head>
      <body style={themeVars}>{children}</body>
    </html>
  );
}
