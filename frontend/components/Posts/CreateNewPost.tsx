import { useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import {
    BigBusIcon,
    BigTramIcon,
    BigTrolleyIcon,
    LoadingIndicator,
} from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { Routes, GET_ROUTES } from "../../utils/graphql";
import { getAccessToken, useAuth } from "../../utils/tokens";
import { transportTypes } from "../Home/SharedComponents";
import { Wrapper } from "../styled/Wrapper";

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

export default function({ navigation }: any) {
    const { auth, loading: authLoading } = useAuth();


    const { data, loading } = useQuery<{ Routes: Routes[] }>(
        GET_ROUTES,
        {
            skip: !auth,
        }
    );

    const [value, setValue] = useState(0);
    const [color, setColor] = useState(COLOR_PALETE.tram);

    // useEffect(() => {
    //     getAccessToken().then((token) => {
    //         if (!token) {
    //             navigation.dispatch(
    //                 CommonActions.reset({
    //                     index: 0,
    //                     routes: [{ name: "Account" }],
    //                 })
    //             );
    //         } else {
    //             setIsAuth(true);
    //         }
    //     });
    // }, []);

    const filtered = useMemo(() => {
        if (data && data.Routes) {
            return data.Routes.filter((r) => {
                if (value === 0) {
                    return r.route_type === "900";
                } else if (value === 1) {
                    return r.route_type === "800";
                } else {
                    return r.route_type === "3";
                }
            })
                .slice()
                .sort(
                    (a, b) =>
                        Number(a.route_sort_order) - Number(b.route_sort_order)
                );
        }
    }, [data, loading, value]);

    if (!auth && !authLoading) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Account" }],
            })
        );
    }

    if (!data || loading) return <LoadingIndicator />;

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
                            {filtered?.map((r, idx) => (
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
