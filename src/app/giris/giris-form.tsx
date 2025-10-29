'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text, Loader } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/app/validasyon/giris-sema';
import toast from 'react-hot-toast';

const initialValues: LoginSchema = {
  email: 'barisgul',
  password: '123456',
  rememberMe: true,
};

export default function SignInForm() {
  const [reset, setReset] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setIsLoading(true);
      console.log('Giriş deneniyor:', data);
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false, // Önce false yapıp sonucu kontrol edelim
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        toast.error('Giriş başarısız: Kullanıcı adı veya şifre hatalı!');
      } else if (result?.ok) {
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        // Başarılı giriş sonrası yönlendirme
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="text"
              size="lg"
              label="Kullanıcı Adı veya Email"
              placeholder="Kullanıcı adınızı veya email adresinizi girin"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Şifre"
              placeholder="Şifrenizi girin"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Beni Hatırla"
                variant="flat"
                className="[&>label>span]:font-medium"
              />
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                Şifremi Unuttum?
              </Link>
            </div>
            <Button 
              className="w-full" 
              type="submit" 
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Giriş yapılıyor...</span>
              ) : (
                <>
                  <span>Giriş Yap</span>{' '}
                  <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />
                </>
              )}
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Hesabınız yok mu?{' '}
        <Link
          href={routes.auth.signUp1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Kayıt Ol
        </Link>
      </Text>
    </>
  );
}


