import { FiPackage } from "react-icons/fi";
import { Order, OrderStatus } from "../model/order";
import OptionsButton from "../../tasks/components/optionsbutton";


interface OrderWidgetProps {
  order: Order;
  status: OrderStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const OrderWidget = ({
  order,
  status,
  onEdit,
  onDelete,
  onView,
}: OrderWidgetProps) => {
  return (
    <div
      className={`p-3 rounded-lg border border-l-4 my-3 ${
        status === "pending"
          ? "border-amber-500"
          : status === "paid"
          ? "border-blue-500"
          : status === "completed"
          ? "border-green-500"
          : "border-gray-300"
      } bg-white`}
    >
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between w-full items-center">
            <div className="bg-gray-100 w-fit px-2 py-1 rounded-md flex items-center">
              <FiPackage className="h-4 w-4" />
              <h4 className="font-medium text-sm pl-2 text-gray-900">
                {order.client?.name || "Unassigned Client"}
              </h4>
            </div>
            <OptionsButton
              item={order}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-sm text-gray-500">
          <span className="font-bold">Order ID:</span> #{order.id.slice(0, 8)}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-bold">Total:</span> $
          {order.totalAmount?.toLocaleString() || "0"}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-bold">Items:</span> {order.items?.length || 0}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-bold">Delivery:</span>{" "}
          {order.deliveryMethod === "online" ? "Online" : "In-Person"}
        </p>
        {order.notes && (
          <p className="text-sm text-gray-500">
            <span className="font-bold">Notes:</span> {order.notes}
          </p>
        )}
      </div>

      <div className="mt-3 flex justify-between items-end">
        <span className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
        {/* <OrderStatusChanger order={order} /> */}
      </div>
    </div>
  );
};

export default OrderWidget;
