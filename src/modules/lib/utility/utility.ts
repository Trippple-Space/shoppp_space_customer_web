import classNames from "classnames";
import { StoreGroupResponse } from "./types/cart.interface";
import { NewUser, User } from "./types/user.interface";
import { IFilters } from "./types/product.interface";
import { ContactFormData } from "./types/contact-us.interface";
import colors from '@/modules/lib/utility/json-data/colors.json';

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

  if (tags !== undefined && tags !== null && tags !== "") {
    const asArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.includes(",")
          ? tags.split(",")
          : [tags]
        : [String(tags)];

    const cleaned = asArray
      .map((t: any) => String(t).trim())
      .filter(Boolean);

    // Single tag: keep old behavior
    if (cleaned.length === 1) {
      params["filters[tags][label]"] = cleaned[0];
    } else if (cleaned.length > 1) {
      params["filters[tags][label][]"] = cleaned;
    }
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

export const filtersToSearchParams = (filters: IFilters, selectedCategory?: { name?: string }, existingParams?: URLSearchParams) => {
  const params = existingParams ? new URLSearchParams(existingParams) : new URLSearchParams();

  if (filters.rating.rateBy) params.set("rating", filters.rating.rateBy);
  else params.delete("rating");

  if (filters.price.min) params.set("priceMin", filters.price.min);
  else params.delete("priceMin");

  if (filters.price.max) params.set("priceMax", filters.price.max);
  else params.delete("priceMax");

  if (filters.sort.sortBy) params.set("sort", filters.sort.sortBy);
  else params.delete("sort");

  if (filters.location.selectedState)
    params.set("location", filters.location.selectedState);
  else params.delete("location");

  if (filters.showOffers) params.set("offers", "true");
  else params.delete("offers");

  if (selectedCategory?.name && selectedCategory.name !== "All") {
    params.set("category", selectedCategory.name.toLowerCase());
  } else {
    params.delete("category");
  }

  return params;
};

export const searchParamsToFilters = (
  searchParams: URLSearchParams
): Partial<IFilters> => {
  return {
    rating: { rateBy: searchParams.get("rating") || "" },
    price: {
      min: searchParams.get("priceMin") || "",
      max: searchParams.get("priceMax") || "",
    },
    sort: { sortBy: searchParams.get("sort") || "" },
    location: {
      selectedState: searchParams.get("location") || "",
    },
    showOffers: searchParams.get("offers") === "true",
  };
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

export const getStoreNames = (storeGroups: StoreGroupResponse[]) => {
  const storeNames = storeGroups?.map((stores: any) => stores?.store?.name)
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

export const checkMediaType = (url: string) => {
  const lowerUrl = url?.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(lowerUrl)) {
    return "image";
  } else if (/\.(mp4|webm|mov|avi|mkv)$/.test(lowerUrl)) {
    return "video";
  }

  return "unknown";
}

export const getCartItems = (storeGroups: StoreGroupResponse[]) => {
  const cartItems = storeGroups?.flatMap((group: StoreGroupResponse) => group.items) || []

  return cartItems
}

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

export const contactEmail = "support@asoebi.africa"

export const emailRegex = /^([a-zA-Z0-9_.\-]+)([+][a-zA-Z0-9_.\-]+)*@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;


export function convertUserResponse(data: NewUser): User {
  const profile = data.customer.profile ?? {
    id: '',
    firstName: "",
    lastName: "",
    gender: null,
    phoneNumbers: [],
    email: null,
    meta: null,
  };

  return {
    id: data.id,
    username: data.username ?? "",
    email: data.email ?? "",
    mobile: data.mobile ?? "",
    role: data.role,
    status: data.status,
    settings: data.settings ?? {},
    meta: data.meta ?? null,
    lastLoginAt: data.lastLoginAt ?? "",
    createAt: data.customer.createAt,
    lastUpdated: data.customer.lastUpdated,
    profile: {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      phoneNumbers: profile.phoneNumbers,
      meta: profile.meta,
    },
    storeRoles: data.storeRoles ?? [],
    workEmail: data.email ?? "",
    personalEmail: profile.email ?? "",
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumbers,
    orderCount: data.orderCount,
  };
}

export function getLastFiveIdChars(id: string): string {
  if (id.length < 5) return id;
  return id.slice(-5).toLocaleUpperCase();
}




export function saveVariantToLocalStorage(variantId: string, minimumPur: string, userConfigurations?: Record<string, any>) {
  if (typeof window === "undefined") return
  localStorage.setItem('variantId', variantId)
  localStorage.setItem('variantIdMinimumPurchase', minimumPur.toString())
  if (userConfigurations) {
    localStorage.setItem(
      'userConfigurations',
      JSON.stringify(userConfigurations)
    );
  }
}





export const handleFlyToCart = (imgRef: React.RefObject<HTMLImageElement>) => {
  if (typeof window === "undefined") return;

  // Only run once
  const hasSeen = localStorage.getItem("seenCartAnimation");
  if (hasSeen) return;

  const cartIcon = document.querySelector(".cart-icon") as HTMLElement | null;
  const img = imgRef.current as HTMLImageElement | null;
  if (!cartIcon || !img) return;

  const imgRect = img.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const viewportOffsetY = window.visualViewport?.offsetTop || 0;

  const imgX = imgRect.left + scrollX;
  const imgY = imgRect.top + scrollY + viewportOffsetY;
  const cartX = cartRect.left + scrollX;
  const cartY = cartRect.top + scrollY + viewportOffsetY;

  const clone = img.cloneNode(true) as HTMLImageElement;
  Object.assign(clone.style, {
    position: "fixed",
    left: `${imgX}px`,
    top: `${imgY}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    zIndex: "99999",
    transition: "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.8s",
    transform: "translate3d(0, 0, 0)",
    pointerEvents: "none",
  });
  document.body.appendChild(clone);

  const deltaX = cartX + cartRect.width / 2 - (imgX + imgRect.width / 2);
  const deltaY = cartY + cartRect.height / 2 - (imgY + imgRect.height / 2);

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
    clone.style.opacity = "0.3";
  });

  clone.addEventListener("transitionend", () => {
    clone.remove();
    cartIcon.classList.remove("cart-bounce");
    void cartIcon.offsetWidth;
    cartIcon.classList.add("cart-bounce");
    setTimeout(() => cartIcon.classList.remove("cart-bounce"), 300);
  }, { once: true });






  localStorage.setItem("seenCartAnimation", "true");
};

export const buildContactSlackMessage = (data: ContactFormData) => ({
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📩 New Contact Form Submission',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Full Name:*\n${data.fullName}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Email:*\n${data.email}`,
      },
    },
    ...(data.phone
      ? [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Phone:*\n${data.phone}`,
          },
        },
      ]
      : []),
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Subject:*\n${data.subject}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:*\n${data.message}`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<mailto:${data.email}|Reply to sender>`,
      },
    },
  ],
});

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

const hexToRgb = (hex: string) =>  {
  const cleaned = hex.replace('#', '')

  const bigint = parseInt(cleaned, 16)

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

const colorDistance = (c1: any, c2: any) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  )
}

export const getClosestColorName = (hex: string) => {
  if (!hex) return hex

  const target = hexToRgb(hex)

  let closestColor = null
  let minDistance = Infinity

  for (const color of colors) {
    const rgb = hexToRgb(color.hex)
    const distance = colorDistance(target, rgb)

    if (distance < minDistance) {
      minDistance = distance
      closestColor = color
    }
  }

  return closestColor?.name ?? hex
}