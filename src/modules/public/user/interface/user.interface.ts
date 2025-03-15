export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  otpExpiry: Date;
  password: string;
  passwordSalt: string;
  otp: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
