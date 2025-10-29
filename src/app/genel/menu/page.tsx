'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Title, Select, Checkbox } from 'rizzui';
import MetricCard from '@core/components/cards/metric-card';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { 
  PiMagnifyingGlass, 
  PiPlus, 
  PiPencilSimple,
  PiTrash,
  PiList,
  PiShieldCheck,
  PiXCircle,
  PiX
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

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

interface Yetki {
  id: number;
  yetki: string;
  durum: number;
}

interface MenuFormData {
  menu: string;
  anamenu_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
}

export default function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    menu: '',
    anamenu_id: 0,
    rota: '',
    ikon: '',
    sira: 0,
    yetki_ids: ''
  });
  const [menuler, setMenuler] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [anamenuList, setAnamenuList] = useState<any[]>([]);
  const [yetkiList, setYetkiList] = useState<Yetki[]>([]);
  const [selectedYetkiler, setSelectedYetkiler] = useState<number[]>([]);
  const [stats, setStats] = useState({
    totalMenu: 0,
    menuWithYetki: 0,
    menuWithoutYetki: 0
  });

  useEffect(() => {
    loadMenuler();
    loadAnamenuList();
    loadYetkiList();
  }, []);

  useEffect(() => {
    loadStats();
  }, [menuler]);

  const loadMenuler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menu`);
      if (response.ok) {
        const data = await response.json();
        setMenuler(data);
      }
    } catch (error) {
      console.error('Menüler yüklenirken hata:', error);
      toast.error('Menüler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      if (response.ok) {
        const data = await response.json();
        const menuWithYetki = data.filter((m: Menu) => m.yetki_ids && m.yetki_ids.trim() !== '').length;
        setStats({
          totalMenu: data.length,
          menuWithYetki,
          menuWithoutYetki: data.length - menuWithYetki
        });
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const loadAnamenuList = async () => {
    try {
      const response = await fetch(`${API_URL}/anamenu`);
      if (response.ok) {
        const data = await response.json();
        setAnamenuList(data);
      }
    } catch (error) {
      console.error('Ana menüler yüklenirken hata:', error);
    }
  };

  const loadYetkiList = async () => {
    try {
      const response = await fetch(`${API_URL}/yetkiler`);
      if (response.ok) {
        const data = await response.json();
        setYetkiList(data.filter((y: Yetki) => y.durum === 1));
      }
    } catch (error) {
      console.error('Yetkiler yüklenirken hata:', error);
    }
  };

  const handleOpenModal = (menu?: Menu) => {
    if (menu) {
      setIsEditMode(true);
      setSelectedMenu(menu);
      setFormData({
        menu: menu.menu,
        anamenu_id: menu.anamenu_id,
        rota: menu.rota,
        ikon: menu.ikon || '',
        sira: menu.sira,
        yetki_ids: menu.yetki_ids || ''
      });
      // Yetki IDs'lerini parse et
      if (menu.yetki_ids) {
        const ids = menu.yetki_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        setSelectedYetkiler(ids);
      } else {
        setSelectedYetkiler([]);
      }
    } else {
      setIsEditMode(false);
      setSelectedMenu(null);
      setFormData({
        menu: '',
        anamenu_id: 0,
        rota: '',
        ikon: '',
        sira: 0,
        yetki_ids: ''
      });
      setSelectedYetkiler([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedMenu(null);
    setFormData({
      menu: '',
      anamenu_id: 0,
      rota: '',
      ikon: '',
      sira: 0,
      yetki_ids: ''
    });
    setSelectedYetkiler([]);
  };

  const handleYetkiToggle = (yetkiId: number) => {
    setSelectedYetkiler(prev => {
      if (prev.includes(yetkiId)) {
        return prev.filter(id => id !== yetkiId);
      } else {
        return [...prev, yetkiId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const yetkiIds = selectedYetkiler.sort((a, b) => a - b).join(',');
    
    try {
      const url = isEditMode && selectedMenu
        ? `${API_URL}/menu/${selectedMenu.id}`
        : `${API_URL}/menu`;
      
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          yetki_ids: yetkiIds
        })
      });

      if (response.ok) {
        toast.success(isEditMode ? 'Menü başarıyla güncellendi' : 'Menü başarıyla oluşturuldu');
        handleCloseModal();
        loadMenuler();
        loadStats();
      } else {
        toast.error('Bir hata oluştu');
      }
    } catch (error) {
      console.error('Menü kaydedilirken hata:', error);
      toast.error('Menü kaydedilirken hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu menüyü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Menü başarıyla silindi');
        loadMenuler();
        loadStats();
      } else {
        toast.error('Menü silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Menü silinirken hata:', error);
      toast.error('Menü silinirken hata oluştu');
    }
  };

  const filteredMenuler = menuler.filter(menu =>
    menu.menu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getYetkiNames = (yetkiIds?: string) => {
    if (!yetkiIds || yetkiIds.trim() === '') return 'Yetki Yok';
    
    const ids = yetkiIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const names = ids.map(id => {
      const yetki = yetkiList.find(y => y.id === id);
      return yetki ? yetki.yetki : `Yetki #${id}`;
    });
    
    return names.join(', ');
  };

  const columns = [
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
      title: <HeaderCell>Yetkiler</HeaderCell>,
      dataIndex: 'yetki_ids',
      key: 'yetki_ids',
      render: (yetki_ids: string) => (
        <div className="max-w-xs">
          <Text className="text-sm text-gray-600">{getYetkiNames(yetki_ids)}</Text>
        </div>
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
    },
    {
      title: <HeaderCell>İşlemler</HeaderCell>,
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (_: any, record: Menu) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleOpenModal(record)}
            className="h-8 w-8 p-0"
          >
            <PiPencilSimple className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            color="danger"
            onClick={() => handleDelete(record.id)}
            className="h-8 w-8 p-0"
          >
            <PiTrash className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto w-full max-w-7xl p-6 @container">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title as="h2" className="text-2xl font-bold">
            Menüler
          </Title>
          <Text className="mt-1 text-gray-500">
            Sistem menülerini yönetin
          </Text>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto"
        >
          <PiPlus className="mr-2 h-4 w-4" />
          Yeni Menü Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          title="Toplam Menü"
          metric={stats.totalMenu}
          icon={<PiList className="w-4 h-4 text-blue-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
        <MetricCard
          title="Yetki Atanmış"
          metric={stats.menuWithYetki}
          icon={<PiShieldCheck className="w-4 h-4 text-green-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
        <MetricCard
          title="Yetki Atanmamış"
          metric={stats.menuWithoutYetki}
          icon={<PiXCircle className="w-4 h-4 text-orange-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            type="search"
            placeholder="Menü ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlass className="h-5 w-5 text-gray-400" />}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <Table
          data={filteredMenuler}
          columns={columns}
          loading={loading}
          className="min-h-[420px]"
        />
        
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-800">
          <Text className="text-sm text-gray-500">
            Toplam {filteredMenuler.length} menü
          </Text>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <Title as="h3" className="text-lg font-semibold">
                {isEditMode ? 'Menü Düzenle' : 'Yeni Menü Ekle'}
              </Title>
              <Button
                variant="text"
                onClick={handleCloseModal}
                className="h-8 w-8 p-0"
              >
                <PiX className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Menü Adı *
                  </label>
                  <Input
                    value={formData.menu}
                    onChange={(e) => setFormData({ ...formData, menu: e.target.value })}
                    placeholder="Örn: Kullanıcılar"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ana Menü *
                  </label>
                  <Select
                    value={formData.anamenu_id.toString()}
                    onChange={(value) => setFormData({ ...formData, anamenu_id: parseInt(value) })}
                    options={anamenuList.map(am => ({
                      value: am.id.toString(),
                      label: am.anamenu
                    }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rota *
                </label>
                <Input
                  value={formData.rota}
                  onChange={(e) => setFormData({ ...formData, rota: e.target.value })}
                  placeholder="/yonetim/menu"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    İkon
                  </label>
                  <Input
                    value={formData.ikon}
                    onChange={(e) => setFormData({ ...formData, ikon: e.target.value })}
                    placeholder="PiUsers"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sıra Numarası
                  </label>
                  <Input
                    type="number"
                    value={formData.sira}
                    onChange={(e) => setFormData({ ...formData, sira: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yetkiler
                </label>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 max-h-64 overflow-y-auto">
                  {yetkiList.length === 0 ? (
                    <Text className="text-sm text-gray-500">Henüz yetki eklenmemiş</Text>
                  ) : (
                    <div className="space-y-2">
                      {yetkiList.map((yetki) => (
                        <div key={yetki.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedYetkiler.includes(yetki.id)}
                            onChange={() => handleYetkiToggle(yetki.id)}
                            label={yetki.yetki}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedYetkiler.length > 0 && (
                  <Text className="mt-2 text-sm text-gray-500">
                    Seçilen yetkiler: {selectedYetkiler.join(', ')}
                  </Text>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button type="submit" className="flex-1">
                  {isEditMode ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

