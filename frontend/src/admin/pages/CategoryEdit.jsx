import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CategoryForm from "../components/Categories/CategoryForm";
import { getCategoryById, updateCategory } from "../../api/categoryApi";

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);

        if (!response.success) {
          throw new Error(response.message || "Category not found");
        }

        setCategory(response.category);
      } catch (error) {
        await Swal.fire({
          title: "Could not load category",
          text:
            error.response?.data?.message ||
            error.message ||
            "Something went wrong.",
          icon: "error",
          confirmButtonColor: "#315C4A",
        });

        navigate("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const slug = formData.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const response = await updateCategory(id, {
        name: formData.name.trim(),
        slug,
        description: formData.description || "",
        isActive: category.isActive,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to update category");
      }

      await Swal.fire({
        title: "Category updated!",
        text: "Your changes have been saved.",
        icon: "success",
        confirmButtonColor: "#315C4A",
      });

      navigate("/admin/categories");
    } catch (error) {
      Swal.fire({
        title: "Could not update category",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#315C4A",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading category...</div>;
  }

  if (!category) return null;

  return (
    <CategoryForm
      initialCategory={category}
      onSubmit={handleSubmit}
      submitLabel={saving ? "Saving..." : "Save Changes"}
    />
  );
};

export default CategoryEdit;
