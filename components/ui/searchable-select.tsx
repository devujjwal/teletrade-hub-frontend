'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SearchableSelectOption {
  value: string;
  label: string;
  keywords?: string[];
}

interface SearchableSelectProps {
  value: string;
  options: SearchableSelectOption[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  onValueChange: (value: string) => void;
  onManualEntry?: () => void;
  manualEntryLabel?: string;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export default function SearchableSelect({
  value,
  options,
  placeholder,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No options available.',
  noResultsMessage = 'No matching results.',
  disabled = false,
  loading = false,
  onValueChange,
  onManualEntry,
  manualEntryLabel = 'Enter manually',
}: SearchableSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(deferredQuery);

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => {
      const haystack = [
        option.label,
        option.value,
        ...(option.keywords || []),
      ].map(normalizeSearchValue);

      return haystack.some((entry) => entry.includes(normalizedQuery));
    });
  }, [deferredQuery, options]);
  const closeDropdown = () => {
    setIsOpen(false);
    setQuery('');
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background transition-colors placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          !selectedOption && 'text-muted-foreground'
        )}
        onClick={() => {
          if (disabled) {
            return;
          }

          setIsOpen((current) => {
            if (current) {
              setQuery('');
            }

            return !current;
          });
        }}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="border-b p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  'flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm',
                  'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading options...
              </div>
            )}

            {!loading && options.length === 0 && (
              <div className="space-y-2 px-3 py-2 text-sm text-muted-foreground">
                <p>{emptyMessage}</p>
                {onManualEntry && (
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                    onClick={() => {
                      closeDropdown();
                      onManualEntry();
                    }}
                  >
                    {manualEntryLabel}
                  </button>
                )}
              </div>
            )}

            {!loading && options.length > 0 && filteredOptions.length === 0 && (
              <div className="space-y-2 px-3 py-2 text-sm text-muted-foreground">
                <p>{noResultsMessage}</p>
                {onManualEntry && (
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                    onClick={() => {
                      closeDropdown();
                      onManualEntry();
                    }}
                  >
                    {manualEntryLabel}
                  </button>
                )}
              </div>
            )}

            {!loading && filteredOptions.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                  )}
                  onClick={() => {
                    onValueChange(option.value);
                    closeDropdown();
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="ml-2 h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
