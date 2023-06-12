import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { BigBusIcon, BigTramIcon, BigTrolleyIcon } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { getAccessToken } from "../../utils/tokens";
import { Routes } from "../Home/ListOfTransport";
import { transportTypes, Wrapper } from "../Home/SharedComponents";
import { Center } from "../styled/Center";

const GET_ROUTES = gql`
    query Routes {
        Routes {
            route_id
            route_long_name
            route_short_name
            route_type
            route_sort_order
        }
    }
`;

// { id: "900", title: "Tram", color: COLOR_PALETE.tram, icon: BusIcon },
// {
//     id: "800" ,
//     title: "Trolley",
//     color: COLOR_PALETE.troleybus,
//     icon: BusIcon,
// },
// { id: "3",  title: "Bus", color: COLOR_PALETE.bus, icon: BusIcon },
//
const Icons = [<BigTrolleyIcon />, <BigTramIcon />, <BigBusIcon />];

export default function ({ navigation }: any) {
    const [isAuth, setIsAuth] = useState(false);


    const { data, loading } = useQuery<{ Routes: Routes[] }>(GET_ROUTES);
    const [value, setValue] = useState(0);
    const [color, setColor] = useState(COLOR_PALETE.tram);

    const [filteredRoutes, setFilteredRoutes] = useState<Routes[]>([]);

    useEffect(() => {
        getAccessToken().then((token) => {
            if (!token) {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Account" }],
                    })
                );
            } else {
                setIsAuth(true);
            }
        });
    }, []);

    useEffect(() => {
        if (data && data.Routes) {
            const f = data.Routes.filter((r) => {
                if (value === 0) {
                    return r.route_type === "900";
                } else if (value === 1) {
                    return r.route_type === "800";
                } else {
                    return r.route_type === "3";
                }
            });
            f.sort((a, b) => {
                return Number(a.route_sort_order) - Number(b.route_sort_order);
            });
            setFilteredRoutes(f);
        }
    }, [data, loading, value]);

    if (!isAuth) return <></>

    if (!data || loading)
        return (
            <Center>
                <ActivityIndicator size="large" color="#0000ff" />
            </Center>
        );

    return (
        <Wrapper>
            <View style={{ height: "100%" }}>
                <SelectorWrapper style={{ flexGrow: 1 }}>
                    <View style={{ gap: 12 }}>
                        {transportTypes.map((type, idx) => (
                            <BigSelectorWrapper
                                onPress={() => {
                                    setValue(idx);
                                    setColor(type.color);
                                }}
                                Selected={value === idx}
                                key={idx}
                                bg={type.color}
                            >
                                {Icons[idx]}
                            </BigSelectorWrapper>
                        ))}
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TransportWrapper>
                            {filteredRoutes.map((r, idx) => (
                                <TransportBtn
                                    key={idx}
                                    bg={color}
                                    onPress={() =>
                                        navigation.navigate("WhatHappend", {
                                            transport: r,
                                        })
                                    }
                                >
                                    <TransportText>
                                        {r.route_short_name}
                                    </TransportText>
                                </TransportBtn>
                            ))}
                        </TransportWrapper>
                    </ScrollView>
                </SelectorWrapper>
            </View>
        </Wrapper>
    );
}

const SelectorWrapper = styled.View({
    flexDirection: "row",
    gap: 20 / 1.5,
});

const BigSelectorWrapper = styled.Pressable(
    ({ Selected, bg }: { Selected?: boolean; bg: string }) => ({
        backgroundColor: Selected ? bg : COLOR_PALETE.additionalText,
        width: 127 / 1.5,
        height: 127 / 1.5,
        borderRadius: 10,

        justifyContent: "center",
        alignItems: "center",
    })
);

const TransportWrapper = styled.View({
    paddingBottom: 50,
    columnGap: 15,
    rowGap: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    flex: 1,
});

export const TransportBtn = styled.Pressable(({ bg }: { bg: string }) => ({
    width: 64 / 1.5,
    height: 64 / 1.5,
    backgroundColor: bg,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
}));

export const TransportText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    alignItems: "center",
    textAlign: "center",

    color: "#FFFFFF",
});
