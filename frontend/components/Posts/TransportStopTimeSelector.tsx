import { useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { LoadingIndicator } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import {
    getTransportSchedule,
    GET_TRANSPORT_SCHEDULE,
    Route,
    Stop,
} from "../../utils/graphql";
import {
    isWorkingDay,
    ScheduleTypeBtn,
    ScheduleTypeText,
    StopTitle,
    TimeTableTitle,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
} from "../Home/SharedComponents";
import { Wrapper } from "../styled/Wrapper";
import {} from "./SharedComponents";

type Times = Record<string, getTransportSchedule[]>;

export function TransportStopTimeSelector({ route, navigation }: any) {
    const stop = route.params.stop as Stop;
    const transport = route.params.transport as Route;
    const scheduleType = route.params?.scheduleType ?? Number(isWorkingDay());

    const [fetchData, { data, loading }] = useMutation<{
        getTransportSchedule: getTransportSchedule[];
    }>(GET_TRANSPORT_SCHEDULE, {
        variables: {
            stopId: stop.stop_id,
            transportId: transport.route_id,
        },
    });

    const schedule = useMemo(() => {
        const newSchedule: getTransportSchedule[] = [];
        if (data?.getTransportSchedule) {
            data.getTransportSchedule.forEach((sched) => {
                console.log(sched.trips.Calendar.friday, scheduleType);
                const IS_CORRECT_SCHEDULE =
                    sched.trips.Calendar.friday == scheduleType;
                if (IS_CORRECT_SCHEDULE) {
                    newSchedule.push(sched);
                }
            });
        }

        return newSchedule;
    }, [data, route, scheduleType]);

    const transportColor = useMemo(() => {
        return transportTypes.filter((x) => transport.route_type === x.id)[0]
            .color;
    }, [transport, route]);

    const [SelectedTime, setSelectedTime] = useState("");

    const times = useMemo<Times>(() => {
        return schedule.reduce((acc: any, value) => {
            const splitted = value.arrival_time.split(":");
            const hour = splitted[0];

            console.log(acc);

            if (acc[hour] && !acc[hour].includes(value)) {
                acc[hour].push(value);
            } else {
                acc[hour] = [value];
            }

            return acc;
        }, {});
    }, [schedule]);

    console.log(times);
    console.log(stop, transport);
    console.log(schedule);

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
                            navigation.navigate("TransportStopTimeSelector", {
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
                            navigation.navigate("TransportStopTimeSelector", {
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
                    <View style={{ flexDirection: "row", alignItems:"center", }}>
                        <View style={{flex:1}}><TimeTableTitle>Timetable</TimeTableTitle></View>
                        <ScheduleTypeBtn onPress={() => {
                                navigation.navigate("WhatHappend", {
                                        transport, stop, trip_id: SelectedTime
                                    })
                            }} disabled={!SelectedTime} style={{flex:1}} isPrimary={!!SelectedTime}>
                            <ScheduleTypeText isPrimary={!!SelectedTime}>Continue</ScheduleTypeText>
                        </ScheduleTypeBtn>
                    </View>
                    {!data || loading ? (
                        <LoadingIndicator />
                    ) : (
                        <View>
                            {Object.entries(times)
                                .sort()
                                .map(([a, bbomba], i) => (
                                    <TableRow key={i}>
                                        <TableHourRow index={i}>
                                            <TableHourRowText>
                                                {a}
                                            </TableHourRowText>
                                        </TableHourRow>
                                        <TableMinRow index={i}>
                                            {bbomba.map((x, j) => (
                                                <Minute
                                                    onPress={() =>
                                                        setSelectedTime(
                                                            x.trips.trip_id
                                                        )
                                                    }
                                                    Selected={
                                                        SelectedTime ===
                                                        x.trips.trip_id
                                                    }
                                                    key={`${i}@${j}`}
                                                >
                                                    {x.arrival_time.slice(3, 5)}
                                                </Minute>
                                            ))}
                                        </TableMinRow>
                                    </TableRow>
                                ))}
                        </View>
                    )}
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
    padding: 5,
    borderRadius: 5,

    fontSize: 15,
}));
