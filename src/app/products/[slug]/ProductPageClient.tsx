'use client';

import TxpShell from '@/txp/patterns/TxpShell';
import ProductPageTemplate from '@/txp/patterns/ProductPageTemplate';
import type { ProductPageContent } from '@/content/txp/products';

type Props = {
  product: ProductPageContent;
};

export default function ProductPageClient({ product }: Props) {
  return (
    <TxpShell>
      <ProductPageTemplate product={product} />
    </TxpShell>
  );
}
