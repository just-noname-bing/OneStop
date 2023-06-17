import { useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { LoadingIndicator } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import {
    getTransportSchedule,
    GET_TRANSPORT_SCHEDULE,
    Route,
    Stop,
} from "../../utils/graphql";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";
import {
    isWorkingDay,
    ScheduleTypeBtn,
    ScheduleTypeText,
    StopTitle,
    TimeTableTitle,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
} from "./SharedComponents";

export function BigSchedule({ route }: any) {
    const stop = route.params.stop as Stop;
    const transport = route.params.transport as Route;
    const scheduleType = route.params?.scheduleType ?? Number(isWorkingDay());

    const navigation = useNavigation() as any;

    const [fetchData, { data, loading }] = useMutation<{
        getTransportSchedule: getTransportSchedule[];
    }>(GET_TRANSPORT_SCHEDULE, {
        variables: {
            stopId: stop.stop_id,
            transportId: transport.route_id,
        },
    });

    const orderedVersion = useMemo(() => {
        if (!data?.getTransportSchedule) return [];
        const ord = data.getTransportSchedule.filter(
            (x) => x.trips.Calendar.friday == scheduleType
        );

        let h: string = "";
        const grouped = ord.reduce((acc, value) => {
            const s = value.arrival_time.slice(0, 2);

            if (!h || s !== h) {
                acc.push([value]);
            } else {
                acc[acc.length - 1].push(value);
            }

            h = s;
            return acc;
        }, [] as getTransportSchedule[][]);
        return grouped;
    }, [scheduleType, data]);

    console.log(orderedVersion);

    const transportColor = useMemo(() => {
        console.log("bomb");
        return transportTypes.filter((x) => x.id === transport.route_type)[0]
            .color;
    }, [transport]);

    useEffect(() => {
        fetchData().catch(console.log);
    }, []);

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Wrapper style={{ gap: 25 }}>
                <View style={{ flexDirection: "row", gap: 13 }}>
                    <TransportRowBtn bg={transportColor}>
                        <TransportRowText>
                            {transport.route_short_name}
                        </TransportRowText>
                    </TransportRowBtn>
                    <StopTitle>{stop.stop_name}</StopTitle>
                </View>
                <View style={{ flexDirection: "row", gap: 30 }}>
                    <ScheduleTypeBtn
                        isPrimary={scheduleType}
                        onPress={() => {
                            if (scheduleType === 1) return;
                            navigation.setParams({
                                stop,
                                transport,
                                scheduleType: 1,
                            });
                        }}
                    >
                        <ScheduleTypeText isPrimary={scheduleType}>
                            Working days
                        </ScheduleTypeText>
                    </ScheduleTypeBtn>
                    <ScheduleTypeBtn
                        isPrimary={!scheduleType}
                        onPress={() => {
                            if (scheduleType === 0) return;
                            navigation.navigate("BigSchedule", {
                                stop,
                                transport,
                                scheduleType: 0,
                            });
                        }}
                    >
                        <ScheduleTypeText isPrimary={!scheduleType}>
                            Holidays
                        </ScheduleTypeText>
                    </ScheduleTypeBtn>
                </View>
                <View style={{ gap: 23 / 1.5 }}>
                    <TimeTableTitle>Timetable</TimeTableTitle>
                    <View>
                        <FlatList
                            ListEmptyComponent={
                                <Center style={{ minHeight: 200 }}>
                                    <LoadingIndicator />
                                </Center>
                            }
                            scrollEnabled={false}
                            data={orderedVersion}
                            renderItem={({ item, index: i }) => (
                                <TableRow key={i}>
                                    <TableHourRow index={i}>
                                        <TableHourRowText>
                                            {orderedVersion[
                                                i
                                            ][0].arrival_time.slice(0, 2)}
                                        </TableHourRowText>
                                    </TableHourRow>
                                    <TableMinRow index={i}>
                                        {item.map((d, j) => (
                                            <Minute key={`${i}@${j}`}>
                                                {d.arrival_time.slice(
                                                    d.arrival_time.indexOf(
                                                        ":"
                                                    ) + 1,
                                                    d.arrival_time.lastIndexOf(
                                                        ":"
                                                    )
                                                )}
                                            </Minute>
                                        ))}
                                    </TableMinRow>
                                </TableRow>
                            )}
                        />
                    </View>
                </View>
            </Wrapper>
        </ScrollView>
    );
}

const TableRow = styled.View({
    flexDirection: "row",
    width: "100%",
});

const TableHourRow = styled.View(({ index }: { index: number }) => ({
    alignItems: "center",
    justifyContent: "center",

    borderColor: COLOR_PALETE.stroke,
    borderRightWidth: 1,
    borderBottomWidth: 1,

    // paddingHorizontal: 15 / 1.5,
    width: 66 / 1.5,

    backgroundColor: (index + 1) % 2 === 0 ? "#FBFBFB" : "white",
}));

const TableHourRowText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 28 / 1.5,
    lineHeight: 36 / 1.5,
    textAlign: "center",
    color: COLOR_PALETE.text,
});

const TableMinRow = styled.View(({ index }: { index: number }) => ({
    flexDirection: "row",
    flexWrap: "wrap",

    alignItems: "center",

    columnGap: 22 / 1.5,
    rowGap: 5 / 1.5,
    padding: 11 / 1.5,

    borderColor: COLOR_PALETE.stroke,
    borderRightWidth: 1,
    borderBottomWidth: 1,

    flex: 1,

    backgroundColor: (index + 1) % 2 === 0 ? "#FBFBFB" : "white",
}));


const Minute = styled.Text(({ Selected }: { Selected?: boolean }) => ({
    // style={{borderColor:COLOR_PALETE.tram, borderWidth:1, padding:2, borderRadius:5}} key={`${i}@${j}`}
    borderColor: COLOR_PALETE.tram,
    borderWidth: Selected ? 1 : 0,
    paddingVertical: 5,
    borderRadius: 5,

    fontSize: 15,
}));

function isNextToCurrentTime(arrival_time: string) {
    return true;
}
