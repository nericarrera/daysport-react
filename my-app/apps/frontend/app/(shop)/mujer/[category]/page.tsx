import { getProductsByCategory } from '@/lib/api/products';

export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const products = await getProductsByCategory(params.category);
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}