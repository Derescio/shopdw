import ProductList from "@/components/shared/product/product-list";
import { getFeaturedProducts, getLatestProducts, } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCarousel from "@/components/shared/product/product-carousel";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const { products, totalCount } = await getLatestProducts();
  const categories = await getAllCategories();
  const featuredProducts = await getFeaturedProducts();


  return (
    <>
      <div className="flex  items-center justify-center mb-6">
        {categories.map((x) => (
          <Button key={x.category} variant='ghost' className='max-w-sm' asChild>
            <Link href={`/search?category=${x.category}`}>
              {x.category}
            </Link>
          </Button>
        ))}
      </div>
      {featuredProducts.length > 0 && (
        <ProductCarousel
          data={featuredProducts.map((product) => ({
            ...product,
            costPrice: product.costPrice.toString(),
          }))}
        />
      )}
      <ProductList
        data={products.map((product) => ({
          ...product,
          price: product.price.toString(),
          costPrice: product.price.toString(),
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
