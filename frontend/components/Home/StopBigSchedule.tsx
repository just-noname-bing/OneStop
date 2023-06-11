import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";
import { Center } from "../styled/Center";
import { Stop } from "./MainMapScreen";
import {
    isWorkingDay,
    ScheduleTypeBtn,
    ScheduleTypeText,
    StopTitle,
    TimeTableTitle,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
    Wrapper,
} from "./SharedComponents";
import { Route } from "./StopSmallSchedule";

const GET_TRANSPORT_SCHEDULE = gql`
    mutation GetTransportSchedule($stopId: String!, $transportId: String!) {
        getTransportSchedule(stop_id: $stopId, transport_id: $transportId) {
            arrival_time
            departure_time
            drop_off_type
            pickup_type
            stop_id
            stop_sequence
            trips {
                Calendar {
                    friday
                    start_date
                }
            }
        }
    }
`;

type getTransportSchedule = {
    arrival_time: string;
    departure_tim: string;
    drop_off_type: string;
    pickup_type: string;
    stop_id: string;
    stop_sequence: string;
    trips: {
        Calendar: {
            friday: string;
            start_date: string;
        };
    };
};

type Times = {
    hour: string;
    minutes: string[];
};

export function BigSchedule({ route, navigation }: any) {
    const stop = route.params.stop as Stop;
    const transport = route.params.transport as Route;
    const scheduleType = route.params?.scheduleType ?? Number(isWorkingDay());
    const [schedule, setSchedule] = useState<getTransportSchedule[]>([]);
    const [times, setTimes] = useState<Times[]>([]);

    const [fetchData, { data, loading }] = useMutation<{
        getTransportSchedule: getTransportSchedule[];
    }>(GET_TRANSPORT_SCHEDULE, {
        variables: {
            stopId: stop.stop_id,
            transportId: transport.route_id,
        },
    });

    console.log(stop, transport);
    console.log(schedule);

    useMemo(() => {
        setTimes(
            schedule.reduce((acc: any, value) => {
                const splitted = value.arrival_time.split(":");
                const hour = splitted[0];
                const minutes = splitted[1];

                if (acc.hasOwnProperty(hour)) {
                    if (!acc[hour].includes(minutes)) {
                        acc[hour].push(minutes);
                    }
                } else {
                    acc[hour] = [minutes];
                }

                return acc;
            }, {})
        );
    }, [schedule]);

    useMemo(() => {
        if (data?.getTransportSchedule) {
            // const newHolidays: getTransportSchedule[] = [];
            // const newWorkingDays: getTransportSchedule[] = [];
            const newSchedule: getTransportSchedule[] = [];
            data.getTransportSchedule.forEach((sched) => {
                console.log(sched.trips.Calendar.friday, scheduleType);
                const IS_CORRECT_SCHEDULE =
                    sched.trips.Calendar.friday == scheduleType;
                if (IS_CORRECT_SCHEDULE) {
                    newSchedule.push(sched);
                }
            });

            setSchedule(newSchedule);
        }
    }, [data, route, scheduleType]);

    const transportColor = useMemo(() => {
        return transportTypes.filter((x) => transport.route_type === x.id)[0]
            .color;
    }, [transport, route]);

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
                            navigation.navigate("BigSchedule", {
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
                    {!data || loading ? (
                        <Center>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </Center>
                    ) : (
                        <View>
                            {Object.entries(times)
                                .sort()
                                .map(([hour, minutes]: any, i) => (
                                    <TableRow key={i}>
                                        <TableHourRow index={i}>
                                            <TableHourRowText>
                                                {hour}
                                            </TableHourRowText>
                                        </TableHourRow>
                                        <TableMinRow index={i}>
                                            {minutes.map(
                                                (minute: string, j: number) => (
                                                    <Text key={`${i}@${j}`}>
                                                        {minute}
                                                    </Text>
                                                )
                                            )}
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
