// models/client.ts
export enum ClientType {
  ALL_CLIENTS = 'allclients',
  ONLINE = 'online',
  IN_PERSON = 'inPerson',
  // BB_USER = 'bbUser'
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  createdAt: Date;
  image: string[];
  orderCount: number;
  totalAmountSpent: number;
}

// Helper functions for ClientType
export const clientTypeFromString = (type: string): ClientType => {
  switch (type.toLowerCase()) {
    case 'on-line':
      return ClientType.ONLINE;
    case 'in-person':
      return ClientType.IN_PERSON;
    // case 'bb-user':
    //   return ClientType.BB_USER;
    default:
      return ClientType.ONLINE; // default value if the type doesn't match
  }
};

export const getClientTypeDisplayTitle = (type: ClientType): string => {
  switch (type) {
    case ClientType.ALL_CLIENTS:
      return 'All Customers';
    case ClientType.ONLINE:
      return 'Individual';
    case ClientType.IN_PERSON:
      return 'Company';
    // case ClientType.BB_USER:
    //   return 'Bb-User';
  }
};

export const getClientTypeBackgroundColor = (type: ClientType): string => {
  switch (type) {
    case ClientType.ALL_CLIENTS:
      return 'bg-black';
    case ClientType.ONLINE:
      return 'bg-green-500';
    case ClientType.IN_PERSON:
      return 'bg-blue-500';
    // case ClientType.BB_USER:
    //   return 'bg-primary'; // Assuming you have a primary color defined
  }
};

export const clientTypeToApiString = (type: ClientType): string => {
  switch (type) {
    case ClientType.ONLINE:
      return 'on-line';
    case ClientType.IN_PERSON:
      return 'in-person';
    // case ClientType.BB_USER:
    //   return 'bb-user';
    default:
      return 'on-line';
  }
};

// Factory functions
export const clientFromJson = (json: string): Client => {
  const data = JSON.parse(json);
  return clientFromMap(data);
};

export const clientToJson = (client: Client): string => {
  return JSON.stringify(clientToMap(client));
};

export const clientFromMap = (data: any): Client => {
  return {
    id: data.id,
    userId: data.userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: clientTypeFromString(data.type),
    createdAt: new Date(data.createdAt),
    image: Array.isArray(data.image) ? data.image : [],
    orderCount: data.orderCount ? Number(data.orderCount) : 0,
    totalAmountSpent: data.totalAmountSpent ? Number(data.totalAmountSpent) : 0,
  };
};

export const clientToMap = (client: Client): any => {
  return {
    id: client.id,
    userId: client.userId,
    name: client.name,
    email: client.email,
    phone: client.phone,
    type: getClientTypeDisplayTitle(client.type),
    createdAt: client.createdAt.toISOString(),
    image: client.image,
    orderCount: client.orderCount,
    totalAmountSpent: client.totalAmountSpent,
  };
};