export interface INewUser {
  username: string;
  password: string;
  role?: string;
}

export interface IUser extends INewUser {
  id: number;
}

export const userRole = {
  superAdmin: 'superAdmin',
  superManager: 'superManager',
  manager: 'manager'
};
