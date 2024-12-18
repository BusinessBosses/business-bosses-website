import { User } from "./user";

export interface Shop {
    id: string; // maps to id
    userId: string; // maps to userId
    category?: string; // no equivalent field in the Dart class
    location: string; // maps to location
    description: string; // maps to description
    images?: string[]; // maps to image (can be expanded to an array if needed)
    price?: string; // no equivalent field in the Dart class
    user?: User; // no equivalent field in the Dart class
    promote: boolean; // maps to promote
    timestamp?: number; // maps to timestamp (DateTime converted to a timestamp)
    likes?: string[]; // no equivalent field in the Dart class
    coins?: string[]; // no equivalent field in the Dart class
    views: number; // maps to views
    discount?: string; // no equivalent field in the Dart class
    isProduct: boolean; // inferred from the use case; no explicit mapping
    name?: string; // maps to name
    email?: string; // maps to email
    phone?: string; // maps to phone
    payments?: string[]; // maps to payments (assumes List<dynamic> can be narrowed down to string[])
    promotionDuration?: number; // maps to promotionDuration
    approved?: boolean; // maps to approved
    plan?: string; // maps to plan
    facebook?: string; // maps to facebook
    twitter?: string; // maps to twitter
    linkedin?: string; // maps to linkedin
    instagram?: string; // maps to instagram
    url?: string; // maps to url
    createdAt?: number; // maps to createdAt (DateTime converted to a timestamp)
    currency?: string; // maps to currency
    appId?: string; // maps to appId
}
