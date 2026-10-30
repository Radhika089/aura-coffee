import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CategoryForm from "../components/Categories/CategoryForm";
import { createCategory } from "../../api/categoryApi";

const CategoryAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const slug = formData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const response = await createCategory({
        name: formData.name.trim(),
        slug,
        description: formData.description || "",
        isActive: true,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to create category");
      }

      await Swal.fire({
        title: "Category added!",
        text: "Your category has been created successfully.",
        icon: "success",
        confirmButtonColor: "#315C4A",
      });

      navigate("/admin/categories");
    } catch (error) {
      Swal.fire({
        title: "Could not add category",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#315C4A",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      submitLabel={loading ? "Adding..." : "Add Category"}
    />
  );
};

export default CategoryAdd;
