import styled from "@emotion/native";
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { Center } from "./styled/Center"

//images
import mapIcon from "../assets/map-icon.png";
import postsIcon from "../assets/post-icon.png";
import accountIcon from "../assets/account-icon.png";
import { useNavigation } from "@react-navigation/native";

interface Props { }

const Wrapper = styled.View({
    // position: "absolute",
    // bottom: 0,
    // left: 0,

    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingBottom: 20,
    minHeight: 105,

    shadowColor: 'silver',
    shadowOffset: {
        width: 0,
        height: -4
    },
    shadowOpacity: .5,
    shadowRadius: 20,
})


export function BottomMenu(_: Props): JSX.Element {
    const navigation = useNavigation() as any // bruh

    return (
        <Wrapper>
            <Center>
                <TouchableOpacity onPress={() => navigation.navigate("Posts")}>
                    <Image source={postsIcon} style={{ width: 46, height: 46 }} />
                </TouchableOpacity>
            </Center>
            <Center>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image source={mapIcon} style={{ width: 46, height: 46 }} />
                </TouchableOpacity>
            </Center>
            <Center>
                <TouchableOpacity onPress={() => navigation.navigate("Account")}>
                    <Image source={accountIcon} style={{ width: 46, height: 46 }} />
                </TouchableOpacity>
            </Center>
        </Wrapper>
    );
}
