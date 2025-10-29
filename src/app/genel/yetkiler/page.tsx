'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge, Input, Text, Title, Select } from 'rizzui';
import MetricCard from '@core/components/cards/metric-card';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { 
  PiMagnifyingGlass, 
  PiPlus, 
  PiPencilSimple,
  PiTrash,
  PiShieldCheck,
  PiCheckCircle,
  PiXCircle,
  PiX
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

interface Yetki {
  id: number;
  yetki: string;
  durum: number;
}

interface YetkiFormData {
  yetki: string;
  durum: number;
}

export default function YetkilerPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<YetkiFormData>({
    yetki: '',
    durum: 1
  });
  const [yetkiler, setYetkiler] = useState<Yetki[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalYetkiler: 0,
    aktifYetkiler: 0,
    pasifYetkiler: 0
  });

  useEffect(() => {
    loadYetkiler();
  }, []);

  useEffect(() => {
    loadStats();
  }, [yetkiler]);

  const loadYetkiler = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/yetkiler`);
      if (response.ok) {
        const data = await response.json();
        setYetkiler(data);
      }
    } catch (error) {
      console.error('Yetkiler yüklenirken hata:', error);
      toast.error('Yetkiler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/yetkiler`);
      if (response.ok) {
        const data = await response.json();
        const aktifYetkiler = data.filter((y: Yetki) => y.durum === 1).length;
        setStats({
          totalYetkiler: data.length,
          aktifYetkiler,
          pasifYetkiler: data.length - aktifYetkiler
        });
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      yetki: '',
      durum: 1
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      yetki: '',
      durum: 1
    });
  };

  const handleEdit = (yetki: Yetki) => {
    router.push(`/genel/yetkiler/${yetki.id}/duzenle`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/yetkiler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Yetki başarıyla oluşturuldu');
        handleCloseModal();
        loadYetkiler();
        loadStats();
      } else {
        toast.error('Bir hata oluştu');
      }
    } catch (error) {
      console.error('Yetki kaydedilirken hata:', error);
      toast.error('Yetki kaydedilirken hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yetkiyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/yetkiler/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Yetki başarıyla silindi');
        loadYetkiler();
        loadStats();
      } else {
        toast.error('Yetki silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Yetki silinirken hata:', error);
      toast.error('Yetki silinirken hata oluştu');
    }
  };

  const filteredYetkiler = yetkiler.filter(yetki =>
    yetki.yetki.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: <HeaderCell>ID</HeaderCell>,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text className="font-medium text-gray-700">{id}</Text>
    },
    {
      title: <HeaderCell>Yetki Adı</HeaderCell>,
      dataIndex: 'yetki',
      key: 'yetki',
      render: (yetki: string) => (
        <Text className="font-medium text-gray-900">{yetki}</Text>
      )
    },
    {
      title: <HeaderCell>Durum</HeaderCell>,
      dataIndex: 'durum',
      key: 'durum',
      width: 120,
      render: (durum: number) => (
        <Badge 
          color={durum === 1 ? 'success' : 'danger'}
          renderAsDot
        >
          {durum === 1 ? 'Aktif' : 'Pasif'}
        </Badge>
      )
    },
    {
      title: <HeaderCell>İşlemler</HeaderCell>,
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (_: any, record: Yetki) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(record)}
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
            Yetkiler
          </Title>
          <Text className="mt-1 text-gray-500">
            Sistem yetkilerini yönetin
          </Text>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto"
        >
          <PiPlus className="mr-2 h-4 w-4" />
          Yeni Yetki Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          title="Toplam Yetki"
          metric={stats.totalYetkiler}
          icon={<PiShieldCheck className="w-4 h-4 text-blue-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
        <MetricCard
          title="Aktif Yetkiler"
          metric={stats.aktifYetkiler}
          icon={<PiCheckCircle className="w-4 h-4 text-green-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
        <MetricCard
          title="Pasif Yetkiler"
          metric={stats.pasifYetkiler}
          icon={<PiXCircle className="w-4 h-4 text-red-600" />}
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
            placeholder="Yetki ara..."
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
          data={filteredYetkiler}
          columns={columns}
          loading={loading}
          className="min-h-[420px]"
        />
        
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-800">
          <Text className="text-sm text-gray-500">
            Toplam {filteredYetkiler.length} yetki
          </Text>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <Title as="h3" className="text-lg font-semibold">
                Yeni Yetki Ekle
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
                  Ekle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

