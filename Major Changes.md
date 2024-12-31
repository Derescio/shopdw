# Added new feature to the shopdw

Pagination - Added pagination to the shopdw by updating some files/components

## The first change is in the product.actions.ts file. This change allowed for the pagination to work

### shopdw_version_1\shopdw\lib\actions\product.actions.ts

### Original code

export const getLatestProducts = async () => {
    // const prisma = new PrismaClient();
    const products = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return prismaToJSObject(products);
}

### odified code

export const getLatestProducts = async () => {
    const totalCount = await prisma.product.count(); // Total number of products
    const products = await prisma.product.findMany({

        orderBy: {
            createdAt: "desc",
        },
    });

    return {
        products: prismaToJSObject(products),
        totalCount,
    };
};

The next change is to the product-list.component.ts file. This change allowed for the pagination to work.

## Orriginal code

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

### Modified code

'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import ProductCard from "./product-card";
import { Product } from "@/types";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constatnts";

interface ProductListProps {
    data: Product[];
    title?: string;
    limit?: number;
    searchParams: { q: string };
    totalCount: number;
}

const ProductList = ({ data, title, limit, searchParams, totalCount }: ProductListProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsQuery = useSearchParams();

    const currentPage = parseInt(searchParamsQuery.get("page") || "1");
    const pageSize = LATEST_PRODUCTS_LIMIT;

    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        const newSearchParams = new URLSearchParams(searchParamsQuery.toString());
        newSearchParams.set("page", String(page));
        router.push(`${pathname}?${newSearchParams.toString()}`);
    };

    return (
        <div className="my-10">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>

            {paginatedData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedData.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p>No products found.</p>
            )}

            <PaginationWithLinks
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ProductList;

The next change is to the homepage in the root.

## Original code

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

### Modified code

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

All theses changes in conjunction with the component called pagination-with-links.tsx, which is used to display the pagination links, allowed for the pagination to work.

export function PaginationWithLinks({
    currentPage,
    totalCount,
    pageSize,
    onPageChange,
}: {
    currentPage: number;
    totalCount: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}) {
    const totalPages = Math.ceil(totalCount / pageSize);

    const renderPageNumbers = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-4 py-2 ${currentPage === i ? "rounded-md bg-orange-400 text-white" : "rounded-md bg-gray-300"}`}
                >
                    {i}
                </button>
            );
        }
        return items;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-md px-4 py-2 bg-gray-300 disabled:opacity-50"
            >
                Previous
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-md px-4 py-2 bg-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
