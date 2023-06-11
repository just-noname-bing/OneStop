import React, { useEffect, useState, useRef } from "react";
import {
    Accuracy,
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
} from "expo-location";
import { LocationObject, watchPositionAsync } from "expo-location";
import {
    ActivityIndicator,
    View,
    Dimensions,
    Pressable,
    Keyboard,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Center } from "../styled/Center";
import Svg, { Path, Rect } from "react-native-svg";
import styled from "@emotion/native";
import { MapMarker } from "react-native-maps";
import { COLOR_PALETE } from "../../utils/colors";
import MapView from "react-native-map-clustering";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    ScrollView,
} from "react-native-gesture-handler";
import {
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    SearchInput,
    transportTypes,
} from "./SharedComponents";
import { getRoutesForStop, GET_ROUTES_FOR_STOP } from "./StopSmallSchedule";

export const DELTA = {
    lat: 0.0922,
    long: 0.0421,
};

const WINDOW_HEIGHT = Dimensions.get("window").height;

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

export function MainMap({ navigation }: any): JSX.Element {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [closesStops, setClosestStops] = useState<Stop[]>([]);

    const {
        data: stops,
        loading,
        error,
        refetch,
    } = useQuery<{ Stops: Stop[] }>(STOPS_QUERY);
    const mapRef = useRef<MapView>(null);

    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            const currentSize = event.translationY + context.value.y;
            translateY.value = Math.min(
                Math.max(currentSize, -WINDOW_HEIGHT / 1.2),
                0
            );
        })
        .onEnd(() => {
            const config = {
                damping: 20,
                stiffness: 150,
            };

            const DEFAULT_STATE = 0;
            const MIDDLE_STATE = -WINDOW_HEIGHT / 2;
            const FULL_STATE = -WINDOW_HEIGHT / 1.2;

            const BGR_THN_DEFAULT = translateY.value < DEFAULT_STATE;

            const BGR_THN_PREV = translateY.value < context.value.y;
            const SM_THN_PREV = translateY.value > context.value.y;

            const SM_THN_MIDDLE = translateY.value > MIDDLE_STATE;
            const BGR_THN_MIDDLE = translateY.value < MIDDLE_STATE;

            console.log(
                translateY.value,
                WINDOW_HEIGHT,
                context.value,
                FULL_STATE
            );

            if (
                BGR_THN_DEFAULT &&
                ((BGR_THN_PREV && SM_THN_MIDDLE) ||
                    (SM_THN_PREV && BGR_THN_MIDDLE))
            ) {
                translateY.value = withSpring(MIDDLE_STATE, config);
            } else if (BGR_THN_DEFAULT && BGR_THN_PREV && BGR_THN_MIDDLE) {
                translateY.value = withSpring(FULL_STATE, config);
            } else {
                runOnJS(Keyboard.dismiss)();
                translateY.value = withSpring(DEFAULT_STATE, config);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

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

            let subscription = await watchPositionAsync(
                { distanceInterval: 10 },
                (location) => {
                    setLocation(location);
                }
            );

            return () => subscription.remove();
        })();
    }, []);

    useEffect(() => {
        if (stops && stops.Stops && location) {
            getClosestMarkers(stops.Stops, location).then((closest) =>
                setClosestStops(closest)
            );
        }
    }, [stops, location]);

    console.log(loading, location, !!stops, error);

    if (error) {
        refetch();
    }

    if (!location || !stops || loading)
        return (
            <Center>
                <ActivityIndicator size="large" color="#0000ff" />
            </Center>
        );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, width: "100%" }}
                initialRegion={{
                    latitude: location!.coords.latitude,
                    longitude: location!.coords.longitude,
                    latitudeDelta: DELTA.lat,
                    longitudeDelta: DELTA.long,
                }}
                showsCompass
                showsMyLocationButton={false}
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
                        onPress={() => {
                            console.log("pressed " + s.stop_id);
                            navigation.navigate("SmallSchedule", { stop: s });
                        }}
                    >
                        <View>
                            <TransportStopMarker />
                        </View>
                    </MapMarker>
                ))}
            </MapView>
            <CreatePostButton style={rBottomSheetStyle}>
                <Pressable
                    onPress={() =>
                        navigation.navigate("Posts", {
                            screen: "CreateNewPost",
                        })
                    }
                >
                    <CreatePostIcon />
                </Pressable>
            </CreatePostButton>
            <GpsButton style={rBottomSheetStyle}>
                <Pressable
                    onPress={() =>
                        (mapRef?.current as any).animateToRegion({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: DELTA.lat / 15,
                            longitudeDelta: DELTA.long / 15,
                        })
                    }
                >
                    <GpsIconSvg />
                </Pressable>
            </GpsButton>
            <GestureDetector gesture={gesture}>
                <BottomMenu style={rBottomSheetStyle}>
                    <MenuLine />
                    <BottomMenuContent>
                        <SearchInput />
                        <CategoryBtnWrapper>
                            {transportTypes.map((Type, idx) => (
                                <CategoryBtn
                                    onPress={() =>
                                        navigation.navigate("ListOfTransport", {
                                            transportType: Type.id,
                                        })
                                    }
                                    key={idx}
                                    style={{ backgroundColor: Type.color }}
                                >
                                    <Type.icon />
                                    <CategoryBtnText>
                                        {Type.title}
                                    </CategoryBtnText>
                                </CategoryBtn>
                            ))}
                        </CategoryBtnWrapper>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ gap: 30, paddingBottom: 250 }}>
                                {closesStops.map((closestS, i) => (
                                    <NearStopConstructor
                                        key={i}
                                        stop={closestS}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </BottomMenuContent>
                </BottomMenu>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const BottomMenu = styled(Animated.View)({
    backgroundColor: "white",
    height: "110%",
    width: "100%",

    position: "absolute",
    top: WINDOW_HEIGHT / 1.2,
    // top: 0,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    paddingHorizontal: 54 / 2.5,
    paddingVertical: 23 / 1.5,
    gap: 48,

    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 13,
    elevation: 5,
});

const CreatePostButton = styled(Animated.View)({
    position: "absolute",
    right: 20,
    top: WINDOW_HEIGHT / 1.2 - 80 * 1.75,
});

const GpsButton = styled(Animated.View)({
    backgroundColor: "white",
    borderRadius: 11,
    padding: 12,

    position: "absolute",
    right: 20,
    top: WINDOW_HEIGHT / 1.2 - 80,
});

const MenuLine = styled.View({
    width: 40 / 1.5,
    height: 5 / 1.5,

    backgroundColor: "#CFCCD4",
    borderRadius: 7,

    alignSelf: "center",
});

const BottomMenuContent = styled.View({
    gap: 25 / 1.5,
});

const NearTransportStopWrapper = styled.View({
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 15,
    padding: 12,

    gap: 10,
});

const NearTransportTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 31,
    color: COLOR_PALETE.text,
});

const NearTransportDescWrapper = styled.View({
    flexDirection: "row",
    alignItems: "center",

    gap: 24,
});

const NearTransportDescription = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20 / 1.5,
    lineHeight: 26 / 1.5,
    color: COLOR_PALETE.additionalText,
});

