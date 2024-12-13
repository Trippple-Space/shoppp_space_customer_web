import React, { FC } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

interface IAddressMap {
    location: {
        lat: number;
        lng: number;
    };
}

const AddressMap: FC<IAddressMap> = ({ location }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    });

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100px" }}
            center={location}
            zoom={16}
            options={{
                disableDefaultUI: true,
                keyboardShortcuts: false,
                disableDoubleClickZoom: true,
            }}
        >
            {location && <Marker position={location} />}
        </GoogleMap>
    );
};

export default AddressMap;
