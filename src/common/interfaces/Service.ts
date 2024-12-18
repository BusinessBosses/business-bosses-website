import { Shop } from "./Shop";
import { User } from "./user";

export interface Service {
    images?: string[]; // Optional list of strings
    id: number; // Required integer
    user?: User; // Optional user model
    shop?: Shop; // Optional shop model
    name: string; // Required string
    price: number; // Required double (number in TypeScript)
    discount: number; // Required double
    description: string; // Required string
    notes?: string; // Optional string
    category: string; // Required string
    location: string; // Required string
    paymentMethod?: string; // Optional string
    deliveryMethod?: string; // Optional string
    url?: string; // Optional string
    itemType: string; // Required string
    isActive: boolean; // Required boolean
    deliveryTime?: string; // Optional string
    availableTime?: Date; // Optional Date object
    serviceType?: string; // Optional string
    participants?: string; // Optional string
    repeat?: string; // Optional string
    createdAt: Date; // Required Date object
    availability?: Record<string, any>; // Optional Map with dynamic keys and values
    packages: any[]; // Required list of any type (adjust the type if you know the structure)
    selectedDates: any[]; // Required list of any type (adjust the type if you know the structure)
  }
  