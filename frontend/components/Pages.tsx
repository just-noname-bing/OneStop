import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { COLOR_PALETE } from "../utils/colors";
import Account from "./Account";
import Home from "./Home";
import Posts from "./Posts";

import {
    Entypo,
    Ionicons,
    MaterialIcons,
    Foundation,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

import * as Linking from "expo-linking";
import { getAccessToken, getRefreshToken } from "../utils/tokens";
import { TokenContext, Tokens } from "../utils/context";
// Listen for incoming URLs

// Function to parse the URL and extract the screen name and parameter
// function parseScreen(url: any) {
//     const { path, queryParams } = Linking.parse(url);
//     return {
//         screenName: queryParams?.screenName,
//         parameter: queryParams?.parameter,
//         path,
//     };
// }

export default function Pages({ route }: any) {
    const navigation = useNavigation() as any;

    const [token, setToken] = useState<Tokens | null>(null);

    const checkTokens = async () => {
        const a = await getAccessToken();
        const r = await getRefreshToken();

        if (a && r) {
            setToken({ accessToken: a, refreshToken: r });
        }
    };

    useEffect(() => {
        checkTokens();
    }, [route]);

    useEffect(() => {
        Linking.addEventListener("url", (event) => {
            const url = event.url;
            const stuff = url.split("/--/")[1];
            const [path, params] = stuff.split("?");
            const [a, b] = params.split("=");
            console.log(path);

            if (path === "email-verification") {
                navigation.navigate("Account", {
                    screen: "VerifyEmail",
                    params: {
                        [a]: b,
                    },
                });
            } else if (path === "password-verification") {
                // ...
            } else {
                console.log("ob");
            }
        });

        checkTokens();
    }, []);

    return (
        <TokenContext.Provider value={[token, setToken]}>
            <Tab.Navigator
                screenOptions={{
                    header: () => null,
                    tabBarLabel: () => null,
                    tabBarActiveTintColor: COLOR_PALETE.buttonActive,
                }}
                initialRouteName="Map"
            >
                <Tab.Screen
                    options={{
                        tabBarIcon: (p) => <Entypo name="chat" {...p} />,
                    }}
                    name="Posts"
                    component={Posts}
                />
                <Tab.Screen
                    options={{
                        tabBarIcon: (p) => <Ionicons name="map-sharp" {...p} />,
                    }}
                    name="Map"
                    component={Home}
                />
                <Tab.Screen
                    options={{
                        tabBarIcon: (p) => (
                            <MaterialIcons name="account-circle" {...p} />
                        ),
                    }}
                    name="Account"
                    component={Account}
                />
                <Tab.Screen
                    options={{
                        tabBarIcon: (p) => <Foundation name="shield" {...p} />,
                    }}
                    name="AdminMenu"
                    component={Account}
                />
            </Tab.Navigator>
        </TokenContext.Provider>
    );
}
