import { COLOR_PALETE } from "../../utils/colors";
import React, { useMemo, useState } from "react";
import {
    TransportRowBtn,
    TransportRowText,
    transportTypes,
    Wrapper,
} from "./SharedComponents";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import styled from "@emotion/native";
import { ScrollView } from "react-native-gesture-handler";
import { Routes } from "./ListOfTransport";
import { gql, useMutation } from "@apollo/client";

const GET_TRANSPORT_DIRECTION_STOPS = gql`
    mutation GetTransportDirectionStops(
        $transportId: String!
        $order: String!
    ) {
        getTransportDirectionStops(transport_id: $transportId, order: $order) {
            stop_name
        }
    }
`;

export function TransportStopsSelect({ route }: any) {
    const transport = route.params.transport as Routes;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: transport.route_long_name, value: 0 },
    ]);
    const [value, setValue] = useState(items[0].value);

    const transportColor = transportTypes.filter(
        (x) => x.id === transport.route_type
    )[0].color;

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
            <ScrollView
                style={{ flexGrow: 1, zIndex: -1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingBottom: 50 }}>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                    <StopBtn>
                        <StopBtnText>Kleistu iela</StopBtnText>
                    </StopBtn>
                </View>
            </ScrollView>
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
