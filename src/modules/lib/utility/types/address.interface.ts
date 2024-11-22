export interface Address {
    id: number;
    userId: number;
    label: string;
    address: string;
    city: string;
    state: string;
    contactNo: string;
    isDefault: boolean;
    notes: string;
    meta: JSON;
    dateCreated: Date;
    lastUpdated: Date;
  }
  