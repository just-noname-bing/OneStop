import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { Register } from "./Register";
import { EmailSent } from "./EmailHasBeenSent";
import EmailVerificated from "./EmailVerificated";

interface Props {}

const Stack = createNativeStackNavigator();

export default function Account(_: Props): JSX.Element {
    return (
        <Stack.Navigator
            screenOptions={{
                header: () => null,
            }}
        >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="EmailSent" component={EmailSent} />
                <Stack.Screen name="VerifyEmail" component={EmailVerificated} />
        </Stack.Navigator>
    );
}
