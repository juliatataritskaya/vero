export interface INewUser {
  username: string;
  password: string;
  role?: string;
}

export interface IUser extends INewUser {
  id: number;
}

export interface IUserWithCustomerProfile extends IUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: number;
  updatedAt: number;
}

export const userRole = {
  admin: 'admin',
  customer: 'customer',
  preCustomer: 'preCustomer',
  guest: 'guest'
};
