'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  brandName: string;
  className?: string;
  height?: number;
  width?: number;
  showFallbackText?: boolean;
}

type ImageSource = 'local' | 'google' | 'text';

// Map common brand names to their domains for Clearbit API
const getBrandDomain = (brandName: string): string => {
  const name = brandName.toLowerCase().trim();
  
  // Common brand domain mappings
  const domainMap: Record<string, string> = {
    // Phones & Mobile Devices
    'apple': 'apple.com',
    'apple inc': 'apple.com',
    'samsung': 'samsung.com',
    'samsung electronics': 'samsung.com',
    'google': 'google.com',
    'google pixel': 'google.com',
    'xiaomi': 'mi.com',
    'mi': 'mi.com',
    'redmi': 'mi.com',
    'huawei': 'huawei.com',
    'oneplus': 'oneplus.com',
    'one plus': 'oneplus.com',
    'oppo': 'oppo.com',
    'vivo': 'vivo.com',
    'nokia': 'nokia.com',
    'motorola': 'motorola.com',
    'moto': 'motorola.com',
    'realme': 'realme.com',
    'poco': 'poco.net',
    'honor': 'honor.com',
    'nothing': 'nothing.tech',
    'nothing phone': 'nothing.tech',
    'htc': 'htc.com',
    'blackberry': 'blackberry.com',
    'infinix': 'infinixmobility.com',
    'tecno': 'tecno-mobile.com',
    'zte': 'zte.com',
    'tcl': 'tcl.com',
    'alcatel': 'alcatelmobile.com',
    'ulefone': 'ulefone.com',
    
    // Laptops & Computers
    'microsoft': 'microsoft.com',
    'microsoft surface': 'microsoft.com',
    'surface': 'microsoft.com',
    'lenovo': 'lenovo.com',
    'thinkpad': 'lenovo.com',
    'ideapad': 'lenovo.com',
    'asus': 'asus.com',
    'rog': 'asus.com',
    'acer': 'acer.com',
    'hp': 'hp.com',
    'hewlett packard': 'hp.com',
    'dell': 'dell.com',
    'msi': 'msi.com',
    'razer': 'razer.com',
    'alienware': 'dell.com',
    'toshiba': 'toshiba.com',
    'fujitsu': 'fujitsu.com',
    'framework': 'frame.work',
    'system76': 'system76.com',
    'lg': 'lg.com',
    'lg electronics': 'lg.com',
    
    // Gaming Consoles
    'nintendo': 'nintendo.com',
    'nintendo switch': 'nintendo.com',
    'sony': 'sony.com',
    'playstation': 'playstation.com',
    'ps5': 'playstation.com',
    'ps4': 'playstation.com',
    'xbox': 'xbox.com',
    'xbox series': 'xbox.com',
    'sega': 'sega.com',
    'atari': 'atari.com',
    'valve': 'valvesoftware.com',
    'steam': 'steampowered.com',
    'steam deck': 'steampowered.com',
    
    // Headphones & Audio
    'jbl': 'jbl.com',
    'bose': 'bose.com',
    'beats': 'beatsbydre.com',
    'sennheiser': 'sennheiser.com',
    'audio-technica': 'audio-technica.com',
    'akg': 'akg.com',
    'skullcandy': 'skullcandy.com',
    'bang & olufsen': 'bang-olufsen.com',
    'jabra': 'jabra.com',
    'plantronics': 'plantronics.com',
    'poly': 'poly.com',
    'shure': 'shure.com',
    'beyerdynamic': 'beyerdynamic.com',
    'anker': 'anker.com',
    'soundcore': 'soundcore.com',
    
    // Prepaid SIM & Telecom
    'vodafone': 'vodafone.com',
    'callya vodafone': 'vodafone.com',
    'callya': 'vodafone.com',
    't-mobile': 't-mobile.com',
    'at&t': 'att.com',
    'att': 'att.com',
    'verizon': 'verizon.com',
    'orange': 'orange.com',
    'o2': 'o2.com',
    'three': 'three.co.uk',
    '3': 'three.co.uk',
    'ee': 'ee.co.uk',
    'telekom': 'telekom.com',
    'deutsche telekom': 'telekom.com',
    'airtel': 'airtel.in',
    'jio': 'jio.com',
    'reliance jio': 'jio.com',
    'vi': 'myvi.in',
    'vodafone idea': 'myvi.in',
    'mtn': 'mtn.com',
    'etisalat': 'etisalat.ae',
    'du': 'du.ae',
    'zain': 'zain.com',
    'stc': 'stc.com.sa',
    'saudi telecom': 'stc.com.sa',
    'ooredoo': 'ooredoo.com',
    'lycamobile': 'lycamobile.com',
    'lyca': 'lycamobile.com',
    'giffgaff': 'giffgaff.com',
    'lebara': 'lebara.com',
    
    // Networking & Tech
    'intel': 'intel.com',
    'amd': 'amd.com',
    'nvidia': 'nvidia.com',
    'cisco': 'cisco.com',
    'tp-link': 'tp-link.com',
    'netgear': 'netgear.com',
    'linksys': 'linksys.com',
    'belkin': 'belkin.com',
    'panasonic': 'panasonic.com',
    'philips': 'philips.com',
    'bosch': 'bosch.com',
    'siemens': 'siemens.com',
  };

  // Check if we have a direct mapping
  if (domainMap[name]) {
    return domainMap[name];
  }

  // Try to extract domain-like patterns from brand name
  // Remove common suffixes and spaces
  const cleanName = name
    .replace(/\s+(inc|ltd|llc|corp|corporation|company|co)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '');

  // Default to .com for unknown brands
  return `${cleanName}.com`;
};

// Generate a clean filename slug from brand name
const getBrandSlug = (brandName: string): string => {
  return brandName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function BrandLogo({
  brandName,
  className = '',
  height = 60,
  width = 120,
  showFallbackText = true,
}: BrandLogoProps) {
  const [currentSource, setCurrentSource] = useState<ImageSource>('local');

  const brandDomain = getBrandDomain(brandName);
  const brandSlug = getBrandSlug(brandName);

  // Get logo URL based on current source
  const getLogoUrl = (): string | null => {
    if (currentSource === 'local') {
      // Try local logo - PNG only (we downloaded PNGs)
      return `/logos/${brandSlug}.png`;
    } else if (currentSource === 'google') {
      return `https://www.google.com/s2/favicons?domain=${brandDomain}&sz=128`;
    }
    return null; // text fallback
  };

  const logoUrl = getLogoUrl();

  // Handle image load error - cascade to next fallback
  const handleImageError = () => {
    if (currentSource === 'local') {
      // If local PNG failed, try Google favicon
      setCurrentSource('google');
    } else if (currentSource === 'google') {
      // Fall back to text
      setCurrentSource('text');
    }
  };

  // If all sources failed and text fallback is disabled, return null
  if (currentSource === 'text' && !showFallbackText) {
    return null;
  }

  // If we're at text fallback, show brand name
  if (currentSource === 'text' && showFallbackText) {
    return (
      <span className={className}>
        {brandName}
      </span>
    );
  }

  // Render image with current source
  return logoUrl ? (
    <Image
      key={currentSource} // Force re-render when source changes
      src={logoUrl}
      alt={brandName}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={handleImageError}
      unoptimized
    />
  ) : null;
}
