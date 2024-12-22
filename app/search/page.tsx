import { Suspense } from 'react';
import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

// Define proper types for the search params
interface SearchParams {
  sort?: string;
  q?: string;
}

// Separate the main search results component
async function SearchResults({ 
  sort, 
  searchValue 
}: { 
  sort?: string; 
  searchValue?: string;
}) {
  // Use proper error handling for sorting
  const sortConfig = sorting.find((item) => item.slug === sort) || defaultSort;
  const { sortKey, reverse } = sortConfig;

  try {
    const products = await getProducts({ 
      sortKey, 
      reverse, 
      query: searchValue 
    });

    if (!products || products.length === 0) {
      return (
        <p className="text-base text-gray-500">
          {searchValue 
            ? `There are no products that match "${searchValue}"` 
            : 'No products found'}
        </p>
      );
    }

    const resultsText = products.length === 1 ? 'result' : 'results';

    return (
      <>
        {searchValue && (
          <p className="mb-4">
            Showing {products.length} {resultsText} for{' '}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        )}
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      </>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <p className="text-base text-red-500">
        An error occurred while fetching products. Please try again later.
      </p>
    );
  }
}

// Main page component
export default async function SearchPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const sort = searchParams?.sort;
  const searchValue = searchParams?.q;

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    }>
      <SearchResults sort={sort} searchValue={searchValue} />
    </Suspense>
  );
                             }
