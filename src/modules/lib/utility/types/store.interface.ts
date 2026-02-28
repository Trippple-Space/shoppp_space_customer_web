export interface Store {
     id: string;
     slug: string;
     type: string;
     status: string;
     name: string;
     thumbnail: string;
     description: string;
     heading: string;
     subHeading: string;
     meta: null | StoreMeta;
     user?: {[key:string]:any};
     profile?: {[key:string]:any};
     registrationProposal?: {[key:string]:any};
     categories?: string[]
}

interface StoreMeta {
     heroImage1: string;
          heroImage2: string;
          heroImage3: string;
          heroImage4: string;
     settings: {
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          storeName: string;
          location: {
               state: string;
               address: string;
               coordinates:{
                    lat:string;
                    lon: string;
                    source: string;
               }
          };
     };
     template: any
     templateFields: {[key:string]:any};
}
