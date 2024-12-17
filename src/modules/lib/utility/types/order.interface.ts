import { Cart } from "./cart.interface";
import { User } from "./user.interface";

export interface Delivery {
     id: number;
     deliveryDate: string;
     deliveryWindowStart: string;
     deliveryWindowEnd: string;
     notes: string;
     status: string;
     code: string;
     meta: any;
     dateTimeDelivered: string | null;
     dateCreated: string;
     lastUpdated: string;
}

export interface Order {
     id: number;
     cart: Cart;
     status: string;
     user: User;
     delivery: Delivery;
     deliveryFee: number;
     totalAmount: number;
     cancellationReason: string | null;
}
