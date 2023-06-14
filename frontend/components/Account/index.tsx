import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { Register } from "./Register";
import { EmailSent } from "./EmailHasBeenSent";
import EmailVerificated from "./EmailVerificated";
import { useAuth } from "../../utils/tokens";
import Profile from "./Profile";
import { PasswordMessage } from "./PasswordHasBeenSent";
import { PasswordReset } from "./PasswordResetForm";
import { NewPassword } from "./NewPassword";

const Stack = createNativeStackNavigator();

export default function Account({ route }: any): JSX.Element {
    const { auth, loading } = useAuth();


    if (loading) return <></>

    return (
        <Stack.Navigator
            screenOptions={{
                header: () => null,
            }}
        >
            {auth ? (
                <>
                    <Stack.Screen name="Profile" component={Profile} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="EmailSent" component={EmailSent} />
                    <Stack.Screen
                        name="PasswordMessage"
                        component={PasswordMessage}
                    />
                    <Stack.Screen
                        name="VerifyEmail"
                        component={EmailVerificated}
                    />

                    <Stack.Screen
                        name="PasswordReset"
                        component={PasswordReset}
                    />
                    <Stack.Screen name="NewPassword" component={NewPassword} />
                </>
            )}
        </Stack.Navigator>
    );
}
