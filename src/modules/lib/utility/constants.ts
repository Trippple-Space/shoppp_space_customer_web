export const deliveryOptions = {
    standard: {
        title: 'Standard Delivery',
        description: 'Arrives in 3 days',
        etaInDays: 3,
        price: 2500
    },
    express: {
        title: 'Same Day Delivery',
        description: 'Arrives within 24 hours',
        etaInDays: 1,
        price: 6500
    },
    pickup: {
        title: 'Pick Up',
        description: 'Pick up in stores close to you',
        etaInDays: '',
        price: 0
    }
}

export const templates = [
  { name: "Default", extraFields: [] },
  { name: "Minimal", extraFields: [
    {
        Products_section_description: "", 
        content_max_length: 30,
        optional: true,
    }
  ]},
  { 
    name: "Bold", 
    extraFields: [
      {
        Info_section_header: "Quality Product",
        Content: "",
        header_max_length: 20,
        content_max_length: 60,
      },
      {
        Info_section_header: "Best Production",
        Content: "",
        header_max_length: 20,
        content_max_length: 60,
      },
      {
        Info_section_header: "100% Authentic",
        Content: "",
        header_max_length: 20,
        content_max_length: 60,
      },
      {
        Product_list_description: "", 
        optional: true,
    }
    ],
  },
];