import React, { useContext, useState, useEffect } from "react";
import { Product } from "../../types/Product";
import { FiCalendar } from "react-icons/fi";

interface CreateProductProps {
  onComplete?: () => void;
  editId?: string;
}

const CreateProduct: React.FC<CreateProductProps> = ({
  onComplete,
  editId,
}) => {
  const emptyProduct: Product = {
    name: "",
    description: "",
    price: 0,

    quantity: 0,
    category: "",

    createdAt: new Date(),
    id: 0,
    itemType: "",
    isActive: false,
  };

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [isEditing, setIsEditing] = useState(false);

  // You need to provide the products array, either via props, context, or import.
  // For example, if products is passed as a prop, add it to CreateProductProps and use it here.
  // Here is an example using a placeholder empty array:
  const products: Product[] = []; // TODO: Replace with actual products source

  useEffect(() => {
    if (editId) {
      const existingProduct = products.find((p) => p.id === Number(editId));
      if (existingProduct) {
        setProduct(existingProduct);
        setIsEditing(true);
      }
    }
  }, [editId, products]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "comparePrice" || name === "quantity"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  return (
    <form onSubmit={() => {}} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            {product.images ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="max-h-28 max-w-full p-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProduct({ ...product, images: [] });
                  }}
                  className="absolute top-1 right-1 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <FiCalendar className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiCalendar className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or GIF (max. 2MB)
                </p>
              </div>
            )}
          </label>
        </div>
        <input
          type="text"
          name="imageUrl"
          value={product.images}
          onChange={handleInputChange}
          placeholder="Or paste image URL here"
          className="mt-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
        />
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={product.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={product.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              required
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="comparePrice"
            className="block text-sm font-medium text-gray-700"
          >
            Compare at Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="comparePrice"
              id="comparePrice"
              min="0"
              step="0.01"
              value={""}
              onChange={handleInputChange}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            required
            min="0"
            value={product.quantity}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={product.category}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;
