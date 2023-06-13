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
    transportTypes,
} from "./SharedComponents";
import { getRoutesForStop, GET_ROUTES_FOR_STOP } from "./StopSmallSchedule";
import {
    CreatePostIcon,
    GpsIconSvg,
    Lupa,
    TransportStopMarker,
} from "../../assets/icons";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";

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

const mapStyle = [
    {
        featureType: "administrative.land_parcel",
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "labels",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "transit",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
];

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
                customMapStyle={mapStyle}
                provider="google"
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
                        <SearchWrapper>
                            <Lupa />
                            <SearchInput />
                        </SearchWrapper>
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
    fontSize: 18 / 1.6,
    lineHeight: 23 / 1.6,
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

function SoonTransportCostructor() {
    return (
        <SoonTransport>
            <SoonTransportCodeWrapper>
                <SoonTransportCode>56</SoonTransportCode>
            </SoonTransportCodeWrapper>
            <View
                style={{
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
            >
                <SoonTransportDesc>Daugavgrīva - Ziepniekkalns</SoonTransportDesc>
                <SoonTransportDesc
                    style={{
                        color: COLOR_PALETE.additionalText,
                    }}
                >
                    to Kleistu iela
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
                        to Kleistu iela
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
