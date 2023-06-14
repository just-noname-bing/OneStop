import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { COLOR_PALETE } from "../utils/colors";
import Account from "./Account";
import Home from "./Home";
import Posts from "./Posts";

import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

import * as Linking from "expo-linking";

export default function Pages({}: any) {
    const navigation = useNavigation() as any;

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
                navigation.navigate("Account", {
                    screen: "NewPassword",
                    params: {
                        [a]: b,
                    },
                });
            } else {
                console.log("ob");
            }
        });
    }, []);

    return (
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
            </Tab.Navigator>
    );
}
