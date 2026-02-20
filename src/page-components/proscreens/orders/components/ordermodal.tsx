import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import { Shop } from "../../../../common/interfaces/Shop";
import ProCustomButton from "../../biz-center/components/procustombutton";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Client } from "../../customers/models/client";
import { Order } from "../model/order";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
}

interface Service {
  id: string;
  name: string;
  price: number;
}

// Local UI type for selected items to avoid mismatches with backend OrderItem
// Allows string ids, optional images, and number|string price for display
// It will be transformed as needed when submitting to backend.
type SelectedItem = {
  id: string;
  name: string;
  price: number | string;
  type: "product" | "service" | "custom" | string;
  images?: string[];
};

interface CreateOrderModalProps {
  order?: Order | undefined;
  onClose: () => void;
  shop: Shop;
  clients: Client[];
  products: Product[];
  services: Service[];
  paymentMethods: string[];
  onCreateOrder: (orderData: any) => Promise<boolean>;
  onUpdateOrder: (orderId: string, orderData: any) => Promise<boolean>;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  order,
  onClose,
  shop,
  clients,
  products,
  services,
  paymentMethods,
  onCreateOrder,
  onUpdateOrder,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<string>("");
  const [selectedOrderDate, setSelectedOrderDate] = useState<Date | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [selectedOrderChannel, setSelectedOrderChannel] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [invoiceOption, setInvoiceOption] = useState<string>("dont_send");
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showItemsModal, setShowItemsModal] = useState<boolean>(false);
  const [canAddCustom, setCanAddCustom] = useState<boolean>(true);

  useEffect(() => {
    if (order) {
      setSelectedClient(order.clientId || "");
      setSelectedItems(
        (order.items || []).map((i) => ({
          id: String(i.id ?? ""),
          name: i.name ?? "Item",
          price: i.price ?? 0,
          type: i.type,
        }))
      );
      setSelectedDeliveryMethod(order.deliveryMethod || "");
      setSelectedOrderDate(
        order.deliveryDate ? new Date(order.deliveryDate) : null
      );
      setSelectedPaymentMethod(order.paymentMethod || "");
      setSelectedOrderChannel(order.orderChannel || "");
      setNotes(order.notes || "");
      setInvoiceOption(order.invoiceOption || "dont_send");
    } else {
      resetForm();
    }
  }, [order]);

  const resetForm = () => {
    setSelectedClient("");
    setSelectedItems([]);
    setSelectedDeliveryMethod("");
    setSelectedOrderDate(null);
    setSelectedPaymentMethod("");
    setSelectedOrderChannel("");
    setNotes("");
    setInvoiceOption("dont_send");
    setCanAddCustom(true);
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      toast.error("Please select a valid customer", { autoClose: 3000 });
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item", { autoClose: 3000 });
      return;
    }
    if (!selectedDeliveryMethod) {
      toast.error("Please select a delivery method", { autoClose: 3000 });
      return;
    }
    if (!selectedOrderDate) {
      toast.error("Please select an order date", { autoClose: 3000 });
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method", { autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      clientId: selectedClient,
      items: selectedItems,
      deliveryMethod: selectedDeliveryMethod,
      deliveryDate: selectedOrderDate.toISOString().split("T")[0],
      paymentMethod: selectedPaymentMethod,
      orderChannel: selectedOrderChannel,
      notes,
      invoiceOption,
    };

    try {
      let success;
      if (order?.id) {
        success = await onUpdateOrder(order.id, orderData);
      } else {
        success = await onCreateOrder(orderData);
      }

      if (success) {
        toast.success(
          order ? "Order updated successfully!" : "Order created successfully!",
          { autoClose: 3000 }
        );
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error(order ? "Error updating order" : "Error creating order", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
    // If we're removing a custom item, allow adding a new one
    if (selectedItems.find((item) => item.id === itemId)?.type === "custom") {
      setCanAddCustom(true);
    }
  };

  const getSelectedClientName = () => {
    const client = clients.find((c) => c.id === selectedClient);
    return client ? client.name : "Select a customer";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {order ? "Update Order" : "Create New Order"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {order
                ? "Update the order details"
                : "Fill in the details below to create a new order"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Selection */}
          <div>
            {/* <CustomTextWidget
              caption={"Customer's Name *"}
              iconName={""}
              backgroundColor="bg-backgroundcolor"
              onButtonClick={() => setShowClientModal(true)}
            /> */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer's Name *
            </label>
            <div
              onClick={() => setShowClientModal(true)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center cursor-pointer"
            >
              <span
                className={selectedClient ? "text-gray-900" : "text-gray-400"}
              >
                {getSelectedClientName()}
              </span>
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          {/* Product/Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product/Service *
            </label>
            <div
              onClick={() => setShowItemsModal(true)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center cursor-pointer"
            >
              <span
                className={
                  selectedItems.length > 0 ? "text-gray-900" : "text-gray-400"
                }
              >
                {selectedItems.length > 0
                  ? `${selectedItems.length} items selected`
                  : "Select items"}
              </span>
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          {/* Selected Items Display */}
          {selectedItems.length > 0 && (
            <div className="mt-2 space-y-2 border p-3 rounded-lg bg-gray-50">
              <div className="font-medium mb-2">Selected Items:</div>
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center">
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-10 h-10 rounded-md mr-3 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {shop.currency}{" "}
                        {typeof item.price === "number"
                          ? item.price.toFixed(2)
                          : item.price}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Order Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Date *
            </label>
            <DatePicker
              selected={selectedOrderDate}
              onChange={(date: Date | null) => setSelectedOrderDate(date)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select order date"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">Select payment method</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Method *
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDeliveryMethod}
              onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
            >
              <option value="">Select delivery method</option>
              <option value="online">Online</option>
              <option value="in_person">In-Person</option>
            </select>
          </div>

          {/* Order Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Channel
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedOrderChannel}
              onChange={(e) => setSelectedOrderChannel(e.target.value)}
            >
              <option value="">Select order channel</option>
              <option value="online">Online</option>
              <option value="in_person">In-Person</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add order notes here"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={300}
            />
          </div>

          {/* Invoice Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Options
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={invoiceOption}
              onChange={(e) => setInvoiceOption(e.target.value)}
            >
              <option value="dont_send">Don't Send</option>
              <option value="send_with_payment_link">
                Send with Payment Link
              </option>
              <option value="send_without_payment_link">
                Send without Payment Link
              </option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <ProCustomButton
              text="Cancel"
              textColor="text-gray-900"
              color="bg-gray-100 hover:bg-gray-200"
              onPressed={onClose}
            />
            <ProCustomButton
              text={order ? "Update Order" : "Create Order"}
              loading={isSubmitting}
              onPressed={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* Client Selection Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Customer</h3>
                <button
                  onClick={() => setShowClientModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {clients.length > 0 ? (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedClient === client.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => {
                        setSelectedClient(client.id);
                        setShowClientModal(false);
                      }}
                    >
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.type}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No customers found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Items Selection Modal */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Items</h3>
                <button
                  onClick={() => setShowItemsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Products Section */}
              {products.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Products</h4>
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={selectedItems.some(
                            (item) =>
                              item.id === product.id && item.type === "product"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([
                                ...selectedItems,
                                {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  type: "product",
                                  images: product.images,
                                },
                              ]);
                            } else {
                              setSelectedItems(
                                selectedItems.filter(
                                  (item) =>
                                    !(
                                      item.id === product.id &&
                                      item.type === "product"
                                    )
                                )
                              );
                            }
                          }}
                          className="mr-3"
                        />
                        <label
                          htmlFor={`product-${product.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded-md mr-3 object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                {shop.currency} {product.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Section */}
              {services.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Services</h4>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={selectedItems.some(
                            (item) =>
                              item.id === service.id && item.type === "service"
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([
                                ...selectedItems,
                                {
                                  id: service.id,
                                  name: service.name,
                                  price: service.price,
                                  type: "service",
                                },
                              ]);
                            } else {
                              setSelectedItems(
                                selectedItems.filter(
                                  (item) =>
                                    !(
                                      item.id === service.id &&
                                      item.type === "service"
                                    )
                                )
                              );
                            }
                          }}
                          className="mr-3"
                        />
                        <label
                          htmlFor={`service-${service.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            {shop.currency} {service.price.toFixed(2)}
                          </p>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Item Section */}
              {canAddCustom && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">
                    Custom Item
                  </h4>
                  <button
                    className="w-full p-3 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
                    onClick={() => {
                      // Show a prompt to get custom item details
                      const name = prompt(
                        "Enter custom item name:",
                        "Custom Item"
                      );
                      if (name) {
                        const price = prompt("Enter price:", "0.00");
                        const customItem = {
                          id: `custom-${Date.now()}`,
                          name: name,
                          price: price || "0.00",
                          type: "custom" as const,
                        };
                        setSelectedItems([...selectedItems, customItem]);
                        setCanAddCustom(false);
                      }
                    }}
                  >
                    + Add Custom Item
                  </button>
                </div>
              )}

              <ProCustomButton
                text="Done"
                onPressed={() => setShowItemsModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrderModal;
