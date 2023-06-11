import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import React, { createContext, useEffect, useState } from "react";
import { COLOR_PALETE } from "../utils/colors";
import Account from "./Account";
import Home from "./Home";
import Posts from "./Posts";

import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
    },
};

export default function Pages() {
    return (
        <NavigationContainer theme={MyTheme}>
            <Tab.Navigator
                screenOptions={{
                    header: () => null,
                    tabBarLabel: () => null,
                    tabBarActiveTintColor: COLOR_PALETE.buttonActive,
                }}
                initialRouteName="Posts"
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
        </NavigationContainer>
    );
}
