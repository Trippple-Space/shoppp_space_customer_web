import axios from "axios";
import { useEffect, useState } from "react";

export const useGetIPAddress = () => {
  const [ipAddress, setIpAddress] = useState<string>("");
  //   const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        setIpAddress(response.data.ip);
        // setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch IP address");
        // setLoading(false);
      });
  }, []);
  return { ipAddress };
};
