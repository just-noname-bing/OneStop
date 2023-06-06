import styled from "@emotion/native";
import React from "react";
import { View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { COLOR_PALETE } from "../../utils/colors";
import { Center } from "../styled/Center";

export function EmailSent(): JSX.Element {
    return (
        <Center>
            <Wrapper style={{ gap: 125 / 1.5 }}>
                <View>
                    <Svg
                        width={170 / 1.5}
                        height={133 / 1.5}
                        viewBox="0 0 170 133"
                        fill="none"
                    >
                        <Path
                            d="M56.6667 133L0 76.4043L19.8333 56.5957L56.6667 93.383L150.167 0L170 19.8085L56.6667 133Z"
                            fill="#34A853"
                        />
                    </Svg>
                </View>
                <Title>E-mail has been sent!</Title>
            </Wrapper>
            <Wrapper
                style={{
                    paddingVertical: 101 / 1.5,
                }}
            >
                <Description>Return to menu in 3</Description>
            </Wrapper>
        </Center>
    );
}

const Wrapper = styled.View({
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
});

const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 48 / 1.5,
    lineHeight: 62 / 1.5,
});

const Description = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 28 / 1.5,
    lineHeight: 36 / 1.5,
    textAlign: "center",
    color: COLOR_PALETE.additionalText,
});
