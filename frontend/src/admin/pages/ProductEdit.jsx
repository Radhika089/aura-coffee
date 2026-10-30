import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductForm from "../components/Products/ProductForm";
import { getSingleProduct } from "../../api/productApi";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(id);
        setProduct(data.product);
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-[#315C4A]">
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Edit Product
        </h1>

        <p className="mt-1.5 text-sm text-gray-500">
          Update your product information.
        </p>
      </div>

      {product && <ProductForm mode="edit" product={product} />}
    </div>
  );
};

export default ProductEdit;
