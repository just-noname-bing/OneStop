import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";

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
    const navigation = useNavigation();
    const [searchInput, setSearchInput] = useState(searchQuery);

    const { data, loading, refetch } = useQuery<{ stopsSearch: stopSearch[] }>(
        STOP_SEARCH_QUERY,
        { variables: { stopName: searchInput } }
    );

    console.log(data)

    return (
        <Wrapper>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 16,
                }}
            >
                <SearchWrapper>
                    <Pressable>
                        <Lupa />
                    </Pressable>
                    <SearchInput
                        onChangeText={(e) => setSearchInput(e)}
                        onSubmitEditing={() =>
                            navigation.setParams({ query: searchInput } as any)
                        }
                        value={searchInput}
                    />
                </SearchWrapper>
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
                            renderItem={({ item }) => (
                                <StopBtn key={item.stop_id}>
                                    <StopBtnText>{item.stop_name}</StopBtnText>
                                </StopBtn>
                            )}
                        />
                    )}
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
