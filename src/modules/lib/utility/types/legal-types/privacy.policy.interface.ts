// privacyPolicyTypes.ts

export interface PrivacyPolicyType {
  privacy_policy: {
    title: string;
    "1_introduction": string;
    "2_information_we_collect": {
      personal_identification_information: string[];
      account_information: string[];
      transaction_information: string[];
      device_and_technical_information: string[];
      cookies_and_usage_data: string[];
    };
    "3_purpose_of_data_collection": string[];
    "4_legal_basis_for_processing": {
      consent: string;
      contract: string;
      legal_obligation: string;
      legitimate_interest: string;
    };
    "5_data_sharing_and_disclosure": {
      vendors_and_service_providers: string;
      third_party_sellers: string;
      law_enforcement: string;
      note: string;
    };
    "6_data_retention": string;
    "7_data_subject_rights": {
      right_to_access: string;
      right_to_rectification: string;
      right_to_erasure: string;
      right_to_data_portability: string;
      right_to_object: string;
      right_to_withdraw_consent: string;
      contact: string;
    };
    "8_cookies_and_tracking_technologies": string;
    "9_data_security": string;
    "10_cross_border_data_transfers": string;
    "11_childrens_privacy": string;
    "12_changes_to_this_privacy_policy": string;
    "13_contact_us": {
      address: string;
      email: string;
    };
  };
}
