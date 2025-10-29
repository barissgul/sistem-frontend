import { API_URL } from '@/config/api';

export interface Anamenu {
  id: number;
  kategori: string;
  anamenu: string;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
}

export interface Menu {
  id: number;
  menu: string;
  anamenu_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  anamenu?: Anamenu;
}

export async function getAnamenuler(): Promise<Anamenu[]> {
  try {
    const response = await fetch(`${API_URL}/anamenu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Anamenu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Anamenu fetch error:', error);
    return [];
  }
}

export async function getMenuler(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Menu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Menu fetch error:', error);
    return [];
  }
}

