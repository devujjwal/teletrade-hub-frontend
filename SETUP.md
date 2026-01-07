# TeleTrade Hub Frontend - Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd teletrade-hub-frontend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set:
   ```env
   NEXT_PUBLIC_API_URL=https://api.vs-mjrinfotech.com
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
teletrade-hub-frontend/
├── app/                          # Next.js App Router
│   ├── (shop)/                  # Customer-facing pages
│   │   ├── page.tsx            # Home page
│   │   ├── products/           # Product listing & detail
│   │   ├── cart/               # Shopping cart
│   │   └── checkout/           # Checkout process
│   ├── admin/                   # Admin panel
│   │   ├── login/              # Admin login
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── orders/             # Order management
│   │   ├── pricing/            # Pricing configuration
│   │   └── sync/               # Product sync
│   └── api/                     # API routes
│       └── images/              # Image proxy route
├── components/                  # React components
│   ├── ui/                     # Base UI components
│   ├── layout/                 # Layout components
│   ├── products/               # Product components
│   ├── cart/                   # Cart components
│   ├── checkout/               # Checkout components
│   └── admin/                  # Admin components
├── lib/                        # Utilities
│   ├── api/                    # API client functions
│   ├── store/                  # Zustand stores
│   └── utils/                  # Utility functions
└── types/                      # TypeScript definitions
```

## Key Features Implemented

### ✅ Customer Features
- Home page with featured products, categories, and brands
- Product listing with filters (category, brand, price range)
- Product detail pages with image gallery
- Shopping cart with persistent storage
- Checkout process with form validation
- Order confirmation

### ✅ Admin Features
- Admin login
- Dashboard with statistics
- Order management (list, view, update status)
- Pricing configuration (global and category-specific markup)
- Product sync status and manual sync

### ✅ Technical Features
- Image proxy API route (hides vendor URLs)
- State management with Zustand
- Form validation with React Hook Form + Zod
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Error handling and loading states

## API Integration

The frontend integrates with the backend API at `https://api.vs-mjrinfotech.com`. All API calls are handled through:

- `lib/api/client.ts` - Centralized API client with interceptors
- `lib/api/products.ts` - Product endpoints
- `lib/api/orders.ts` - Order endpoints
- `lib/api/admin.ts` - Admin endpoints

## Image Proxy

All product images are proxied through `/api/images/[...path]` to:
- Hide vendor image URLs from end users
- Add caching headers
- Validate image sources

## State Management

- **Cart Store** (`lib/store/cart-store.ts`): Manages shopping cart with localStorage persistence
- **Auth Store** (`lib/store/auth-store.ts`): Manages authentication state

## Next Steps

1. **Install Dependencies**: Run `npm install` in the frontend directory
2. **Configure Environment**: Set up `.env.local` with your API URL
3. **Test Locally**: Run `npm run dev` and test all features
4. **Customize Design**: Update Tailwind config to match your brand colors
5. **Add SEO**: Implement structured data and sitemap generation
6. **Add Multi-language**: Implement language selector in header

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

See `.env.local.example` for all available environment variables.

## Troubleshooting

### Images not loading
- Check that image proxy API route is working
- Verify `ALLOWED_IMAGE_DOMAINS` in environment variables
- Check browser console for errors

### API calls failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on backend
- Verify authentication tokens are being sent

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run type-check`
- Verify all environment variables are set

## Support

For issues or questions, refer to:
- Backend API documentation: `teletrade-hub-backend/doc/API_ENDPOINTS_REFERENCE.md`
- Postman collection: `teletrade-hub-backend/doc/TeleTrade_Hub_API_Collection.postman_collection.json`

