import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import axiosInstance from "../../services/axiosConfig";
import toast from "react-hot-toast";

interface BookOrder {
  _id: string;
  orderNo: string;
  userId: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: any[];
  grandTotal: number;
  deliveryStatus: string;
  shippingAddress: {
    flatNo: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: string;
}

export default function BookOrderList() {
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get("/ebooks/orders/all");
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch book orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { data } = await axiosInstance.put(`/ebooks/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        toast.success("Delivery status updated!");
        fetchOrders(); // refresh
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div>
      <PageMeta title="Book Orders | Happy Life" description="Manage physical book orders" />
      <PageBreadcrumb pageTitle="Book Orders" />
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">Recent Orders</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Order No</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Shipping Address</th>
                  <th className="px-4 py-3 font-medium">Total Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{order.orderNo}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{order.userId?.fullName}</div>
                      <div className="text-xs text-gray-500">{order.userId?.email}</div>
                      <div className="text-xs text-gray-500">{order.shippingAddress?.phone || order.userId?.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-700 dark:text-gray-300 max-w-xs whitespace-normal">
                        {order.shippingAddress ? (
                          <>
                            {order.shippingAddress.flatNo && `${order.shippingAddress.flatNo}, `}
                            {order.shippingAddress.street && `${order.shippingAddress.street}, `}
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                          </>
                        ) : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-500">₹{typeof order.grandTotal === 'object' ? (order.grandTotal as any).$numberDecimal : order.grandTotal}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${order.deliveryStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                          order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {order.deliveryStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={order.deliveryStatus || 'pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-2 py-1 border rounded text-xs dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="text-center text-gray-500 mt-4">No book orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
