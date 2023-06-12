import React, {
    useContext,
    useEffect,
    useState,
} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { Register } from "./Register";
import { EmailSent } from "./EmailHasBeenSent";
import EmailVerificated from "./EmailVerificated";
import { getAccessToken, getRefreshToken } from "../../utils/tokens";
import Profile from "./Profile";
import { TokenContext } from "../../utils/context";

const Stack = createNativeStackNavigator();

export default function Account({ route }: any): JSX.Element {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [token, setToken] = useContext(TokenContext);

    const checkTokens = async () => {
        const a = await getAccessToken();
        const r = await getRefreshToken();

        if (!a || !r) {
            setIsAuth(false);
        } else {
            setIsAuth(true);
            setToken({ accessToken: a, refreshToken: r });
        }
    };

    useEffect(() => {
        checkTokens();
    }, []);

    useEffect(() => {
        checkTokens();
    }, [route]);

    if (isAuth === null) return <></>;

    return (
            <Stack.Navigator
                screenOptions={{
                    header: () => null,
                }}
            >
                {token ? (
                    <>
                        <Stack.Screen name="Profile" component={Profile} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="EmailSent" component={EmailSent} />
                        <Stack.Screen
                            name="VerifyEmail"
                            component={EmailVerificated}
                        />
                    </>
                )}
            </Stack.Navigator>
    );
}
