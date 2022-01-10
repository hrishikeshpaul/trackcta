import { FunctionComponent } from 'react';

import { useColorMode, Center, Spinner, Box } from '@chakra-ui/react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

import { darkStyle, lightStyle } from 'shared/map/Map.Styles';
import { Point } from 'store/data/DataStore.Types';
import { ColorMode } from 'store/system/SystemStore.Types';

const containerStyle = {
    width: '100%',
    height: '100%',
};

interface Props {
    defaultZoom: number;
    onLoad: (map: google.maps.Map) => void;
    center: Point;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onZoomChanged?: () => void;
}

export const MapLoader: FunctionComponent = ({ children }) => {
    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY!}
            loadingElement={
                <Center h="100%">
                    <Spinner color="blue.300" />
                </Center>
            }
        >
            {children}
        </LoadScript>
    );
};

export const Map: FunctionComponent<Props> = ({
    defaultZoom,
    onLoad,
    center,
    onDragStart,
    onDragEnd,
    onZoomChanged,
    children,
}) => {
    const { colorMode } = useColorMode();

    const mapOptions = {
        disableDefaultUI: true,
        styles: colorMode === ColorMode.Light ? lightStyle : darkStyle,
        maxZoom: 19,
        minZoom: 7,
    };
    return (
        <Box h="100%" w="100%">
            <GoogleMap
                onLoad={onLoad}
                mapContainerStyle={containerStyle}
                center={center}
                zoom={defaultZoom}
                options={mapOptions}
                clickableIcons={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onZoomChanged={onZoomChanged}
            >
                {children}
            </GoogleMap>
        </Box>
    );
};