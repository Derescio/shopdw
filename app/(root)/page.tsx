import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const { products, totalCount } = await getLatestProducts();
  const categories = await getAllCategories();


  return (
    <>
      <div className="flex  items-center justify-center">
        {categories.map((x, index) => (
          <Button key={x.category} variant='ghost' className='max-w-sm' asChild>
            <Link href={`/search?category=${x.category}`}>
              {x.category}
            </Link>
          </Button>
        ))}
      </div>
      {/* Banner */}
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
