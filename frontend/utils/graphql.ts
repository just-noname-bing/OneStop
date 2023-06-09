import { gql } from "@apollo/client";

export const POSTS_QUERY = gql`
    query GetPosts {
        getPosts {
            id
            created_at
            text
            title
            transport_id
            updated_at
            author {
                name
                surname
            }
            route {
                route_short_name
                route_long_name
                route_id
                route_desc
                route_type
            }
            stop {
                stop_name
            }
            stop_time {
                arrival_time
            }
        }
    }
`;

export const GET_POST_BY_ID = gql`
    query GetPost($id: String) {
        getPost(id: $id) {
            id
            created_at
            text
            title
            transport_id
            updated_at
            Comment {
                text
                id
                created_at
                author {
                    id
                    name
                    surname
                }
            }
            author {
                id
                name
                surname
            }
            route {
                route_short_name
                route_long_name
                route_id
                route_desc
                route_type
            }
            stop {
                stop_name
            }
            stop_time {
                arrival_time
            }
        }
    }
`;
export type POST_BY_ID = {
    id: string;
    text: string;
    title: string;
    transport_id: string;
    created_at: Date;
    updated_at: Date;
    Comment: [
        {
            text: string;
            id: string;
            created_at: Date;
            author: {
                id:string
                name: string;
                surname: string;
            };
        }
    ];
    author: {
        id:string
        name: string;
        surname: string;
    };
    route: {
        route_short_name: string;
        route_long_name: string;
        route_id: string;
        route_desc: string;
        route_type: string;
    };
    stop: {
        stop_name: string;
    };
    stop_time: {
        arrival_time: string;
    };
};

export type POST = {
    id: string;
    text: string;
    title: string;
    transport_id: string;
    created_at: Date;
    updated_at: Date;
    author: {
        name: string;
        surname: string;
    };
    route: {
        route_short_name: string;
        route_long_name: string;
        route_id: string;
        route_desc: string;
        route_type: string;
    };
    stop: {
        stop_name: string;
    };
    stop_time: {
        arrival_time: string;
    };
};

export type problemListProps = {
    data: POST[] | undefined;
    sortOrder: 1 | 0;
};

export const GET_ROUTES_FOR_STOP = gql`
    query GetRoutesForStop($stopId: String!) {
        getRoutesForStop(stop_id: $stopId) {
            Routes {
                route_id
                route_long_name
                route_short_name
                route_type
            }
            Stop_times {
                arrival_time
                trip_id
            }
        }
    }
`;

export type Route = {
    route_id: string;
    route_long_name: string;
    route_short_name: string;
    route_type: string;
};

export type CustomRouteForStop = {
    Routes: {
        route_id: string;
        route_long_name: string;
        route_short_name: string;
        route_type: string;
    };
    Stop_times: [
        {
            arrival_time: string;
            trip_id: string;
        }
    ];
};

export type getRoutesForStop = {
    getRoutesForStop: CustomRouteForStop[];
};

export const STOPS_QUERY = gql`
    query Stops {
        Stops {
            stop_id
            stop_lat
            stop_lon
            stop_name
        }
    }
`;

export type Stop = {
    stop_id: string;
    stop_lat: string;
    stop_lon: string;
    stop_name: string;
};

export const GET_ROUTES = gql`
    query Routes {
        Routes {
            route_id
            route_long_name
            route_short_name
            route_sort_order
            route_type
        }
    }
`;

export type Routes = {
    route_id: string;
    route_long_name: string;
    route_short_name: string;
    route_sort_order: string;
    route_type: string;
};

export const GET_TRANSPORT_SCHEDULE = gql`
    mutation GetTransportSchedule($stopId: String!, $transportId: String!) {
        getTransportSchedule(stop_id: $stopId, transport_id: $transportId) {
            arrival_time
            departure_time
            drop_off_type
            pickup_type
            stop_id
            stop_sequence
            trips {
                trip_id
                Calendar {
                    friday
                    start_date
                }
            }
        }
    }
`;

export type getTransportSchedule = {
    arrival_time: string;
    departure_time: string;
    drop_off_type: string;
    pickup_type: string;
    stop_id: string;
    stop_sequence: string;
    trips: {
        trip_id: string;
        Calendar: {
            friday: string;
            start_date: string;
        };
    };
};

export const LOGIN_MUTATION = gql`
    mutation Login($options: loginInput!) {
        login(options: $options) {
            data {
                accessToken
                refreshToken
            }
            errors {
                field
                message
            }
        }
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout($token: String!) {
        logout(token: $token)
    }
`;

export const REGISTER_MUTATION = gql`
    mutation Register($options: registerInput!) {
        register(options: $options) {
            data {
                accessToken
                refreshToken
            }
            errors {
                field
                message
            }
        }
    }
`;

export const GET_TRANSPORT_DIRECTION_STOPS = gql`
    mutation GetTransportDirectionStops(
        $transportId: String!
        $order1: String!
        $order2: String!
    ) {
        asc: getTransportDirectionStops(
            transport_id: $transportId
            order: $order1
        ) {
            trip_id
            stop_id
            stops {
                stop_id
                stop_lat
                stop_lon
                stop_name
            }
        }
        desc: getTransportDirectionStops(
            transport_id: $transportId
            order: $order2
        ) {
            stops {
                stop_id
                stop_lat
                stop_lon
                stop_name
            }
            stop_id
            trip_id
        }
    }
`;

export type getTransportDirectionStops = {
    stops: Stop;
    stop_id: string;
    trip_id: string;
};
