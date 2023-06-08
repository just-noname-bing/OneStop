import React, { useEffect, useState, useRef } from "react";
import {
    Accuracy,
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
} from "expo-location";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, View, Dimensions } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Center } from "../styled/Center";
import Svg, { Path, Rect } from "react-native-svg";
import styled from "@emotion/native";
import { MapMarker } from "react-native-maps";
import { COLOR_PALETE } from "../../utils/colors";
import MapView from "react-native-map-clustering";
import SmallSchedule from "./StopSmallSchedule";

export const DELTA = {
    lat: 0.0922,
    long: 0.0421,
};

const mapHeight = Dimensions.get("window").height
const swipeMenuHeight = mapHeight  /  1.65

const STOPS_QUERY = gql`
    query Stops {
        Stops {
            stop_id
            stop_lat
            stop_lon
            stop_name
        }
    }
`;

export type Stop = {
    stop_id: string;
    stop_lat: string;
    stop_lon: string;
    stop_name: string;
};

export function Home() {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const { data: stops, loading } = useQuery<{ Stops: Stop[] }>(STOPS_QUERY);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            const currentLocation = await getCurrentPositionAsync({
                accuracy: Accuracy.Low,
                mayShowUserSettingsDialog: true,
            });

            setLocation(currentLocation);
        })();
    }, []);

    if (!location || !stops || loading)
        return (
            <Center>
                <ActivityIndicator size="large" color="#0000ff" />
            </Center>
        );

    return (
        <View style={{flex:1}}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, width: "100%", maxHeight: mapHeight - swipeMenuHeight + 50}}
                initialRegion={{
                    latitude: location!.coords.latitude,
                    longitude: location!.coords.longitude,
                    latitudeDelta: DELTA.lat,
                    longitudeDelta: DELTA.long,
                }}
                showsCompass
                showsUserLocation
                extent={200}
                minPoints={4}
                showsIndoors={false}
                showsBuildings={false}
                showsPointsOfInterest={false}
                showsIndoorLevelPicker={false}
                showsScale={false}
                showsTraffic={false}
                animationEnabled={false}
                clusterColor={COLOR_PALETE.troleybus}
            >
                {stops!.Stops.map((s: Stop) => (
                    <MapMarker
                        tracksViewChanges={false}
                        key={s.stop_id}
                        coordinate={{
                            latitude: Number(s.stop_lat),
                            longitude: Number(s.stop_lon),
                        }}
                        onPress={() => console.log("pressed " + s.stop_id)}
                    >
                        <View>
                            <TransportStopMarker />
                        </View>
                    </MapMarker>
                ))}
            </MapView>
            <BottomMenuWrapper pointerEvents="box-none">
                <GpsButton
                    activeOpacity={1}
                    onPress={() => {
                        (mapRef?.current as any).animateToRegion(
                            {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 1 / (25 * 3),
                                longitudeDelta: 1 / (25 * 3),
                            },
                            500
                        );
                    }}
                >
                    <GpsIconSvg />
                </GpsButton>
                <BottomMenu>
                    <BottomMenuLine />
                    <View>
                        <SearchInput placeholder="Search..." />
                        <SmallSchedule />
                    </View>
                </BottomMenu>
            </BottomMenuWrapper>
        </View>
    );
}

const BottomMenuWrapper = styled.View({
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: swipeMenuHeight, // 1.5 if input focused else 7

    gap: 44 / 1.5,
});

const GpsButton = styled.TouchableOpacity({
    backgroundColor: "white",
    borderRadius: 11,
    alignSelf: "flex-end",
    padding: 11,

    // width: 33.92 / 1.5,
    // height: 33.92 / 1.5,

    marginHorizontal: 29 / 1.5,
});

const BottomMenu = styled.View({
    backgroundColor: "white",
    borderRadius: 30,
    height: "100%",

    paddingHorizontal: 50 / 1.5,
    paddingVertical: 23 / 1.5,

    gap: 48 / 1.5,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
});

const BottomMenuLine = styled.View({
    width: 40,
    height: 5,
    backgroundColor: "#CFCCD4",
    borderRadius: 7,

    alignSelf: "center",
});

const SearchInput = styled.TextInput({
    borderWidth: 1 / 1.5,
    borderColor: COLOR_PALETE.additionalText,
    borderRadius: 12,
    minHeight: 63 / 1.5,
    width: "100%",

    paddingHorizontal: 31 / 1.5,
});
function TransportStopMarker() {
    return (
        <Svg width={31 / 1.5} height={35 / 1.5} viewBox="0 0 31 35" fill="none">
            <Rect width="31" height="35" rx="5" fill={COLOR_PALETE.troleybus} />
            <Path
                d="M5 23.4211C5 24.5789 5.51187 25.6184 6.3125 26.3421V28.6842C6.3125 29.4079 6.90312 30 7.625 30H8.9375C9.65938 30 10.25 29.4079 10.25 28.6842V27.3684H20.75V28.6842C20.75 29.4079 21.3406 30 22.0625 30H23.375C24.0969 30 24.6875 29.4079 24.6875 28.6842V26.3421C25.4881 25.6184 26 24.5789 26 23.4211V10.2632C26 5.65789 21.3013 5 15.5 5C9.69875 5 5 5.65789 5 10.2632V23.4211ZM9.59375 24.7368C8.50437 24.7368 7.625 23.8553 7.625 22.7632C7.625 21.6711 8.50437 20.7895 9.59375 20.7895C10.6831 20.7895 11.5625 21.6711 11.5625 22.7632C11.5625 23.8553 10.6831 24.7368 9.59375 24.7368ZM21.4062 24.7368C20.3169 24.7368 19.4375 23.8553 19.4375 22.7632C19.4375 21.6711 20.3169 20.7895 21.4062 20.7895C22.4956 20.7895 23.375 21.6711 23.375 22.7632C23.375 23.8553 22.4956 24.7368 21.4062 24.7368ZM23.375 16.8421H7.625V10.2632H23.375V16.8421Z"
                fill="white"
            />
        </Svg>
    );
}

function GpsIconSvg() {
    return (
        <Svg width="25" height="25" viewBox="0 0 34 35" fill="none">
            <Path
                d="M16.9998 11.3332C13.5928 11.3332 10.8332 14.0928 10.8332 17.4998C10.8332 20.9069 13.5928 23.6665 16.9998 23.6665C20.4069 23.6665 23.1665 20.9069 23.1665 17.4998C23.1665 14.0928 20.4069 11.3332 16.9998 11.3332ZM30.7823 15.9582C30.0732 9.52942 24.9703 4.4265 18.5415 3.71734V0.541504H15.4582V3.71734C9.02942 4.4265 3.9265 9.52942 3.21734 15.9582H0.0415039V19.0415H3.21734C3.9265 25.4703 9.02942 30.5732 15.4582 31.2823V34.4582H18.5415V31.2823C24.9703 30.5732 30.0732 25.4703 30.7823 19.0415H33.9582V15.9582H30.7823ZM16.9998 28.2915C11.0336 28.2915 6.20817 23.4661 6.20817 17.4998C6.20817 11.5336 11.0336 6.70817 16.9998 6.70817C22.9661 6.70817 27.7915 11.5336 27.7915 17.4998C27.7915 23.4661 22.9661 28.2915 16.9998 28.2915Z"
                fill="#29221E"
            />
        </Svg>
    );
}
