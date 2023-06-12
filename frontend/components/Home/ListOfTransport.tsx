import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Lupa } from "../../assets/icons";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import {
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    TransportRow,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
    Wrapper,
} from "./SharedComponents";

const ROUTES_QUERY = gql`
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

export function ListOfTransport({ route, navigation }: any) {
    const { data: routes, loading } = useQuery<{ Routes: Routes[] }>(
        ROUTES_QUERY
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
        return (
            <Center>
                <ActivityIndicator size="large" color="#0000ff" />
            </Center>
        );
    }

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Wrapper>
                <View style={{ gap: 13 }}>
                    <SearchWrapper>
                        <Lupa />
                        <SearchInput />
                    </SearchWrapper>
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
