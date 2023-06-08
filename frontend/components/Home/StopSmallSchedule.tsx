import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect } from "react";
import { ActivityIndicator, Text } from "react-native";

// test data riga_bus_41
// test data 1086

const GET_TRANSPORT_SCHEDULE = gql`
    mutation GetRoutesForStop($stopId: String!) {
        getRoutesForStop(stop_id: $stopId) {
            route_id
            route_long_name
            route_type
        }
    }
`;

type getTransportSchedule = {
    getRoutesForStop: [
        { route_id: string; route_long_name: string; route_type: string }
    ];
    getTransportSchedule: [
        {
            arrival_time: string;
            drop_off_type: string;
            departure_time: string;
            pickup_type: string;
            stop_id: string;
            stop_sequence: string;
            trips: { Calendar: { monday: string; saturday: string } };
        }
    ];
};

export default function SmallSchedule() {
    const [getInformation, { data, loading }] =
        useMutation<getTransportSchedule>(GET_TRANSPORT_SCHEDULE, {
            variables: {
                stopId: "1086",
                transportId: "riga_bus_41",
            },
        });

    useEffect(() => {
        getInformation().catch(console.log);
    }, []);

    if (!data || loading)
        return (
            <Wrapper>
                <ActivityIndicator size="large" color="#0000ff" />
            </Wrapper>
        );

    return (
        <Wrapper>
            <Text>{JSON.stringify(data, null, 2)}</Text>
        </Wrapper>
    );
}

const Wrapper = styled.View({
    paddingTop: 58 / 1.5,
});
