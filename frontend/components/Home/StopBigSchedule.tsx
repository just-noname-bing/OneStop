import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";
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

export function BigSchedule({ route, navigation }: any) {
    const stop = route.params.stop as Stop;
    const transport = route.params.transport as Route;
    const scheduleType = route.params?.scheduleType || Number(isWorkingDay());
    const [schedule, setSchedule] = useState<getTransportSchedule[]>([]);

    const [fetchData, { data }] = useMutation<{
        getTransportSchedule: getTransportSchedule[];
    }>(GET_TRANSPORT_SCHEDULE, {
        variables: {
            stopId: stop.stop_id,
            transportId: transport.route_id,
        },
    });

    const filterSchedules = () => {
        if (data?.getTransportSchedule) {
            // const newHolidays: getTransportSchedule[] = [];
            // const newWorkingDays: getTransportSchedule[] = [];
            const newSchedule: getTransportSchedule[] = [];
            data.getTransportSchedule.forEach((sched) => {
                const IS_CORRECT_SCHEDULE =
                    sched.trips.Calendar.friday == scheduleType;
                console.log(IS_CORRECT_SCHEDULE);
                if (IS_CORRECT_SCHEDULE) {
                    newSchedule.push(sched);
                }
            });

            setSchedule(newSchedule);
        }
    };

    const transportColor = transportTypes.filter(
        (x) => transport.route_type === x.id
    )[0].color;

    useEffect(() => {
        fetchData().catch(console.log);
    }, []);

    useEffect(() => {
        filterSchedules();
    }, [data, route]);

    console.log(scheduleType)

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
                    <View>
                        {Array.from(new Array(23), () => 1).map((_, i) => (
                            <TableRow key={i}>
                                <TableHourRow index={i}>
                                    <TableHourRowText>{i}</TableHourRowText>
                                </TableHourRow>
                                <TableMinRow index={i}>
                                    <Text>{schedule.length}</Text>
                                    <Text>55</Text>
                                    <Text>55</Text>
                                    <Text>55</Text>
                                    <Text>55</Text>
                                    <Text>55</Text>
                                    <Text>55</Text>
                                </TableMinRow>
                            </TableRow>
                        ))}
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
