import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";
import { StopSearch } from "./MainMapScreen";
import { transportTypes } from "./SharedComponents";

const STOP_SEARCH_QUERY = gql`
    query StopsSearch($stopName: String!) {
        stopsSearch(stop_name: $stopName) {
            route {
                route_id
                route_short_name
                route_long_name
                route_type
            }
            stop_id
            stop_name
        }
    }
`;

type stopSearch = {
    route: [
        {
            route_id: string;
            route_short_name: string;
            route_long_name: string;
            route_type: string;
        }
    ];
    stop_id: string;
    stop_name: string;
};

export function StopResults({ route }: any) {
    const searchQuery = route.params.query as string;
    const navigation = useNavigation() as any;

    const { data, loading } = useQuery<{ stopsSearch: stopSearch[] }>(
        STOP_SEARCH_QUERY,
        {
            variables: { stopName: searchQuery },
            skip: searchQuery === "" || searchQuery.trim().length === 0,
        }
    );

    return (
        <Wrapper>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <StopSearch value={searchQuery} />
            </View>
            <ScrollView
                style={{ flexGrow: 1, minHeight: "100%" }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingBottom: 50, minHeight: "100%" }}>
                    {loading ? (
                        <LoadingIndicator />
                    ) : (
                        <FlatList
                            scrollEnabled={false}
                            data={data?.stopsSearch}
                            style={{ paddingBottom: 100 }}
                            ListEmptyComponent={
                                <Center style={{ minHeight: "50%" }}>
                                    <Text
                                        style={{
                                            color: COLOR_PALETE.additionalText,
                                        }}
                                    >
                                        No results found
                                    </Text>
                                </Center>
                            }
                            renderItem={({ item, index: i }) => (
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("SmallSchedule", {
                                            stop: item,
                                        })
                                    }
                                    key={i}
                                >
                                    <StopBtn key={item.stop_id}>
                                        <StopBtnText>
                                            {item.stop_name}
                                        </StopBtnText>
                                    </StopBtn>
                                    <FlatList
                                        data={item.route}
                                        scrollEnabled={false}
                                        contentContainerStyle={{
                                            gap: 5,
                                            flexDirection: "row",
                                            borderBottomWidth: 1,
                                            borderBottomColor:
                                                COLOR_PALETE.stroke,
                                            paddingBottom: 20,
                                        }}
                                        renderItem={({
                                            item: routes,
                                            index: j,
                                        }) => (
                                            <NearTransportCodeWrapper
                                                bg={
                                                    transportTypes.filter(
                                                        (x) =>
                                                            routes.route_type ===
                                                            x.id
                                                    )[0].color
                                                }
                                                key={`${i}@${j}`}
                                            >
                                                <NearTransportCode>
                                                    {routes.route_short_name}
                                                </NearTransportCode>
                                            </NearTransportCodeWrapper>
                                        )}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </ScrollView>
        </Wrapper>
    );
}

const StopBtn = styled.View({
    paddingVertical: 30 / 1.5,
});

const StopBtnText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 2,
    lineHeight: 42 / 2,
    color: COLOR_PALETE.text,
});

const NearTransportCodeWrapper = styled.View(({ bg }: { bg: string }) => ({
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bg,
    borderRadius: 5,
}));

const NearTransportCode = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "white",
});
