export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: number;
}

export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserRegister {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword: string;
}
export interface IUserUpdate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: number;
}
export interface IResetPassword {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
export interface UserUpdateAvatar {
  id: number;
  avatar: string;
}

export interface UserUpdateRole {
  id: number;
  role: number;
}
export interface UserUpdateStatus {
  id: number;
  status: number;
}
