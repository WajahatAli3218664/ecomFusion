export const runtime = 'edge';

import { Metadata } from 'next';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

<<<<<<< HEAD
// Define the props type explicitly for searchParams
interface SearchPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams = {} }: SearchPageProps) {
  let products: any[] = [];
  let query = '';
  let sortKey = defaultSort.sortKey;
  let reverse = defaultSort.reverse;

  try {
    // Extract sorting and search value from searchParams
    const { sort, q: searchValue } = searchParams;

    // Ensure searchValue is a string
    query = searchValue ? searchValue.toString() : '';

    // Determine sorting options
    ({ sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort);

    console.log('Fetching products with:', { sortKey, reverse, query });

    // Fetch products from Shopify
    const fetchedProducts = await getProducts({ sortKey, reverse, query });

    // Validate if fetchedProducts is an array
    if (Array.isArray(fetchedProducts)) {
      products = fetchedProducts;
    } else {
      console.error('Unexpected return type from getProducts, expected an array:', fetchedProducts);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Determine the result text (singular or plural based on the number of products)
  const resultsText = products.length === 1 ? 'result' : 'results';

  return (
    <>
      {/* Conditionally render search results message */}
      {query ? (
        <p className="mb-4">
          {products.length === 0
            ? `There are no products that match “${query}”`
            : `Showing ${products.length} ${resultsText} for “${query}”`}
        </p>
      ) : null}

      {/* Render the product grid if there are products */}
      {products.length > 0 && (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </>
=======
export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <div>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${products.length > 1 ? 'results' : 'result'} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <h2>{product.title}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
>>>>>>> 1ecf16d6294c63d05a845ce55a6fd7a18e8bcbb3
  );
}
