import { COLOR_PALETE } from "../../utils/colors";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import styled from "@emotion/native";
import { Wrapper } from "../styled/Wrapper";
import {} from "./SharedComponents";
import DropDownPicker from "react-native-dropdown-picker";
import { gql, useQuery } from "@apollo/client";
import { FlatList } from "react-native-gesture-handler";
import { LoadingIndicator } from "../../assets/icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Routes } from "../../utils/graphql";
import { TransportRowBtn, TransportRowText, transportTypes } from "../Home/SharedComponents";

const GET_TRANSPORT_DIRECTION_STOPS = gql`
    query GetTransportDirectionStops2($transportId: String!) {
        getTransportDirectionStops2(transport_id: $transportId) {
            route_short_name
            route_long_name
            route_id
            route_sort_order
            route_type
            trips {
                trip_headsign
                service_id
                shape_id
                direction_id
                stop_times {
                    stop_sequence
                    stops {
                        stop_name
                        stop_id
                    }
                }
            }
        }
    }
`;

type getTransportDirectionStops = {
    route_short_name: string;
    route_long_name: string;
    route_id: string;
    route_sort_order: string;
    route_type: string;
    trips: {
        trip_headsign: string;
        service_id: string;
        shape_id: string;
        direction_id: string;
        stop_times: {
            stop_sequence: string;
            stops: {
                stop_name: string;
                stop_id: string;
            };
        }[];
    }[];
};

export function TransportSelectorForPost({ route }: any) {
    const transport = route.params.transport as Routes;
    const navigation = useNavigation() as any;

    const { data, loading } = useQuery<{
        getTransportDirectionStops2: getTransportDirectionStops;
    }>(GET_TRANSPORT_DIRECTION_STOPS, {
        variables: { transportId: transport.route_id },
    });

    const directions = useMemo(() => {
        if (data?.getTransportDirectionStops2) {
            const d = data.getTransportDirectionStops2.trips.map((x, i) => {
                const y =
                    x.stop_times[0].stops.stop_name +
                    " - " +
                    x.stop_times[x.stop_times.length - 1].stops.stop_name;
                return {
                    label: y,
                    value: i,
                    id: x.shape_id,
                };
            });

            return d;
        }

        return [];
    }, [data, transport]);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(null as any);
    const [value, setValue] = useState(null as any);

    useEffect(() => {
        if (directions[0]) {
            setItems(directions);
            setValue(directions[0].value);
        }
    }, [directions]);

    const transportColor = useMemo(() => {
        return transportTypes.filter((x) => x.id === transport.route_type)[0]
            .color;
    }, [route]);

    const orderedTrips = useMemo(() => {
        if (data?.getTransportDirectionStops2 && items) {
            return data.getTransportDirectionStops2.trips.filter(
                (x) => x.shape_id === items[value].id
            );
        }

        return [];
    }, [directions, data, value]);

    if (loading || !data || items === null || value === null)
        return <LoadingIndicator />;
    return (
        <Wrapper style={{ gap: 40 / 1.5 }}>
            <View style={{ flexDirection: "row", gap: 18 / 1.5 }}>
                <TransportRowBtn bg={transportColor}>
                    <TransportRowText>
                        {transport.route_short_name}
                    </TransportRowText>
                </TransportRowBtn>
                <View style={{ flex: 1 }}>
                    <DropDownPicker
                        style={{
                            minHeight: 69 / 1.5,
                            borderColor: COLOR_PALETE.stroke,
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                    />
                </View>
            </View>

            <FlatList
                style={{ zIndex: -1, minHeight: "100%" }}
                contentContainerStyle={{ paddingBottom: 100 }}
                data={orderedTrips[0].stop_times}
                renderItem={({ item }) => (
                    <StopBtn
                        key={item.stops.stop_id}
                        onPress={() =>
                            navigation.navigate("TransportStopTimeSelector", {
                                transport,
                                stop: item.stops,
                            })
                        }
                    >
                        <StopBtnText>{item.stops.stop_name}</StopBtnText>
                    </StopBtn>
                )}
            />
        </Wrapper>
    );
}

const StopBtn = styled.Pressable({
    borderBottomWidth: 1,
    borderColor: COLOR_PALETE.stroke,

    padding: 30 / 1.5,
});

const StopBtnText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 2,
    lineHeight: 42 / 2,
    color: COLOR_PALETE.text,
});
