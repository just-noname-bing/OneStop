import React from "react"
import { Button, View, Text } from "react-native"
import PageContainer from "./PageContainer"

export default function Login({ navigation }: any): JSX.Element {
    return (
        <PageContainer>
            <Text>lgoin bob </Text>
            <View>
                <Text>dont have an account ? </Text>
                <Button title="register" onPress={() => navigation.navigate("Register")} />
            </View>
        </PageContainer>
    )
}
