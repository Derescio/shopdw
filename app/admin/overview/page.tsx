import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderSummary } from "@/lib/actions/order-actions";
import { formatCurrency, formatDateTime, formatNumberIntl } from "@/lib/utils";
import { BadgeDollarSign, Barcode, CreditCard, PersonStanding } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { MonthlySalesChart } from "@/components/admin/charts/monthly-sales";
import { ProfitBreakdownChart } from "@/components/admin/charts/profit-breakdown";
import { ProductProfitChart } from "@/components/admin/charts/product-profits";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/admin/charts/error-boundary";
import { ChartLoading } from "@/components/admin/charts/chart-loading";
import { RevenueTrendChart } from "@/components/admin/charts/revenue-trend";

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

    const revenueTrendData = summary.salesData.map(monthData => ({
        name: monthData.month,
        value: monthData.totalSales,
        users: summary.userCount, // Total users (modify if you have per-month user data)
        sales: summary.orderCount // Total sales (modify if you have per-month sales count)
    }));

    const profitData = [
        { name: 'Revenue', value: summary.result.totalRevenue },
        { name: 'Costs', value: summary.result.totalCost },
        { name: 'Profit', value: summary.result.profit },
    ];


    return (<>
        <div className="space-y-6">
            <h1 className="h2-bold">
                Sales Overview Page
            </h1>
            {/* Header Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {/* Revenue Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <BadgeDollarSign size={24} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(summary.totalSales.toString())}
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
                            {formatCurrency(summary.result.profit.toString())}
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

            {/* Chart div, 3 colums. 4 columns for first chart and three for the other */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {/* Monthly Sales Trend */}
                <Card className="p-6 col-span-2 ">
                    <div className="mb-4">
                        <h3 className="font-semibold">Monthly Sales Trend</h3>
                        <p className="text-sm text-muted-foreground">Paid orders only</p>
                    </div>
                    <MonthlySalesChart data={summary.salesData} />
                </Card>

                {/* Profit Composition */}
                <Card className="p-6 col-span-1 md:col-span-1 lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="font-semibold">Profit Composition</h3>
                        <p className="text-sm text-muted-foreground">Revenue vs Costs</p>
                    </div>
                    <ErrorBoundary fallback={<div className="text-destructive p-4">Failed to load profit breakdown data</div>}>
                        <Suspense fallback={<ChartLoading />}>
                            <ProfitBreakdownChart data={profitData} />
                        </Suspense>
                    </ErrorBoundary>
                </Card>

                {/* Product Performance */}
                <Card className="p-6 col-span-2 md:col-span-2 lg:col-span-4 xl:col-span-5">
                    <div className="mb-4">
                        <h3 className="font-semibold">Product Performance</h3>
                        <p className="text-sm text-muted-foreground">Top selling items</p>
                    </div>
                    <ErrorBoundary>
                        <Suspense fallback={<ChartLoading />}>
                            <ProductProfitChart data={summary.skuProfits} />
                        </Suspense>
                    </ErrorBoundary>
                </Card>
            </div>

            <RevenueTrendChart data={revenueTrendData} />
            {/* <Card className="col-span-3">
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
            </Card> */}

        </div>
    </>);
}

export default AdminOverviewPage;