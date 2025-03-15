export interface UserInfoInterface {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
