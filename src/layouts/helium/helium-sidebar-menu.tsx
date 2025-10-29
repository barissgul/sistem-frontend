'use client';

import Link from 'next/link';
import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Title } from 'rizzui/typography';
import { Collapse } from 'rizzui/collapse';
import cn from '@core/utils/class-names';
import { PiCaretDownBold } from 'react-icons/pi';
import { useDynamicMenu, type MenuItem, type MenuCategory } from '@/layouts/helium/helium-dynamic-menu';
import StatusBadge from '@core/components/get-status-badge';

export function HeliumSidebarMenu() {
  const pathname = usePathname();
  const { menuCategories, loading } = useDynamicMenu();

  // API yüklenirken loading göster
  if (loading) {
    return (
      <div className="mt-4 pb-3 3xl:mt-6">
        <div className="animate-pulse space-y-4 px-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 dark:bg-gray-700"></div>
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // API'den menü gelmemişse boş göster
  if (!menuCategories || menuCategories.length === 0) {
    return (
      <div className="mt-4 pb-3 3xl:mt-6">
        <div className="px-6 text-center text-gray-500 dark:text-gray-400">
          <p>Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pb-3 3xl:mt-6">
      {menuCategories.map((category, categoryIndex) => (
        <div key={category.name}>
          {/* Kategori Başlığı */}
          <Title
            as="h6"
            className={cn(
              'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 dark:text-gray-500 2xl:px-8',
              categoryIndex !== 0 && 'mt-6 3xl:mt-7'
            )}
          >
            {category.name}
          </Title>
          
          {/* Kategori Altındaki Menü Öğeleri */}
          {category.items.map((item, itemIndex) => {
            const isActive = pathname === (item?.href as string);
            const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
              (dropdownItem) => dropdownItem.href === pathname
            );
            const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

            return (
              <Fragment key={item.name + '-' + itemIndex}>
                {item?.href ? (
                  <>
                    {item?.dropdownItems ? (
                      <Collapse
                        defaultOpen={isDropdownOpen}
                        header={({ open, toggle }) => (
                          <div
                            onClick={toggle}
                            className={cn(
                              'group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2',
                              isDropdownOpen
                                ? 'before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white dark:text-primary dark:before:bg-primary 2xl:before:-start-5'
                                : 'text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-700'
                            )}
                          >
                            <span className="flex items-center">
                              {item?.icon && (
                                <span
                                  className={cn(
                                    'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                    isDropdownOpen
                                      ? 'text-white dark:text-primary'
                                      : 'text-gray-300/70 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-500'
                                  )}
                                >
                                  {item?.icon}
                                </span>
                              )}
                              {item.name}
                            </span>

                            <PiCaretDownBold
                              strokeWidth={3}
                              className={cn(
                                'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                                open && 'rotate-0 rtl:rotate-0'
                              )}
                            />
                          </div>
                        )}
                      >
                        {item?.dropdownItems?.map((dropdownItem, index) => {
                          const isChildActive =
                            pathname === (dropdownItem?.href as string);

                          return (
                            <Link
                              href={dropdownItem?.href}
                              key={dropdownItem?.name + index}
                              className={cn(
                                'group mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-2.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5 2xl:px-3.5',
                                isChildActive
                                  ? 'text-gray-200 dark:text-gray-700'
                                  : 'text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500'
                              )}
                            >
                              <div className="flex items-center truncate">
                                <span
                                  className={cn(
                                    'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                    isChildActive
                                      ? 'bg-primary ring-[1px] ring-primary'
                                      : 'opacity-40 group-hover:bg-gray-700'
                                  )}
                                />{' '}
                                <span className="truncate">
                                  {dropdownItem?.name}
                                </span>
                              </div>
                              {'badge' in dropdownItem && dropdownItem.badge ? (
                                <StatusBadge status={dropdownItem.badge} />
                              ) : null}
                            </Link>
                          );
                        })}
                      </Collapse>
                    ) : (
                      <Link
                        href={item?.href}
                        className={cn(
                          'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
                          isActive
                            ? 'before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white dark:text-gray-900 2xl:before:-start-5'
                            : 'text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-700'
                        )}
                      >
                        <div className="flex items-center truncate">
                          {item?.icon && (
                            <span
                              className={cn(
                                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-200 [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                isActive
                                  ? 'text-white dark:text-gray-900'
                                  : 'text-gray-300/70 group-hover:text-gray-500 dark:text-gray-500'
                              )}
                            >
                              {item?.icon}
                            </span>
                          )}
                          <span className="truncate">{item.name}</span>
                        </div>
                        {'badge' in item && item.badge ? (
                          <StatusBadge status={item.badge} />
                        ) : null}
                      </Link>
                    )}
                  </>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
}
