'use client';

import { LAYOUT_OPTIONS } from '@/config/enums';

// Sadece Helium layout kullanılıyor
export function useLayout() {
  return {
    layout: LAYOUT_OPTIONS.HELIUM,
    setLayout: () => {}, // Layout değişikliği artık yok
  };
}
