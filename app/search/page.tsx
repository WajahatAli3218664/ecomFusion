import { Metadata } from 'next';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

// Move metadata to a generateMetadata function
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search',
    description: 'Search for products in the store.'
  };
}

// Define types
interface SearchParams {
  sort?: string;
  q?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

// Main page component
export default async function SearchPage({
  searchParams
}: PageProps) {
  // Destructure and provide default values
  const { sort, q: searchValue } = searchParams ?? {};
  
  // Get sort configuration
  const sortConfig = sorting.find((item) => item.slug === sort) || defaultSort;
  const { sortKey, reverse } = sortConfig;

  // Fetch products
  const products = await getProducts({ 
    sortKey, 
    reverse, 
    query: searchValue 
  }).catch(() => []);  // Provide empty array as fallback

  // Early return for no products
  if (!products || products.length === 0) {
    return (
      <p className="mx-auto text-base text-gray-500">
        {searchValue 
          ? `There are no products that match "${searchValue}"` 
          : 'No products found'}
      </p>
    );
  }

  const resultsText = products.length === 1 ? 'result' : 'results';

  return (
    <div className="w-full">
      {searchValue && (
        <p className="mb-4">
          Showing {products.length} {resultsText} for{' '}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      )}
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ProductGridItems products={products} />
      </Grid>
    </div>
  );
}