const NearTransportCodeWrapper = styled.View(({ bg }: { bg: string }) => ({
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: bg,
    borderRadius: 5,
}));

const NearTransportCode = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "white",
});

const SoonTransport = styled.View({
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,

    borderBottomColor: COLOR_PALETE.stroke,
    borderBottomWidth: 1,
});

const SoonTransportCodeWrapper = styled.View({
    width: 35,
    height: 37,
    backgroundColor: COLOR_PALETE.bus,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
});

const SoonTransportCode = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 23,

    color: "#FFFFFF",
});

const SoonTransportDesc = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.2,
    lineHeight: 23 / 1.2,
});

const SoonTransportTimeWrapper = styled.View({
    flexDirection: "row",
    gap: 30,
});

const SoonTransportTime = styled.View({
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
});

const SoonTransportTimeTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: "#000000",
});

const SoonTransportTimeMin = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,

    color: COLOR_PALETE.text,
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

function CreatePostIcon() {
    return (
        <Svg width={70 / 1.5} height={70 / 1.5} viewBox="0 0 70 70" fill="none">
            <Path
                d="M38.5 38.5H31.5V17.5H38.5M38.5 52.5H31.5V45.5H38.5M35 0C30.4037 0 25.8525 0.905302 21.6061 2.66422C17.3597 4.42313 13.5013 7.00121 10.2513 10.2513C3.68749 16.815 0 25.7174 0 35C0 44.2826 3.68749 53.185 10.2513 59.7487C13.5013 62.9988 17.3597 65.5769 21.6061 67.3358C25.8525 69.0947 30.4037 70 35 70C44.2826 70 53.185 66.3125 59.7487 59.7487C66.3125 53.185 70 44.2826 70 35C70 30.4037 69.0947 25.8525 67.3358 21.6061C65.5769 17.3597 62.9988 13.5013 59.7487 10.2513C56.4987 7.00121 52.6403 4.42313 48.3939 2.66422C44.1475 0.905302 39.5963 0 35 0Z"
                fill="#FF3838"
            />
        </Svg>
    );
}

