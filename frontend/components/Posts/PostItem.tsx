import styled from "@emotion/native";
import React from "react";
import { View, Text } from "react-native";
import { POST } from ".";
import { COLOR_PALETE } from "../../utils/colors";

type props = {
    post: POST;
};

export function PostItem({ post }: props): JSX.Element {
    return (
        <PostItemWrapper>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10 / 1.5,
                }}
            >
                <TransportNumberWrapper
                    style={{
                        backgroundColor: COLOR_PALETE.bus,
                    }}
                >
                    <TransportNumber>13</TransportNumber>
                </TransportNumberWrapper>
                <TitleWrapper>
                    <Title>{post.title}</Title>
                    <Direction>Vodila1 daun</Direction>
                </TitleWrapper>
                <Text>4 min ago</Text>
            </View>
            <View>
                <Text>
                    Lorem ipsum dolor sit amet, qui minim labore adipisicing
                    minim sint cillum sint consectetur cupidatat.
                </Text>
            </View>
        </PostItemWrapper>
    );
}

const TransportNumberWrapper = styled.View({
    borderRadius: 10,
    // paddingHorizontal: 17 / 1.5,
    // paddingVertical: 15 / 1.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 74 / 1.5,
    maxHeight: 73 / 1.5,
});

const TransportNumber = styled.Text({
    fontWeight: "400",
    fontStyle: "normal",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    color: "white",
});

const TitleWrapper = styled.View({
    justifyContent: "space-between",
    flex: 1,
    flexGrow: 1,
    gap: 5 / 1.5,
});

const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
});

const Direction = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
});

const PostItemWrapper = styled.View({
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR_PALETE.stroke,

    gap: 20 / 1.5,

    paddingHorizontal: 17 / 1.5,
    paddingVertical: 15 / 1.5,
});
