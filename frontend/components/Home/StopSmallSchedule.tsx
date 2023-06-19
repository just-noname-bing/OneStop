import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import {
    getRoutesForStop,
    GET_ROUTES_FOR_STOP,
    Routes,
    Stop,
} from "../../utils/graphql";
import { SearchInput, SearchWrapper } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";
import { convertTimeToString, StopSearch } from "./MainMapScreen";
import {
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    TransportRow,
    transportTypes,
    TransportRowBtn,
    TransportRowText,
    ScheduleTypeBtn,
    ScheduleTypeText,
    StopTitle,
    TimeTableTitle,
    isWorkingDay,
} from "./SharedComponents";

// test data riga_bus_41
// test data 1086

export function SmallSchedule({ route, navigation }: any) {
    const stop = route.params.stop as Stop;

    const { data, loading } = useQuery<getRoutesForStop>(GET_ROUTES_FOR_STOP, {
        variables: {
            stopId: stop.stop_id,
        },
        fetchPolicy: "network-only",
    });

    const client = useApolloClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [GET_ROUTES_FOR_STOP],
            })
            .then(() => {
                setIsRefreshing(false);
            });
    };

    const rightTimeTableFormat = useMemo(() => {
        if (data?.getRoutesForStop) {
            const map = new Map<string, Routes>();
            for (let routs of data.getRoutesForStop) {
                for (let x of routs.Stop_times) {
                    map.set(x.arrival_time, routs.Routes as any);
                }
            }
            const full = Array.from(map.entries()).sort((a, b) => {
                const aa = a[0].split(":");
                const bb = b[0].split(":");
                return Number(aa.join("")) - Number(bb.join(""));
            });

            const cool = [];
            const currD = new Date();
            for (let f of full) {
                if (Number(f[0].split(":")[0]) > currD.getHours() + 1) {
                    break;
                }
                cool.push(f);
            }

            return cool;
        }
    }, [data, loading]);

    if (!data || loading) return <LoadingIndicator />;

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    style={{ borderColor: COLOR_PALETE.tram }}
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <Wrapper>
                <View style={{ gap: 13 }}>
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
                                <CategoryBtnText>{Type.title}</CategoryBtnText>
                            </CategoryBtn>
                        ))}
                    </CategoryBtnWrapper>
                </View>
                <View style={{ gap: 30 / 1.5 }}>
                    <StopTitle>{stop.stop_name}</StopTitle>
                    <View style={{ flexDirection: "row", gap: 30 }}>
                        <ScheduleTypeBtn isPrimary={isWorkingDay()}>
                            <ScheduleTypeText isPrimary={isWorkingDay()}>
                                Working days
                            </ScheduleTypeText>
                        </ScheduleTypeBtn>
                        <ScheduleTypeBtn isPrimary={!isWorkingDay()}>
                            <ScheduleTypeText isPrimary={!isWorkingDay()}>
                                Holidays
                            </ScheduleTypeText>
                        </ScheduleTypeBtn>
                    </View>
                    <View style={{ gap: 16 / 1.5 }}>
                        {transportTypes.map((type, idx) => (
                            <TransportRow key={idx}>
                                {data.getRoutesForStop
                                    .filter(
                                        (x) => x.Routes.route_type === type.id
                                    )
                                    .map((t, i) => (
                                        <TransportRowBtn
                                            key={`${idx}@${i}`}
                                            bg={type.color}
                                            onPress={() =>
                                                navigation.navigate(
                                                    "BigSchedule",
                                                    {
                                                        stop,
                                                        transport: t.Routes,
                                                    }
                                                )
                                            }
                                        >
                                            <TransportRowText>
                                                {t.Routes.route_short_name}
                                            </TransportRowText>
                                        </TransportRowBtn>
                                    ))}
                            </TransportRow>
                        ))}
                    </View>

                    <View style={{ gap: 15 / 1.5 }}>
                        <TimeTableTitle>Timetable</TimeTableTitle>
                        <View style={{ gap: 15 / 1.5 }}>
                            <FlatList
                                ListEmptyComponent={() => (
                                    <Center
                                        style={{
                                            paddingVertical: 100,
                                            opacity: 0.3,
                                        }}
                                    >
                                        <Text>No transport will come soon</Text>
                                    </Center>
                                )}
                                scrollEnabled={false}
                                data={rightTimeTableFormat}
                                contentContainerStyle={{ gap: 15 / 1.5 }}
                                renderItem={({ item: [a, b] }) => (
                                    <TimeTableRow>
                                        <TransportRowBtn
                                            bg={
                                                transportTypes.filter(
                                                    (x) => x.id === b.route_type
                                                )[0].color
                                            }
                                        >
                                            <TransportRowText>
                                                {b.route_short_name}
                                            </TransportRowText>
                                        </TransportRowBtn>
                                        <Text>{convertTimeToString(a)}</Text>
                                    </TimeTableRow>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </Wrapper>
        </ScrollView>
    );
}

const TimeTableRow = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});
