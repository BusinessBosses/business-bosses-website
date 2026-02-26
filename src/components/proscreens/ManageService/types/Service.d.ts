import { Shop } from "../../../../../../common/interfaces/Shop";
import { User } from "../../../../../../common/interfaces/user";

export class Service {
  images?: string[];
  id: number;
  user?: User;
  shop?: Shop;
  name: string;
  price: number;
  discount: number;
  description: string;
  notes?: string;
  category?: string;
  location: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  url?: string;
  itemType: string;
  isActive: boolean;
  deliveryTime?: string;
  availableTime?: Date;
  serviceType?: string;
  participants?: string;
  repeat?: string;
  createdAt: Date;
  availability?: Record<string, any>;
  packages: any[];
  selectedDates: any[];
  serviceDuration?: number;
  isAppointment?: boolean;

  constructor({
    images,
    id,
    user,
    shop,
    name,
    price,
    discount = 0,
    description,
    category,
    location,
    paymentMethod,
    deliveryMethod,
    participants,
    repeat,
    url,
    notes,
    itemType,
    isActive,
    deliveryTime,
    availableTime,
    serviceType,
    createdAt,
    availability,
    packages = [],
    selectedDates = [],
    serviceDuration,
    isAppointment = false,
  }: {
    images?: string[];
    id: number;
    user?: User;
    shop?: Shop;
    name: string;
    price: number;
    discount?: number;
    description: string;
    category?: string;
    location: string;
    paymentMethod?: string;
    deliveryMethod?: string;
    participants?: string;
    repeat?: string;
    url?: string;
    notes?: string;
    itemType: string;
    isActive: boolean;
    deliveryTime?: string;
    availableTime?: Date;
    serviceType?: string;
    createdAt: Date;
    availability?: Record<string, any>;
    packages?: any[];
    selectedDates?: any[];
    serviceDuration?: number;
    isAppointment?: boolean;
  }) {
    this.images = images;
    this.id = id;
    this.user = user;
    this.shop = shop;
    this.name = name;
    this.price = price;
    this.discount = discount;
    this.description = description;
    this.category = category;
    this.location = location;
    this.paymentMethod = paymentMethod;
    this.deliveryMethod = deliveryMethod;
    this.url = url;
    this.participants = participants;
    this.repeat = repeat;
    this.itemType = itemType;
    this.isActive = isActive;
    this.deliveryTime = deliveryTime;
    this.availableTime = availableTime;
    this.serviceType = serviceType;
    this.createdAt = createdAt;
    this.availability = availability;
    this.packages = packages;
    this.selectedDates = selectedDates;
    this.notes = notes;
    this.serviceDuration = serviceDuration;
    this.isAppointment = isAppointment;
  }

  static fromJson(json: Record<string, any>): Service {
    return new Service({
      images: json['images'] != null && Array.isArray(json['images'])
        ? json['images'] as string[]
        : [],
      id: json['id'],
      user: json['user'] != null ? json['user'] as User : undefined,
      shop: json['shop'] != null ? json['shop'] as Shop : undefined,
      name: json['name'],
      price: parseFloat(json['price'].toString()),
      discount: json['discount'] == null
        ? 0
        : parseFloat(json['discount'].toString()),
      description: json['description'],
      category: json['category'],
      location: json['location'],
      paymentMethod: json['paymentMethod'],
      deliveryMethod: json['deliveryMethod'],
      url: json['url'],
      participants: json['participants'],
      repeat: json['repeat'],
      itemType: json['itemType'],
      isActive: json['isActive'],
      deliveryTime: json['deliveryTime'],
      serviceType: json['serviceType'],
      createdAt: new Date(json['createdAt']),
      availability: json['availability'] ?? json['serviceAvailability'],
      packages: json['packages'] ?? [],
      selectedDates: json['selectedDates'] ?? [],
      notes: json['notes'],
      serviceDuration: json['serviceDuration'],
      isAppointment: json['isAppointment']
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
      discount: this.discount,
      description: this.description,
      category: this.category,
      location: this.location,
      paymentMethod: this.paymentMethod,
      deliveryMethod: this.deliveryMethod,
      url: this.url,
      itemType: this.itemType,
      isActive: this.isActive,
      deliveryTime: this.deliveryTime,
      serviceType: this.serviceType,
      createdAt: this.createdAt.toISOString(),
      availability: this.availability?.toString(),
      packages: this.packages,
      notes: this.notes,
      participants: this.participants,
      repeat: this.repeat,
      selectedDates: this.selectedDates,
      serviceDuration: this.serviceDuration,
      isAppointment: this.isAppointment,
    };
  }

  toString(): string {
    return `
Service {
  id: ${this.id},
  name: ${this.name},
  price: ${this.price},
  discount: ${this.discount},
  description: ${this.description},
  category: ${this.category},
  location: ${this.location},
  paymentMethod: ${this.paymentMethod},
  deliveryMethod: ${this.deliveryMethod},
  url: ${this.url},
  itemType: ${this.itemType},
  isActive: ${this.isActive},
  user: ${this.user},
  shop: ${this.shop},
  deliveryTime: ${this.deliveryTime},
  serviceType: ${this.serviceType},
  createdAt: ${this.createdAt.toISOString()},
  images: ${this.images}, 
  availability: ${this.availability},
  packages: ${this.packages},
  notes: ${this.notes},
  participants: ${this.participants},
  repeat: ${this.repeat},
  selectedDates: ${this.selectedDates},
  serviceDuration: ${this.serviceDuration}, 
  isAppointment: ${this.isAppointment}
}`;
  }
}