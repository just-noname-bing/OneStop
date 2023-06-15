import {
    ApolloClient,
    gql,
    useApolloClient,
    useMutation,
    useQuery,
} from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions } from "@react-navigation/native";
import { ErrorMessage, Formik, FormikHelpers, FormikValues } from "formik";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    FlatList,
    Keyboard,
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { formatRelativeTime } from "../../utils/formatTime";
import { GET_POST_BY_ID, POST_BY_ID } from "../../utils/graphql";
import { getAccessToken } from "../../utils/tokens";
import { COMMENT_INPUT_SCHEMA, FieldError } from "../../utils/validationSchema";
import { transportTypes } from "../Home/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";
import {
    InfoWrapper,
    NewPostBtn,
    NewPostText,
    ProblemDescription,
    ProblemTitle,
    ProblemWrapper,
    SearchInput,
    SearchWrapper,
    TimeStamp,
    Title,
    TransportDirection,
    TransportIcon,
    TransportIconText,
} from "./SharedComponents";

const defaultFields = {
    text: "",
};

const CREATE_COMMENT_MUTATION = gql`
    mutation CreateComment($options: commentInput!) {
        createComment(options: $options) {
            data {
                id
                author_id
                text
                created_at
                updated_at
            }
            errors {
                field
                message
            }
        }
    }
`;

type createCommentMutation = {
    data: {
        id: string;
        author_id: string;
        text: string;
        created_at: string;
        updated_at: string;
    };
    errors: FieldError[];
};

