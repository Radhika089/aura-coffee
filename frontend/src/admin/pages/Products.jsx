import { useEffect, useState } from "react";
import ProductFilters from "../components/Products/ProductFilters";
import ProductHeader from "../components/Products/ProductHeader";
import ProductTable from "../components/Products/ProductTable";
import { getProducts, updateProductStatus } from "../../api/productApi";
import toast from "react-hot-toast";

const Products = () => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [stockSort, setStockSort] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await getProducts();

        if (!data.success) {
          toast.error(data.message || "Failed to fetch products");
          return;
        }

        setProducts(data.products);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStatusToggle = async (id) => {
    const product = products.find((item) => item._id === id);

    if (!product) return;

    try {
      const data = await updateProductStatus(id, !product.isActive);

      if (!data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item._id === id ? { ...item, isActive: data.product.isActive } : item,
        ),
      );

      toast.success("Product status updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status",
      );
    }
  };

  const handleDelete = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== id),
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" ||
      product.category?.name?.toLowerCase() === category.toLowerCase();

    const matchesStatus =
      status === "" ||
      (status === "active" && product.isActive === true) ||
      (status === "inactive" && product.isActive === false);

    return matchSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (priceSort === "low-high") {
      return Number(a.price) - Number(b.price);
    }

    if (priceSort === "high-low") {
      return Number(b.price) - Number(a.price);
    }

    if (stockSort === "low-high") {
      return Number(a.stock) - Number(b.stock);
    }

    if (stockSort === "high-low") {
      return Number(b.stock) - Number(a.stock);
    }

    return 0;
  });

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div>
      <ProductHeader />

      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        stockSort={stockSort}
        setStockSort={setStockSort}
      />

      <ProductTable
        products={sortedProducts}
        onStatusToggle={handleStatusToggle}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Products;
