'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from 'rizzui';
import { locales } from '@/i18n/request';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // /tr/giris -> /en/giris
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      {locales.map((loc) => (
        <Button
          key={loc}
          size="sm"
          variant={locale === loc ? 'solid' : 'outline'}
          onClick={() => switchLocale(loc)}
          className="uppercase"
        >
          {loc}
        </Button>
      ))}
    </div>
  );
}

