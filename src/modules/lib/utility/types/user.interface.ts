
// ---- Core system user response shape ----
export interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  role: string;
  status: string;
  settings: Record<string, unknown>;
  meta: Record<string, unknown> | null;
  lastLoginAt: string;
  dateCreated: string;
  lastUpdated: string;
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    gender: string | null;
    phoneNumbers: string[];
    meta: Record<string, unknown> | null;
  };
  storeRoles: unknown[];
  workEmail: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string[];
  orderCount?: number;
}


// ---- API response shape ----
export interface NewUser {
  id: number;
  username?: string;
  email: string | null;
  mobile?: string | null;
  role: string;
  status: string;
  settings?: Record<string, unknown> | null;
  meta?: Record<string, unknown> | null;
  lastLoginAt?: string | null;
  orderCount?: number;
  storeRoles?: unknown[];
  customer: {
    dateCreated: string;
    lastUpdated: string;
    profile?: {
      id: number;
      firstName: string;
      lastName: string;
      gender: string | null;
      phoneNumbers: string[];
      email: string | null;
      meta: Record<string, unknown> | null;
    } | null;
  };
}

// ---- Converted/flattened output ----
