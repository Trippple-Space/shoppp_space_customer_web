export interface Address {
  firstname: string;
  lastname: string;
  id: number;
  userId: number;
  label: string;
  address: string;
  city: string;
  state: string;
  contactNo1: string;
  contactNo2: string;
  isDefault: boolean;
  notes: string;
  meta: JSON;
  dateCreated: Date;
  lastUpdated: Date;
}
