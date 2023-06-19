import React, {
    useEffect,
    useState,
    useRef,
    useMemo,
    useCallback,
} from "react";
import {
    Accuracy,
    getCurrentPositionAsync,
    requestForegroundPermissionsAsync,
} from "expo-location";
import { LocationObject, watchPositionAsync } from "expo-location";
import {
    Dimensions,
    Pressable,
    Keyboard,
    View,
    RefreshControl,
    FlatList,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
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
import {
    CreatePostIcon,
    GpsIconSvg,
    LoadingIndicator,
    Lupa,
    TransportStopMarker,
} from "../../assets/icons";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import {
    CustomRouteForStop,
    getRoutesForStop,
    GET_ROUTES_FOR_STOP,
    Stop,
    STOPS_QUERY,
} from "../../utils/graphql";
import { Route, useNavigation } from "@react-navigation/native";
import { transformOperation } from "@apollo/client/link/utils";
import { Center } from "../styled/Center";
import { Text } from "react-native";
import { isNextToCurrentTime } from "./StopBigSchedule";

export const DELTA = {
    lat: 0.0922,
    long: 0.0421,
};

const WINDOW_HEIGHT = Dimensions.get("window").height;

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

    const {
        data: stops,
        loading,
        error,
        refetch,
    } = useQuery<{ Stops: Stop[] }>(STOPS_QUERY, {
        fetchPolicy: "cache-first",
    });

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

    const animateSwipePadding = useAnimatedStyle(() => ({
        paddingBottom: WINDOW_HEIGHT - Math.abs(translateY.value) + 109,
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

    console.log(loading, location, !!stops, error);
    console.log("_______GHHDDHSGSKDHGHG ", translateY.value, WINDOW_HEIGHT);

    if (error) {
        refetch();
    }

    if (!location || !stops || loading) return <LoadingIndicator />;

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
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: "Posts",
                                    state: {
                                        routes: [
                                            { name: "PostsFeed" },
                                            {
                                                name: "CreateNewPost",
                                            },
                                        ],
                                    },
                                },
                            ],
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
                        <StopSearch />
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

                        <NearStopsWrapper
                            animatedPadd={animateSwipePadding}
                            l={location}
                            stops={stops.Stops}
                        />
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

const NearTransportStopWrapper = styled.Pressable({
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
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
    flexWrap:"wrap",
    maxWidth:100
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
    fontSize: 24 / 2,
    lineHeight: 31 / 2,

    color: "#000000",
});

const SoonTransportTimeMin = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,

    color: COLOR_PALETE.text,
});

