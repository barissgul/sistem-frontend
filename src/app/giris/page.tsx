import Image from 'next/image';
import SignInForm from './giris-form';
import AuthWrapperOne from '@/app/shared/giris-sablon/giris-sayfa-bir';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Giriş Yap'),
};

export default function SignIn() {
  return (
    <AuthWrapperOne>
      <SignInForm />
    </AuthWrapperOne>
  );
}


