import { Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { FiX, FiCalendar, FiChevronDown } from "react-icons/fi";
import { Shop } from "../../../../common/interfaces/Shop";

interface OrderItem {
  id: string;
  type: "product" | "service" | "custom";
  name: string;
  price: string | number;
  images?: string[];
}

interface Order {
  id?: string;
  clientId?: string;
  items?: OrderItem[];
  deliveryMethod?: string;
  deliveryDate?: string;
  paymentMethod?: string;
  notes?: string;
  invoiceOption?: string;
}

interface Client {
  id: string;
  name: string;
  type: string;
}

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



interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  order?: Order;
  shop: Shop;
  clients: Client[];
  products: Product[];
  services: Service[];
  paymentMethods: string[];
  onCreateOrder: (orderData: any) => Promise<boolean>;
  onUpdateOrder: (orderId: string, orderData: any) => Promise<boolean>;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  open,
  onClose,
  order,
  shop,
  clients,
  products,
  services,
  paymentMethods,
  onCreateOrder,
  onUpdateOrder,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [selectedOrderDate, setSelectedOrderDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedOrderChannel, setSelectedOrderChannel] = useState("");
  const [notes, setNotes] = useState("");
  const [invoiceOption, setInvoiceOption] = useState("dont_send");
  const [showClientModal, setShowClientModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [canAddCustom, setCanAddCustom] = useState(true);

  useEffect(() => {
    if (order) {
      setSelectedClient(order.clientId || "");
      setSelectedItems(order.items || []);
      setSelectedDeliveryMethod(order.deliveryMethod || "");
      setSelectedOrderDate(order.deliveryDate || "");
      setSelectedPaymentMethod(order.paymentMethod || "");
      setNotes(order.notes || "");
      setInvoiceOption(order.invoiceOption || "dont_send");
    } else {
      resetForm();
    }
  }, [order, open]);

  const resetForm = () => {
    setSelectedClient("");
    setSelectedItems([]);
    setSelectedDeliveryMethod("");
    setSelectedOrderDate("");
    setSelectedPaymentMethod("");
    setSelectedOrderChannel("");
    setNotes("");
    setInvoiceOption("dont_send");
    setCanAddCustom(true);
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      alert("Please select a valid client");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    if (!selectedDeliveryMethod) {
      alert("Please select a delivery method");
      return;
    }
    if (!selectedOrderDate) {
      alert("Please select an order date");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      clientId: selectedClient,
      items: selectedItems,
      deliveryMethod: selectedDeliveryMethod,
      deliveryDate: selectedOrderDate,
      paymentMethod: selectedPaymentMethod,
      notes,
      invoiceOption,
      orderChannel: selectedOrderChannel,
    };

    try {
      let success;
      if (order?.id) {
        success = await onUpdateOrder(order.id, orderData);
      } else {
        success = await onCreateOrder(orderData);
      }

      if (success) {
        onClose();
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {order ? "Update Order" : "Create New Order"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-4 space-y-4">
              {/* Client Selection */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Customer's Name *
                </label>
                <div
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowClientModal(true)}
                >
                  <span
                    className={
                      selectedClient ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {selectedClient || "Select a customer"}
                  </span>
                  <FiChevronDown className="text-gray-400" />
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select product/service *
                </label>
                <div
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (
                      !canAddCustom &&
                      selectedItems.some((item) => item.type === "custom")
                    ) {
                      alert("Already Added Custom Order!");
                      return;
                    }
                    setShowOrderModal(true);
                  }}
                >
                  <span
                    className={
                      selectedItems.length > 0
                        ? "text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    {selectedItems.length > 0
                      ? `${selectedItems.length} items selected`
                      : "Select items"}
                  </span>
                  <FiChevronDown className="text-gray-400" />
                </div>

                {/* Selected Items List */}
                {selectedItems.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 border rounded-lg"
                      >
                        <div className="flex items-center">
                          {item.images?.[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-10 h-10 rounded-md mr-3"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {shop.currency} {item.price}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Date */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Order Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-3 border rounded-lg"
                    value={selectedOrderDate}
                    onChange={(e) => setSelectedOrderDate(e.target.value)}
                  />
                  <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method *
                </label>
                <select
                  className="w-full p-3 border rounded-lg appearance-none"
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
                <FiChevronDown className="relative -top-8 left-[calc(100%-32px)] text-gray-400 pointer-events-none" />
              </div>

              {/* Delivery Method */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Method *
                </label>
                <select
                  className="w-full p-3 border rounded-lg appearance-none"
                  value={selectedDeliveryMethod}
                  onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                >
                  <option value="">Select delivery method</option>
                  <option value="online">Online</option>
                  <option value="in_person">In-Person</option>
                </select>
                <FiChevronDown className="relative -top-8 left-[calc(100%-32px)] text-gray-400 pointer-events-none" />
              </div>

              {/* Order Channel */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Order Channel
                </label>
                <select
                  className="w-full p-3 border rounded-lg appearance-none"
                  value={selectedOrderChannel}
                  onChange={(e) => setSelectedOrderChannel(e.target.value)}
                >
                  <option value="">Select order channel</option>
                  <option value="online">Online</option>
                  <option value="in_person">In-Person</option>
                </select>
                <FiChevronDown className="relative -top-8 left-[calc(100%-32px)] text-gray-400 pointer-events-none" />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Add order notes here"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={300}
                />
              </div>

              {/* Invoice Options */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Options
                </label>
                <select
                  className="w-full p-3 border rounded-lg"
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
            </div>

            {/* Footer with Submit Button */}
            <div className="sticky bottom-0 bg-white p-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full p-3 rounded-lg text-white ${
                  isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : order
                  ? "Update Order"
                  : "Create Order"}
              </button>
            </div>
          </div>
        </div>

        {/* Client Selection Modal */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Customer</h3>
                <button
                  onClick={() => setShowClientModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedClient === client.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
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
            </div>
          </div>
        )}

        {/* Order Items Selection Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Items</h3>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-2 border rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (item) =>
                              item.id === product.id && item.type === "product"
                          )}
                          onChange={(e) => {
                            const newItems = e.target.checked
                              ? [
                                  ...selectedItems,
                                  { ...product, type: "product" },
                                ]
                              : selectedItems.filter(
                                  (item) =>
                                    !(
                                      item.id === product.id &&
                                      item.type === "product"
                                    )
                                );
                            setSelectedItems(newItems as OrderItem[]);
                          }}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Services</h4>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center p-2 border rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.some(
                            (item) =>
                              item.id === service.id && item.type === "service"
                          )}
                          onChange={(e) => {
                            const newItems = e.target.checked
                              ? [
                                  ...selectedItems,
                                  { ...service, type: "service" },
                                ]
                              : selectedItems.filter(
                                  (item) =>
                                    !(
                                      item.id === service.id &&
                                      item.type === "service"
                                    )
                                );
                            setSelectedItems(newItems as OrderItem[]);
                          }}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            ${service.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {canAddCustom && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Custom Item</h4>
                    <button
                      className="w-full p-3 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
                      onClick={() => {
                        const customItem = {
                          id: `custom-${Date.now()}`,
                          name: "Custom Item",
                          price: "0.00",
                          type: "custom" as const,
                        };
                        setSelectedItems([...selectedItems, customItem]);
                        setCanAddCustom(false);
                      }}
                    >
                      + Add Custom Item
                    </button>
                  </div>
                )}
                <button
                  className="w-full p-3 bg-black text-white rounded-lg"
                  onClick={() => setShowOrderModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateOrderModal;
