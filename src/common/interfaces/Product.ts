import { Shop } from "./Shop";
import { User } from "./user";

export interface Product {
    images?: string[]; // Optional list of strings
    id: number; // Required integer
    user?: User; // Optional user model
    shop?: Shop; // Optional shop model
    name: string; // Required string
    price: number; // Required double (number in TypeScript)
    discount?: number; // Optional double
    description: string; // Required string
    category: string; // Required string
    location?: string; // Optional string
    notes?: string; // Optional string
    paymentMethod?: string; // Optional string
    deliveryMethod?: string; // Optional string
    url?: string; // Optional string
    deliveryDuration?: string; // Optional string
    itemType: string; // Required string
    isActive: boolean; // Required boolean
    storageLocation?: string; // Optional string
    productNumber?: string; // Optional string
    quantity?: number; // Optional integer
    startAt?: Date; // Optional Date object
    endAt?: Date; // Optional Date object
    color?: string[]; // Optional list of strings
    size?: string[]; // Optional list of strings
    createdAt: Date; // Required Date object
  }
  