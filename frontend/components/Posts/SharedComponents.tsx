import { useApolloClient } from "@apollo/client";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";
import { formatRelativeTime } from "../../utils/formatTime";
import { POST, POSTS_QUERY, problemListProps } from "../../utils/graphql";
import { transportTypes } from "../Home/SharedComponents";
import { Center } from "../styled/Center";

export const NewPostBtn = styled.Pressable({
    width: 172 / 1.5,
    height: 63 / 1.5,
    backgroundColor: "#FF3838",
    // borderWidth: 1,
    // borderColor: "#CDCDCD",
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
});
export const NewPostText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 2,
    lineHeight: 42 / 2,
    color: "#FFFFFF",
});

export const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 48 / 2,
    lineHeight: 62 / 2,
    color: "#29221E",
});

export const SearchWrapper = styled.View({
    flexDirection: "row",
    gap: 8,

    flexGrow: 1,

    borderColor: COLOR_PALETE.stroke,
    borderWidth: 1,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    height: 63 / 1.5,
});

export const SearchInput = styled.TextInput({
    flex: 1,
});

export const InfoWrapper = styled.View({
    flexDirection: "row",
    gap: 10,
});

export const ProblemWrapper = styled.TouchableOpacity({
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 10,

    padding: 10,

    gap: 20 / 1.5,
});

export const TransportIcon = styled.View(({ bg }: { bg: string }) => ({
    width: 74 / 1.5,
    height: 73 / 1.5,
    backgroundColor: bg,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
}));

export const TransportIconText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    color: "#FFFFFF",
});

export const ProblemTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    color: "#29221E",
});

export const TransportDirection = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.8,
    lineHeight: 31 / 1.8,
    color: "#29221E",
});

export const ProblemDescription = styled.Text({});

export const TimeStamp = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
    color: "#29221E",
});

export function ProblemList(props: problemListProps) {
    const navigation = useNavigation() as any;
    const sortedData = useCallback(
        () =>
            props.data?.slice().sort((a, b) => {
                return (
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                );
            }),
        [props.data]
    );
    const [isRefreshing, setIsRefreshing] = useState(false);

    const client = useApolloClient();

    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [POSTS_QUERY],
            })
            .then(() => setIsRefreshing(false));
    };

    const getColor = useCallback(
        (item: POST) =>
            transportTypes.filter((x) => x.id === item.route.route_type)[0]
                .color,
        [transportTypes]
    );

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={{ zIndex: -1, minHeight: "100%" }}
            data={sortedData()}
            keyExtractor={({ id }) => id}
            contentContainerStyle={{ gap: 15 }}
            refreshControl={
                <RefreshControl
                    style={{ borderColor: COLOR_PALETE.tram }}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
            ListEmptyComponent={() => (
                <Center style={{ minHeight: "50%" }}>
                    <Text style={{ color: COLOR_PALETE.additionalText }}>
                        No posts
                    </Text>
                </Center>
            )}
            ListFooterComponent={() => (
                <View style={{ paddingBottom: 150 }}></View>
            )}
            renderItem={({ item }) => (
                <ProblemWrapper
                    activeOpacity={1}
                    onPress={() =>
                        navigation.navigate("PostView", { postId: item.id })
                    }
                >
                    <InfoWrapper>
                        <TransportIcon bg={getColor(item)}>
                            <TransportIconText>
                                {item.route.route_short_name}
                            </TransportIconText>
                        </TransportIcon>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "space-between",
                            }}
                        >
                            <ProblemTitle>{item.title}</ProblemTitle>
                            <TransportDirection>
                                {item.route.route_long_name}
                            </TransportDirection>
                        </View>
                        <View>
                            <TimeStamp>
                                {formatRelativeTime(item.created_at)}
                            </TimeStamp>
                        </View>
                    </InfoWrapper>
                    <ProblemDescription>{item.text}</ProblemDescription>
                    <View style={{flexDirection:"row", gap:20, alignSelf:"flex-end"}}>
                        <Text>{item.stop.stop_name}</Text>
                        <Text>{item.stop_time.arrival_time.slice(0, item.stop_time.arrival_time.lastIndexOf(":"))}</Text>
                    </View>
                </ProblemWrapper>
            )}
        />
    );
}
