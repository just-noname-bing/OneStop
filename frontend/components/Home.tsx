import React, { useEffect, useState } from "react"
import { Center } from "./styled/Center";
import MapView, { Callout, MapMarker, Marker } from "react-native-maps";
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, Text } from "react-native";
import { gql, useQuery } from "@apollo/client";

const DELTA = {
    lat: 0.0922,
    long: 0.0421
}

const STOPS_QUERY = gql`
    query Stops {
      Stops {
        stop_id
        stop_lat
        stop_lon
        stop_name
      }
    }
`

type Stop = {
    stop_id: string
    stop_lat: string
    stop_lon: string
    stop_name: string
}

export function Home() {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const { data: stops, loading } = useQuery<{ Stops: Stop[] }>(STOPS_QUERY)

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


    if (!location) return <Center><ActivityIndicator size="large" color="#0000ff" /></Center>


    return (
        <Center>
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
                {(!loading && !!stops) && stops.Stops.map(s => (
                    <MapMarker
                        coordinate={{
                            latitude: Number(s.stop_lat),
                            longitude: Number(s.stop_lon)
                        }}
                        onPress={() => console.log("pressed " + s.stop_name)}
                    >
                        <Callout>
                            <Text>{s.stop_name}</Text>
                        </Callout>
                    </MapMarker>
                ))}
            </MapView>
        </Center>
    )
}
