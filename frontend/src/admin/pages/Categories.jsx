import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CategoryHeader from "../components/Categories/CategoryHeader";
import CategoryFilters from "../components/Categories/CategoryFilters";
import CategoryTable from "../components/Categories/CategoryTable";
import {
  getCategories,
  deleteCategory,
  updateCategory,
} from "../../api/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = [category.name, category.description].some(
        (value) => value?.toLowerCase().includes(search.trim().toLowerCase()),
      );

      const matchesStatus =
        status === "" ||
        (status === "active" && category.isActive) ||
        (status === "inactive" && !category.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, status]);

  const handleDelete = async (id) => {
    try {
      const data = await deleteCategory(id);

      if (!data.success) {
        throw new Error(data.message || "Failed to delete category");
      }

      setCategories((previous) =>
        previous.filter((category) => category._id !== id),
      );

      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete category",
      );
    }
  };

  const handleStatusToggle = async (id) => {
    const category = categories.find((item) => item._id === id);

    if (!category) return;

    try {
      const data = await updateCategory(id, {
        isActive: !category.isActive,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update category status");
      }

      setCategories((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, isActive: data.category.isActive }
            : item,
        ),
      );

      toast.success("Category status updated!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update category status",
      );
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
  };

  if (loading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="w-full">
      <CategoryHeader />

      <CategoryFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onReset={handleReset}
      />

      <CategoryTable
        categories={filteredCategories}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
};

export default Categories;
