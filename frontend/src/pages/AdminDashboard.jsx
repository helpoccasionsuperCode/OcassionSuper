import React from "react";
import { Download, Calendar, Shield, DollarSign, Building2, Users } from "lucide-react";
import AdminContent from "../components/AdminContent";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  return (
    <div>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="bg-rose-100 text-rose-700 px-4 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Control Center
            </span>
            <h1 className="text-3xl font-bold mt-4">OccasionSuper Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Comprehensive platform management and analytics
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <Download size={16} />
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-green-600 px-4 py-2 rounded-lg text-white hover:opacity-90">
              {/* <span className="material-icons"></span> */}
              AI Insights
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h2 className="text-2xl font-bold">₹0</h2>
              <p className="text-green-600 text-sm"></p>
            </div>
            <div className="bg-orange-100 text-orange-500 rounded-xl p-3">
              <DollarSign />
            </div>
          </div>

          {/* Active Vendors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Active Vendors</p>
              <h2 className="text-2xl font-bold">0</h2>
              <p className="text-blue-600 text-sm"></p>
            </div>
            <div className="bg-blue-100 text-blue-500 rounded-xl p-3">
              <Building2 />
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h2 className="text-2xl font-bold">0</h2>
              <p className="text-green-600 text-sm"></p>
            </div>
            <div className="bg-orange-100 text-orange-500 rounded-xl p-3">
              <Calendar />
            </div>
          </div>

          {/* Platform Users */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Platform Users</p>
              <h2 className="text-2xl font-bold">0</h2>
              <p className="text-blue-600 text-sm"></p>
            </div>
            <div className="bg-green-100 text-green-500 rounded-xl p-3">
              <Users />
            </div>
          </div>
        </div>
        <AdminContent />
      </div>
      <Footer />
    </div>
  );
}
