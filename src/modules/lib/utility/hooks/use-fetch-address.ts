import axios from "axios";
import { toast } from "sonner";

const useFetchAddress = () => {
  const esriApiKey = process.env.NEXT_PUBLIC_ESRI_API_KEY;

  const fetchAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
    callback: (addressDetails: {
      streetAddress?: string;
      city?: string;
      state?: string;
    }) => void
  ) => {
    try {
      const response = await axios.get(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${longitude},${latitude}&f=json&outFields=*&token=${esriApiKey}`
      );
      //console.log(response.data.address);

      const address = response.data.address;
      if (address) {
        if (address.Region.toLowerCase().includes("lagos")) {
          const addressDetails = {
            streetAddress: address.Address,
            city: address.District === "" ? address.City : address.District,
            state: address.Region,
          };
          callback(addressDetails);
        } else {
          toast.error("Location must be within Lagos, Nigeria", {
            duration: 2000,
          });
        }
      } else {
        toast.error("Unable to extract address details", { duration: 2000 });
      }
    } catch (err) {
      toast.success("Failed to fetch address", { duration: 2000 });
      //console.log(err);
    }
  };
  return { fetchAddressFromCoordinates };
};

export default useFetchAddress;
