export const FavoriteStopsKey = 'track-cta-favorite-stops';
export const FavoriteRoutesKey = 'track-cta-favorite-routes';
export const SearchHistoryKey = 'track-cta-search-history';

export enum PointType {
    S = 'S', // stop
    W = 'W', // waypoint
}

export enum Direction {
    Northbound = 'Northbound',
    Southbound = 'Southbound',
    Eastbound = 'Eastbound',
    Westbound = 'Westbound',
}

export enum Juncture {
    A = 'A', // arrival
    D = 'D', // departure
}

export enum RouteType {
    Bus = 'B',
    Train = 'T',
    All = 'A',
}

export interface Route {
    route: string;
    name: string;
    color: string;
    type: string;
    routes?: Array<{ direction: string; destination: string }>;
}

export interface RouteColor {
    [key: string]: string;
}

export interface Point {
    lat: number;
    lng: number;
}

export interface Stop extends Point {
    name: string;
    id: string;
    route: string;
    type: RouteType;
}

export interface Pattern {
    fillColor: string;
    strokeColor: string;
    id: number;
    route: string;
    paths: Point[];
    stops: Stop[];
    type: RouteType;
}

export interface Vehicle {
    id: string;
    timestamp: string;
    position: Point;
    route: string;
    destination: string;
    delayed: boolean;
    color: string;
    heading: number;
    type: RouteType;
}

export interface Prediction {
    type: Juncture;
    name: string;
    id: string;
    stopId: string;
    route: string;
    direction: Direction;
    time: number;
    timestamp: string;
    delayed: boolean;
    vehicleId: string;
    destination: string;
}

export interface DataStoreState {
    currentLocation: Point;
    routes: Record<string, Route>;
    patterns: Pattern[];
    stop: Stop | null;
    vehicle: Vehicle | null;
    error?: any;
    vehicles: Vehicle[];
    savedStops: Record<string, Stop>;
    savedRoutes: Record<string, Route>;
    searchHistory: Array<string>;
}
