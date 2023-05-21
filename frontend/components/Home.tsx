import React from "react"
import { Text, View, Button } from "react-native";
import { BottomMenu } from "./BottomMenu";
import { Center } from "./styled/Center";

export function Home() {
    return (
        <Center>
            <Center style={{ backgroundColor: "white", width: "100%" }}>
                <Text>Map</Text>
            </Center>
        </Center>
    )
}
