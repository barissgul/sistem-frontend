'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Title, Button, Text } from 'rizzui';
import MetricCard from '@core/components/cards/metric-card';
import WidgetCard from '@core/components/cards/widget-card';
import { PiUsers, PiArrowRight } from 'react-icons/pi';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { API_URL } from '@/config/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/giris');
    } else {
      loadStats();
    }
  }, [session, status, router]);

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data for mini charts
  const userChartData = [
    { name: '1', value: 5 },
    { name: '2', value: 8 },
    { name: '3', value: 6 },
    { name: '4', value: 10 },
    { name: '5', value: 12 },
    { name: '6', value: 9 },
    { name: '7', value: 15 },
  ];

  const renderMiniChart = (color: string) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={userChartData}>
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill={`url(#gradient-${color})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Title>Yükleniyor...</Title>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title as="h2" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </Title>
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Genel bakış ve istatistikler
          </Text>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <MetricCard
          title="Toplam Kullanıcı"
          metric={stats.totalUsers.toLocaleString('tr-TR')}
          icon={<PiUsers className="w-5 h-5 text-blue-600" />}
          chart={renderMiniChart('#3b82f6')}
          className="border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs font-medium"
          metricClassName="text-2xl font-bold"
          iconClassName="!h-12 !w-12 rounded-lg bg-blue-50 dark:bg-blue-500/10"
          chartClassName="!h-16"
        />
        
        <MetricCard
          title="Aktif Kullanıcı"
          metric={stats.activeUsers.toLocaleString('tr-TR')}
          icon={<PiUsers className="w-5 h-5 text-green-600" />}
          chart={renderMiniChart('#22c55e')}
          className="border-muted bg-gray-0 dark:bg-gray-50"
          titleClassName="text-xs font-medium"
          metricClassName="text-2xl font-bold"
          iconClassName="!h-12 !w-12 rounded-lg bg-green-50 dark:bg-green-500/10"
          chartClassName="!h-16"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <WidgetCard
          title="Kullanıcılar"
          description="Sistem kullanıcılarını yönetin"
          className="border-muted bg-gray-0 dark:bg-gray-50"
        >
          <div className="mt-4">
            <Button
              onClick={() => router.push('/genel/kullanicilar')}
              className="w-full"
              variant="outline"
            >
              Kullanıcıları Görüntüle
              <PiArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </WidgetCard>

        <WidgetCard
          title="Yetkiler"
          description="Sistem yetkilerini yönetin"
          className="border-muted bg-gray-0 dark:bg-gray-50"
        >
          <div className="mt-4">
            <Button
              onClick={() => router.push('/genel/yetkiler')}
              className="w-full"
              variant="outline"
            >
              Yetkileri Görüntüle
              <PiArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

