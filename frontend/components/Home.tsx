import React, { useEffect, useRef, useState } from "react"
import { Center } from "./styled/Center";
import MapView, { Callout, MapMarker } from "react-native-maps";
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, Text, View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { Path, Svg } from "react-native-svg";
import { COLOR_PALETE } from "../utils/colors";

const DELTA = {
    lat: 0.0922,
    long: 0.0421
}

const USER_ZOOM_ON_PRESS = 200 * 7

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

    const mapRef = useRef<MapView>(null)

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
                ref={mapRef}
                style={{ flex: 1, width: "100%" }}
                initialRegion={{
                    latitude: location?.coords.latitude || 0,
                    longitude: location?.coords.longitude || 0,
                    latitudeDelta: DELTA.lat,
                    longitudeDelta: DELTA.long,
                }}
                showsCompass
                showsUserLocation
            >
                {(!loading && !!stops) && stops.Stops.map(s => (
                    <MapMarker
                        key={s.stop_id}
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
            <BottomMenuWrapper pointerEvents="box-none">
                <GpsButton
                    activeOpacity={1}
                    onPress={() => mapRef.current?.animateCamera({
                        center: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        },
                        altitude: USER_ZOOM_ON_PRESS
                    })}
                >
                    <Svg width="25" height="25" viewBox="0 0 34 35" fill="none">
                        <Path d="M16.9998 11.3332C13.5928 11.3332 10.8332 14.0928 10.8332 17.4998C10.8332 20.9069 13.5928 23.6665 16.9998 23.6665C20.4069 23.6665 23.1665 20.9069 23.1665 17.4998C23.1665 14.0928 20.4069 11.3332 16.9998 11.3332ZM30.7823 15.9582C30.0732 9.52942 24.9703 4.4265 18.5415 3.71734V0.541504H15.4582V3.71734C9.02942 4.4265 3.9265 9.52942 3.21734 15.9582H0.0415039V19.0415H3.21734C3.9265 25.4703 9.02942 30.5732 15.4582 31.2823V34.4582H18.5415V31.2823C24.9703 30.5732 30.0732 25.4703 30.7823 19.0415H33.9582V15.9582H30.7823ZM16.9998 28.2915C11.0336 28.2915 6.20817 23.4661 6.20817 17.4998C6.20817 11.5336 11.0336 6.70817 16.9998 6.70817C22.9661 6.70817 27.7915 11.5336 27.7915 17.4998C27.7915 23.4661 22.9661 28.2915 16.9998 28.2915Z" fill="#29221E" />
                    </Svg>
                </GpsButton>
                <BottomMenu>
                    <BottomMenuLine />
                    <View>
                        <SearchInput placeholder="Search..." />
                    </View>
                </BottomMenu>
            </BottomMenuWrapper>
        </Center >
    )
}

const BottomMenuWrapper = styled.View({
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "15%", // 65 if input focused

    gap: 44 / 1.5,

})

const GpsButton = styled.TouchableOpacity({
    backgroundColor: "white",
    borderRadius: 11,
    alignSelf: "flex-end",
    padding: 11,

    // width: 33.92 / 1.5,
    // height: 33.92 / 1.5,

    marginHorizontal: 29 / 1.5
})

const BottomMenu = styled.View({
    backgroundColor: "white",
    borderRadius: 30,
    height: "100%",

    paddingHorizontal: 50 / 1.5,
    paddingVertical: 23 / 1.5,

    gap: 48 / 1.5,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
})

const BottomMenuLine = styled.View({
    width: 40,
    height: 5,
    backgroundColor: "#CFCCD4",
    borderRadius: 7,

    alignSelf: "center"
})

const SearchInput = styled.TextInput({
    borderWidth: 1 / 1.5,
    borderColor: COLOR_PALETE.additionalText,
    borderRadius: 12,
    minHeight: 63 / 1.5,
    width: "100%",

    paddingHorizontal: 31 / 1.5
})
