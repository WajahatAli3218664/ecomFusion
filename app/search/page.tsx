import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

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
  );
}
