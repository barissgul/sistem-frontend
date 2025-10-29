import React from 'react';
import { Button } from 'rizzui';
import { 
  PiCaretLeft, 
  PiCaretRight, 
  PiCaretDoubleLeft, 
  PiCaretDoubleRight,
  PiMagnifyingGlass,
  PiArrowClockwise
} from 'react-icons/pi';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (limit: number) => void;
  onSearch?: (searchTerm: string) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showRefresh?: boolean;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  className?: string;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  onSearch,
  onRefresh,
  searchPlaceholder = 'Ara...',
  showSearch = true,
  showRefresh = true,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 20, 50, 100],
  className = '',
  disabled = false
}: PaginationProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // İlk sayfa
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Mevcut sayfa etrafındaki sayfalar
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Son sayfa
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showSearch && !showRefresh && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Sol taraf - Bilgiler ve Arama */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Sayfa bilgisi */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">{startItem}-{endItem}</span> / {totalItems.toLocaleString()} kayıt
        </div>

        {/* Arama */}
        {showSearch && onSearch && (
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={disabled}
              />
              <PiMagnifyingGlass className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={disabled || !searchTerm.trim()}
            >
              Ara
            </Button>
          </form>
        )}
      </div>

      {/* Sağ taraf - Sayfalama ve Kontroller */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Sayfa başına kayıt sayısı */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sayfa başına:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={disabled}
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Yenile butonu */}
        {showRefresh && onRefresh && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRefresh}
            disabled={disabled}
            className="flex items-center gap-1"
          >
            <PiArrowClockwise className="w-4 h-4" />
            Yenile
          </Button>
        )}

        {/* Sayfa navigasyonu */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* İlk sayfa */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(1)}
              disabled={disabled || currentPage === 1}
              className="p-2"
            >
              <PiCaretDoubleLeft className="w-4 h-4" />
            </Button>

            {/* Önceki sayfa */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
              className="p-2"
            >
              <PiCaretLeft className="w-4 h-4" />
            </Button>

            {/* Sayfa numaraları */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {typeof page === 'number' ? (
                    <Button
                      size="sm"
                      variant={currentPage === page ? "solid" : "outline"}
                      onClick={() => onPageChange(page)}
                      disabled={disabled}
                      className={`min-w-[40px] ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span className="px-2 py-1 text-sm text-gray-500">...</span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Sonraki sayfa */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
              className="p-2"
            >
              <PiCaretRight className="w-4 h-4" />
            </Button>

            {/* Son sayfa */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPageChange(totalPages)}
              disabled={disabled || currentPage === totalPages}
              className="p-2"
            >
              <PiCaretDoubleRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagination;
