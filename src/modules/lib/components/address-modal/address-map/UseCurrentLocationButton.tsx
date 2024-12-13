import useFetchAddress from "@/modules/lib/utility/hooks/use-fetch-address";
import { useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { toast } from "sonner";

const UseCurrentLocationButton = ({ formhandler, setUserLocation }: any) => {
    const { addressDetails, error, fetchAddressFromCoordinates } = useFetchAddress();
    const [loading, setLoading] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude })

                await fetchAddressFromCoordinates(latitude, longitude);

                formhandler.setFieldValue("address", addressDetails?.address || '');
                formhandler.setFieldValue("city", addressDetails?.city || '');
                //formhandler.setFieldValue("state", addressDetails.state);
                //console.log({ latitude, longitude })
                setLoading(false);
            },
            (geoError) => {
                setLoading(false);
                switch (geoError.code) {
                    case geoError.PERMISSION_DENIED:
                        toast.success("User denied the request for Geolocation", { duration: 2000 });
                        break;
                    case geoError.POSITION_UNAVAILABLE:
                        toast.success("Location information is unavailable", { duration: 2000 });
                        break;
                    case geoError.TIMEOUT:
                        toast.success("The request to get user location timed out", { duration: 2000 });
                        break;
                    default:
                        toast.success("An error occurred", { duration: 2000 });
                }
            }
        );
    };

    return (
        <div className='py-12 px-24 flex a-items-center gap-10 radius-6 bg-#F5F5F5 w-fit mx-auto weight-500 text-16 line-height-22 pointer' onClick={handleGetLocation}>
            <SlLocationPin className='w-24 h-24' />
            <p>{loading ? 'loading' : 'Use current location'}</p>
        </div>
    );
};

export default UseCurrentLocationButton;