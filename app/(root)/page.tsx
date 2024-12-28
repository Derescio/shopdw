import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
// import sampleData from '../db/sample-data';


export const metadata = {
  title: 'Home'
};

//const deleay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HomePage = async () => {
  //console.log(sampleData)
  // await deleay(1000);
  const products = await getLatestProducts();
  return (
    <>
      <ProductList data={products.map(product => ({
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString()
      }))} title="Newest Arrivals" />
    </>
  );
}

export default HomePage;

//Component Description:
//This is the Home Page of the ShopDW Application. It displays a list of products.
//The data for the products is fetched from a sample data file local to the directory and then from the DB.
//The ProductList component is used to display the list of products.