function SoonTransportCostructor(routes: CustomRouteForStop) {
    const [head, end] = routes.Routes.route_long_name.split(" - ");

    const firstTwo = routes.Stop_times.splice(0, 2);
    useEffect(() => {
        console.log("SOON TRANSPORT CONSTRUCTOR");
        console.log(routes.Routes.route_short_name, firstTwo);
        console.log("SOON TRANSPORT CONSTRUCTOR");
    }, [routes]);

    return (
        <SoonTransport>
            <SoonTransportCodeWrapper
                style={{
                    backgroundColor: transportTypes.filter(
                        (x) => routes.Routes.route_type === x.id
                    )[0].color,
                }}
            >
                <SoonTransportCode>
                    {routes.Routes.route_short_name}
                </SoonTransportCode>
            </SoonTransportCodeWrapper>
            <View
                style={{
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
            >
                <SoonTransportDesc>{head}</SoonTransportDesc>
                <SoonTransportDesc
                    style={{
                        color: COLOR_PALETE.additionalText,
                    }}
                >
                    to {end}
                </SoonTransportDesc>
            </View>
            <SoonTransportTimeWrapper>
                {firstTwo.map((times, i) => (
                    <SoonTransportTime key={i}>
                        <SoonTransportTimeTitle>
                            {convertTimeToString(times.arrival_time)}
                        </SoonTransportTimeTitle>
                    </SoonTransportTime>
                ))}
            </SoonTransportTimeWrapper>
        </SoonTransport>
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

function getClosestMarkers(markers: Stop[], userLocation: LocationObject) {
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
    return sortedMarkers.slice(0, 6);
}

export function convertTimeToString(arrival_time: string) {
    const [h, m, s] = arrival_time.split(":");
    const now = new Date();
    const date = new Date();
    date.setHours(Number(h), Number(m), Number(s));
    const diff = Math.round((date.getTime() - now.getTime()) / 1000);

    if (diff < 60) {
        return "now";
    } else if (diff < 3600) {
        const mins = Math.floor(diff / 60);
        return "in " + mins + " mins";
    } else {
        return h + ":" + m;
    }
}

export function StopSearch({ value }: { value?: string }) {
    const [searchInput, setSearchInput] = useState(value ?? "");
    const navigation = useNavigation() as any;
    return (
        <SearchWrapper>
            <Lupa />
            <SearchInput
                returnKeyType="done"
                value={searchInput}
                onChangeText={(e) => setSearchInput(e)}
                onSubmitEditing={() =>
                    navigation.navigate("StopSearch", {
                        query: searchInput,
                    })
                }
            />
        </SearchWrapper>
    );
}

const GET_ROUTES_FOR_MULTIPLE_STOPS = gql`
    query GetRoutesForMultipleStops($stopIds: [String!]!) {
        getRoutesForMultipleStops(stop_ids: $stopIds) {
            stop_id
            stop_name
            stop_lat
            stop_lon
            routes {
                route_id
                route_short_name
                route_long_name
                route_type
                route_sort_order
                stop_times {
                    trip_id
                    arrival_time
                    departure_time
                    stop_id
                    stop_sequence
                    pickup_type
                    drop_off_type
                    trips {
                        route_id
                        service_id
                        trip_id
                        trip_headsign
                        direction_id
                        block_id
                        shape_id
                        wheelchair_accessible
                    }
                }
                stop_order {
                    stops {
                        stop_name
                        stop_id
                    }
                }
            }
        }
    }
`;

type getRoutesForMultipleStops = {
    stop_id: string;
    stop_name: string;
    stop_lat: string;
    stop_lon: string;
    routes: {
        route_id: string;
        route_short_name: string;
        route_long_name: string;
        route_type: string;
        route_sort_order: string;
        stop_times: {
            trip_id: string;
            arrival_time: string;
            departure_time: string;
            stop_id: string;
            stop_sequence: string;
            pickup_type: string;
            drop_off_type: string;
            trips: {
                route_id: string;
                service_id: string;
                trip_id: string;
                trip_headsign: string;
                direction_id: string;
                block_id: string;
                shape_id: string;
                wheelchair_accessible: string;
            };
        }[];
        stop_order: {
            stops: {
                stop_name: string;
                stop_id: string;
            };
        }[];
    }[];
};

function NearStopsWrapper(props: {
    animatedPadd: any;
    stops: Stop[];
    l: LocationObject;
}) {
    const { stops, animatedPadd, l } = props;
    const [isRefreshing, setIsRefreshing] = useState(false);
    const closestStops = useCallback(() => {
        console.log("closest stops recalc");
        return getClosestMarkers(stops, l).slice(0, 5);
    }, [stops]);

    const { data, loading, refetch } = useQuery<{
        getRoutesForMultipleStops: getRoutesForMultipleStops[];
    }>(GET_ROUTES_FOR_MULTIPLE_STOPS, {
        variables: { stopIds: closestStops().flatMap((x) => x.stop_id) },
        skip: !stops || !l,
    });

    const getCodeColor = useCallback(
        (type: string) => {
            return transportTypes.filter((x) => x.id === type)[0].color;
        },
        [stops]
    );

    const navigation = useNavigation() as any;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={async () => {
                        setIsRefreshing(true);
                        closestStops();
                        await refetch();
                        setIsRefreshing(false);
                    }}
                />
            }
        >
            <Animated.View style={[{ gap: 15 }, animatedPadd]}>
                {!data || loading ? (
                    <LoadingIndicator />
                ) : (
                    <FlatList
                        scrollEnabled={false}
                        data={data.getRoutesForMultipleStops}
                        contentContainerStyle={{ gap: 20 }}
                        renderItem={({ item, index: i }) => (
                            <NearTransportStopWrapper
                                onPress={() => {
                                    navigation.navigate("SmallSchedule", {
                                        stop: item,
                                    });
                                }}
                                key={i}
                            >
                                <View>
                                    <NearTransportTitle>
                                        {item.stop_name}
                                    </NearTransportTitle>
                                    <NearTransportDescWrapper>
                                        <NearTransportDescription>
                                            {
                                                item.routes[0].stop_order[
                                                    item.routes[0].stop_order
                                                        .length - 1
                                                ].stops.stop_name
                                            }
                                        </NearTransportDescription>
                                        <View>
                                            <NearTransportDescription>
                                                ~5min
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
                                    {item.routes.flatMap((route, j) => (
                                        <NearTransportCodeWrapper
                                            bg={getCodeColor(route.route_type)}
                                            key={`${i}@${j}`}
                                        >
                                            <NearTransportCode>
                                                {route.route_short_name}
                                            </NearTransportCode>
                                        </NearTransportCodeWrapper>
                                    ))}
                                </View>

                                <View>
                                    <FlatList
                                        scrollEnabled={false}
                                        data={item.routes}
                                        renderItem={({ item: routes }) => (
                                            <SoonTransport>
                                                <SoonTransportCodeWrapper
                                                    style={{
                                                        backgroundColor:
                                                            getCodeColor(
                                                                routes.route_type
                                                            ),
                                                    }}
                                                >
                                                    <SoonTransportCode>
                                                        {
                                                            routes.route_short_name
                                                        }
                                                    </SoonTransportCode>
                                                </SoonTransportCodeWrapper>
                                                <View
                                                    style={{
                                                        justifyContent:
                                                            "space-between",
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <SoonTransportDesc>
                                                        {
                                                            routes.stop_order[0]
                                                                .stops.stop_name
                                                        }
                                                    </SoonTransportDesc>
                                                    <SoonTransportDesc
                                                        style={{
                                                            color: COLOR_PALETE.additionalText,
                                                        }}
                                                    >
                                                        {
                                                            routes.stop_order[
                                                                routes
                                                                    .stop_order
                                                                    .length - 1
                                                            ].stops.stop_name
                                                        }
                                                    </SoonTransportDesc>
                                                </View>
                                                <FlatList
                                                    style={{
                                                        flexDirection: "row",
                                                        gap: 30,
                                                        alignItems: "center",
                                                    }}
                                                    data={getNextTimesSlice(
                                                        routes.stop_times
                                                    )}
                                                    renderItem={({
                                                        item: stop_time,
                                                        index: k,
                                                    }) => (
                                                        <SoonTransportTime
                                                            key={k}
                                                        >
                                                            <SoonTransportTimeTitle>
                                                                {convertTimeToString(
                                                                    stop_time.arrival_time
                                                                )}
                                                            </SoonTransportTimeTitle>
                                                        </SoonTransportTime>
                                                    )}
                                                />
                                            </SoonTransport>
                                        )}
                                    />
                                </View>
                            </NearTransportStopWrapper>
                        )}
                    />
                )}
            </Animated.View>
        </ScrollView>
    );
}

function splitStopName(stopName: string) {
    const splited = stopName.split(" - ");
    return splited[splited.length - 1];
}

function getNextTimesSlice(data: any) {
    const x = data.filter((x: any) => isNextToCurrentTime(x.arrival_time));
    x.sort((a: any, b: any) => {
        const [aHour, aMinute, aSecond] = a.arrival_time.split(":").map(Number);
        const [bHour, bMinute, bSecond] = b.arrival_time.split(":").map(Number);

        if (aHour !== bHour) {
            return aHour - bHour;
        }

        if (aMinute !== bMinute) {
            return aMinute - bMinute;
        }

        return aSecond - bSecond;
    });
    console.log("SORTED_IN_TIME");
    return x.slice(0, 2);
}