function SoonTransportCostructor() {
    return (
        <SoonTransport>
            <SoonTransportCodeWrapper>
                <SoonTransportCode>12</SoonTransportCode>
            </SoonTransportCodeWrapper>
            <View
                style={{
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
            >
                <SoonTransportDesc>Keista iela</SoonTransportDesc>
                <SoonTransportDesc
                    style={{
                        color: COLOR_PALETE.additionalText,
                    }}
                >
                    to Prechu iela
                </SoonTransportDesc>
            </View>
            <SoonTransportTimeWrapper>
                <SoonTransportTime>
                    <SoonTransportTimeTitle>Now</SoonTransportTimeTitle>
                    <SoonTransportTimeMin>min</SoonTransportTimeMin>
                </SoonTransportTime>
                <SoonTransportTime>
                    <SoonTransportTimeTitle>43</SoonTransportTimeTitle>
                    <SoonTransportTimeMin>min</SoonTransportTimeMin>
                </SoonTransportTime>
            </SoonTransportTimeWrapper>
        </SoonTransport>
    );
}

function NearStopConstructor(props: { stop: Stop }) {
    const [fetchRoutes, { loading, data }] = useMutation<getRoutesForStop>(
        GET_ROUTES_FOR_STOP,
        {
            variables: {
                stopId: props.stop.stop_id,
            },
        }
    );

    useEffect(() => {
        fetchRoutes().catch(console.log);
    }, []);

    if (!data || loading) {
        return (
            <Center style={{ flexGrow: 1 }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </Center>
        );
    }

    return (
        <NearTransportStopWrapper>
            <View>
                <NearTransportTitle>{props.stop.stop_name}</NearTransportTitle>
                <NearTransportDescWrapper>
                    <NearTransportDescription>
                        to Kipsala norverg
                    </NearTransportDescription>
                    <View>
                        <NearTransportDescription>
                            5min
                        </NearTransportDescription>
                    </View>
                </NearTransportDescWrapper>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    gap: 5,
                    flexWrap: "wrap",
                }}
            >
                {data.getRoutesForStop.map((route, i) => (
                    <NearTransportCodeWrapper
                        bg={
                            transportTypes.filter(
                                (x) => route.route_type === x.id
                            )[0].color
                        }
                        key={i}
                    >
                        <NearTransportCode>
                            {route.route_short_name}
                        </NearTransportCode>
                    </NearTransportCodeWrapper>
                ))}
            </View>

            <View>
                <SoonTransportCostructor />
                <SoonTransportCostructor />
            </View>
        </NearTransportStopWrapper>
    );
}

function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function getClosestMarkers(
    markers: Stop[],
    userLocation: LocationObject
) {
    const temp = [...markers];
    const sortedMarkers = temp.sort(
        (a, b) =>
            calculateDistance(
                Number(a.stop_lat),
                Number(a.stop_lon),
                userLocation.coords.latitude,
                userLocation.coords.longitude
            ) -
            calculateDistance(
                Number(b.stop_lat),
                Number(b.stop_lon),
                userLocation.coords.latitude,
                userLocation.coords.longitude
            )
    );
    return sortedMarkers.slice(0, 3);
}
