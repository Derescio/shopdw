import { Metadata } from "next";
import { getOrder } from "@/lib/actions/order-actions";
import { formatDateTime, formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import Pagination from '@/components/shared/pagination';



export const metadata: Metadata = {
    title: 'Orders',
    description: 'Orders Page',
}


const OrdersPage = async (props: {
    searchParams: Promise<{ page: string }>
}) => {
    const { page } = await props.searchParams;
    const orders = await getOrder({ page: Number(page) || 1 });
    // console.log(orders)


    return (<>
        <div className="space-y-2">
            <h2 className="h2-bold">Orders</h2>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{formatId(order.id)}</TableCell>
                                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                <TableCell>{order.isPaid ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{order.isDelivered ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Link href={`/order/${order.id}`} className="btn btn-primary">View</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {
                    orders.totalPages > 1 && (
                        <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
                    )
                }
            </div>
        </div>
    </>);
}

export default OrdersPage;