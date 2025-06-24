export type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  restaurant: string; // This will be the ID
  restaurantName?: string; // This will be populated
  permissions: string[];
}; 