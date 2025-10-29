'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Text, Title, Select } from 'rizzui';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { 
  PiArrowLeft,
  PiFloppyDisk,
  PiShieldCheck,
  PiList
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

interface Yetki {
  id: number;
  yetki: string;
  durum: number;
}

interface Menu {
  id: number;
  menu: string;
  anamenu_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  anamenu?: {
    id: number;
    anamenu: string;
  };
}

interface YetkiFormData {
  yetki: string;
  durum: number;
}

export default function YetkiEditPage() {
  const router = useRouter();
  const params = useParams();
  const yetkiId = params?.id as string;

  const [yetki, setYetki] = useState<Yetki | null>(null);
  const [menuler, setMenuler] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<YetkiFormData>({
    yetki: '',
    durum: 1
  });

  useEffect(() => {
    if (yetkiId) {
      loadYetki();
      loadMenuler();
    }
  }, [yetkiId]);

  const loadYetki = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/yetkiler/${yetkiId}`);
      if (response.ok) {
        const data = await response.json();
        setYetki(data);
        setFormData({
          yetki: data.yetki,
          durum: data.durum
        });
      } else {
        toast.error('Yetki bulunamadı');
        router.push('/genel/yetkiler');
      }
    } catch (error) {
      console.error('Yetki yüklenirken hata:', error);
      toast.error('Yetki yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadMenuler = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenuler(data);
      }
    } catch (error) {
      console.error('Menüler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/yetkiler/${yetkiId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Yetki başarıyla güncellendi');
        router.push('/genel/yetkiler');
      } else {
        toast.error('Yetki güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Yetki kaydedilirken hata:', error);
      toast.error('Yetki kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Bu yetkinin yetki_ids'de geçtiği menüleri filtrele
  const getMenulerWithYetki = () => {
    if (!yetkiId) return [];
    return menuler.filter(menu => {
      if (!menu.yetki_ids) return false;
      const ids = menu.yetki_ids.split(',').map(id => id.trim());
      return ids.includes(yetkiId);
    });
  };

  const menuColumns = [
    {
      title: <HeaderCell>ID</HeaderCell>,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text className="font-medium text-gray-700">{id}</Text>
    },
    {
      title: <HeaderCell>Menü Adı</HeaderCell>,
      dataIndex: 'menu',
      key: 'menu',
      render: (menu: string) => (
        <Text className="font-medium text-gray-900">{menu}</Text>
      )
    },
    {
      title: <HeaderCell>Ana Menü</HeaderCell>,
      dataIndex: 'anamenu',
      key: 'anamenu',
      render: (anamenu: any) => (
        <Text className="text-gray-600">{anamenu?.anamenu || '-'}</Text>
      )
    },
    {
      title: <HeaderCell>Rota</HeaderCell>,
      dataIndex: 'rota',
      key: 'rota',
      render: (rota: string) => (
        <Text className="text-sm text-gray-500">{rota}</Text>
      )
    },
    {
      title: <HeaderCell>Sıra</HeaderCell>,
      dataIndex: 'sira',
      key: 'sira',
      width: 80,
      render: (sira: number) => (
        <Text className="text-gray-600">{sira}</Text>
      )
    }
  ];

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Text>Yükleniyor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6 @container">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/genel/yetkiler')}
          className="h-8 w-8 p-0"
        >
          <PiArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <Title as="h2" className="text-2xl font-bold">
            Yetki Düzenle
          </Title>
          <Text className="mt-1 text-gray-500">
            Yetki bilgilerini düzenleyin
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf - Yetki Bilgileri */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <PiShieldCheck className="h-5 w-5 text-primary" />
              <Title as="h3" className="text-lg font-semibold">
                Yetki Bilgileri
              </Title>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yetki Adı *
                </label>
                <Input
                  value={formData.yetki}
                  onChange={(e) => setFormData({ ...formData, yetki: e.target.value })}
                  placeholder="Örn: Kullanıcı Görüntüleme"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Durum
                </label>
                <Select
                  value={formData.durum.toString()}
                  onChange={(value) => setFormData({ ...formData, durum: parseInt(value) })}
                  options={[
                    { value: '1', label: 'Aktif' },
                    { value: '0', label: 'Pasif' }
                  ]}
                />
              </div>

              <div className="pt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/genel/yetkiler')}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  <PiFloppyDisk className="mr-2 h-4 w-4" />
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sağ Taraf - Menüler */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-2">
              <PiList className="h-5 w-5 text-primary" />
              <Title as="h3" className="text-lg font-semibold">
                Bu Yetkiye Sahip Menüler
              </Title>
            </div>

            {getMenulerWithYetki().length === 0 ? (
              <div className="text-center py-8">
                <Text className="text-gray-500">
                  Bu yetkiye sahip menü bulunmamaktadır.
                </Text>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200">
                <Table
                  data={getMenulerWithYetki()}
                  columns={menuColumns}
                  loading={false}
                  className="min-h-[200px]"
                />
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
                  <Text className="text-sm text-gray-500">
                    Toplam {getMenulerWithYetki().length} menü
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/genel/menu')}
                  >
                    Menüleri Yönet
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

