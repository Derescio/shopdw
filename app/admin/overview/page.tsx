import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order-actions";
import { formatCurrency, formatDateTime, formatNumberIntl } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, PersonStanding } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'Admin Overview Page',
};




const AdminOverviewPage = async () => {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized Access. Please Go back');
    }
    const summary = await getOrderSummary();
    //console.log(summary)
    console.log('Total Revenue:', summary.totalRevenue);  // $3,354.32
    console.log('Total Profit:', summary.totalProfit);    // $1,009.85
    console.log('Valid Sales:', summary.orderCount);     // 16


    return (<>
        <div className="space-y-2">
            <h1 className="h2-bold">
                Sales Overview Page
            </h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {/* Revenue Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BadgeDollarSign size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(summary.totalRevenue.toString())}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                        <BadgeDollarSign size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(summary.totalProfit.toString())}
                        </div>
                    </CardContent>
                </Card>
                {/* Sales Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CreditCard size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumberIntl(summary.orderCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <PersonStanding size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumberIntl(summary.userCount)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Barcode size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumberIntl(summary.productCount)}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Chart div, 7 colums. 4 columns for first chart and three for the other */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
                        <CardTitle className="text-sm font-medium">Sales Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Charts data={{
                            salesData: summary.salesData,
                        }} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Chart</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        Buyer
                                    </TableHead>
                                    <TableHead>
                                        Date
                                    </TableHead>
                                    <TableHead>
                                        Total
                                    </TableHead>
                                    <TableHead>
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.latestOrders.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{sale.user.name}</TableCell>
                                        <TableCell>{formatDateTime(sale.createdAt).dateTime}</TableCell>
                                        <TableCell>{formatCurrency(sale.totalPrice.toString())}</TableCell>
                                        <TableCell>
                                            <Link href={`/order/${sale.id}`}>
                                                <Button size="sm" variant="link">
                                                    View
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

        </div>

    </>);
}

export default AdminOverviewPage;