import { useState, useEffect, useCallback } from 'react';

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialSortBy?: string;
  initialSortOrder?: 'ASC' | 'DESC';
  onPageChange?: (params: PaginationParams) => void;
}

export function usePagination<T>(
  fetchFunction: (params: PaginationParams) => Promise<PaginationResponse<T>>,
  options: UsePaginationOptions = {}
) {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialSearch = '',
    initialSortBy = 'rank',
    initialSortOrder = 'ASC',
    onPageChange
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    search: initialSearch,
    sortBy: initialSortBy,
    sortOrder: initialSortOrder,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchData = useCallback(async (params: PaginationParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchFunction(params);
      
      setData(response.data || []);
      setPagination(prev => ({
        ...prev,
        ...response,
        search: params.search || '',
        sortBy: params.sortBy || prev.sortBy,
        sortOrder: params.sortOrder || prev.sortOrder
      }));
      
      if (onPageChange) {
        onPageChange(params);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onPageChange]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchData({
        page,
        limit: pagination.limit,
        search: pagination.search,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder
      });
    }
  }, [fetchData, pagination.limit, pagination.search, pagination.sortBy, pagination.sortOrder, pagination.totalPages]);

  const changeLimit = useCallback((limit: number) => {
    fetchData({
      page: 1, // Limit değiştiğinde ilk sayfaya git
      limit,
      search: pagination.search,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder
    });
  }, [fetchData, pagination.search, pagination.sortBy, pagination.sortOrder]);

  const search = useCallback((searchTerm: string) => {
    fetchData({
      page: 1, // Arama yapıldığında ilk sayfaya git
      limit: pagination.limit,
      search: searchTerm,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder
    });
  }, [fetchData, pagination.limit, pagination.sortBy, pagination.sortOrder]);

  const sort = useCallback((sortBy: string, sortOrder: 'ASC' | 'DESC' = 'ASC') => {
    fetchData({
      page: 1, // Sıralama değiştiğinde ilk sayfaya git
      limit: pagination.limit,
      search: pagination.search,
      sortBy,
      sortOrder
    });
  }, [fetchData, pagination.limit, pagination.search]);

  const refresh = useCallback(() => {
    fetchData({
      page: pagination.page,
      limit: pagination.limit,
      search: pagination.search,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder
    });
  }, [fetchData, pagination.page, pagination.limit, pagination.search, pagination.sortBy, pagination.sortOrder]);

  // İlk yükleme
  useEffect(() => {
    fetchData({
      page: initialPage,
      limit: initialLimit,
      search: initialSearch,
      sortBy: initialSortBy,
      sortOrder: initialSortOrder
    });
  }, []); // Sadece component mount olduğunda çalışsın

  return {
    // Data
    data,
    loading,
    error,
    
    // Pagination state
    pagination,
    
    // Actions
    goToPage,
    changeLimit,
    search,
    sort,
    refresh,
    
    // Convenience methods
    nextPage: () => goToPage(pagination.page + 1),
    prevPage: () => goToPage(pagination.page - 1),
    firstPage: () => goToPage(1),
    lastPage: () => goToPage(pagination.totalPages),
    
    // Computed values
    canGoNext: pagination.hasNext,
    canGoPrev: pagination.hasPrev,
    isEmpty: (data?.length || 0) === 0 && !loading,
    hasData: (data?.length || 0) > 0
  };
}
