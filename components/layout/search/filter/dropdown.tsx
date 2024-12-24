'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { ListItem } from '.'; // Assuming ListItem is defined somewhere in your project
import { FilterItem } from './item';

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Handle closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    // Attach event listener
    window.addEventListener('click', handleClickOutside);

    // Clean up listener on component unmount
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Set active filter based on pathname or searchParams
  useEffect(() => {
    const activeItem = list.find(
      (listItem) =>
        ('path' in listItem && pathname === listItem.path) ||
        ('slug' in listItem && searchParams.get('sort') === listItem.slug)
    );

    if (activeItem) {
      setActive(activeItem.title);
    }
  }, [pathname, searchParams, list]);

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown trigger */}
      <div
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        <div>{active || 'Select an option'}</div>
        <ChevronDownIcon className="h-4" />
      </div>

      {/* Dropdown menu */}
      {openSelect && (
        <div
          onClick={() => setOpenSelect(false)}
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
        >
          {list.map((item: ListItem, i) => (
            <FilterItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
