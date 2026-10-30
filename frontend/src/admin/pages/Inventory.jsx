import { useEffect, useMemo, useState } from "react";
import InventoryHeader from "../components/Inventory/InventoryHeader";
import InventoryFilters from "../components/Inventory/InventoryFilters";
import InventoryTable from "../components/Inventory/InventoryTable";
import { getInventory } from "../../api/inventoryApi";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInventory();

        setProducts(
          (data || []).map((product) => ({
            ...product,
            id: product._id,
            name: product.name,
            category:
              typeof product.category === "object"
                ? product.category?.name || "Uncategorized"
                : product.category || "Uncategorized",
            stock: Number(product.stock || 0),
            image: product.image || "",
          })),
        );
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setError(err.response?.data?.message || "Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(query);
      const matchesCategory = !category || product.category === category;

      const matchesStock =
        !stockStatus ||
        (stockStatus === "in-stock" && product.stock > 5) ||
        (stockStatus === "low-stock" &&
          product.stock > 0 &&
          product.stock <= 5) ||
        (stockStatus === "out-of-stock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, category, stockStatus]);

  const handleStockUpdate = (id, stock) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, stock } : product,
      ),
    );
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setStockStatus("");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading inventory...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="w-full">
      <InventoryHeader products={products} />

      <InventoryFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
        onReset={handleReset}
      />

      <InventoryTable
        products={filteredProducts}
        onStockUpdate={handleStockUpdate}
      />
    </div>
  );
};

export default Inventory;
