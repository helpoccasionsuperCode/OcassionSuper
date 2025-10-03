


import React, { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    FileText,
    Building,
    Users,
    Shield
} from "lucide-react";

const revenueTrend = [
    { month: "Jan", revenue: 450000 },
    { month: "Feb", revenue: 520000 },
    { month: "Mar", revenue: 680000 },
    { month: "Apr", revenue: 750000 },
    { month: "May", revenue: 910000 },
    { month: "Jun", revenue: 940000 },
];

const vendorStatus = [
    { name: "Approved", value: 15, color: "#34D399" },
    { name: "Pending", value: 2, color: "#FBBF24" },
    { name: "Rejected", value: 1, color: "#F87171" },
];

const monthlyRevenue = revenueTrend;

export default function AdminContent() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div className="p-6 bg-gray-50">
            {/* Tabs */}
            <div className="flex w-full justify-between mb-6 overflow-x-auto">
                {["overview", "vendors", "bookings", "revenue", "fraud", "reports"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-15 py-2 rounded-full capitalize ${activeTab === tab
                            ? "bg-orange-300 text-white"
                            : "bg-gray-50 text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="font-bold flex items-center space-x-2 text-lg">
                            <span>📈</span>
                            <span>Revenue Trend</span>
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={revenueTrend}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#F59E0B"
                                    fill="#FEE2E2"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="font-bold flex items-center space-x-2 text-lg">
                            <span>🏢</span>
                            <span>Vendor Status</span>
                        </h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={vendorStatus}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={80}
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {vendorStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Vendors */}
            {activeTab === "vendors" && (
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="font-bold text-lg mb-4">Vendor Management</h2>
                    <div className="space-y-4">
                        {[
                            {
                                name: "Shaadi Planners India",
                                contact: "Anjali Sharma • Delhi",
                                status: "Approved",
                            },
                            {
                                name: "Taste Buds Catering",
                                contact: "Rahul Kapoor • Mumbai",
                                status: "Approved",
                            },
                            {
                                name: "Pixel Perfect Photography",
                                contact: "Priya Singh • Bangalore",
                                status: "Approved",
                            },
                        ].map((vendor, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                            >
                                <div>
                                    <p className="font-semibold">{vendor.name}</p>
                                    <p className="text-gray-500 text-sm">{vendor.contact}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                        {vendor.status}
                                    </span>
                                    <button className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full">
                                        Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bookings */}
            {activeTab === "bookings" && (
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="font-bold text-lg mb-4">Booking Management</h2>
                    <div className="space-y-4">
                        {[
                            {
                                id: "#482bbc1f",
                                date: "12/15/2024",
                                amount: "₹200,000",
                                status: ["Completed", "Partially Paid"],
                            },
                            {
                                id: "#bd2b49a9",
                                date: "10/20/2024",
                                amount: "₹25,000",
                                status: ["Pending", "Unpaid"],
                            },
                        ].map((booking, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                            >
                                <div>
                                    <p className="font-semibold">Booking {booking.id}</p>
                                    <p className="text-gray-500 text-sm">
                                        {booking.date} • {booking.amount}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {booking.status.map((s, i) => (
                                        <span
                                            key={i}
                                            className={`px-3 py-1 rounded-full ${s === "Completed" || s === "Paid"
                                                ? "bg-green-100 text-green-600"
                                                : s === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                    <button className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full">
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Revenue */}
            {activeTab === "revenue" && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h2 className="font-bold text-lg mb-2">Monthly Revenue</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyRevenue}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#F59E0B" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-lg mb-2">Payout Management</h2>
                            <div className="bg-gray-50 p-4 rounded-xl mb-3">
                                <p className="text-gray-500 text-sm">Pending Payouts</p>
                                <p className="text-2xl font-bold text-orange-600">₹2,45,000</p>
                                <p className="text-gray-500 text-sm">
                                    12 vendors awaiting payment
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-gray-500 text-sm">Processed This Month</p>
                                <p className="text-2xl font-bold text-teal-600">₹8,90,000</p>
                                <p className="text-gray-500 text-sm">45 successful payouts</p>
                            </div>
                        </div>
                        <button className="mt-4 bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-xl">
                            $ Process Pending Payouts
                        </button>
                    </div>
                </div>
            )}

            {/* Fraud Detection */}
            {activeTab === "fraud" && (
                <div className="bg-white p-4 rounded-2xl shadow space-y-4">
                    <h2 className="font-bold text-lg mb-2">
                        Fraud Detection & Security
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-red-50 p-4 rounded-xl">
                            <p className="font-semibold text-red-600 flex items-center space-x-2">
                                <XCircle className="text-red-600" /> <span>High Risk</span>
                            </p>
                            <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                                <li>Suspicious payment pattern detected</li>
                                <li>Multiple bookings from same IP</li>
                                <li>Vendor document mismatch</li>
                            </ul>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl">
                            <p className="font-semibold text-yellow-600 flex items-center space-x-2">
                                <AlertTriangle className="text-yellow-600" />
                                <span>Medium Risk</span>
                            </p>
                            <ul className="text-sm text-yellow-600 mt-2 list-disc list-inside">
                                <li>Unusual booking amounts</li>
                                <li>New vendor rapid bookings</li>
                                <li>Payment method changes</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <p className="font-semibold text-green-600 flex items-center space-x-2">
                                <CheckCircle className="text-green-600" /> <span>Low Risk</span>
                            </p>
                            <ul className="text-sm text-green-600 mt-2 list-disc list-inside">
                                <li>Minor verification delays</li>
                                <li>Standard review required</li>
                                <li>Routine security checks</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl">
                        <p className="font-semibold">AI Analysis</p>
                        <p className="text-sm text-orange-700 mt-2">
                            Our AI detected 3 potentially fraudulent patterns in the last 24
                            hours. Recommended actions: Review vendor ID #VEN-2024-0892,
                            investigate booking cluster from IP 192.168.1.xxx, and verify
                            payment source for transaction #TXN-445521.
                        </p>
                    </div>
                </div>
            )}

            {/* Report Cards */}
            {activeTab === "reports" && (
                <div>
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl text-center cursor-pointer hover:shadow-md">
                            <FileText className="mx-auto mb-3 text-orange-400" size={28} />
                            <h3 className="font-semibold text-orange-500">Revenue Report</h3>
                            <p className="text-sm text-gray-500">Monthly breakdown</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl text-center cursor-pointer hover:shadow-md">
                            <Building className="mx-auto mb-3 text-orange-400" size={28} />
                            <h3 className="font-semibold text-orange-500">Vendor Report</h3>
                            <p className="text-sm text-gray-500">Performance metrics</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl text-center cursor-pointer hover:shadow-md">
                            <Users className="mx-auto mb-3 text-orange-400" size={28} />
                            <h3 className="font-semibold text-orange-500">Customer Report</h3>
                            <p className="text-sm text-gray-500">Engagement data</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl text-center cursor-pointer hover:shadow-md">
                            <Shield className="mx-auto mb-3 text-orange-400" size={28} />
                            <h3 className="font-semibold text-orange-500">Security Report</h3>
                            <p className="text-sm text-gray-500">Fraud analysis</p>
                        </div>
                    </div>

                    {/* Custom Report Generator */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Custom Report Generator</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <select className="w-full md:w-1/3 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-300">
                                <option>Report Type</option>
                                <option>Revenue</option>
                                <option>Vendors</option>
                                <option>Customers</option>
                                <option>Security</option>
                            </select>
                            <select className="w-full md:w-1/3 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-300">
                                <option>Time Period</option>
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                                <option>Last Year</option>
                            </select>
                            <button className="w-full md:w-auto bg-orange-300 hover:bg-orange-400 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2">
                                <span>📥</span>
                                <span>Generate Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}