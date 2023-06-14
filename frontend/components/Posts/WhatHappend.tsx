import { gql, useApolloClient, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions } from "@react-navigation/native";
import { ErrorMessage, Formik } from "formik";
import { useContext, useEffect } from "react";
import {
    Keyboard,
    ScrollView,
    TextInput,
    View,
    Text,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Alert,
} from "react-native";
import { err } from "react-native-svg/lib/typescript/xml";
import { PencilIcon } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { POSTS_QUERY, Route } from "../../utils/graphql";
import { useAuth } from "../../utils/tokens";
import { FieldError, POST_INPUT_SCHEMA } from "../../utils/validationSchema";
import { transportTypes } from "../Home/SharedComponents";
import { Wrapper } from "../styled/Wrapper";
import { TransportBtn, TransportText } from "./CreateNewPost";

const defaultFields = {
    title: "",
    text: "",
};

const CREATE_POST_MUTATION = gql`
    mutation CreatePost($options: PostInput!) {
        createPost(options: $options) {
            data {
                id
                author_id
                text
                title
                transport_id
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

type createPostMutation = {
    data: {
        id: string;
        author_id: string;
        text: string;
        title: string;
        transport_id: string;
        created_at: Date;
        updated_at: Date;
    };
    errors: FieldError[];
};

export default function ({ route, navigation }: any) {
    const [createPost] = useMutation<{ createPost: createPostMutation }>(
        CREATE_POST_MUTATION
    );

    const client = useApolloClient();

    const transport = route.params.transport as Route;
    const color = transportTypes.filter((r) => r.id === transport.route_type)[0]
        .color;

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ height: "100%" }}
        >
            <Formik
                initialValues={{
                    ...defaultFields,
                    transport_id: transport.route_id,
                }}
                onSubmit={async (values, actions) => {
                    let response = null;
                    try {
                        response = await createPost({
                            variables: { options: values },
                        });
                    } catch {
                        console.log("something went wrong");
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Account" }],
                            })
                        );
                        return;
                    }

                    if (response.errors?.length || !response.data) {
                        return Alert.alert("something went wrong");
                    }

                    const { errors } = response.data.createPost;

                    if (errors?.length) {
                        return errors.forEach((error) => {
                            actions.setErrors({
                                [error["field"]]: error.message,
                            });
                        });
                    }

                    actions.setTouched({}, false);
                    actions.resetForm({});
                    await client.refetchQueries({
                        include: [POSTS_QUERY],
                    });

                    // success
                    navigation.navigate("PostsFeed");
                }}
                validateOnBlur={false}
                validateOnMount={false}
                validateOnChange={true}
                validationSchema={POST_INPUT_SCHEMA}
            >
                {({
                    handleChange,
                    values,
                    handleSubmit,
                    isSubmitting,
                    errors,
                }) => (
                    <ScrollView>
                        <Wrapper style={{ gap: 25 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    flexGrow: 1,
                                }}
                            >
                                <TransportBtn
                                    bg={color}
                                    style={{ position: "relative" }}
                                    onPress={() => navigation.goBack()}
                                >
                                    <PencilIcon />
                                    <TransportText>
                                        {transport.route_short_name}
                                    </TransportText>
                                </TransportBtn>
                                <View style={{ flex: 1, gap: 12 / 1.5 }}>
                                    <TitleInput
                                        isErrors={!!errors.title}
                                        placeholder="Traffic jam..."
                                        value={values.title}
                                        onChangeText={handleChange("title")}
                                    />
                                    <CustomErrorMessage title="title" />
                                    <TextInput
                                        style={{ color: "silver" }}
                                        value={transport.route_long_name}
                                        editable={false}
                                    />
                                </View>
                            </View>
                            <View style={{ gap: 12 / 1.5 }}>
                                <TextBox
                                    isErrors={!!errors.text}
                                    multiline={true}
                                    value={values.text}
                                    onChangeText={handleChange("text")}
                                    placeholder={"Describe your problem.."}
                                />
                                <CustomErrorMessage title="text" />
                                <CustomErrorMessage title="transport_id" />
                            </View>
                            <View>
                                <ConfirmBtn
                                    disabled={isSubmitting}
                                    onPress={handleSubmit as any}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator color={"white"} />
                                    ) : (
                                        <ConfirmText>Create</ConfirmText>
                                    )}
                                </ConfirmBtn>
                            </View>
                        </Wrapper>
                    </ScrollView>
                )}
            </Formik>
        </TouchableWithoutFeedback>
    );
}

const TitleInput = styled.TextInput(({ isErrors }: { isErrors: boolean }) => ({
    minHeight: 62 / 1.5,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: isErrors ? COLOR_PALETE.tram : "#CDCDCD",
    borderRadius: 10,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    color: "#29221E",

    paddingHorizontal: 10,
}));

const TextBox = styled.TextInput(({ isErrors }: { isErrors: boolean }) => ({
    height: 160,
    borderWidth: 1,
    borderColor: isErrors ? COLOR_PALETE.tram : "#CDCDCD",
    borderRadius: 5,

    textAlignVertical: "top",
    padding: 10,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
}));

const ConfirmBtn = styled.Pressable({
    minHeight: 51 / 1.5,
    backgroundColor: COLOR_PALETE.tram,
    borderRadius: 6,
    paddingVertical: 10,

    justifyContent: "center",
    alignItems: "center",
});

const ConfirmText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    textAlign: "center",
    color: "#FFFFFF",
});

function CustomErrorMessage(props: { title: string }) {
    return (
        <ErrorMessage name={props.title}>
            {(msg) => <Text style={{ color: COLOR_PALETE.tram }}>{msg}</Text>}
        </ErrorMessage>
    );
}
