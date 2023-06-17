import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import {
    CommonActions,
    StackActions,
    useNavigation,
} from "@react-navigation/native";
import { ErrorMessage, Formik, FormikHelpers } from "formik";
import { useContext, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    View,
} from "react-native";
import { RefreshControl } from "react-native";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { withDecay } from "react-native-reanimated";
import { LoadingIndicator } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { ShowAdminMenuContext } from "../../utils/context";
import { formatRelativeTime } from "../../utils/formatTime";
import { LOGOUT_MUTATION } from "../../utils/graphql";
import { TokensLogout, useAuth } from "../../utils/tokens";
import {
    FieldError,
    UPDATE_USER_INPUT_SCHEMA,
} from "../../utils/validationSchema";
import { transportTypes } from "../Home/SharedComponents";
import { CommentAuthor, CommentAuthorWrapper } from "../Posts/PostView";
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
            role
            verified
            Post {
                id
                created_at
                updated_at
                title
                text
                route {
                    route_short_name
                    route_long_name
                    route_id
                    route_desc
                    route_type
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
    role: "MODERATOR" | "ADMIN" | "DEFAULT";
    verified: boolean;
    Post: [
        {
            id: string;
            created_at: Date;
            updated_at: Date;
            title: string;
            text: string;
            route: {
                route_short_name: string;
                route_long_name: string;
                route_id: string;
                route_desc: string;
                route_type: string;
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

const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($options: updateUserInput!, $updateUserId: String!) {
        updateUser(options: $options, id: $updateUserId) {
            data {
                id
            }
            errors {
                field
                message
            }
        }
    }
`;

type updateUserMutation = {
    data: {
        id: string;
    };
    errors: FieldError[];
};

export default function ({ route }: any) {
    const [logout] = useMutation(LOGOUT_MUTATION);
    const [updateUser] = useMutation<{ updateUser: updateUserMutation }>(
        UPDATE_USER_MUTATION
    );
    const navigation = useNavigation() as any;

    const { rf, payload, auth, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!auth && !authLoading) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Account" }],
                })
            );
        }
    }, [auth, authLoading]);

    const { data: me, loading } = useQuery<{ me: getMeQuery }>(GET_ME_QUERY, {
        fetchPolicy: "cache-and-network",
    });

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPosts, setShowPosts] = useState(true);

    const orderedPosts = useMemo(() => {
        return me?.me.Post.slice().sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [me]);

    // const orderedComments = useMemo(() => {
    //     return me?.me.Comment.slice().sort(
    //         (a, b) =>
    //             new Date(b.created_at).getTime() -
    //             new Date(a.created_at).getTime()
    //     );
    // }, [me?.me]);
    const orderedComments = useMemo(() => {
        return me?.me.Comment.slice().sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [me, loading, route]);

    const client = useApolloClient();

    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [GET_ME_QUERY],
            })
            .then(() => setIsRefreshing(false));
    };

    if (!me?.me || loading || authLoading) return <LoadingIndicator />;

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
                <Formik
                    initialValues={{
                        name: me.me.name,
                        surname: me.me.surname,
                        email: me.me.email,
                        role: "DEFAULT",
                        verified: me.me.verified,
                    }}
                    validationSchema={UPDATE_USER_INPUT_SCHEMA}
                    validateOnChange={true}
                    validateOnBlur={false}
                    validateOnMount={false}
                    onSubmit={async (values, a) => {
                        console.log(values, me.me.id);

                        const response = await updateUser({
                            variables: {
                                options: values,
                                updateUserId: me.me.id,
                            },
                        });

                        if (response.data?.updateUser) {
                            if (response.data.updateUser.errors?.length) {
                                response.data.updateUser.errors.forEach(
                                    (error) => {
                                        console.log(error);
                                        a.setErrors({
                                            [error.field]: error.message,
                                        });
                                    }
                                );
                                return;
                            }

                            // success

                            Alert.alert("Fields are successfuly changed");
                        } else {
                            return Alert.alert("Something went wrong");
                        }
                    }}
                >
                    {({ values, handleSubmit, isSubmitting, handleChange }) => (
                        <>
                            <View style={{ gap: 30 }}>
                                <InputWrapper>
                                    <Lable>Name:</Lable>
                                    <InputField
                                        onChangeText={handleChange("name")}
                                        editable={me.me.role !== "ADMIN"}
                                        value={values.name}
                                        style={{
                                            color:
                                                me.me.role === "ADMIN"
                                                    ? COLOR_PALETE.additionalText
                                                    : "black",
                                        }}
                                    />
                                </InputWrapper>
                                <ErrorMessage name="name">
                                    {(msg) => (
                                        <Text
                                            style={{
                                                color: COLOR_PALETE.tram,
                                            }}
                                        >
                                            {msg}
                                        </Text>
                                    )}
                                </ErrorMessage>
                                <InputWrapper>
                                    <Lable>Surname:</Lable>
                                    <InputField
                                        onChangeText={handleChange("surname")}
                                        editable={payload?.role !== "ADMIN"}
                                        value={values.surname}
                                        style={{
                                            color:
                                                me.me.role === "ADMIN"
                                                    ? COLOR_PALETE.additionalText
                                                    : "black",
                                        }}
                                    />
                                </InputWrapper>
                                <ErrorMessage name="surname">
                                    {(msg) => (
                                        <Text
                                            style={{
                                                color: COLOR_PALETE.tram,
                                            }}
                                        >
                                            {msg}
                                        </Text>
                                    )}
                                </ErrorMessage>
                                <InputWrapper>
                                    <Lable>E-mail:</Lable>
                                    <InputField
                                        value={me?.me.email}
                                        editable={false}
                                        style={{
                                            color: COLOR_PALETE.additionalText,
                                        }}
                                    />
                                </InputWrapper>
                            </View>
                            <ConfirmWrapper>
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                    {me.me.role !== "ADMIN" && (
                                        <ConfirmBtn
                                            disabled={isSubmitting}
                                            onPress={handleSubmit as any}
                                            isPrimary
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator
                                                    color={"white"}
                                                />
                                            ) : (
                                                <ConfirmText isPrimary>
                                                    confirm
                                                </ConfirmText>
                                            )}
                                        </ConfirmBtn>
                                    )}
                                    <ConfirmBtn
                                        onPress={async () => {
                                            await logout({
                                                variables: { token: rf },
                                            });
                                            await TokensLogout();

                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        { name: "Account" },
                                                    ],
                                                })
                                            );
                                        }}
                                    >
                                        <ConfirmText>logout</ConfirmText>
                                    </ConfirmBtn>
                                </View>
                            </ConfirmWrapper>
                        </>
                    )}
                </Formik>

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
                        contentContainerStyle={{ gap: 15}}
                        ListEmptyComponent={
                            <Center style={{paddingVertical:"20%"}}>
                                <Text
                                    style={{
                                        color: COLOR_PALETE.additionalText,
                                    }}
                                >
                                    No posts
                                </Text>
                            </Center>
                        }
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <ProblemWrapper
                                activeOpacity={1}
                                onPress={() => {
                                    // navigation.navigate("Posts", {
                                    //     screen: "PostView",
                                    //     params: { postId: item.id },
                                    // });
                                    navigation.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: "Posts",
                                                state: {
                                                    routes: [
                                                        { name: "PostsFeed" },
                                                        {
                                                            name: "PostView",
                                                            params: {
                                                                postId: item.id,
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    });
                                }}
                            >
                                <InfoWrapper>
                                    <TransportIcon
                                        bg={
                                            transportTypes.filter(
                                                (x) =>
                                                    x.id ===
                                                    item.route.route_type
                                            )[0].color
                                        }
                                    >
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
                    <FlatList
                        scrollEnabled={false}
                        data={orderedComments}
                        contentContainerStyle={{ gap: 10 }}
                        ListEmptyComponent={
                            <Center>
                                <Text
                                    style={{
                                        color: COLOR_PALETE.additionalText,
                                    }}
                                >
                                    No comments
                                </Text>
                            </Center>
                        }
                        renderItem={({ item, index }) => (
                            <ProblemWrapper
                                key={index}
                                activeOpacity={1}
                                onPress={() =>
                                    navigation.reset({
                                        index: 0,
                                        routes: [
                                            {
                                                name: "Posts",
                                                state: {
                                                    routes: [
                                                        { name: "PostsFeed" },
                                                        {
                                                            name: "PostView",
                                                            params: {
                                                                postId: item
                                                                    .Post.id,
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    })
                                }
                            >
                                <CommentAuthorWrapper>
                                    <CommentAuthor>You:</CommentAuthor>
                                    <TimeStamp>
                                        {formatRelativeTime(item.created_at)}
                                    </TimeStamp>
                                </CommentAuthorWrapper>
                                <ProblemDescription>
                                    {item.text}
                                </ProblemDescription>
                            </ProblemWrapper>
                        )}
                    />
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
