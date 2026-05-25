import { Cart } from "./cart.interface";
import { User } from "./user.interface";

export interface OrderPayment {
     createdAt?: string;
     deliveryOption?: string;
     status?: string;
}

export interface Delivery {
     id: string;
     deliveryDate: string;
     deliveryWindowStart: string;
     deliveryWindowEnd: string;
     notes: string;
     status: string;
     code: string;
     meta: any;
     dateTimeDelivered: string | null;
     createAt?: string;
     createdAt?: string;
     lastUpdated: string;
}

/** Per-line status from the API (ONGOING, REMOVED, ACKNOWLEDGED, etc.). */
export interface OrderLineItem {
     id: string;
     status: string;
     item: Record<string, unknown>;
     store?: {
          id: string;
          name?: string;
          slug?: string;
     };
}

export interface Order {
     id: string;
     cart: Cart;
     orderItems?: OrderLineItem[];
     status: string;
     user: User;
     delivery: Delivery;
     deliveryFee: number;
     totalAmount: number;
     totalDiscountPrice?: number;
     totalDiscountValue?: number;
     cancellationReason: string | null;
     createdAt?: string;
     updatedAt?: string;
     channel?: string;
     payment?: OrderPayment;
     cancelledAt?: string | null;
}
