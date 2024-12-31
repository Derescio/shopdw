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

const ProductList = ({ data, title, totalCount }: ProductListProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsQuery = useSearchParams();

    const currentPage = parseInt(searchParamsQuery.get("page") || "1");
    const pageSize = LATEST_PRODUCTS_LIMIT;

    // const totalPages = Math.ceil(totalCount / pageSize);
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
