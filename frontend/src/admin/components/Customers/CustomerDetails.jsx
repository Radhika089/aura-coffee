import { useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  ShoppingBag,
  MapPin,
  CalendarDays,
  CreditCard,
  Package,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) =>
  `₹${(Number(amount) || 0).toLocaleString("en-IN")}`;

const CustomerDetails = ({
  customer,
  onClose,
  loading = false,
  error = "",
}) => {
  useEffect(() => {
    if (!customer) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [customer, onClose]);

  if (!customer && !loading) return null;

  const orders = customer?.orders || [];

  const initials = (customer?.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <div
        className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Customer Profile
            </p>

            <h2
              id="customer-details-title"
              className="mt-1 text-xl font-semibold text-gray-900">
              {customer?.name || "Customer Details"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <X size={19} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#315C4A]" />
            <p className="mt-4 text-sm text-gray-500">
              Loading customer details...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="p-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Customer content */}
        {!loading && customer && (
          <div className="space-y-6 p-5 sm:p-6">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EEF5F1] text-xl font-semibold text-[#315C4A]">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {customer.name || "Unnamed Customer"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Customer since {formatDate(customer.createdAt)}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[#EEF5F1] px-2.5 py-1 text-xs font-medium text-[#315C4A]">
                  {Number(customer.totalOrders || 0) > 1
                    ? "Returning Customer"
                    : Number(customer.totalOrders || 0) === 1
                      ? "First-time Buyer"
                      : "No Orders Yet"}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 p-4">
                <ShoppingBag size={18} className="text-[#315C4A]" />

                <p className="mt-3 text-xs text-gray-500">Total Orders</p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {customer.totalOrders ??
                    orders.filter((order) => order.orderStatus !== "cancelled")
                      .length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <CreditCard size={18} className="text-[#315C4A]" />

                <p className="mt-3 text-xs text-gray-500">Total Spent</p>

                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(customer.totalSpent)}
                </p>
              </div>
            </div>

            {/* Contact information */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Contact Information
              </h3>

              <div className="space-y-4 rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <Mail size={17} className="mt-0.5 shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="mt-1 break-all text-sm text-gray-700">
                      {customer.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={17} className="mt-0.5 shrink-0 text-gray-400" />

                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {customer.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                      {typeof customer.address === "string"
                        ? customer.address
                        : customer.address
                          ? [
                              customer.address.address,
                              customer.address.city,
                              customer.address.state,
                              customer.address.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : "No address provided"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Order history */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  Order History
                </h3>

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center">
                  <Package size={28} className="mx-auto text-gray-300" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No orders yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    This customer hasn't placed an order.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-xl border border-gray-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="break-all text-sm font-semibold text-gray-800">
                            Order #{String(order._id).slice(-8).toUpperCase()}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <CalendarDays size={13} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                            order.orderStatus === "delivered"
                              ? "bg-green-50 text-green-700"
                              : order.orderStatus === "cancelled"
                                ? "bg-red-50 text-red-600"
                                : order.orderStatus === "shipped"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-amber-50 text-amber-700"
                          }`}>
                          {order.orderStatus || "pending"}
                        </span>
                      </div>

                      {/* Products */}
                      <div className="mt-4 space-y-3">
                        {(order.items || []).map((item, index) => {
                          const product =
                            item.product && typeof item.product === "object"
                              ? item.product
                              : null;

                          return (
                            <div
                              key={item._id || `${order._id}-${index}`}
                              className="flex items-center gap-3">
                              {product?.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name || "Product"}
                                  className="h-11 w-11 rounded-lg border border-gray-100 object-cover"
                                />
                              ) : (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EEF5F1]">
                                  <Package
                                    size={18}
                                    className="text-[#315C4A]"
                                  />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-700">
                                  {product?.name || "Product"}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm text-gray-600">
                                {formatCurrency(
                                  Number(item.price) * Number(item.quantity),
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Payment and total */}
                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-500">
                            Payment:{" "}
                            <span className="font-medium capitalize text-gray-700">
                              {order.paymentMethod || "—"}
                            </span>
                          </p>

                          <p className="text-xs text-gray-500">
                            Payment status:{" "}
                            <span className="font-medium capitalize text-gray-700">
                              {order.paymentStatus || "pending"}
                            </span>
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">Order Total</p>

                          <p className="mt-1 text-base font-semibold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-gray-100 bg-white p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
