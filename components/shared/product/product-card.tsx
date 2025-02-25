import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../../ui/card";
import ProductPrice from "./product-price";
// import ShareButtons from "../sharebuttons/share-buttons";
import { Product } from "../../../types";
import Rating from './rating';

const ProductCard = ({ product }: { product: Product }) => {
    return (<Card className="w-full max-w-sm">

        <CardHeader className="p-0 items-center">
            <Link href={`/product/${product.slug}`}>
                <Image src={product.images[0]} alt={product.name} width={300} height={300} priority={true} />
            </Link>
        </CardHeader>

        <CardContent className="p-4">
            <div className="text-xs bold mb-2">{product.brand}</div>
            <Link href={`/product/${product.slug}`}>
                <h6 className="text-sm font-bold">{product.name}</h6>
            </Link>
            <div className="flex flex-between gap-4">
                <p className="text-gray-500">{product.category}</p>
                {product.stock > 0 ? <ProductPrice value={Number(product.price)} /> : <p className="text-red-500">Out of Stock</p>}
            </div>
            <Rating value={Number(product.rating)} />
        </CardContent>
        {/* <ShareButtons product={product} /> */}
    </Card>);
}

export default ProductCard;

//Component Description:
//This component is used to display a list of products, it takes a data array as a prop and displays the products in a grid layout.
// It is used in the ProductList component.
//This component is a reusable component that displays a product card.
// It takes a product object as a prop and displays the product image, name, brand, category, price, and stock status.