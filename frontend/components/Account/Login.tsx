import React from "react"
import { KeyboardTypeOptions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInputProps, Button, Text } from 'react-native'
import styled from "@emotion/native"
import { COLOR_PALETE } from "../../utils/colors";
import { Center } from "../styled/Center";


type formFieldsType = {
    email: string;
    name: string;
    surname: string;
    password: string;
}

export function Login({ navigation }: any): JSX.Element {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Center style={{ gap: 41 }}>
                    <InputField label="email" type="email-address" />
                    <InputField label="name" />
                    <InputField label="surname" />
                    <InputField label="password" type="visible-password" secureTextEntry={true} />
                    <Text>
                        Already have an account?{" "}<Text style={{ color: "red" }} onPress={() => navigation.navigate("Register")}>Sign in</Text>
                    </Text>
                </Center>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

type inputFieldProps = {
    label: keyof formFieldsType
    type?: KeyboardTypeOptions
} & TextInputProps

const Wrapper = styled.View({
    width: "100%",
    maxWidth: 620,
    paddingHorizontal: 50,

    gap: 10,
})

const Label = styled.Text({
    color: COLOR_PALETE.additionalText
})

const CustomTextInput = styled.TextInput({
    borderBottomWidth: 1,
    paddingBottom: 5
})

function InputField({ label, type, ...props }: inputFieldProps) {
    return (
        <Wrapper>
            <Label>{label}</Label>
            <CustomTextInput {...props} keyboardType={type} maxLength={200} accessibilityLabelledBy={label} />
        </Wrapper>
    )
}


