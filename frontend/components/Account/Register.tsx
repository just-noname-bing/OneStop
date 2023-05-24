import { Formik } from "formik";
import React from "react"
import { Button, KeyboardAvoidingView, ScrollView, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLOR_PALETE } from "../../utils/colors";
import { REGISTER_INPUT_SCHEMA } from "../../utils/validationSchema";
import { LoginWrapper, TitleWrapper, Title, FormWrapper, InputFieldWrapper, InputLabel, InputField, SubmitButtonWrapper, SubmitButtonText, Description, CustomForm, ErrorMessage } from "./SharedComponents";


export function Register({ navigation }: any): JSX.Element {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView >
                <LoginWrapper>
                    <TitleWrapper>
                        <Svg width="99.17" height="127.5" viewBox="0 0 100 128" fill="none">
                            <Path fill-rule="evenodd" clip-rule="evenodd" d="M52.0398 127.102L52.054 127.095L52.0894 127.07L52.1957 126.989L52.6136 126.688C52.9678 126.425 53.4848 126.043 54.1365 125.54C55.4398 124.541 57.2886 123.071 59.495 121.184C65.2871 116.233 70.7031 110.858 75.6982 105.105C87.414 91.5542 99.5832 72.2131 99.5832 50.1025C99.5832 36.8921 94.3628 24.2129 85.0694 14.8629C80.476 10.2353 75.0127 6.5619 68.994 4.05402C62.9754 1.54613 56.5201 0.253323 49.9998 0.25C43.4798 0.252859 37.0247 1.54511 31.0061 4.05238C24.9874 6.55965 19.524 10.2324 14.9303 14.8594C5.6278 24.2308 0.41026 36.9016 0.41651 50.106C0.41651 72.2131 12.5857 91.5542 24.3015 105.105C29.2966 110.858 34.7126 116.233 40.5046 121.184C42.7146 123.071 44.5598 124.541 45.8632 125.54C46.5024 126.033 47.1483 126.517 47.8005 126.992L47.9138 127.07L47.9457 127.095L47.9598 127.102C49.1817 127.963 50.818 127.963 52.0398 127.102ZM67.7082 49.8333C67.7082 54.5299 65.8425 59.0341 62.5215 62.355C59.2006 65.676 54.6964 67.5417 49.9998 67.5417C45.3033 67.5417 40.7991 65.676 37.4782 62.355C34.1572 59.0341 32.2915 54.5299 32.2915 49.8333C32.2915 45.1368 34.1572 40.6326 37.4782 37.3117C40.7991 33.9907 45.3033 32.125 49.9998 32.125C54.6964 32.125 59.2006 33.9907 62.5215 37.3117C65.8425 40.6326 67.7082 45.1368 67.7082 49.8333Z" fill="#FF3838" />
                        </Svg>
                        <Title>Let's begin from here</Title>
                    </TitleWrapper>
                    <Formik
                        initialValues={{ email: "", name: "", surname: "", password: "" }}
                        onSubmit={values => console.log("handle login", values)}
                        validationSchema={REGISTER_INPUT_SCHEMA}
                        validateOnBlur={false}
                        validateOnChange={true}
                        validateOnMount={false}
                    >
                        {({ handleChange, values, handleSubmit, errors }) => (
                            <FormWrapper>
                                <CustomForm>
                                    <InputFieldWrapper>
                                        <InputLabel>E-mail</InputLabel>
                                        <InputField
                                            keyboardType="email-address"
                                            onChangeText={handleChange('email')}
                                            value={values.email}
                                            style={errors.email ? { borderBottomColor: COLOR_PALETE.tram } : {}}
                                        />
                                        {errors.email && (<ErrorMessage>{errors.email}</ErrorMessage>)}
                                    </InputFieldWrapper>
                                    <InputFieldWrapper>
                                        <InputLabel>Name</InputLabel>
                                        <InputField
                                            onChangeText={handleChange('name')}
                                            value={values.name}
                                            style={errors.name ? { borderBottomColor: COLOR_PALETE.tram } : {}}
                                        />
                                        {errors.name && (<ErrorMessage>{errors.name}</ErrorMessage>)}
                                    </InputFieldWrapper>
                                    <InputFieldWrapper>
                                        <InputLabel>Surname</InputLabel>
                                        <InputField
                                            onChangeText={handleChange('surname')}
                                            value={values.surname}
                                            style={errors.surname ? { borderBottomColor: COLOR_PALETE.tram } : {}}
                                        />
                                        {errors.surname && (<ErrorMessage>{errors.surname}</ErrorMessage>)}
                                    </InputFieldWrapper>
                                    <InputFieldWrapper>
                                        <InputLabel>Password</InputLabel>
                                        <InputField
                                            secureTextEntry
                                            onChangeText={handleChange('password')}
                                            value={values.password}
                                            style={errors.password ? { borderBottomColor: COLOR_PALETE.tram } : {}}
                                        />
                                        {errors.password && (<ErrorMessage>{errors.password}</ErrorMessage>)}
                                    </InputFieldWrapper>
                                </CustomForm>
                                <SubmitButtonWrapper onPress={handleSubmit as any} >
                                    <SubmitButtonText>Sign up</SubmitButtonText>
                                </SubmitButtonWrapper>
                                <Description>
                                    Already have an account?{" "}
                                    <Text
                                        style={{ color: COLOR_PALETE.tram }}
                                        onPress={() => navigation.navigate("Login")}
                                    >Sign in</Text>
                                </Description>
                            </FormWrapper>
                        )}
                    </Formik>
                </LoginWrapper>
            </ScrollView>
        </KeyboardAvoidingView >
    )
}
