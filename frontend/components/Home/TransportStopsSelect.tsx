import { COLOR_PALETE } from "../../utils/colors";
import React, { useEffect, useMemo, useState } from "react";
import {
    TransportRowBtn,
    TransportRowText,
    transportTypes,
    Wrapper,
} from "./SharedComponents";
import { ActivityIndicator, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "@emotion/native";
import { ScrollView } from "react-native-gesture-handler";
import { Routes } from "./ListOfTransport";
import { gql, split, useMutation } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import { Center } from "../styled/Center";
import { Stop } from "./MainMapScreen";

const GET_TRANSPORT_DIRECTION_STOPS = gql`
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

type getTransportDirectionStops = {
    stops: Stop;
    stop_id: string;
    trip_id: string;
};

type doubleDirection = {
    asc: getTransportDirectionStops[];
    desc: getTransportDirectionStops[];
};

export function TransportStopsSelect({ route, navigation }: any) {
    const transport = route.params.transport as Routes;
    const [open, setOpen] = useState(false);
    const splitRouteName = transport.route_long_name.split("-");
    const [items, setItems] = useState([
        { label: transport.route_long_name, value: 0 },
        { label: [splitRouteName[1], splitRouteName[0]].join(" - "), value: 1 },
    ]);
    const [value, setValue] = useState(items[0].value);

    const transportColor = transportTypes.filter(
        (x) => x.id === transport.route_type
    )[0].color;

    const [fetchDirections, { data, loading }] = useMutation<doubleDirection>(
        GET_TRANSPORT_DIRECTION_STOPS,
        {
            variables: {
                transportId: transport.route_id,
                order1: "0",
                order2: "1",
            },
        }
    );

    const RenderStopBtns = () => {
        if (data) {
            return;
        }
    };

    useEffect(() => {
        fetchDirections().catch(console.log);
    }, []);

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
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                    />
                </View>
            </View>
            {!data || loading ? (
                <Center>
                    <ActivityIndicator size="large" color="#0000ff" />
                </Center>
            ) : (
                <ScrollView
                    style={{ flexGrow: 1, zIndex: -1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ paddingBottom: 50 }}>
                        {(!value ? data.asc : data.desc).map((stop, idx) => (
                            <StopBtn
                                key={idx}
                                onPress={() =>
                                    navigation.navigate("BigSchedule", {
                                        transport,
                                        stop: stop.stops,
                                    })
                                }
                            >
                                <StopBtnText>
                                    {stop.stops.stop_name}
                                </StopBtnText>
                            </StopBtn>
                        ))}
                    </View>
                </ScrollView>
            )}
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
