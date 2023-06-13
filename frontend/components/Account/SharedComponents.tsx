import styled from "@emotion/native";
import { TextInputProps } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";

export const LoginWrapper = styled.View({
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 50,
    paddingBottom: 100,
    gap: 60 / 1.5,
});

export const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,

    color: COLOR_PALETE.text,
});

export const TitleWrapper = styled.View({
    alignItems: "center",
    gap: 21.5,
});

export const FormWrapper = styled.View({
    flex: 1,
    gap: 60 / 1.5,
});

export const CustomForm = styled.View({
    gap: 41 / 1.5,
});

export const InputFieldWrapper = styled.View({
    gap: 10 / 1.5,
});
export const InputLabel = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: COLOR_PALETE.additionalText,
});

export const InputField = styled.TextInput({
    minHeight: 36 / 1.5,
    borderBottomColor: COLOR_PALETE.stroke,
    borderBottomWidth: 3 / 1.5,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20 / 1.5,
    lineHeight: 26 / 1.5,
});

export const SubmitButtonWrapper = styled.TouchableOpacity({
    backgroundColor: COLOR_PALETE.tram,
    borderRadius: 30,
    minHeight: 75 / 1.5,

    alignItems: "center",
    justifyContent: "center",
});
export const SubmitButtonText = styled.Text({
    color: "white",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
});

export const Description = styled.Text({
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    color: "#999999",
});

export const ErrorMessage = styled.Text({
    color: COLOR_PALETE.tram,
});

type CustomInputProps = {
    label: string;
    error: string | undefined;
} & TextInputProps;
export function CustomInputField({
    error,
    label,
    ...InputProps
}: CustomInputProps): JSX.Element {
    return (
        <InputFieldWrapper>
            <InputLabel>{label}</InputLabel>
            <InputField
                {...InputProps}
                style={error ? { borderBottomColor: COLOR_PALETE.tram } : {}}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputFieldWrapper>
    );
}

export type FieldError = {
    field: string;
    message: string;
};


