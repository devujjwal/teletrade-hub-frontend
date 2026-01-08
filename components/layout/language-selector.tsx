'use client';

import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Button from '@/components/ui/button';
import { useLanguage, languageConfig, type Language } from '@/contexts/language-context';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          <span className="text-base">{languageConfig[language].flag}</span>
          <span className="hidden sm:inline text-xs">{language.toUpperCase()}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {(Object.keys(languageConfig) as Language[]).map((lang) => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => setLanguage(lang)}
            className="gap-2"
          >
            <span className="text-base">{languageConfig[lang].flag}</span>
            <span>{languageConfig[lang].name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

