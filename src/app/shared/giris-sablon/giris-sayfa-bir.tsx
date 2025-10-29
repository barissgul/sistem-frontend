'use client';

import Link from 'next/link';
import logoImg from '@public/logo-primary.svg';
import logoImgText from '@public/logo-primary-text.svg';
import Image from 'next/image';
import { Title, Text } from 'rizzui';
import { PiArrowLeftBold } from 'react-icons/pi';
import UnderlineShape from '@core/components/shape/underline';

export default function AuthWrapperOne({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <>
      <Link
        href={'/'}
        className="sticky start-0 top-0 z-20 flex items-center justify-center bg-blue p-3.5 text-sm font-medium text-white md:p-4 lg:hidden"
      >
        <PiArrowLeftBold />
      </Link>
      <div className="min-h-screen justify-between gap-x-8 px-4 py-8 pt-10 md:pt-12 lg:flex lg:p-6 xl:gap-x-10 xl:p-7 2xl:p-10 2xl:pt-10 [&>div]:min-h-[calc(100vh-80px)]">
        <div className="relative flex w-full items-center justify-center lg:w-5/12 2xl:justify-end 2xl:pe-24">
          <div className="w-full max-w-sm md:max-w-md lg:py-7 lg:ps-3 lg:pt-16 2xl:w-[630px] 2xl:max-w-none 2xl:ps-20 2xl:pt-7">
            <div className="mb-7 px-6 pt-3 text-center md:pt-0 lg:px-0 lg:text-start xl:mb-8 2xl:mb-10">
              <Link
                href={'/'}
                className="mb-6 inline-flex max-w-[168px] xl:mb-8"
              >
                <Image src={logoImg} alt="Isomorphic" />
                <Image
                  src={logoImgText}
                  alt="Isomorphic"
                  className="ps-2.5 dark:invert"
                />
              </Link>
              <Title
                as="h2"
                className="mb-5 text-[26px] leading-snug md:text-3xl md:!leading-normal lg:mb-7 lg:pe-16 lg:text-[28px] xl:text-3xl 2xl:pe-8 2xl:text-4xl"
              >
                Hoş geldiniz!{' '}<br />
                <span className="relative inline-block">
                  Giriş yapın
                  <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
                </span>{' '}
                devam edin.
              </Title>
              <Text className="leading-[1.85] text-gray-700 md:leading-loose lg:pe-8 2xl:pe-14">
                Giriş yaparak özel içeriklere erişebilir ve sistemi kullanmaya başlayabilirsiniz.
              </Text>
            </div>
            {children}
          </div>
        </div>
        <div className="hidden w-7/12 items-center justify-center rounded-[20px] bg-gray-50 px-6 dark:bg-gray-100/40 lg:flex xl:justify-start 2xl:px-16">
          <div className="pb-8 pt-10 text-center xl:pt-16 2xl:block 2xl:w-[1063px]">
            <div className="mx-auto mb-10 max-w-sm pt-2 2xl:max-w-lg">
              <Title
                as="h2"
                className="mb-5 font-semibold !leading-normal lg:text-[26px] 2xl:px-10 2xl:text-[32px]"
              >
                Çalışma alanınızı yönetmenin en basit yolu.
              </Title>
              <Text className="leading-[1.85] text-gray-700 md:leading-loose 2xl:px-6">
                Projelerinizi kolayca yönetin ve takımınızla işbirliği yapın.
              </Text>
            </div>
            <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
              <Image
                src={'https://isomorphic-furyroad.s3.amazonaws.com/public/auth/sign-up.webp'}
                alt="Sign Up Thumbnail"
                fill
                priority
                sizes="(max-width: 768px) 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
