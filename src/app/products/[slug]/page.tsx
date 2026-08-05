import { notFound, redirect } from 'next/navigation';
import { productLandingRoutes } from '@/content/txp/product-routes';
import { txpProducts } from '@/content/txp/products';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props) {
  const product = txpProducts[params.slug];
  if (!product) return { title: 'Product | Tau' };
  return {
    title: `${product.name} | Tau Experience Platform`,
    description: product.tagline,
  };
}

export default function ProductPage({ params }: Props) {
  const landing = productLandingRoutes[params.slug];
  if (landing) redirect(landing);

  const product = txpProducts[params.slug];
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
