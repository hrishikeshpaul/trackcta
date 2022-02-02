import axios from 'axios';

import { Pattern, Prediction, Route, RouteColor, RouteType } from 'store/data/DataStore.Types';
import { Http } from 'utils/Http';
import { socket } from 'utils/Socket';

const { CancelToken } = axios;
let cancelGetPatternSource = CancelToken.source();

export const getRoutes = async (search?: string, filter?: string, limit?: number, index?: number): Promise<Route[]> => {
    const { data } = await Http.get<Route[]>('/routes', {
        params: { search, filter, limit, index },
    });

    return data;
};

export const getRouteColor = async (ids: string): Promise<RouteColor> => {
    const { data } = await Http.get<RouteColor>('/route-color', {
        params: { ids },
    });

    return data;
};

export const getPattern = async (route: string, color: string): Promise<Pattern[]> => {
    const { data } = await Http.get<Pattern[]>('/patterns', {
        params: {
            route,
            color,
        },
        cancelToken: cancelGetPatternSource.token,
    });

    return data;
};

export const cancelGetPattern = (): void => {
    cancelGetPatternSource.cancel();
    cancelGetPatternSource = CancelToken.source();
};

export const getPredictions = async (stop: string): Promise<Prediction[]> => {
    const { data } = await Http.get<Prediction[]>('/predictions', {
        params: {
            stop,
        },
    });

    return data;
};

export const getTrainRoutes = async (): Promise<Route[]> => {
    const { data } = await Http.get<Route[]>('/train/routes');

    return data;
};

export const getTrainPatterns = async (route: string, color: string): Promise<Pattern[]> => {
    const { data } = await Http.get<Pattern[]>('/train/patterns', {
        params: {
            route,
            color,
        },
    });

    return data;
};

export const onRouteSelect = (route: string, color: string, type: RouteType): void => {
    /**
     * For devices that have saved busses before
     */
    let savedType = type;
    if (!type) {
        savedType = RouteType.Bus;
    }

    socket.emit('route-add', { route, color, type: savedType });
};

export const onRouteDeselect = (route: string, type: RouteType): void => {
    let savedType = type;
    if (!type) {
        savedType = RouteType.Bus;
    }
    socket.emit('route-remove', { route, type: savedType });
};

export const onRouteRemoveAll = (): void => {
    socket.emit('route-remove-all');
};

export const onIdle = (): void => {
    socket.emit('idle');
};

export const onActive = (): void => {
    socket.emit('active');
};
