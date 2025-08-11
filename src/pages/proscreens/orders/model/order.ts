// models/order.ts

import { Product } from "../../../../common/interfaces/Product";
import { Service } from "../../../../common/interfaces/Service";
import { Shop } from "../../../../common/interfaces/Shop";
import { User } from "../../../../common/interfaces/user";
import { Client } from "../../customers/models/client";

export enum OrderStatus {
  ALL_ORDERS = "allorders",
  PENDING = "pending",
  PAID = "paid",
  COMPLETED = "completed",
}

export interface OrderItem {
  type: string;
  id?: number;
  name?: string;
  price?: string;
  amount?: number;
}

export interface Order {
  orderChannel: string;
  totalAmount: number;
  id: string;
  userId: string;
  shopId: string;
  clientId?: string;
  items?: OrderItem[];
  deliveryMethod: string;
  deliveryDate?: Date;
  paymentMethod: string;
  notes?: string;
  invoiceOption: string;
  user?: User;
  client?: Client;
  status: OrderStatus;
  products?: Product[];
  customItems?: any[];
  services?: Service[];
  createdAt: Date;
  orderDetails?: string;
  shop: Shop;
  startTime?: Date;
  endTime?: Date;
  quantity?: number;
}

// Helper functions
export const orderStatusFromString = (status: string): OrderStatus => {
  switch (status.toLowerCase()) {
    case "all orders":
    case "allorders":
      return OrderStatus.ALL_ORDERS;
    case "pending":
      return OrderStatus.PENDING;
    case "paid":
      return OrderStatus.PAID;
    case "completed":
      return OrderStatus.COMPLETED;
    case "cancelled": // treat cancelled as completed
      return OrderStatus.COMPLETED;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
};

export const getOrderStatusDisplayTitle = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.ALL_ORDERS:
      return "All Orders";
    case OrderStatus.PENDING:
      return "Pending";
    case OrderStatus.PAID:
      return "Paid";
    case OrderStatus.COMPLETED:
      return "Completed";
  }
};

export const getOrderStatusBackgroundColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.ALL_ORDERS:
      return "bg-gray-100";
    case OrderStatus.PENDING:
      return "bg-amber-100";
    case OrderStatus.PAID:
      return "bg-blue-100";
    case OrderStatus.COMPLETED:
      return "bg-green-100";
  }
};

export const orderStatusToString = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.ALL_ORDERS:
      return "all orders";
    case OrderStatus.PENDING:
      return "pending";
    case OrderStatus.PAID:
      return "paid";
    case OrderStatus.COMPLETED:
      return "completed";
  }
};

// Factory functions
export const orderFromJson = (json: any): Order => {
  return {
    id: json.id,
    userId: json.userId,
    shopId: json.shopId,
    clientId: json.clientId,
    quantity: json.quantity,
    items: json.items?.map((item: any) => ({
      type: item.type,
      id: item.id,
      name: item.name,
      amount: item.amount,
    })),
    deliveryMethod: json.deliveryMethod,
    deliveryDate: json.deliveryDate ? new Date(json.deliveryDate) : undefined,
    paymentMethod: json.paymentMethod,
    notes: json.notes,
    invoiceOption: json.invoiceOption,
    user: json.user,
    products: json.products,
    customItems: json.customItems,
    services: json.services,
    client: json.client,
    createdAt: new Date(json.createdAt),
    orderDetails: json.orderDetails,
    shop: json.shop,
    startTime: json.startTime ? new Date(json.startTime) : undefined,
    endTime: json.endTime ? new Date(json.endTime) : undefined,
    status: orderStatusFromString(json.status),
    totalAmount: json.totalAmount ?? 0,
    orderChannel: json.orderChannel ?? "",
  };
};

export const orderToJson = (order: Order): any => {
  return {
    id: order.id,
    userId: order.userId,
    shopId: order.shopId,
    clientId: order.clientId,
    quantity: order.quantity,
    items: order.items?.map((item) => ({
      type: item.type,
      id: item.id,
      name: item.name,
      amount: item.amount,
    })),
    deliveryMethod: order.deliveryMethod,
    deliveryDate: order.deliveryDate?.toISOString(),
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    invoiceOption: order.invoiceOption,
    user: order.user,
    client: order.client,
    status: orderStatusToString(order.status),
    products: order.products,
    services: order.services,
    createdAt: order.createdAt.toISOString(),
    orderDetails: order.orderDetails,
    shop: order.shop,
    startTime: order.startTime?.toISOString(),
    endTime: order.endTime?.toISOString(),
    totalAmount: order.totalAmount,
    orderChannel: order.orderChannel,
  };
};
