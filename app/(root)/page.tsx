import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const { products, totalCount } = await getLatestProducts();

  return (
    <>
      <ProductList
        data={products.map((product) => ({
          ...product,
          price: product.price.toString(),
          rating: product.rating.toString(),
        }))}
        title="Newest Arrivals"
        searchParams={{ q: "" }}
        totalCount={totalCount}
      />
    </>
  );
};

export default HomePage;
