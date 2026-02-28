import { Cart } from "./cart.interface";
import { User } from "./user.interface";

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
     createAt: string;
     lastUpdated: string;
}

export interface Order {
     id: string;
     cart: Cart;
     status: string;
     user: User;
     delivery: Delivery;
     deliveryFee: number;
     totalAmount: number;
     cancellationReason: string | null;
}
