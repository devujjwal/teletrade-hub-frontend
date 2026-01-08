'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'de' | 'fr' | 'es' | 'it' | 'sk';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Language configuration with flags
export const languageConfig: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  sk: { name: 'Slovenčina', flag: '🇸🇰' },
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.brands': 'Brands',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.myOrders': 'My Orders',
    'nav.trackOrder': 'Track Order',
    'nav.signIn': 'Sign In',
    
    // Hero
    'hero.title': 'Premium Telecom Products',
    'hero.subtitle': 'Discover the latest smartphones, tablets, and accessories from top brands',
    'hero.cta': 'Shop Now',
    'hero.secondary': 'View Categories',
    
    // Products
    'products.title': 'Products',
    'products.featured': 'Featured Products',
    'products.all': 'All Products',
    'products.search': 'Search products...',
    'products.filter': 'Filter',
    'products.sort': 'Sort by',
    'products.sortPrice': 'Price',
    'products.sortName': 'Name',
    'products.sortNewest': 'Newest',
    'products.asc': 'Low to High',
    'products.desc': 'High to Low',
    'products.inStock': 'In Stock',
    'products.outOfStock': 'Out of Stock',
    'products.lowStock': 'Low Stock',
    'products.addToCart': 'Add to Cart',
    'products.viewDetails': 'View Details',
    'products.quickView': 'Quick View',
    'products.noProducts': 'No products found',
    'products.clearFilters': 'Clear Filters',
    'products.priceRange': 'Price Range',
    'products.color': 'Color',
    'products.storage': 'Storage',
    'products.ram': 'RAM',
    'products.category': 'Category',
    'products.brand': 'Brand',
    'products.specifications': 'Specifications',
    'products.description': 'Description',
    'products.relatedProducts': 'Related Products',
    'products.sku': 'SKU',
    'products.warranty': 'Warranty',
    'products.months': 'months',
    'products.loginToViewPrice': 'Login to view price',
    'products.signInForPricing': 'Sign in to see exclusive pricing and offers',
    'products.loginToBuy': 'Login to Purchase',
    
    // Categories
    'categories.title': 'Categories',
    'categories.shopBy': 'Shop by Category',
    'categories.productsCount': 'products',
    
    // Brands
    'brands.title': 'Brands',
    'brands.shopBy': 'Shop by Brand',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Tax',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Information',
    'checkout.billing': 'Billing Information',
    'checkout.payment': 'Payment Method',
    'checkout.review': 'Review Order',
    'checkout.sameAsBilling': 'Same as billing address',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderNotes': 'Order Notes',
    'checkout.guestCheckout': 'Continue as Guest',
    'checkout.firstName': 'First Name',
    'checkout.lastName': 'Last Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone',
    'checkout.company': 'Company (Optional)',
    'checkout.address': 'Address',
    'checkout.addressLine2': 'Apartment, suite, etc.',
    'checkout.city': 'City',
    'checkout.state': 'State/Province',
    'checkout.postalCode': 'Postal Code',
    'checkout.country': 'Country',
    'checkout.creditCard': 'Credit Card',
    'checkout.paypal': 'PayPal',
    'checkout.bankTransfer': 'Bank Transfer',
    
    // Orders
    'orders.title': 'My Orders',
    'orders.track': 'Track Order',
    'orders.orderNumber': 'Order Number',
    'orders.date': 'Date',
    'orders.status': 'Status',
    'orders.total': 'Total',
    'orders.details': 'View Details',
    'orders.trackPlaceholder': 'Enter your order number',
    'orders.emailPlaceholder': 'Enter your email',
    'orders.trackButton': 'Track Order',
    'orders.noOrders': 'No orders found',
    'orders.search': 'Search orders...',
    'orders.allStatus': 'All Status',
    'orders.placedOn': 'Placed on',
    'orders.items': 'item(s)',
    'orders.startShopping': 'Start Shopping',
    'orders.tryAdjusting': 'Try adjusting your search or filters',
    'orders.noOrdersYet': "You haven't placed any orders yet",
    
    // Order Status
    'status.pending': 'Pending',
    'status.processing': 'Processing',
    'status.shipped': 'Shipped',
    'status.delivered': 'Delivered',
    'status.cancelled': 'Cancelled',
    
    // Payment Status
    'payment.pending': 'Payment Pending',
    'payment.paid': 'Paid',
    'payment.failed': 'Payment Failed',
    'payment.refunded': 'Refunded',
    
    // Account
    'account.title': 'My Account',
    'account.profile': 'Profile',
    'account.settings': 'Settings',
    'account.profileInformation': 'Profile Information',
    'account.editProfile': 'Edit Profile',
    'account.saveChanges': 'Save Changes',
    'account.cancel': 'Cancel',
    'account.verifiedAccount': 'Verified Account',
    'account.firstName': 'First Name',
    'account.lastName': 'Last Name',
    'account.email': 'Email Address',
    'account.phone': 'Phone Number',
    'account.notProvided': 'Not provided',
    'account.myOrders': 'My Orders',
    'account.trackOrders': 'Track and manage your orders',
    'account.addresses': 'Addresses',
    'account.manageAddresses': 'Manage delivery addresses',
    'account.accountSettings': 'Account Settings',
    'account.preferences': 'Account preferences and security',
    'account.signOut': 'Sign Out',
    'account.logoutDescription': 'Log out of your account',
    'account.viewOrders': 'View your orders',
    'account.signInToView': 'Sign in to see your order history and track shipments',
    'account.signInToAccount': 'Sign in to your account',
    'account.accessAccount': 'Access your orders, wishlist, and account settings',
    'account.createAccount': 'Create Account',
    'account.signInRequired': 'Sign in required',
    
    // Addresses
    'addresses.title': 'My Addresses',
    'addresses.subtitle': 'Manage your delivery addresses',
    'addresses.addNew': 'Add Address',
    'addresses.edit': 'Edit Address',
    'addresses.name': 'Address Name',
    'addresses.namePlaceholder': 'e.g., Home, Office',
    'addresses.street': 'Street Address',
    'addresses.streetPlaceholder': 'Enter street address',
    'addresses.city': 'City',
    'addresses.cityPlaceholder': 'Enter city',
    'addresses.postalCode': 'Postal Code',
    'addresses.postalCodePlaceholder': 'Enter postal code',
    'addresses.country': 'Country',
    'addresses.countryPlaceholder': 'Enter country',
    'addresses.selectCountry': 'Select country',
    'addresses.state': 'State/Region',
    'addresses.selectState': 'Select state/region',
    'addresses.selectCity': 'Select city',
    'addresses.default': 'Default',
    'addresses.setDefault': 'Set as default',
    'addresses.noAddresses': 'No addresses saved',
    'addresses.noAddressesDesc': 'Add your first delivery address to make checkout faster.',
    'addresses.addFirst': 'Add your first address',
    'addresses.updated': 'Address updated',
    'addresses.updatedDesc': 'Your address has been updated successfully.',
    'addresses.added': 'Address added',
    'addresses.addedDesc': 'Your new address has been saved.',
    'addresses.deleted': 'Address deleted',
    'addresses.deletedDesc': 'Your address has been removed.',
    'addresses.defaultSet': 'Default address set',
    'addresses.defaultSetDesc': 'This address will be used as your default delivery address.',
    'addresses.deleteConfirm': 'Delete this address?',
    'addresses.deleteConfirmDesc': 'This action cannot be undone.',
    
    // Settings
    'settings.title': 'Account Settings',
    'settings.subtitle': 'Manage your account preferences',
    'settings.changePassword': 'Change Password',
    'settings.changePasswordDesc': 'Update your password to keep your account secure.',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.updatePassword': 'Update Password',
    'settings.passwordChanged': 'Password changed',
    'settings.passwordChangedDesc': 'Your password has been updated successfully.',
    'settings.passwordMismatch': 'Passwords do not match',
    'settings.passwordMismatchDesc': 'Please make sure your passwords match.',
    'settings.passwordTooShort': 'Password too short',
    'settings.passwordTooShortDesc': 'Password must be at least 8 characters.',
    'settings.notifications': 'Notifications',
    'settings.notificationsDesc': 'Choose what notifications you receive.',
    'settings.orderUpdates': 'Order Updates',
    'settings.orderUpdatesDesc': 'Get notified about your order status.',
    'settings.promotions': 'Promotions',
    'settings.promotionsDesc': 'Receive promotional offers and discounts.',
    'settings.newsletter': 'Newsletter',
    'settings.newsletterDesc': 'Stay updated with our latest news.',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language.',
    'settings.dangerZone': 'Danger Zone',
    'settings.dangerZoneDesc': 'Irreversible actions for your account.',
    'settings.deleteAccount': 'Delete Account',
    'settings.deleteConfirm': 'Are you sure?',
    'settings.deleteConfirmDesc': 'This will permanently delete your account and all associated data. This action cannot be undone.',
    'settings.accountDeleted': 'Account deleted',
    'settings.accountDeletedDesc': 'Your account has been permanently deleted.',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Footer
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.howToBuy': 'How to Buy',
    'footer.shipping': 'Shipping Policy',
    'footer.returns': 'Returns Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': '© 2026 TeleTrade Hub. All rights reserved.',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.products': 'Produkte',
    'nav.categories': 'Kategorien',
    'nav.brands': 'Marken',
    'nav.cart': 'Warenkorb',
    'nav.account': 'Konto',
    'nav.login': 'Anmelden',
    'nav.register': 'Registrieren',
    'nav.logout': 'Abmelden',
    'nav.myOrders': 'Meine Bestellungen',
    'nav.trackOrder': 'Bestellung verfolgen',
    'nav.signIn': 'Anmelden',
    
    // Hero
    'hero.title': 'Premium Telekom Produkte',
    'hero.subtitle': 'Entdecken Sie die neuesten Smartphones, Tablets und Zubehör von Top-Marken',
    'hero.cta': 'Jetzt Einkaufen',
    'hero.secondary': 'Kategorien ansehen',
    
    // Products
    'products.title': 'Produkte',
    'products.featured': 'Empfohlene Produkte',
    'products.all': 'Alle Produkte',
    'products.search': 'Produkte suchen...',
    'products.filter': 'Filtern',
    'products.sort': 'Sortieren nach',
    'products.sortPrice': 'Preis',
    'products.sortName': 'Name',
    'products.sortNewest': 'Neueste',
    'products.asc': 'Aufsteigend',
    'products.desc': 'Absteigend',
    'products.inStock': 'Auf Lager',
    'products.outOfStock': 'Nicht verfügbar',
    'products.lowStock': 'Wenig Bestand',
    'products.addToCart': 'In den Warenkorb',
    'products.viewDetails': 'Details ansehen',
    'products.quickView': 'Schnellansicht',
    'products.noProducts': 'Keine Produkte gefunden',
    'products.clearFilters': 'Filter löschen',
    'products.priceRange': 'Preisbereich',
    'products.color': 'Farbe',
    'products.storage': 'Speicher',
    'products.ram': 'RAM',
    'products.category': 'Kategorie',
    'products.brand': 'Marke',
    'products.specifications': 'Spezifikationen',
    'products.description': 'Beschreibung',
    'products.relatedProducts': 'Ähnliche Produkte',
    'products.sku': 'Artikelnummer',
    'products.warranty': 'Garantie',
    'products.months': 'Monate',
    'products.loginToViewPrice': 'Anmelden für Preise',
    'products.signInForPricing': 'Melden Sie sich an, um exklusive Preise zu sehen',
    'products.loginToBuy': 'Zum Kaufen anmelden',
    
    // Categories
    'categories.title': 'Kategorien',
    'categories.shopBy': 'Nach Kategorie einkaufen',
    'categories.productsCount': 'Produkte',
    
    // Brands
    'brands.title': 'Marken',
    'brands.shopBy': 'Nach Marke einkaufen',
    
    // Cart
    'cart.title': 'Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.continueShopping': 'Weiter einkaufen',
    'cart.subtotal': 'Zwischensumme',
    'cart.tax': 'MwSt.',
    'cart.shipping': 'Versand',
    'cart.total': 'Gesamt',
    'cart.checkout': 'Zur Kasse',
    'cart.remove': 'Entfernen',
    'cart.quantity': 'Menge',
    
    // Checkout
    'checkout.title': 'Kasse',
    'checkout.shipping': 'Versandinformationen',
    'checkout.billing': 'Rechnungsinformationen',
    'checkout.payment': 'Zahlungsmethode',
    'checkout.review': 'Bestellung überprüfen',
    'checkout.sameAsBilling': 'Wie Rechnungsadresse',
    'checkout.placeOrder': 'Bestellung aufgeben',
    'checkout.orderNotes': 'Bestellnotizen',
    'checkout.guestCheckout': 'Als Gast fortfahren',
    'checkout.firstName': 'Vorname',
    'checkout.lastName': 'Nachname',
    'checkout.email': 'E-Mail',
    'checkout.phone': 'Telefon',
    'checkout.company': 'Firma (Optional)',
    'checkout.address': 'Adresse',
    'checkout.addressLine2': 'Wohnung, Suite, etc.',
    'checkout.city': 'Stadt',
    'checkout.state': 'Bundesland',
    'checkout.postalCode': 'Postleitzahl',
    'checkout.country': 'Land',
    'checkout.creditCard': 'Kreditkarte',
    'checkout.paypal': 'PayPal',
    'checkout.bankTransfer': 'Banküberweisung',
    
    // Orders
    'orders.title': 'Meine Bestellungen',
    'orders.track': 'Bestellung verfolgen',
    'orders.orderNumber': 'Bestellnummer',
    'orders.date': 'Datum',
    'orders.status': 'Status',
    'orders.total': 'Gesamt',
    'orders.details': 'Details ansehen',
    'orders.trackPlaceholder': 'Geben Sie Ihre Bestellnummer ein',
    'orders.emailPlaceholder': 'Geben Sie Ihre E-Mail ein',
    'orders.trackButton': 'Bestellung verfolgen',
    'orders.noOrders': 'Keine Bestellungen gefunden',
    'orders.search': 'Bestellungen suchen...',
    'orders.allStatus': 'Alle Status',
    'orders.placedOn': 'Bestellt am',
    'orders.items': 'Artikel',
    'orders.startShopping': 'Einkaufen beginnen',
    'orders.tryAdjusting': 'Versuchen Sie, Ihre Suche oder Filter anzupassen',
    'orders.noOrdersYet': 'Sie haben noch keine Bestellungen aufgegeben',
    
    // Order Status
    'status.pending': 'Ausstehend',
    'status.processing': 'In Bearbeitung',
    'status.shipped': 'Versendet',
    'status.delivered': 'Zugestellt',
    'status.cancelled': 'Storniert',
    
    // Payment Status
    'payment.pending': 'Zahlung ausstehend',
    'payment.paid': 'Bezahlt',
    'payment.failed': 'Zahlung fehlgeschlagen',
    'payment.refunded': 'Erstattet',
    
    // Account
    'account.title': 'Mein Konto',
    'account.profile': 'Profil',
    'account.settings': 'Einstellungen',
    'account.profileInformation': 'Profilinformationen',
    'account.editProfile': 'Profil bearbeiten',
    'account.saveChanges': 'Änderungen speichern',
    'account.cancel': 'Abbrechen',
    'account.verifiedAccount': 'Verifiziertes Konto',
    'account.firstName': 'Vorname',
    'account.lastName': 'Nachname',
    'account.email': 'E-Mail-Adresse',
    'account.phone': 'Telefonnummer',
    'account.notProvided': 'Nicht angegeben',
    'account.myOrders': 'Meine Bestellungen',
    'account.trackOrders': 'Bestellungen verfolgen und verwalten',
    'account.addresses': 'Adressen',
    'account.manageAddresses': 'Lieferadressen verwalten',
    'account.accountSettings': 'Kontoeinstellungen',
    'account.preferences': 'Kontoeinstellungen und Sicherheit',
    'account.signOut': 'Abmelden',
    'account.logoutDescription': 'Von Ihrem Konto abmelden',
    'account.viewOrders': 'Ihre Bestellungen ansehen',
    'account.signInToView': 'Melden Sie sich an, um Ihren Bestellverlauf und Sendungsverfolgung zu sehen',
    'account.signInToAccount': 'Bei Ihrem Konto anmelden',
    'account.accessAccount': 'Zugriff auf Ihre Bestellungen, Wunschliste und Kontoeinstellungen',
    'account.createAccount': 'Konto erstellen',
    'account.signInRequired': 'Anmeldung erforderlich',
    
    // Addresses
    'addresses.title': 'Meine Adressen',
    'addresses.subtitle': 'Verwalten Sie Ihre Lieferadressen',
    'addresses.addNew': 'Adresse hinzufügen',
    'addresses.edit': 'Adresse bearbeiten',
    'addresses.name': 'Adressname',
    'addresses.namePlaceholder': 'z.B. Zuhause, Büro',
    'addresses.street': 'Straße',
    'addresses.streetPlaceholder': 'Straße eingeben',
    'addresses.city': 'Stadt',
    'addresses.cityPlaceholder': 'Stadt eingeben',
    'addresses.postalCode': 'Postleitzahl',
    'addresses.postalCodePlaceholder': 'PLZ eingeben',
    'addresses.country': 'Land',
    'addresses.countryPlaceholder': 'Land eingeben',
    'addresses.selectCountry': 'Land auswählen',
    'addresses.state': 'Bundesland/Region',
    'addresses.selectState': 'Bundesland/Region auswählen',
    'addresses.selectCity': 'Stadt auswählen',
    'addresses.default': 'Standard',
    'addresses.setDefault': 'Als Standard festlegen',
    'addresses.noAddresses': 'Keine Adressen gespeichert',
    'addresses.noAddressesDesc': 'Fügen Sie Ihre erste Lieferadresse hinzu.',
    'addresses.addFirst': 'Erste Adresse hinzufügen',
    'addresses.updated': 'Adresse aktualisiert',
    'addresses.updatedDesc': 'Ihre Adresse wurde erfolgreich aktualisiert.',
    'addresses.added': 'Adresse hinzugefügt',
    'addresses.addedDesc': 'Ihre neue Adresse wurde gespeichert.',
    'addresses.deleted': 'Adresse gelöscht',
    'addresses.deletedDesc': 'Ihre Adresse wurde entfernt.',
    'addresses.defaultSet': 'Standardadresse festgelegt',
    'addresses.defaultSetDesc': 'Diese Adresse wird als Standard verwendet.',
    'addresses.deleteConfirm': 'Diese Adresse löschen?',
    'addresses.deleteConfirmDesc': 'Diese Aktion kann nicht rückgängig gemacht werden.',
    
    // Settings
    'settings.title': 'Kontoeinstellungen',
    'settings.subtitle': 'Verwalten Sie Ihre Kontoeinstellungen',
    'settings.changePassword': 'Passwort ändern',
    'settings.changePasswordDesc': 'Aktualisieren Sie Ihr Passwort.',
    'settings.currentPassword': 'Aktuelles Passwort',
    'settings.newPassword': 'Neues Passwort',
    'settings.confirmPassword': 'Neues Passwort bestätigen',
    'settings.updatePassword': 'Passwort aktualisieren',
    'settings.passwordChanged': 'Passwort geändert',
    'settings.passwordChangedDesc': 'Ihr Passwort wurde erfolgreich aktualisiert.',
    'settings.passwordMismatch': 'Passwörter stimmen nicht überein',
    'settings.passwordMismatchDesc': 'Bitte stellen Sie sicher, dass Ihre Passwörter übereinstimmen.',
    'settings.passwordTooShort': 'Passwort zu kurz',
    'settings.passwordTooShortDesc': 'Das Passwort muss mindestens 8 Zeichen lang sein.',
    'settings.notifications': 'Benachrichtigungen',
    'settings.notificationsDesc': 'Wählen Sie, welche Benachrichtigungen Sie erhalten.',
    'settings.orderUpdates': 'Bestellstatus',
    'settings.orderUpdatesDesc': 'Benachrichtigungen über Ihren Bestellstatus erhalten.',
    'settings.promotions': 'Werbeaktionen',
    'settings.promotionsDesc': 'Angebote und Rabatte erhalten.',
    'settings.newsletter': 'Newsletter',
    'settings.newsletterDesc': 'Bleiben Sie über unsere neuesten Nachrichten informiert.',
    'settings.language': 'Sprache',
    'settings.languageDesc': 'Wählen Sie Ihre bevorzugte Sprache.',
    'settings.dangerZone': 'Gefahrenzone',
    'settings.dangerZoneDesc': 'Unwiderrufliche Aktionen für Ihr Konto.',
    'settings.deleteAccount': 'Konto löschen',
    'settings.deleteConfirm': 'Sind Sie sicher?',
    'settings.deleteConfirmDesc': 'Dies löscht Ihr Konto und alle zugehörigen Daten dauerhaft.',
    'settings.accountDeleted': 'Konto gelöscht',
    'settings.accountDeletedDesc': 'Ihr Konto wurde dauerhaft gelöscht.',
    
    // Auth
    'auth.login': 'Anmelden',
    'auth.register': 'Konto erstellen',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.retry': 'Wiederholen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.view': 'Ansehen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.search': 'Suchen',
    'common.close': 'Schließen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    
    // Footer
    'footer.about': 'Über uns',
    'footer.contact': 'Kontakt',
    'footer.howToBuy': 'Kaufanleitung',
    'footer.shipping': 'Versandrichtlinien',
    'footer.returns': 'Rückgaberecht',
    'footer.terms': 'AGB',
    'footer.privacy': 'Datenschutz',
    'footer.copyright': '© 2026 TeleTrade Hub. Alle Rechte vorbehalten.',
  },
  // Stub translations for other languages - will fallback to English via t() function
  fr: {} as Record<string, string>,
  es: {} as Record<string, string>,
  it: {} as Record<string, string>,
  sk: {} as Record<string, string>,
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const LANGUAGE_KEY = 'teletrade_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check localStorage first
    const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language;
    const validLanguages: Language[] = ['en', 'de', 'fr', 'es', 'it', 'sk'];
    if (savedLang && validLanguages.includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      // Check URL params
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as Language;
      if (urlLang && validLanguages.includes(urlLang)) {
        setLanguageState(urlLang);
        localStorage.setItem(LANGUAGE_KEY, urlLang);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang);
      
      // Update URL without reload
      const url = new URL(window.location.href);
      if (lang === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', lang);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const t = (key: string): string => {
    // Try current language first
    const langTranslations = translations[language];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    // Fallback to English for missing languages or missing keys
    if (language !== 'en' && translations.en[key]) {
      return translations.en[key];
    }
    // Return key if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

