import api from "./api";

export const getCustomers = async () => {
  const response = await api.get("/admin/customers");
  return response.data;
};

export const getCustomerById = async (customerId) => {
  const response = await api.get(`/admin/customers/${customerId}`);
  return response.data;
};