export default function({ navigation, route }: any) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    // const [, setToken] = useContext(TokenContext);

    const postId = route.params.postId as string;

    const [isRefreshing, setIsRefreshing] = useState(false);
    const client = useApolloClient();
    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [GET_POST_BY_ID],
            })
            .then(() => setIsRefreshing(false));
    };
    const [createComment] = useMutation<{
        createComment: createCommentMutation;
    }>(CREATE_COMMENT_MUTATION);

    const { data, loading } = useQuery<{ getPost: POST_BY_ID }>(
        GET_POST_BY_ID,
        {
            variables: { id: postId },
        }
    );

    const orderedComments = useMemo(() => {
        return data?.getPost.Comment.slice().sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
        );
    }, [data, loading, route]);

    useEffect(() => {
        getAccessToken().then((token) => {
            setIsAuth(!!token);
        });
    }, []);

    if (isAuth === null) return <></>;

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ flexGrow: 1 }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ minHeight: "100%" }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <Wrapper style={{ gap: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <Title>Last updates</Title>
                        </View>
                        <NewPostBtn
                            onPress={() => navigation.navigate("CreateNewPost")}
                        >
                            <NewPostText>New post</NewPostText>
                        </NewPostBtn>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 16,
                        }}
                    >
                        <SearchWrapper>
                            <Lupa />
                            <SearchInput />
                        </SearchWrapper>
                    </View>

                    {!data || !data.getPost || loading ? (
                        <LoadingIndicator />
                    ) : (
                        <>
                            <ProblemWrapper activeOpacity={1}>
                                <InfoWrapper>
                                    <TransportIcon
                                        bg={
                                            transportTypes.filter(
                                                (x) =>
                                                    x.id ===
                                                    data.getPost.route
                                                        .route_type
                                            )[0].color
                                        }
                                    >
                                        <TransportIconText>
                                            {
                                                data.getPost.route
                                                    .route_short_name
                                            }
                                        </TransportIconText>
                                    </TransportIcon>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <ProblemTitle>
                                            {data.getPost.title}
                                        </ProblemTitle>
                                        <TransportDirection>
                                            {data.getPost.route.route_long_name}
                                        </TransportDirection>
                                    </View>
                                    <View>
                                        <TimeStamp>
                                            {formatRelativeTime(
                                                data.getPost.created_at
                                            )}
                                        </TimeStamp>
                                    </View>
                                </InfoWrapper>
                                <ProblemDescription>
                                    {data.getPost.text}
                                </ProblemDescription>
                            </ProblemWrapper>

                            {isAuth && (
                                <Formik
                                    initialValues={{ ...defaultFields, postId }}
                                    validationSchema={COMMENT_INPUT_SCHEMA}
                                    validateOnChange={true}
                                    validateOnMount={false}
                                    validateOnBlur={false}
                                    onSubmit={async (values, actions) => {
                                        let response = null;
                                        try {
                                            response = await createComment({
                                                variables: { options: values },
                                            });
                                        } catch {
                                            console.log("something went wrong");
                                            // navigation.dispatch(
                                            //     CommonActions.reset({
                                            //         index: 0,
                                            //         routes: [
                                            //             { name: "Account" },
                                            //         ],
                                            //     })
                                            // );
                                            return;
                                        }

                                        if (
                                            response.errors?.length ||
                                            !response.data
                                        ) {
                                            return Alert.alert(
                                                "something went wrong"
                                            );
                                        }

                                        const { errors } =
                                            response.data.createComment;

                                        if (errors?.length) {
                                            return errors.forEach((error) => {
                                                actions.setErrors({
                                                    [error["field"]]:
                                                        error.message,
                                                });
                                            });
                                        }

                                        actions.setValues(
                                            { ...values, text: "" },
                                            true
                                        );

                                        actions.resetForm();
                                        await client.refetchQueries({
                                            include: [GET_POST_BY_ID],
                                        });
                                    }}
                                >
                                    {({
                                        isSubmitting,
                                        handleChange,
                                        handleSubmit,
                                        values,
                                        errors,
                                    }) => (
                                        <View style={{ gap: 25 / 1.5 }}>
                                            <CommentInput
                                                onChangeText={handleChange(
                                                    "text"
                                                )}
                                                value={values.text}
                                                multiline={true}
                                                placeholder="Write your comment"
                                                style={
                                                    !!errors.text
                                                        ? {
                                                            borderColor:
                                                                COLOR_PALETE.tram,
                                                        }
                                                        : {}
                                                }
                                            />
                                            <ErrorMessage name="text">
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
                                            <CreateCommentBtn
                                                disabled={isSubmitting}
                                                onPress={handleSubmit as any}
                                            >
                                                {isSubmitting ? (
                                                    <ActivityIndicator
                                                        color={"white"}
                                                    />
                                                ) : (
                                                    <CreateCommentText>
                                                        Send
                                                    </CreateCommentText>
                                                )}
                                            </CreateCommentBtn>
                                        </View>
                                    )}
                                </Formik>
                            )}

                            {orderedComments?.length ? (
                                orderedComments?.map((item) => (
                                    <ProblemWrapper
                                        key={item.id}
                                        activeOpacity={1}
                                    >
                                        <CommentAuthorWrapper>
                                            <CommentAuthor>
                                                {item.author.name}:
                                            </CommentAuthor>
                                            <TimeStamp>
                                                {formatRelativeTime(
                                                    item.created_at
                                                )}
                                            </TimeStamp>
                                        </CommentAuthorWrapper>
                                        <ProblemDescription>
                                            {item.text}
                                        </ProblemDescription>
                    <View style={{flexDirection:"row", gap:20, alignSelf:"flex-end"}}>
                        <Text>{item.stop.stop_name}</Text>
                        <Text>{item.stop_time.arrival_time.slice(0, item.stop_time.arrival_time.lastIndexOf(":"))}</Text>
                    </View>
                                    </ProblemWrapper>
                                ))
                            ) : (
                                <Center style={{ paddingVertical: 100 }}>
                                    <Text
                                        style={{ color: COLOR_PALETE.stroke }}
                                    >
                                        No comments
                                    </Text>
                                </Center>
                            )}
                        </>
                    )}
                </Wrapper>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const CommentInput = styled.TextInput({
    height: 160,
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 15,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,

    verticalAlign: "top",
    padding: 10,
});

const CreateCommentBtn = styled.Pressable({
    width: 119 / 1.5,
    height: 63 / 1.5,
    backgroundColor: "#FF3838",
    // borderWidth: 1,
    // borderColor: "#CDCDCD",
    borderRadius: 10,

    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
});
const CreateCommentText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: "#FFFFFF",
});

const CommentAuthorWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});
const CommentAuthor = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20 / 1.5,
    lineHeight: 26 / 1.5,
    color: "#999999",
});
