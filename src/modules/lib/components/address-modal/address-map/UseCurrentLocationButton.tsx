import useFetchAddress from "@/modules/lib/utility/hooks/addresses/use-fetch-address";
import { useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { toast } from "sonner";

const UseCurrentLocationButton = ({ formhandler, setUserLocation }: any) => {
    const { fetchAddressFromCoordinates } = useFetchAddress();
    const [loading, setLoading] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser", { duration: 2000 });
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude })

                await fetchAddressFromCoordinates(latitude, longitude, (addressDetails) => {
                    formhandler.setFieldValue("address", addressDetails?.streetAddress || '');
                    formhandler.setFieldValue("city", addressDetails?.city || '');
                    //formhandler.setFieldValue("state", addressDetails?.state || '');
                    formhandler.setFieldValue('meta', { 'location': { latitude, longitude } })
                });
                setLoading(false);
            },
            (geoError) => {
                setLoading(false);
                switch (geoError.code) {
                    case geoError.PERMISSION_DENIED:
                        toast.error("User denied the request for Geolocation", { duration: 2000 });
                        break;
                    case geoError.POSITION_UNAVAILABLE:
                        toast.error("Location information is unavailable", { duration: 2000 });
                        break;
                    case geoError.TIMEOUT:
                        toast.error("The request to get user location timed out", { duration: 2000 });
                        break;
                    default:
                        toast.error("An error occurred", { duration: 2000 });
                }
            }
        );
    };

    return (
        <div className='py-12 sm:px-24 px-12 flex a-items-center sm:gap-10 gap-5 radius-6 bg-#F5F5F5 w-fit mx-auto weight-500 sm:text-16 text-14 line-height-22 pointer' onClick={handleGetLocation}>
            <SlLocationPin className='sm:w-24 w-20 sm:h-24 h-20' />
            <p>{loading ? 'loading' : 'Use current location'}</p>
        </div>
    );
};

export default UseCurrentLocationButton;