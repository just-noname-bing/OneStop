import React from "react"
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Login } from "./Login"
import { Register } from "./Register"

interface Props { }

const Stack = createNativeStackNavigator()

export function Account(_: Props): JSX.Element {
    return (
        <Stack.Navigator screenOptions={{
            header: () => null
        }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    )
}

