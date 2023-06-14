import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { RefreshControl } from "react-native";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LoadingIndicator } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { formatRelativeTime } from "../../utils/formatTime";
import { LOGOUT_MUTATION } from "../../utils/graphql";
import { TokensLogout, useAuth } from "../../utils/tokens";
import {
    InfoWrapper,
    ProblemDescription,
    ProblemTitle,
    ProblemWrapper,
    TimeStamp,
    TransportDirection,
    TransportIcon,
    TransportIconText,
} from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";

const GET_ME_QUERY = gql`
    query Me {
        me {
            id
            name
            surname
            email
            Post {
                created_at
                updated_at
                title
                text
                route {
                    route_short_name
                }
            }
            Comment {
                Post {
                    id
                }
                text
                created_at
                updated_at
            }
            created_at
            updated_at
        }
    }
`;

type getMeQuery = {
    id: string;
    name: string;
    surname: string;
    email: string;
    Post: [
        {
            created_at: Date;
            updated_at: Date;
            title: string;
            text: string;
            route: {
                route_short_name: string;
            };
        }
    ];
    Comment: [
        {
            Post: {
                id: string;
            };
            text: string;
            created_at: Date;
            updated_at: Date;
        }
    ];
    created_at: Date;
    updated_at: Date;
};

export default function ({}: any) {
    const [logout] = useMutation(LOGOUT_MUTATION);
    const navigation = useNavigation() as any;

    const { data: me, loading } = useQuery<{ me: getMeQuery }>(GET_ME_QUERY);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPosts, setShowPosts] = useState(true);

    const orderedPosts = useMemo(() => {
        return me?.me.Post.slice().sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [me]);

    const orderedComments = useMemo(() => {
        return me?.me.Comment.slice().sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [me?.me]);

    const client = useApolloClient();

    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [GET_ME_QUERY],
            })
            .then(() => setIsRefreshing(false));
    };

    const { rf, loading: authLoading } = useAuth();

    if (!me?.me || loading || authLoading) <LoadingIndicator />;

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <Wrapper>
                <View style={{ gap: 30 }}>
                    <InputWrapper>
                        <Lable>Name:</Lable>
                        <InputField value={me?.me.name} />
                    </InputWrapper>
                    <InputWrapper>
                        <Lable>Surname:</Lable>
                        <InputField value={me?.me.surname} />
                    </InputWrapper>
                    <InputWrapper>
                        <Lable>E-mail:</Lable>
                        <InputField
                            value={me?.me.email}
                            editable={false}
                            style={{ color: COLOR_PALETE.additionalText }}
                        />
                    </InputWrapper>
                </View>
                <ConfirmWrapper>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <ConfirmBtn isPrimary>
                            <ConfirmText isPrimary>confirm</ConfirmText>
                        </ConfirmBtn>
                        <ConfirmBtn
                            onPress={async () => {
                                await logout({
                                    variables: { token: rf },
                                });
                                await TokensLogout();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: "Account" }],
                                    })
                                );
                            }}
                        >
                            <ConfirmText>logout</ConfirmText>
                        </ConfirmBtn>
                    </View>
                </ConfirmWrapper>

                <HistoryWrapper>
                    <HistoryCategory
                        isSelected={showPosts}
                        onPress={() =>
                            !showPosts
                                ? setShowPosts(true)
                                : console.log("bomb1")
                        }
                    >
                        Post History
                    </HistoryCategory>
                    <HistoryCategory
                        isSelected={!showPosts}
                        onPress={() =>
                            showPosts
                                ? setShowPosts(false)
                                : console.log("bomb2")
                        }
                    >
                        Comment history
                    </HistoryCategory>
                </HistoryWrapper>

                {showPosts ? (
                    <FlatList
                        data={orderedPosts}
                        contentContainerStyle={{ gap: 15 }}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ProblemWrapper
                                activeOpacity={1}
                                onPress={() =>
                                    navigation.navigate("PostView", {
                                        postId: "",
                                    })
                                }
                            >
                                <InfoWrapper>
                                    <TransportIcon bg={COLOR_PALETE.bus}>
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
                                        <ProblemTitle>
                                            {item.title}
                                        </ProblemTitle>
                                        <TransportDirection></TransportDirection>
                                    </View>
                                    <View>
                                        <TimeStamp>
                                            {formatRelativeTime(
                                                item.created_at
                                            )}
                                        </TimeStamp>
                                    </View>
                                </InfoWrapper>
                                <ProblemDescription>
                                    {item.text}
                                </ProblemDescription>
                            </ProblemWrapper>
                        )}
                    />
                ) : (
                    <Center>
                        <Text>Show comments</Text>
                    </Center>
                )}
            </Wrapper>
        </ScrollView>
    );
}

const Lable = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    color: "#29221E",

    flex: 0.5,
});

const InputField = styled.TextInput(({ isError }: { isError?: boolean }) => ({
    flex: 1,
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: isError ? "#FF3838" : "#9B9B9B",
}));

const InputWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});

const ConfirmBtn = styled.Pressable(
    ({ isPrimary }: { isPrimary?: boolean }) => ({
        minHeight: 50 / 1.5,
        paddingHorizontal: 54 / 1.5,
        backgroundColor: isPrimary ? "#FF3838" : "transparent",
        borderColor: "#FF3838",
        borderWidth: !isPrimary ? 1 : 0,
        borderRadius: 13,

        justifyContent: "center",
        alignItems: "center",
    })
);

const ConfirmText = styled.Text(({ isPrimary }: { isPrimary?: boolean }) => ({
    color: isPrimary ? "white" : COLOR_PALETE.text,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
}));

const ConfirmWrapper = styled.View({
    alignItems: "flex-end",
});

const HistoryWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 74,
});

const HistoryCategory = styled.Text(
    ({ isSelected }: { isSelected?: boolean }) => ({
        color: isSelected ? COLOR_PALETE.tram : COLOR_PALETE.additionalText,
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 24 / 1.5,
        lineHeight: 31 / 1.5,
    })
);
