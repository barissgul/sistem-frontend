import type { Metadata } from 'next';
import { inter, lexendDeca } from '@/app/fonts';
import cn from '@core/utils/class-names';
import NextProgress from '@core/components/next-progress';
import HeliumLayout from '@/layouts/helium/helium-layout';
import { ThemeProvider, JotaiProvider } from '@/app/shared/theme-provider';
import GlobalDrawer from '@/app/shared/drawer-views/container';
import GlobalModal from '@/app/shared/modal-views/container';
import { Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import AuthProvider from '@/app/api/auth/[...nextauth]/auth-provider';
import { siteConfig } from '@/config/site.config';

import 'swiper/css';
import 'swiper/css/navigation';
import './globals.css';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="tr"
      dir="ltr"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, 'font-inter')}
      >
        <AuthProvider session={session}>
          <ThemeProvider>
            <NextProgress />
            <JotaiProvider>
              {session ? (
                <HeliumLayout>{children}</HeliumLayout>
              ) : (
                children
              )}
              <Toaster />
              <GlobalDrawer />
              <GlobalModal />
            </JotaiProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
