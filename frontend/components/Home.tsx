import React, { useEffect, useState } from "react"
import { Center } from "./styled/Center";
import MapView, { Marker } from "react-native-maps";
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator } from "react-native";
import { LinkingContext } from "@react-navigation/native";

const DELTA = {
    lat: 0.0922,
    long: 0.0421
}

export function Home() {
    const [location, setLocation] = useState<LocationObject | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const currentLocation = await getCurrentPositionAsync({
                accuracy: Accuracy.Low,
                mayShowUserSettingsDialog: true,
            });
            setLocation(currentLocation);
        })();
    }, []);

    return (
        <Center>
            {location ? (
                <MapView
                    style={{ flex: 1, width: "100%" }}
                    initialRegion={{
                        latitude: location?.coords.latitude || 0,
                        longitude: location?.coords.longitude || 0,
                        latitudeDelta: DELTA.lat,
                        longitudeDelta: DELTA.long,
                    }}
                    showsCompass
                    showsUserLocation
                    showsMyLocationButton
                >
                </MapView>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </Center>
    )
}
