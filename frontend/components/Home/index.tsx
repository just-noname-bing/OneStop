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
    TextInput,
    Text,
    ScrollView,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { Center } from "../styled/Center";
import Svg, { Path, Rect } from "react-native-svg";
import styled from "@emotion/native";
import { MapMarker } from "react-native-maps";
import { COLOR_PALETE } from "../../utils/colors";
import MapView from "react-native-map-clustering";
import Animated, {
    color,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";

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

export function Home() {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const { data: stops, loading } = useQuery<{ Stops: Stop[] }>(STOPS_QUERY);
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
            <CreatePostButton style={rBottomSheetStyle}>
                <Pressable>
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
                            <CategoryBtn
                                style={{ backgroundColor: COLOR_PALETE.tram }}
                            >
                                <BusIcon />
                                <CategoryBtnText>Tram</CategoryBtnText>
                            </CategoryBtn>
                            <CategoryBtn
                                style={{
                                    backgroundColor: COLOR_PALETE.troleybus,
                                }}
                            >
                                <BusIcon />
                                <CategoryBtnText>Trolley</CategoryBtnText>
                            </CategoryBtn>
                            <CategoryBtn
                                style={{ backgroundColor: COLOR_PALETE.bus }}
                            >
                                <BusIcon />
                                <CategoryBtnText>Bus</CategoryBtnText>
                            </CategoryBtn>
                        </CategoryBtnWrapper>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{gap:30, paddingBottom:250 }}>
                                <NearStopConstructor />
                                <NearStopConstructor />
                                <NearStopConstructor />
                                <NearStopConstructor />
                                <NearStopConstructor />
                                <NearStopConstructor />
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

const SearchInput = styled.TextInput({
    minHeight: 58 / 1.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR_PALETE.additionalText,
    paddingHorizontal: 30 / 1.5,
});

const CategoryBtnWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
});

const CategoryBtn = styled.Pressable({
    paddingVertical: 11,
    paddingHorizontal: 15,
    borderRadius: 12 / 1.5,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 10,
});

const CategoryBtnText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: "#FFFFFF",
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

const NearTransportCodeWrapper = styled.View({
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_PALETE.tram,
    borderRadius: 5,
});

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

function BusIcon() {
    return (
        <Svg width={18 / 1.5} height={26 / 1.5} viewBox="0 0 18 26" fill="none">
            <Path
                d="M0.5 17.7368C0.5 18.6632 0.914375 19.4947 1.5625 20.0737V21.9474C1.5625 22.5263 2.04062 23 2.625 23H3.6875C4.27187 23 4.75 22.5263 4.75 21.9474V20.8947H13.25V21.9474C13.25 22.5263 13.7281 23 14.3125 23H15.375C15.9594 23 16.4375 22.5263 16.4375 21.9474V20.0737C17.0856 19.4947 17.5 18.6632 17.5 17.7368V7.21053C17.5 3.52632 13.6962 3 9 3C4.30375 3 0.5 3.52632 0.5 7.21053V17.7368ZM4.21875 18.7895C3.33687 18.7895 2.625 18.0842 2.625 17.2105C2.625 16.3368 3.33687 15.6316 4.21875 15.6316C5.10063 15.6316 5.8125 16.3368 5.8125 17.2105C5.8125 18.0842 5.10063 18.7895 4.21875 18.7895ZM13.7812 18.7895C12.8994 18.7895 12.1875 18.0842 12.1875 17.2105C12.1875 16.3368 12.8994 15.6316 13.7812 15.6316C14.6631 15.6316 15.375 16.3368 15.375 17.2105C15.375 18.0842 14.6631 18.7895 13.7812 18.7895ZM15.375 12.4737H2.625V7.21053H15.375V12.4737Z"
                fill="white"
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

function NearStopConstructor() {
    return (
        <NearTransportStopWrapper>
            <View>
                <NearTransportTitle>Pirskapopas iela</NearTransportTitle>
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
                {Array.from(new Array(25), () => 12).map((_, i) => (
                    <NearTransportCodeWrapper key={i}>
                        <NearTransportCode>12</NearTransportCode>
                    </NearTransportCodeWrapper>
                ))}
            </View>

            <View>
                <SoonTransportCostructor />
                <SoonTransportCostructor />
                <SoonTransportCostructor />
                <SoonTransportCostructor />
                <SoonTransportCostructor />
                <SoonTransportCostructor />
            </View>
        </NearTransportStopWrapper>
    );
}
