// Import corresponding interfaces for User and Shop

import { Shop } from "../../../../../../common/interfaces/Shop";
import { User } from "../../../../../../common/interfaces/user";

export interface Product {
  images?: string[];
  id: number;
  user?: User;
  shop?: Shop;
  name: string;
  price: number;
  discount?: number;
  description: string;
  category: string;
  location?: string;
  notes?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  url?: string;
  deliveryDuration?: string;
  itemType: string;
  isActive: boolean;
  storageLocation?: string;
  productNumber?: string;
  quantity?: number;
  startAt?: Date;
  endAt?: Date;
  color?: string[];
  size?: string[];
  createdAt: Date;
}

export class ProductModel implements Product {
  images?: string[];
  id: number;
  user?: User;
  shop?: Shop;
  name: string;
  price: number;
  discount: number = 0;
  description: string;
  category: string;
  location?: string;
  notes?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  url?: string;
  deliveryDuration?: string;
  itemType: string;
  isActive: boolean;
  storageLocation?: string;
  productNumber?: string;
  quantity: number = 0;
  startAt?: Date;
  endAt?: Date;
  color?: string[];
  size?: string[];
  createdAt: Date;

  constructor(params: Product) {
    this.images = params.images;
    this.id = params.id;
    this.user = params.user;
    this.shop = params.shop;
    this.name = params.name;
    this.price = params.price;
    this.discount = params.discount ?? 0;
    this.notes = params.notes;
    this.description = params.description;
    this.category = params.category;
    this.location = params.location ?? 'Nigeria';
    this.paymentMethod = params.paymentMethod;
    this.deliveryMethod = params.deliveryMethod;
    this.url = params.url;
    this.deliveryDuration = params.deliveryDuration;
    this.itemType = params.itemType;
    this.isActive = params.isActive;
    this.storageLocation = params.storageLocation;
    this.productNumber = params.productNumber;
    this.quantity = params.quantity ?? 0;
    this.startAt = params.startAt;
    this.endAt = params.endAt;
    this.color = params.color;
    this.size = params.size;
    this.createdAt = params.createdAt;
  }

  static fromJson(json: any): ProductModel {
    return new ProductModel({
      images: json.images ? json.images as string[] : undefined,
      id: json.id,
      user: json.user ? json.user : undefined,
      shop: json.shop ? json.shop : undefined,
      name: json.name,
      price: parseFloat(json.price.toString()),
      discount: json.discount ? parseFloat(json.discount.toString()) : 0,
      description: json.description,
      notes: json.notes,
      category: json.category,
      location: json.location ?? 'Nigeria',
      paymentMethod: json.paymentMethod,
      deliveryMethod: json.deliveryMethod,
      url: json.url,
      deliveryDuration: json.deliveryDuration,
      itemType: json.itemType,
      isActive: json.isActive,
      storageLocation: json.storageLocation,
      productNumber: json.productNumber?.toString(),
      quantity: json.quantity ? parseInt(json.quantity.toString()) : 0,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      color: json.color ? json.color as string[] : undefined,
      size: json.size ? json.size as string[] : undefined,
      createdAt: new Date(json.createdAt)
    });
  }

  toJson(): Record<string, any> {
    return {
      images: this.images,
      id: this.id,
      user: this.user,
      shop: this.shop,
      name: this.name,
      price: this.price,
      notes: this.notes,
      discount: this.discount,
      description: this.description,
      category: this.category,
      location: this.location,
      paymentMethod: this.paymentMethod,
      deliveryMethod: this.deliveryMethod,
      url: this.url,
      deliveryDuration: this.deliveryDuration,
      itemType: this.itemType,
      isActive: this.isActive,
      storageLocation: this.storageLocation,
      productNumber: this.productNumber,
      quantity: this.quantity ?? 0,
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
      color: this.color,
      size: this.size,
      // Note: createdAt is not included in the original toJson implementation
    };
  }

  toString(): string {
    return `
Product {
  id: ${this.id},
  name: ${this.name},
  price: ${this.price},
  discount: ${this.discount},
  description: ${this.description},
  category: ${this.category},
  notes: ${this.notes},
  location: ${this.location},
  paymentMethod: ${this.paymentMethod},
  deliveryMethod: ${this.deliveryMethod},
  url: ${this.url},
  deliveryDuration: ${this.deliveryDuration},
  itemType: ${this.itemType},
  isActive: ${this.isActive},
  user: ${this.user},
  shop: ${this.shop},
  storageLocation: ${this.storageLocation},
  productNumber: ${this.productNumber},
  quantity: ${this.quantity},
  color: ${this.color},
  size: ${this.size},
  startAt: ${this.startAt?.toISOString()},
  endAt: ${this.endAt?.toISOString()},
  images: ${this.images}
}`;
  }
}