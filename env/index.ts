import development from "./local";
import production from "./production";
import staging from "./staging";

const allConfigs: {
  [key in "development" | "staging" | "production"]: typeof production;
} = {
  development,
  staging,
  production,
};

const bruteCheckLocal = () => {
  return window.location.href.includes("localhost");
};

const bruteCheckProduction = () => {
  return (
    window.location.href.includes("asoebi.africa") &&
    !window.location.href.includes("staging")
  );
};

let currentEnv: keyof typeof allConfigs;
if (!process.env.ENV) {
  currentEnv = bruteCheckLocal()
    ? "development"
    : bruteCheckProduction()
    ? "production"
    : "staging";
} else {
  currentEnv = (process.env.ENV as keyof typeof allConfigs) || "development";
}

currentEnv = "production";

const resolvedConfigs = { ...allConfigs[currentEnv], ENV: currentEnv };

export default resolvedConfigs;
