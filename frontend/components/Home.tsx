import React from "react"
import { Text, View, Button } from "react-native";
import PageContainer from "./PageContainer";

export function Home({ navigation }: any) {
    return (
        <PageContainer>
            <Text>helo from home page</Text>
            <Button title="login" onPress={() => navigation.navigate("Login")} />
        </PageContainer>
    )
}
