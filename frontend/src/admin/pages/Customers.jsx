import { useEffect, useState } from "react";
import CustomerHeader from "../components/Customers/CustomerHeader";
import CustomerTable from "../components/Customers/CustomerTable";
import CustomerDetails from "../components/Customers/CustomerDetails";
import { getCustomers, getCustomerById } from "../../api/customerApi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCustomers();
        setCustomers(data.customers || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const data = await getCustomerById(customer._id);
      setSelectedCustomer(data.customer);
    } catch (err) {
      setDetailsError(
        err.response?.data?.message || "Failed to load customer details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
    setDetailsError("");
  };

  return (
    <div className="w-full">
      <CustomerHeader customers={customers} />

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Loading customers...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg border border-gray-200 px-4 py-2 text-sm">
            Try again
          </button>
        </div>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            onViewCustomer={handleViewCustomer}
          />

          <CustomerDetails
            customer={selectedCustomer}
            loading={detailsLoading}
            error={detailsError}
            onClose={handleCloseDetails}
          />
        </>
      )}
    </div>
  );
};

export default Customers;
