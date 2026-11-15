import useFetchAddress from "@/modules/lib/utility/hooks/addresses/use-fetch-address";
import { useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { toast } from "sonner";

const UseCurrentLocationButton = ({ formhandler, setUserLocation, setSuggestionInputValue }: any) => {
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
                setSuggestionInputValue('')

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
                        toast.error(geoError.message, { duration: 2000 });
                }
            }
        );
    };

    return (
        <div className='py-[12px] sm:px-[24px] px-[12px] flex items-center sm:gap-[10px] gap-[5px] rounded-[6px] bg-[#F5F5F5] w-fit mx-auto font-medium sm:text-[16px] text-[14px] leading-[22px] cursor-pointer' onClick={handleGetLocation}>
            <SlLocationPin className='sm:w-[24px] w-[20px] sm:h-[24px] h-[20px]' />
            <p>{loading ? 'loading' : 'Use current location'}</p>
        </div>
    );
};

export default UseCurrentLocationButton;