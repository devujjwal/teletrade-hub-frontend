# TeleTrade Hub Frontend

A modern, production-ready e-commerce frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **E-commerce Functionality**: Product browsing, cart, checkout, and order management
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🔐 **Admin Panel**: Complete admin interface for managing orders, products, and pricing
- 🖼️ **Image Proxy**: Secure image proxying to hide vendor URLs
- 🌍 **Multi-language Support**: Support for 10+ languages
- ⚡ **Performance**: Optimized with Next.js App Router and ISR
- 🔍 **SEO Optimized**: Server-side rendering, metadata, and structured data

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your API URL:
```env
NEXT_PUBLIC_API_URL=https://api.vs-mjrinfotech.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
teletrade-hub-frontend/
├── app/                    # Next.js App Router pages
│   ├── (shop)/            # Customer-facing pages
│   ├── admin/             # Admin pages
│   └── api/               # API routes (image proxy)
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   └── admin/            # Admin components
├── lib/                  # Utilities and helpers
│   ├── api/             # API client functions
│   ├── store/           # Zustand stores
│   └── utils/           # Utility functions
└── types/               # TypeScript type definitions
```

## Key Features

### Image Proxy

All product images are proxied through `/api/images/[...path]` to hide vendor URLs from end users.

### State Management

- **Cart Store**: Manages shopping cart with localStorage persistence
- **Auth Store**: Manages authentication state

### API Integration

All API calls go through the centralized API client with:
- Automatic token injection
- Language parameter handling
- Error handling and retry logic

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.local.example` for all available environment variables.

## License

Copyright © Telecommunication Trading e.K.

