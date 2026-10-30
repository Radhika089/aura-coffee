import api from "./api";

export const getInventory = async () => {
  const response = await api.get("/inventory");
  return response.data.inventory;
};

export const updateInventoryStock = async (productId, stock) => {
  const response = await api.patch(`/product/admin/${productId}/stock`, {
    quantity: Number(stock),
  });

  return response.data;
};
