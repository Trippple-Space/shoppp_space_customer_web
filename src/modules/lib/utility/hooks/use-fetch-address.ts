import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const useFetchAddress = () => {
  const [addressDetails, setAddressDetails] = useState<{
    address?: string;
    city?: string;
    state?: string;
  }>({});
  const [error, setError] = useState<string>("");

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
      );
      console.log(response.data);

      const results = response.data.results;
      if (results && results.length > 0) {
        const formattedAddress =
          results[0].formatted_address || "Address not found";

        const addressComponents = results[0].address_components;
        const city = addressComponents.find((comp: any) =>
          comp.types.includes("locality")
        )?.long_name;
        const state = addressComponents.find((comp: any) =>
          comp.types.includes("administrative_area_level_1")
        )?.long_name;

        setAddressDetails({ address: formattedAddress, city, state });
      } else {
        toast.success("Unable to extract address details", { duration: 2000 });
        setError("Unable to extract address details");
      }
    } catch (err) {
      toast.success("Failed to fetch address", { duration: 2000 });
      setError("Failed to fetch address");
    }
  };

  return { addressDetails, error, fetchAddressFromCoordinates };
};

export default useFetchAddress;
