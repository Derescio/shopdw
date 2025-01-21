import Link from "next/link";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatId, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from "@/components/shared/pagination";


const AdminProductsPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>
}) => {
    const serachParams = await props.searchParams;
    const page = Number(serachParams.page) || 1;
    const searchText = serachParams.query || '';
    const category = serachParams.category || '';

    const products = await getAllProducts({
        query: searchText,
        page,
        category
    })
    //console.log(products)
    return (
        <div className="space-y-2">
            <div className="flex-between">
                <div className='flex items-center gap-3 gap-x-16'>
                    <h1 className='h2-bold'>Products</h1>
                    {searchText && (
                        <div className="mt-3">
                            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
                            <Link href={`/admin/products`}>
                                <Button variant='outline' size='sm'>
                                    Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <Button asChild variant='default'>
                    <Link href='/admin/products/create'> Add Product</Link>
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead className="text-right">PRICE</TableHead>
                        <TableHead>CATEGORY</TableHead>
                        <TableHead>STOCK</TableHead>
                        <TableHead>RATING</TableHead>
                        <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{formatId(product.id)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell className='flex gap-1'>
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/products/${product.id}`}>Details</Link>
                                </Button>
                                <DeleteDialog id={product.id} action={deleteProduct} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {products.totalPages > 1 && (
                <Pagination totalPages={products.totalPages} page={page} />
            )}
        </div>
    );
}

export default AdminProductsPage 