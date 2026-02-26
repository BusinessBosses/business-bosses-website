import React, { useState, useEffect } from "react";

export const dynamic = 'force-dynamic';

import { Product } from "./types/Product";
import CustomEditText from "../../../page-components/proscreens/biz-center/components/customedittext";
import CustomDropdown from "../../../page-components/proscreens/biz-center/components/customdropdown";
import {
  FiChevronUp as ChevronUp,
  FiChevronDown as ChevronDown,
} from "react-icons/fi";
import MultipleEditText from "../../../page-components/proscreens/biz-center/components/multipleedittextfield";

interface CreateProductProps {
  onComplete?: (product: Product) => void;
  editId?: string;
  products?: Product[];
}

const CreateProduct: React.FC<CreateProductProps> = ({
  onComplete,
  editId,
  products = [],
}) => {
  const emptyProduct: Product = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    createdAt: new Date(),
    id: 0,
    itemType: "product",
    isActive: true,
    images: [],
    color: [],
    size: [],
  };

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(true);

  const categories = [
    "Agriculture, Food & Beverage",
    "Books & Education",
    "Construction & Real Estate",
    "Fashion & Beauty",
    "Finance & Legal",
    "Healthcare & Wellness",
    "Home, Gardens & Outdoors",
    "Jewellery & Timepieces",
    "Media & Entertainment",
    "Security, Safety & Equipment",
    "Technology, Games & Electronic",
    "Vehicle & Transportation",
  ];

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
        name === "price" ||
        name === "discount" ||
        name === "quantity" ||
        name === "productNumber"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setProduct((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleMultiInputChange = (name: string, values: string[]) => {
    setProduct((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !product.name ||
      !product.description ||
      product.price <= 0 ||
      !product.category ||
      (product.quantity ?? 0) <= 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // In a real app, you would handle the API call here
    setTimeout(() => {
      if (onComplete) {
        onComplete(product);
      }
      setIsSubmitting(false);

      // Reset form if not editing
      if (!isEditing) {
        setProduct(emptyProduct);
      }
    }, 1000);
  };

  const toggleAdditionalInfo = () => {
    setIsAdditionalInfoOpen(!isAdditionalInfoOpen);
  };

  const [values, setValues] = useState<string[]>([]);

  const handleValuesChanged = (newValues: string[]) => {
    setValues(newValues);
    console.log("Values changed:", newValues);
  };

  return (
    <div className="min-h-screen">
      <div className=" bg-white rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">
            {isEditing ? "Edit Product" : "Create Product"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Update your product information below."
              : "Fill in the information below to add a new product to your inventory."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Basic Product Information */}
            <div className="space-y-4">
              <CustomEditText
                backgroundColor="bg-backgroundcolor"
                caption="Product Name *"
                hintText="Enter product name"
                value={product.name}
                onChange={(val: string) =>
                  setProduct((prev) => ({ ...prev, name: val }))
                }
                maxLength={30}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CustomEditText
                  isCurrencyField={true}
                  backgroundColor="bg-backgroundcolor"
                  caption="Price *"
                  hintText="Enter price"
                  value={product.price.toString()}
                  onChange={(val: string) =>
                    setProduct((prev) => ({
                      ...prev,
                      price: parseFloat(val) || 0,
                    }))
                  }
                  maxLength={10}
                />

                <CustomEditText
                  backgroundColor="bg-backgroundcolor"
                  caption="Discount (%)"
                  hintText="Enter discount percentage"
                  value={product.discount?.toString() || ""}
                  onChange={(val: string) =>
                    setProduct((prev) => ({
                      ...prev,
                      discount: parseFloat(val) || 0,
                    }))
                  }
                  maxLength={3}
                />
              </div>

              <CustomEditText
                backgroundColor="bg-backgroundcolor"
                caption="Product Description *"
                hintText="Describe your product"
                value={product.description}
                onChange={(val: string) =>
                  setProduct((prev) => ({ ...prev, description: val }))
                }
                maxLength={300}
              />

              <CustomDropdown
                initialValue={product.category}
                caption="Category *"
                hintText="Select a category"
                items={categories}
                onChanged={(newValue) =>
                  setProduct((prev) => ({ ...prev, category: newValue ?? "" }))
                }
                backgroundColor="bg-backgroundcolor"
              />

              {/* <FormField label="Location" required>
                <TextField
                  id="location"
                  name="location"
                  value={product.location || ""}
                  onChange={handleInputChange}
                  placeholder="Enter product location"
                  required
                />
              </FormField> */}

              {/* <ImageUploader
                images={product.images || []}
                onChange={handleImagesChange}
              /> */}

              <CustomEditText
                backgroundColor="bg-backgroundcolor"
                caption="Quantity *"
                hintText="Enter quantity"
                value={(product.quantity ?? 0).toString()}
                onChange={(val: string) =>
                  setProduct((prev) => ({
                    ...prev,
                    quantity: parseInt(val) || 0,
                  }))
                }
                maxLength={10}
              />
            </div>

            {/* Additional Information (Expandable) */}
            <div className="border rounded-lg overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 bg-gray-50 text-left"
                onClick={toggleAdditionalInfo}
              >
                <span className="text-sm font-medium text-gray-900">
                  Additional Information
                  <span className="text-gray-500 text-xs ml-1">(Optional)</span>
                </span>
                {isAdditionalInfoOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {isAdditionalInfoOpen && (
                <div className="px-4 py-5 space-y-4 bg-white">
                  <CustomDropdown
                    initialValue={product.deliveryMethod || ""}
                    caption="Delivery Method"
                    hintText="Select delivery method"
                    items={["Online", "Courier", "In-Store Pickup"]}
                    onChanged={(newValue) =>
                      handleSelectChange("deliveryMethod", newValue ?? "")
                    }
                    backgroundColor="bg-backgroundcolor"
                  />

                  <CustomEditText
                    backgroundColor="bg-backgroundcolor"
                    caption="Delivery Duration (Days)"
                    hintText="Enter delivery duration in days"
                    value={product.deliveryDuration?.toString() || ""}
                    onChange={(val: string) =>
                      setProduct((prev) => ({
                        ...prev,
                        deliveryDuration: val,
                      }))
                    }
                    maxLength={3}
                  />

                  <CustomEditText
                    backgroundColor="bg-backgroundcolor"
                    caption="Storage Location"
                    hintText="Enter storage location"
                    value={product.storageLocation || ""}
                    onChange={(val: string) =>
                      setProduct((prev) => ({
                        ...prev,
                        storageLocation: val,
                      }))
                    }
                    maxLength={30}
                  />

                  <CustomEditText
                    backgroundColor="bg-backgroundcolor"
                    caption="Product Number"
                    hintText="Enter product number"
                    value={product.productNumber?.toString() || ""}
                    onChange={(val: string) =>
                      setProduct((prev) => ({
                        ...prev,
                        productNumber: val,
                      }))
                    }
                    maxLength={30}
                  />

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Product Variations
                    </h3>

                    <div className="mb-4">
                      <MultipleEditText
                        caption="Colors"
                        hintText="Add a color and press Enter"
                        initialValues={product.color || []}
                        onValuesChanged={handleValuesChanged}
                      />
                    </div>

                    <MultipleEditText
                      caption="Sizes"
                      hintText="Add a size and press Enter"
                      initialValues={product.size || []}
                      onValuesChanged={handleValuesChanged}
                    />
                  </div>

                  <CustomEditText
                    backgroundColor="bg-backgroundcolor"
                    caption="Notes"
                    hintText="Add additional notes"
                    value={product.notes || ""}
                    onChange={(val: string) =>
                      setProduct((prev) => ({
                        ...prev,
                        notes: val,
                      }))
                    }
                    maxLength={300}
                  />
                </div>
              )}
            </div>

            {/* Status Toggle */}
            {/* <SwitchToggle
              checked={product.isActive}
              onChange={(checked) => handleSwitchChange("isActive", checked)}
              label="Status"
              description="This listing will show in your inventory and marketplace"
            /> */}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Processing..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>

            {/* Guidelines Notice */}
            <p className="text-xs text-center text-gray-500 mt-4">
              By creating a product, you confirm that you will abide by the
              <button
                type="button"
                className="text-indigo-600 font-medium mx-1 hover:text-indigo-500"
              >
                Marketplace Guidelines
              </button>
              and declare that the listing does not include any prohibited
              items.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
