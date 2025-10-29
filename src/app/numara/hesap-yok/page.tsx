'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Badge, Input, Text, Title, Select } from 'rizzui';
import MetricCard from '@core/components/cards/metric-card';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { 
  PiMagnifyingGlass, 
  PiXCircle,
  PiArrowLeft,
  PiArrowRight,
  PiCaretDoubleLeft,
  PiCaretDoubleRight
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import { API_URL } from '@/config/api';

interface Numara {
  id: number;
  ad?: string;
  soyad?: string;
  tc?: string;
  numara: string;
  gonderildi: number;
  gonderildi_tarihi?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

interface PaginationResponse {
  data: Numara[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function HesapYokContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [numaralar, setNumaralar] = useState<Numara[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 50
  });

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    
    setCurrentPage(page);
    setLimit(limitParam);
    setSearchTerm(search);
  }, [searchParams]);

  useEffect(() => {
    loadNumaralar();
  }, [currentPage, limit, searchTerm]);

  const loadNumaralar = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      params.append('gonderildi', '2'); // Hesap Yok = 2
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_URL}/numaralar?${params.toString()}`);
      if (response.ok) {
        const data: PaginationResponse = await response.json();
        setNumaralar(data.data);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          page: data.page,
          limit: data.limit
        });

        const newUrl = `/numara/hesap-yok?${params.toString()}`;
        router.replace(newUrl);
      } else {
        toast.error('Numaralar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Numaralar yüklenirken hata:', error);
      toast.error('Numaralar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: <HeaderCell title="ID" />,
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <Text className="font-medium text-gray-700">{id}</Text>
    },
    {
      title: <HeaderCell title="Ad" />,
      dataIndex: 'ad',
      key: 'ad',
      width: 120,
      render: (ad: string) => <Text className="text-gray-900">{ad || '-'}</Text>
    },
    {
      title: <HeaderCell title="Soyad" />,
      dataIndex: 'soyad',
      key: 'soyad',
      width: 120,
      render: (soyad: string) => <Text className="text-gray-900">{soyad || '-'}</Text>
    },
    {
      title: <HeaderCell title="TC" />,
      dataIndex: 'tc',
      key: 'tc',
      width: 120,
      render: (tc: string) => <Text className="text-gray-900">{tc || '-'}</Text>
    },
    {
      title: <HeaderCell title="Numara" />,
      dataIndex: 'numara',
      key: 'numara',
      width: 150,
      render: (numara: string) => <Text className="font-medium text-gray-900">{numara}</Text>
    },
    {
      title: <HeaderCell title="Oluşturma Tarihi" />,
      dataIndex: 'olusturma_tarihi',
      key: 'olusturma_tarihi',
      width: 180,
      render: (tarih: string) => <Text className="text-gray-600">{formatDate(tarih)}</Text>
    }
  ];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pagination.totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== pagination.totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < pagination.totalPages - 2) {
        pages.push('...');
      }
      
      if (pagination.totalPages > 1) {
        pages.push(pagination.totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6 @container">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title as="h2" className="text-2xl font-bold">
            Hesap Yok
          </Title>
          <Text className="mt-1 text-gray-500">
            Mesaj gönderilemeyen numaraları görüntüleyin
          </Text>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-1">
        <MetricCard
          title="Toplam Hesap Yok"
          metric={pagination.total.toLocaleString('tr-TR')}
          icon={<PiXCircle className="w-4 h-4 text-red-600" />}
          className="!p-3 border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs"
          metricClassName="text-base"
          iconClassName="!h-8 !w-8 rounded-lg bg-gray-100"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
          <Input
            type="search"
            placeholder="Ad, soyad, TC veya numara ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlass className="h-5 w-5 text-gray-400" />}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline">
            Ara
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <Text className="text-sm text-gray-600">Sayfa başına:</Text>
          <Select
            value={limit.toString()}
            onChange={handleLimitChange}
            options={[
              { value: '25', label: '25' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
              { value: '200', label: '200' }
            ]}
            className="w-20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <Text>Yükleniyor...</Text>
          </div>
        ) : (
          <Table
            data={numaralar}
            columns={columns}
            className="min-h-[420px]"
            rowKey="id"
          />
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-800">
            <Text className="text-sm text-gray-500">
              Toplam {pagination.total.toLocaleString('tr-TR')} kayıt - Sayfa {currentPage} / {pagination.totalPages}
            </Text>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <PiCaretDoubleLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <PiArrowLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <Text key={`ellipsis-${index}`} className="px-2 text-gray-400">...</Text>
                ) : (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? 'solid' : 'outline'}
                    onClick={() => handlePageChange(page as number)}
                    className="min-w-[32px]"
                  >
                    {page}
                  </Button>
                )
              ))}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                <PiArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
              >
                <PiCaretDoubleRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HesapYokPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Title>Yükleniyor...</Title>
        </div>
      </div>
    }>
      <HesapYokContent />
    </Suspense>
  );
}

