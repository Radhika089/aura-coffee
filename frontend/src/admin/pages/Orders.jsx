import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import OrderHeader from "../components/Orders/OrderHeader";
import OrderFilters from "../components/Orders/OrderFilters";
import OrderTable from "../components/Orders/OrderTable";
import OrderDetails from "../components/Orders/OrderDetails";
import {
  getAllOrders,
  updateOrderStatus as saveOrderStatus,
} from "../../api/orderApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName =
        order.shippingAddress?.name || order.user?.name || "";
      const customerEmail =
        order.shippingAddress?.email || order.user?.email || "";

      const matchesSearch =
        (order._id || "").toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        customerEmail.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (!status || order.orderStatus === status) &&
        (!paymentStatus || order.paymentStatus === paymentStatus)
      );
    });
  }, [orders, search, status, paymentStatus]);

  const handleStatusChange = async (order, nextStatus) => {
    const result = await Swal.fire({
      title: "Update order status?",
      text: `Change order #${order._id.slice(-6).toUpperCase()} to ${nextStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      confirmButtonColor: "#315C4A",
    });

    if (!result.isConfirmed) return;

    try {
      const updatedOrder = await saveOrderStatus(order._id, nextStatus);

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id ? { ...item, ...updatedOrder } : item,
        ),
      );

      setSelectedOrder((current) =>
        current?._id === order._id ? { ...current, ...updatedOrder } : current,
      );

      Swal.fire({
        title: "Updated!",
        text: "Order status saved successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to update order:", err);

      Swal.fire({
        title: "Update failed",
        text: err.response?.data?.message || "Could not update order status.",
        icon: "error",
        confirmButtonColor: "#315C4A",
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4 text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#315C4A] px-4 py-2 text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <OrderHeader orders={orders} />

      <OrderFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        onReset={() => {
          setSearch("");
          setStatus("");
          setPaymentStatus("");
        }}
      />

      <OrderTable orders={filteredOrders} onViewOrder={setSelectedOrder} />

      <OrderDetails
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Orders;
