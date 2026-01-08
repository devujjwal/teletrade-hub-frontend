'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { settingsApi, PublicSettings } from '@/lib/api/settings';
import { useLanguage } from '@/contexts/language-context';

export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<PublicSettings>({
    site_name: 'TeleTrade Hub',
    site_email: '',
    address: '',
    contact_number: '',
    whatsapp_number: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const publicSettings = await settingsApi.getPublic();
        setSettings(publicSettings);
      } catch (error) {
        console.error('Failed to load footer settings:', error);
      }
    };
    loadSettings();
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground hidden md:block">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg">TT</span>
              </div>
              <span className="font-display font-bold text-xl">{settings.site_name || 'TeleTrade Hub'}</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              {t('footer.description') || 'Your trusted partner for premium telecommunication products. Quality devices from the world\'s top brands.'}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t('footer.company') || 'Company'}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-buy"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.howToBuy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t('footer.policies') || 'Policies'}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-primary-foreground/70 text-sm whitespace-pre-line">
                    {settings.address}
                  </span>
                </li>
              )}
              {settings.contact_number && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <a 
                    href={`tel:${settings.contact_number.replace(/\s/g, '')}`} 
                    className="text-primary-foreground/70 hover:text-secondary text-sm"
                  >
                    {settings.contact_number}
                  </a>
                </li>
              )}
              {settings.whatsapp_number && (
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <a 
                    href={`https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, '')}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-secondary text-sm"
                  >
                    {settings.whatsapp_number}
                  </a>
                </li>
              )}
              {settings.site_email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                  <a 
                    href={`mailto:${settings.site_email}`} 
                    className="text-primary-foreground/70 hover:text-secondary text-sm"
                  >
                    {settings.site_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-primary-foreground/10">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>{t('footer.secureCheckout') || 'Secure Checkout'}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </svg>
            <span>{t('footer.safePayment') || 'Safe Payment'}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <span>{t('footer.fastDelivery') || 'Fast Delivery'}</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-primary-foreground/10">
          <p className="text-primary-foreground/50 text-sm">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
