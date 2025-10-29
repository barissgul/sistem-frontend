'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getAnamenuler, getMenuler, type Anamenu, type Menu } from '@/services/menu.service';
import { getIconByName } from '@/utils/menu-icons';

export interface MenuItem {
  name: string;
  href?: string;
  icon?: React.ReactElement;
  badge?: string;
  sira: number;
  dropdownItems?: {
    name: string;
    href: string;
    badge?: string;
  }[];
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export function useDynamicMenu() {
  const { data: session, status } = useSession();
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session yüklenmesini bekle
    if (status === 'loading') {
      return;
    }

    async function loadMenu() {
      try {
        // Gerçek API'den veri çek
        const [anamenuler, menuler] = await Promise.all([
          getAnamenuler(),
          getMenuler()
        ]);
        
        if (anamenuler && anamenuler.length > 0) {
          // Kullanıcının yetki ID'sini al
          const userYetkiIds = (session?.user as any)?.yetki_ids;
          
          // Yetki kontrolü ile menüleri filtrele
          const filteredAnamenuler = filterMenusByYetki(anamenuler, userYetkiIds);
          const filteredMenuler = filterMenusByYetki(menuler, userYetkiIds);
          
          const categories = transformToMenuCategories(filteredAnamenuler, filteredMenuler);
          setMenuCategories(categories);
        } else {
          setMenuCategories([]);
        }
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
        setMenuCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, [session, status]);

  return { menuCategories, loading };
}

// Yetki kontrolü ile menüleri filtrele
function filterMenusByYetki<T extends { yetki_ids?: string }>(menus: T[], userYetkiIds: string | null | undefined): T[] {
  // Eğer kullanıcının yetkisi yoksa veya yetki_ids yoksa, hiçbir menüyü gösterme
  if (!userYetkiIds) {
    return [];
  }

  // yetki_ids string veya number olabilir, string'e çevir
  const userYetkiIdsStr = String(userYetkiIds).trim();
  
  if (userYetkiIdsStr === '' || userYetkiIdsStr === 'null' || userYetkiIdsStr === 'undefined') {
    return [];
  }

  // Kullanıcının yetki ID'lerini parse et
  const userYetkiIdArray = userYetkiIdsStr.split(',').map(id => id.trim()).filter(id => id !== '' && id !== 'null' && id !== 'undefined');

  // Menüleri filtrele
  return menus.filter(menu => {
    // Eğer menünün yetki_ids'si yoksa veya boşsa, kimseye gösterme (güvenlik için)
    if (!menu.yetki_ids || String(menu.yetki_ids).trim() === '') {
      return false;
    }

    // Menünün yetki ID'lerini parse et
    const menuYetkiIdArray = String(menu.yetki_ids).split(',').map(id => id.trim()).filter(id => id !== '');

    // Kullanıcının en az bir yetkisi menünün yetkileri ile eşleşiyorsa göster
    return userYetkiIdArray.some(userYetkiId => menuYetkiIdArray.includes(userYetkiId));
  });
}

function transformToMenuItems(anamenuler: Anamenu[]): MenuItem[] {
  return anamenuler
    .map((anamenu) => ({
      name: anamenu.anamenu,
      href: anamenu.rota,
      icon: getIconByName(anamenu.ikon),
      sira: anamenu.sira,
    }))
    .sort((a, b) => a.sira - b.sira);
}

function transformToMenuCategories(anamenuler: Anamenu[], menuler: Menu[] = []): MenuCategory[] {
  const categoryMap = new Map<string, MenuItem[]>();

  // Önce anamenüleri sira'ya göre sırala
  const sortedAnamenuler = [...anamenuler].sort((a, b) => a.sira - b.sira);

  sortedAnamenuler.forEach((anamenu) => {
    // Bu ana menüye ait alt menüleri bul ve sira'ya göre sırala
    const altMenuler = menuler
      .filter(menu => menu.anamenu_id === anamenu.id)
      .sort((a, b) => a.sira - b.sira);
    
    const menuItem: MenuItem = {
      name: anamenu.anamenu,
      href: anamenu.rota,
      icon: getIconByName(anamenu.ikon),
      sira: anamenu.sira,
    };

    // Eğer alt menüler varsa dropdownItems olarak ekle
    if (altMenuler.length > 0) {
      menuItem.dropdownItems = altMenuler.map(menu => ({
        name: menu.menu,
        href: menu.rota,
        badge: undefined
      }));
    }

    if (!categoryMap.has(anamenu.kategori)) {
      categoryMap.set(anamenu.kategori, []);
    }
    
    categoryMap.get(anamenu.kategori)!.push(menuItem);
  });

  // Map'i MenuCategory array'ine çevir ve sira'ya göre sırala
  const categories: MenuCategory[] = [];
  categoryMap.forEach((items, categoryName) => {
    categories.push({
      name: categoryName,
      items: items.sort((a, b) => a.sira - b.sira)
    });
  });

  // Kategorileri de ilk menüsünün sira'sına göre sırala
  return categories.sort((a, b) => {
    const aFirstItem = a.items[0];
    const bFirstItem = b.items[0];
    return (aFirstItem?.sira || 0) - (bFirstItem?.sira || 0);
  });
}

