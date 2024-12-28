import ProductCard from "./product-card";
import { Product } from "@/types";

const ProductList = ({ data, title, limit }: { data: Product[], title?: string, limit?: number }) => {
    const limitData = limit ? data.slice(0, limit) : data;
    return (<div className="my-10 ">

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {data.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{
            limitData.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
            ))
        }</div>) : (<p>No products found.</p>)}
    </div>);
}

export default ProductList;

//Component Description:
// It is used in the HomePage component.
//This component is used to display the products in a grid layout.
// It takes a data array as a prop and displays the products in a grid layout, it also takes a title and limit as props.
// The Limit is used to limit the number of products to be displayed.
// The Title is used to display the title of the products.
// It imports the ProductCard component and passes the data(product) and uses it to display the products in a grid layout.

// limitData Explained:

//  a constant that will store the resulting array after applying the optional limit.
// - The ternary operator `?` is used to check if the

// limit

//  variable is truthy (i.e., it has a value other than `null`, `undefined`, `0`, `false`, etc.).
// - If

// limit

//  is truthy, the

// data.slice(0, limit)

//  method is called. This method creates a shallow copy of a portion of the

// data

//  array, starting from index `0` and ending at the index specified by

// limit

//  (not inclusive). Essentially, it limits the number of items in the resulting array to the value of

// limit

// .
// - If

// limit

//  is falsy, the entire

// data

//  array is assigned to

// limitData

//  without any slicing.

