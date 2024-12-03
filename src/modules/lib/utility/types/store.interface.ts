export interface Store {
     id: number;
     slug: string;
     type: string;
     status: string;
     name: string;
     thumbnail: string;
     description: string;
     heading: string;
     subHeading: string;
     meta: null | StoreMeta;
}

interface StoreMeta {
     heroImages: {
          heroImage1: string;
          heroImage2: string;
          heroImage3: string;
          heroImage4: string;
     };
     settings: {
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          storeName: string;
          location: {
               state: string;
               address: string;
          };
     };
}
