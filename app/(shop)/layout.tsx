import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pb-mobile-nav">{children}</main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

