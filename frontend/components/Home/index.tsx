import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainMap } from "./MainMapScreen";
import { SmallSchedule } from "./StopSmallSchedule";
import { ListOfTransport } from "./ListOfTransport";
import { BigSchedule } from "./StopBigSchedule";
import { TransportStopsSelect } from "./TransportStopsSelect";

interface Props {}

const HomeStack = createNativeStackNavigator();

export default function Home(_: Props): JSX.Element {
    return (
        <HomeStack.Navigator
            screenOptions={{
                header: () => null,
            }}
        >
            <HomeStack.Screen name="MainMap" component={MainMap} />
            <HomeStack.Screen name="SmallSchedule" component={SmallSchedule} />
            <HomeStack.Screen name="ListOfTransport" component={ListOfTransport} />
            <HomeStack.Screen name="BigSchedule" component={BigSchedule} />
            <HomeStack.Screen name="TransportStopsSelect" component={TransportStopsSelect} />
        </HomeStack.Navigator>
    );
}
