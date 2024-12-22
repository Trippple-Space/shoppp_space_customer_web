import React, { FC } from "react";
interface IAddressMap {
    location: {
        lat: number;
        lng: number;
    };
}

const AddressMap: FC<IAddressMap> = ({ location }) => {
    const locationiqApiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API;
   
    return (
        (<img src={`https://maps.locationiq.com/v3/staticmap?key=${locationiqApiKey}&center=${location.lat},${location.lng}&zoom=16&size=600x400&format=jpg&maptype=streets&markers=icon:small-red|${location.lat},${location.lng}`} className="h-full w-full object-fit" alt="map" />)
    );
};

export default AddressMap;
