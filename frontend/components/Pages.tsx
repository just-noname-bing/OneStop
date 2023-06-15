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
import { useAuth } from "../utils/tokens";
import { AdminMenu } from "./AdminMenu";
import { gql, useQuery } from "@apollo/client";

const ME_QUERY_SMALL = gql`
    query Me {
        me {
            id
            name
            surname
            email
            role
            verified
        }
    }
`;

type meQuerySmall = {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    verified: string;
};

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
            backBehavior="history"
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
                    unmountOnBlur: true,
                }}
                name="Account"
                component={Account}
            />
        </Tab.Navigator>
    );
}
