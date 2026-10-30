import api from "./api";

export const getProducts = async (search = "") => {
  const response = await api.get("/product", { params: { search } });

  return response.data;
};

export const getSingleProduct = async (id) => {
  const response = await api.get(`/product/${id}`);

  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post("/product", formData);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/product/${id}`, formData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/product/${id}`);
  return response.data;
};

export const updateProductStatus = async (id, isActive) => {
  const response = await api.patch(`/product/${id}/status`, {
    isActive,
  });
  return response.data;
};
