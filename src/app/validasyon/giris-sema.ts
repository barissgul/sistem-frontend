import { z } from 'zod';

// form zod validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Kullanıcı adı veya email gereklidir'),
  password: z.string().min(1, 'Şifre gereklidir'),
  rememberMe: z.boolean().optional(),
});

// generate form types from zod validation schema
export type LoginSchema = z.infer<typeof loginSchema>;
