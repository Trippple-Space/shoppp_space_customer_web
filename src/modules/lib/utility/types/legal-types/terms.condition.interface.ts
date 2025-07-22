export interface TermsAndConditionsJson {
  terms_and_conditions: TermsAndConditionsSection;
  schedule_1_shipping_policy: ShippingPolicySection;
  return_policy: ReturnPolicySection;
}

export interface TermsAndConditionsSection {
  title: string;
  last_updated: string;
  "1_introduction": string;
  "2_use_of_services": UseOfServices;
  "3_products_and_orders": ProductsAndOrders;
  "4_payments": Payments;
  "5_shipping_and_delivery": ShippingAndDelivery;
  "6_returns_and_refunds": ReturnsAndRefunds;
  "7_intellectual_property": IntellectualProperty;
  "8_limitation_of_liability": string;
  "9_indemnification": string;
  "10_governing_law": string;
  "11_changes_to_terms": string;
  "12_contact_us": ContactInfo;
  acknowledgment: string;
}

export interface UseOfServices {
  eligibility: string;
  account_registration: string;
  prohibited_conduct: string[];
}

export interface ProductsAndOrders {
  product_descriptions: string;
  pricing: string;
  order_acceptance: string;
}

export interface Payments {
  payment_methods: string;
  billing_information: string;
}

export interface ShippingAndDelivery {
  shipping_policy_reference: string;
  risk_of_loss: string;
}

export interface ReturnsAndRefunds {
  return_policy_reference: string;
}

export interface IntellectualProperty {
  ownership: string;
  limited_license: string;
}

export interface ContactInfo {
  email: string;
  address: string;
}

export interface ShippingPolicySection {
  title: string;
  last_updated: string;
  shipping_introduction: string;
  "1_shipping_locations": string;
  "2_processing_time": string[];
  "3_delivery_time": {
    lagos_state: string;
  };
  "4_shipping_costs": string;
  "5_order_tracking": string;
  "6_failed_deliveries": string;
  "7_contact_us": ShippingContact;
}

export interface ShippingContact {
  email: string;
  phone: string;
}

export interface ReturnPolicySection {
  title: string;
  description: string;
}
