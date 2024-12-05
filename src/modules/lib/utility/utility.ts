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
    currency: currency,
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
    behavior: "smooth",
  });
};

export function displayStockUnit(stockUnit: string): string {
  if (stockUnit == "yard") return `per ${stockUnit}`;
  else if (stockUnit == "unit") return stockUnit;
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
  const tagsWithPill = tags?.filter((tag: any) => tag.label.includes("pill"));

  const destringPills = (pills: { label: string }[]): PillableProp => {
    const pillable: PillableProp = {};

    pills.forEach((pill) => {
      const { label } = pill;

      const slicedPill = label.split("|");
      const pillAttributes: { [key: string]: string } = {};

      slicedPill.forEach((attribute) => {
        const [key, value] = attribute.split(":");
        pillAttributes[key] = value;
      });

      const destringedPill = pillAttributes["pill"];
      pillable[destringedPill] = {
        active: true,
        pillColor: pillAttributes["pillColor"],
        pillBackground: pillAttributes["pillBackground"],
        priority: parseInt(pillAttributes["priority"]),
        text: pillAttributes["text"],
      };
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
