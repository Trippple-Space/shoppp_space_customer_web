import React from "react";

const AddressMap: React.FC = () => {
    return (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15856.253527566354!2d3.3892903999999997!3d6.5136621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cfb29806459%3A0xe969b915b9128f99!2sSports%20Center%2C%20University%20of%20Lagos%20Akoka!5e0!3m2!1sen!2sng!4v1733917963749!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
};

export default AddressMap;
