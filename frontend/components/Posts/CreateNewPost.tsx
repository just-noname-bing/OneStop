import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { Path, Svg } from "react-native-svg";
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

    if (!isAuth) return

    const { data, loading } = useQuery<{ Routes: Routes[] }>(GET_ROUTES);
    const [value, setValue] = useState(0);
    const [color, setColor] = useState(COLOR_PALETE.tram);

    const [filteredRoutes, setFilteredRoutes] = useState<Routes[]>([]);

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

function BigTrolleyIcon() {
    return (
        <Svg width={57 / 1.5} height={89 / 1.5} viewBox="0 0 57 89" fill="none">
            <Path
                d="M14.5938 13.9065H20.4344L14.8719 4.17211C14.3156 2.78149 14.5938 1.11274 15.9844 0.278364C17.375 -0.277886 19.0438 0.000238595 19.8781 1.39086L26.8312 13.9065H31.5594L25.9969 4.17211C25.4406 2.78149 25.7188 1.11274 27.1094 0.278364C28.5 -0.277886 30.1687 0.000238595 31.0031 1.39086L37.9562 13.9065H42.4062C50.1937 13.9065 56.3125 20.0252 56.3125 27.8127V52.844V69.5315C56.3125 72.0346 55.2 74.2596 53.5312 75.6502V80.6565C53.5312 85.3846 49.9156 89.0002 45.1875 89.0002C40.4594 89.0002 36.8438 85.3846 36.8438 80.6565V77.8752H20.1562V80.6565C20.1562 85.3846 16.5406 89.0002 11.8125 89.0002C7.08437 89.0002 3.46875 85.3846 3.46875 80.6565V75.6502C1.8 74.2596 0.6875 72.0346 0.6875 69.5315V52.844V27.8127C0.6875 20.0252 6.80625 13.9065 14.5938 13.9065ZM36.8438 66.7502H45.1875C46.8562 66.7502 47.9688 65.6377 47.9688 63.969C47.9688 62.3002 46.8562 61.1877 45.1875 61.1877H36.8438C35.175 61.1877 34.0625 62.3002 34.0625 63.969C34.0625 65.6377 35.175 66.7502 36.8438 66.7502ZM11.8125 66.7502H20.1562C21.825 66.7502 22.9375 65.6377 22.9375 63.969C22.9375 62.3002 21.825 61.1877 20.1562 61.1877H11.8125C10.1437 61.1877 9.03125 62.3002 9.03125 63.969C9.03125 65.6377 10.1437 66.7502 11.8125 66.7502ZM6.25 50.0627H50.75V30.594H6.25V50.0627Z"
                fill="white"
            />
        </Svg>
    );
}
function BigBusIcon() {
    return (
        <Svg width={69 / 1.5} height={87 / 1.5} viewBox="0 0 69 87" fill="none">
            <Path
                d="M0 64.1053C0 68.1347 1.68187 71.7521 4.3125 74.2705V82.4211C4.3125 84.9395 6.25312 87 8.625 87H12.9375C15.3094 87 17.25 84.9395 17.25 82.4211V77.8421H51.75V82.4211C51.75 84.9395 53.6906 87 56.0625 87H60.375C62.7469 87 64.6875 84.9395 64.6875 82.4211V74.2705C67.3181 71.7521 69 68.1347 69 64.1053V18.3158C69 2.28947 53.5613 0 34.5 0C15.4387 0 0 2.28947 0 18.3158V64.1053ZM15.0938 68.6842C11.5144 68.6842 8.625 65.6163 8.625 61.8158C8.625 58.0153 11.5144 54.9474 15.0938 54.9474C18.6731 54.9474 21.5625 58.0153 21.5625 61.8158C21.5625 65.6163 18.6731 68.6842 15.0938 68.6842ZM53.9062 68.6842C50.3269 68.6842 47.4375 65.6163 47.4375 61.8158C47.4375 58.0153 50.3269 54.9474 53.9062 54.9474C57.4856 54.9474 60.375 58.0153 60.375 61.8158C60.375 65.6163 57.4856 68.6842 53.9062 68.6842ZM60.375 41.2105H8.625V18.3158H60.375V41.2105Z"
                fill="white"
            />
        </Svg>
    );
}
function BigTramIcon() {
    return (
        <Svg width={61 / 1.5} height={91 / 1.5} viewBox="0 0 61 91" fill="none">
            <Path
                d="M60.5 67.977V29.575C60.5 16.8805 49.3143 14.105 34.7429 13.6955L38 6.825H51.9286V0H9.07143V6.825H29.4286L26.1714 13.741C12.7571 14.1505 0.5 16.9715 0.5 29.575V67.977C0.5 74.5745 5.6 80.08 11.6 81.4905L4.78571 88.725V91H14.3429L22.9143 81.9H39.0714L47.6429 91H56.2143V88.725L49.7857 81.9H49.4429C56.6857 81.9 60.5 75.6665 60.5 67.977ZM30.5 75.075C26.9429 75.075 24.0714 72.0265 24.0714 68.25C24.0714 64.4735 26.9429 61.425 30.5 61.425C34.0571 61.425 36.9286 64.4735 36.9286 68.25C36.9286 72.0265 34.0571 75.075 30.5 75.075ZM51.9286 54.6H9.07143V31.85H51.9286V54.6Z"
                fill="white"
            />
        </Svg>
    );
}

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
