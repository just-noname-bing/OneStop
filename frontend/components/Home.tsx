import React, { useState } from "react"
import { Center } from "./styled/Center";
import MapView from "react-native-maps";

export function Home() {
    return (
        <Center>
            <MapView style={{ flex: 1, width: "100%" }} />
        </Center>
    )
}
