import React, { FunctionComponent } from 'react';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

import './MapContainer.scss';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 41.88,
    lng: -87.65,
};

const mapOptions = {
    disableDefaultUI: true,
};

export const MapContainer: FunctionComponent = () => {
    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY!}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    options={mapOptions}
                    clickableIcons={false}
                ></GoogleMap>
            </LoadScript>
        </div>
    );
};
