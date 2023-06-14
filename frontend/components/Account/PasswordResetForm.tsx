import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { PASSWORD_RESET_EMAIL } from "../../utils/validationSchema";
import { Wrapper } from "../styled/Wrapper";
import {
    CustomInputField,
    SubmitButtonText,
    SubmitButtonWrapper,
    Title,
} from "./SharedComponents";

const PASSWORD_RESET_MUTATION = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`;

export function PasswordReset() {
    const navigation = useNavigation() as any;
    const [sendMessage] = useMutation(PASSWORD_RESET_MUTATION);
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Formik
                initialValues={{ email: "" }}
                validateOnBlur={false}
                validateOnMount={false}
                validateOnChange={true}
                validationSchema={PASSWORD_RESET_EMAIL}
                onSubmit={async (values, a) => {
                    const response = await sendMessage({ variables: values });

                    if (!response.data.forgotPassword) {
                        a.setErrors({ email: "incorrect email address" });
                    } else {
                        navigation.navigate("PasswordMessage");
                    }
                }}
            >
                {({
                    values,
                    isSubmitting,
                    errors,
                    handleChange,
                    handleSubmit,
                }) => (
                    <Wrapper style={{ gap: 125 / 1.5, paddingHorizontal: 50 }}>
                        <TitleWrapper>
                            <View>
                                <QuerstionMarkIcon />
                            </View>
                            <Title>forgot your password</Title>
                        </TitleWrapper>
                        <View style={{ gap: 85 / 1.5 }}>
                            <View>
                                <CustomInputField
                                    label={"Your E-mail"}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    inputMode="email"
                                    error={errors.email}
                                />
                            </View>

                            <SubmitButtonWrapper
                                disabled={isSubmitting}
                                onPress={handleSubmit as any}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={"white"} />
                                ) : (
                                    <SubmitButtonText>
                                        send code
                                    </SubmitButtonText>
                                )}
                            </SubmitButtonWrapper>
                        </View>
                    </Wrapper>
                )}
            </Formik>
        </TouchableWithoutFeedback>
    );
}

function QuerstionMarkIcon() {
    return (
        <Svg
            width={83 / 1.5}
            height={143 / 1.5}
            viewBox="0 0 83 143"
            fill="none"
        >
            <Path
                d="M30.9679 97.8421C30.9679 87.6816 31.8782 80.3735 33.6987 75.9179C35.5193 71.4624 39.3735 66.6029 45.2615 61.3395C50.4021 56.8237 54.3216 52.9025 57.0198 49.5758C59.718 46.2492 61.0646 42.4559 61.0596 38.196C61.0596 33.0531 59.3369 28.7882 55.8914 25.4013C52.4459 22.0145 47.6487 20.321 41.5 20.321C35.1055 20.321 30.2457 22.2653 26.9205 26.1539C23.5954 30.0425 21.2483 33.9939 19.8791 38.0079L0.5 29.7289C3.13303 21.7009 7.96025 14.739 14.9817 8.84342C22.0031 2.94781 30.8425 0 41.5 0C54.6651 0 64.791 3.67033 71.8776 11.011C78.9642 18.3517 82.505 27.1625 82.5 37.4434C82.5 43.7153 81.1534 49.0791 78.4602 53.5347C75.767 57.9903 71.5341 63.0379 65.7615 68.6776C59.6177 74.5732 55.8889 79.0589 54.5749 82.1347C53.2608 85.2104 52.6013 90.4462 52.5963 97.8421H30.9679ZM41.5 143C37.3624 143 33.8216 141.525 30.8776 138.575C27.9336 135.624 26.4591 132.082 26.4541 127.947C26.4541 123.808 27.9286 120.263 30.8776 117.313C33.8266 114.362 37.3674 112.89 41.5 112.895C45.6376 112.895 49.1809 114.37 52.1299 117.32C55.0789 120.271 56.5509 123.813 56.5459 127.947C56.5459 132.087 55.0714 135.632 52.1224 138.582C49.1734 141.532 45.6326 143.005 41.5 143Z"
                fill="#FF3838"
            />
        </Svg>
    );
}

const TitleWrapper = styled.View({
    alignItems: "center",
    gap: 14,
});
