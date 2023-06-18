import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import { Routes, GET_ROUTES } from "../../utils/graphql";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";
import { StopSearch } from "./MainMapScreen";
import {
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    TransportRow,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
} from "./SharedComponents";

export function ListOfTransport({ route, navigation }: any) {
    const { data: routes, loading } = useQuery<{ Routes: Routes[] }>(
        GET_ROUTES
    );

    const [filteredRoutes, setFilteredRoutes] = useState<Routes[]>([]);
    const { transportType } = route.params;
    const itemsColor = transportTypes.filter((x) => x.id === transportType)[0]
        .color;

    useEffect(() => {
        if (routes && routes.Routes) {
            const f = routes.Routes.filter(
                (rout) => rout.route_type === transportType
            );
            f.sort(
                (a, b) =>
                    Number(a.route_sort_order) - Number(b.route_sort_order)
            );
            setFilteredRoutes(f);
        }
    }, [routes, loading, route]);

    if (!routes || loading) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Wrapper>
                <View style={{ gap: 13 }}>
                    <StopSearch />
                    <CategoryBtnWrapper>
                        {transportTypes.map((Type, idx) => (
                            <CategoryBtn
                                onPress={() =>
                                    navigation.navigate("ListOfTransport", {
                                        transportType: Type.id,
                                    })
                                }
                                isActive={idx === transportType}
                                key={idx}
                                style={{ backgroundColor: Type.color }}
                            >
                                <Type.icon />
                                <CategoryBtnText>{Type.title}</CategoryBtnText>
                            </CategoryBtn>
                        ))}
                    </CategoryBtnWrapper>
                </View>
                <TransportRow style={{ columnGap: 10 / 1.5, rowGap: 25 / 2 }}>
                    {filteredRoutes.map((r, i) => (
                        <TransportRowBtn
                            key={i}
                            bg={itemsColor}
                            onPress={() =>
                                navigation.navigate("TransportStopsSelect", {
                                    transport: r,
                                })
                            }
                        >
                            <TransportRowText>
                                {r.route_short_name}
                            </TransportRowText>
                        </TransportRowBtn>
                    ))}
                </TransportRow>
            </Wrapper>
        </ScrollView>
    );
}
