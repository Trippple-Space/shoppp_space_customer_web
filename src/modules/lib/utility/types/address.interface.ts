export interface Address {
  firstName: string;
  lastName: string;
  id: number;
  userId: number;
  label: string;
  address: string;
  city: string;
  state: string;
  contactNo: string;
  secondaryContactNo: string;
  isDefault: boolean;
  notes: string;
  meta: JSON;
  dateCreated: Date;
  lastUpdated: Date;
}
