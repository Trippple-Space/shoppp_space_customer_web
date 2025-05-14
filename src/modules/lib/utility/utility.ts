import classNames from "classnames";

export type ImageSrcFolder = "icons" | "logos" | "images";
export const getImageDir = (folder: ImageSrcFolder, object: string) => {
  if (object?.indexOf("http") === 0) return object;
  return `/images/${folder}/${object}`;
};

export const getQueryStringFromObject = (object: Record<string, string>) => {
  return new URLSearchParams(object).toString();
};

export const cx = (...args: classNames.ArgumentArray) => {
  return classNames(...args);
};

export const formatNumberAsPrice = (
  number: number,
  currency: string = "NGN"
) => {
  if (!number || !currency) return "";

  const formatted = (+number).toLocaleString("en", {
    style: "currency",
    currency: currency
  });

  return formatted.replace(".00", "").replace("NGN", "₦");
};

export const getDiscountedPrice = (
  totalPrice: number,
  discountCalculationType: string,
  value: number
) => {
  if (discountCalculationType === "PERCENTAGE"){
    const discount = 10/100 * totalPrice

    return totalPrice - discount
  } else {
    return totalPrice - value
  }
}

export const getGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    return "Good morning!";
  } else if (currentTime >= 12 && currentTime < 18) {
    return "Good afternoon!";
  } else {
    return "Good evening!";
  }
};

export const buildEndpoint = (
  endpoint: string,
  routeParams: { [key: string]: string | number } = {},
  extendBy: string = ""
) => {
  let builtEndpoint = endpoint;
  for (const param in routeParams) {
    builtEndpoint = builtEndpoint.replace(`:${param}`, `${routeParams[param]}`);
  }
  return builtEndpoint + extendBy;
};

export const buildFilterParams = (filters: any) => {
  if (!filters) return {};
  const { price, sort, rating, showOffers, location, tags } = filters;
  let params: any = {};

  if (price?.min && price?.max) {
    if (price.max === "infinity") {
      params["filters[price][MoreThan]"] = price.min;
    } else {
      params["filters[price][Between]"] = `${price.min},${price.max}`;
    }
  } else if (price?.min) {
    params["filters[price][MoreThanOrEqual]"] = price.min;
  } else if (price?.max) {
    params["filters[price][LessThanOrEqual]"] = price.max;
  }

  if (tags){
    params["filters[tags][label]"] = tags
  } 

  if (rating?.rateBy) {
    params["filters[variants][averageRating][MoreThanOrEqual]"] = rating.rateBy;
  }
  /*if (sort?.sortBy) {
    params["sort"] = sort.sortBy;
  }

  if (showOffers) {
    params["filters[showOffer]"] = "true";

  if (location) {
    params["filters[location]"] = location.selectedState
  }  
  }*/

  return params;
};

export const chunkArray = <T>(arr: T[], noOfChunks: number): T[][] => {
  const result: T[][] = [];
  for (const i in arr) {
    const pos = +i % noOfChunks;
    if (!result[pos]) {
      result[pos] = [];
    }
    result[pos].push(arr[i]);
  }
  return result;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

export function displayStockUnit(stockUnit: string): string {
  if (stockUnit == "yard" || stockUnit === "yards") return `yard`;
  else if (stockUnit == "unit" || stockUnit === "units") return stockUnit;
  else return "piece";
}

interface PillableProp {
  [x: string]: {
    active: boolean;
    pillColor: string;
    pillBackground: string;
    priority: number;
    text: string;
  };
}

export const displayProductPill = (tags: any) => {
  //console.log(tags);

  const tagsWithPill = tags?.filter((tag: any) => tag.label.includes("pill:"));

  const destringPills = (pills: { label: string }[]): PillableProp => {
    const pillable: PillableProp = {};

    pills?.forEach((pill) => {
      const destringedPill = JSON.parse(pill.label);

      for (const key in destringedPill) {
        const { pillColor, pillBackground, priority, text } =
          destringedPill[key];
        pillable[key] = {
          active: true,
          pillColor,
          pillBackground,
          priority: parseInt(priority),
          text
        };
      }
    });

    return pillable;
  };

  const pillable = destringPills(tagsWithPill);

  const getTwoActivePills = (pillable: PillableProp) => {
    const activeItems = Object.entries(pillable)
      .filter(([key, value]) => value.active)
      .sort(([_, a], [__, b]) => a.priority - b.priority)
      .slice(0, 2)
      .map((a) => a[1]);

    return activeItems;
  };
  const topTwoPills = getTwoActivePills(pillable);

  return topTwoPills;
};

export const replaceParamInEndpoint = (
  endpoint: string,
  param: string,
  slug: number | string
): string => {
  return endpoint.replace(`:${param}`, `${slug}`);
};

const getOrdinalSuffix = (day: number): string => {
  const suffixes: string[] = ["th", "st", "nd", "rd"];
  const remainder: number = day % 10;
  const exception: boolean = day >= 11 && day <= 13;

  return (
    day +
    (exception
      ? "th"
      : suffixes[remainder > 3 || remainder === 0 ? 0 : remainder])
  );
};

export const formatDate = (date: Date): string => {
  const dayWithSuffix: string = getOrdinalSuffix(date.getDate());
  const month: string = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const year: number = date.getFullYear();

  const hours: number = date.getHours() % 12 || 12;
  const minutes: string = String(date.getMinutes()).padStart(2, "0");
  const ampm: string = date.getHours() >= 12 ? "PM" : "AM";

  return `${dayWithSuffix} ${month}, ${year}. ${hours}:${minutes}${ampm}`;
};

export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  return `${hours}:${minutesStr}${ampm}`;
}

export const getStoreNames = (cartItems: any) => {
  const storeNames = cartItems?.map((item: any) => item.variant?.product?.store?.name)
    .filter(Boolean)
    .reduce((uniqueNames: any, name: any) => {
      if (!uniqueNames.includes(name)) {
        uniqueNames.push(name);
      }
      return uniqueNames;
    }, []);

  if (storeNames?.length > 2) {
    const firstStore = storeNames[0];
    const secondStore = storeNames[1];
    const remainingCount = storeNames?.length - 2;
    return `${firstStore}, ${secondStore} and ${remainingCount} more`;
  }

  return storeNames?.join(", ");
};

export const preventCopyPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
}

export const passwordValidatorRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/ 



  export const ellipseText = (text: string, isExpanded: boolean, limit: number) => {
    if (isExpanded || text.length <= limit) {
      return text 
    }
    return `${text.substring(0, limit)}...` 
  }

 export const onGoingOrderStatus = [
    'ONGOING',
    'PENDING_CONFIRMATION',
    'CONFIRMED',
   'ACKNOWLEDGED',
    'WAITING_TO_BE_SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED'
 ]
  
export function getStatusText(status: string) {    
           switch (status) {
       case 'ONGOING':
         return 'Order placed'
       case 'PENDING_CONFIRMATION':
               return 'Pending Confirmation'
             case 'CONFIRMED':
               return 'Order confirmed'
       case 'ACKNOWLEDGED':
         return 'Order received'
       case 'WAITING_TO_BE_SHIPPED':
         return 'Waiting to be shipped'
       case 'OUT_FOR_DELIVERY':
         return 'Out for delivery'
       case 'DELIVERED':
         return 'Delivered'
       default:
         return ''
     }
}
   
export const onGoingOrderStatusQuery = 'ONGOING,PENDING_CONFIRMATION,CONFIRMED,ACKNOWLEDGED,WAITING_TO_BE_SHIPPED,OUT_FOR_DELIVERY'
export const states = [
  "Lagos"
];
/*
[
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]
*/
