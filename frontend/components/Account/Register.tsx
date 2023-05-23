import React from "react"
import { KeyboardTypeOptions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInputProps } from 'react-native'
import styled from "@emotion/native"
import { COLOR_PALETE } from "../../utils/colors";
import { Center } from "../styled/Center";

interface Props { }

type formFieldsType = {
    email: string;
    password: string;
}

export function Register(_: Props): JSX.Element {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Center style={{ gap: 41 }}>
                    <InputField label="email" type="email-address" />
                    <InputField label="password" type="visible-password" secureTextEntry={true} />
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


