// import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export default function OrderSummaryCharts({ salesData, skuProfits, categoryDistribution }) {
//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//             {/* Sales Trends */}
//             <div className="bg-white p-4 rounded-2xl shadow">
//                 <h3 className="text-xl font-semibold mb-2">Sales Trends</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={salesData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* SKU Profitability */}
//             <div className="bg-white p-4 rounded-2xl shadow">
//                 <h3 className="text-xl font-semibold mb-2">SKU Profitability</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={skuProfits}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="productId" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="profit" fill="#82ca9d" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* Order Distribution by Category */}
//             <div className="bg-white p-4 rounded-2xl shadow">
//                 <h3 className="text-xl font-semibold mb-2">Order Distribution</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                         <Pie data={categoryDistribution} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={100} label>
//                             {categoryDistribution.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// }