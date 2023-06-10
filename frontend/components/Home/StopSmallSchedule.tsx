import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLOR_PALETE } from "../../utils/colors";
import {
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    SearchInput,
    TransportRow,
    transportTypes,
    TransportRowBtn,
    TransportRowText,
    Wrapper,
} from "./SharedComponents";

// test data riga_bus_41
// test data 1086

const GET_TRANSPORT_SCHEDULE = gql`
    mutation GetRoutesForStop($stopId: String!) {
        getRoutesForStop(stop_id: $stopId) {
            route_id
            route_long_name
            route_type
        }
    }
`;

type getTransportSchedule = {
    getRoutesForStop: [
        { route_id: string; route_long_name: string; route_type: string }
    ];
    getTransportSchedule: [
        {
            arrival_time: string;
            drop_off_type: string;
            departure_time: string;
            pickup_type: string;
            stop_id: string;
            stop_sequence: string;
            trips: { Calendar: { monday: string; saturday: string } };
        }
    ];
};

export function SmallSchedule({ route, navigation }: any): JSX.Element {
    const { stop } = route.params;
    const [getInformation, { data, loading }] =
        useMutation<getTransportSchedule>(GET_TRANSPORT_SCHEDULE, {
            variables: {
                stopId: "1086",
                transportId: "riga_bus_41",
            },
        });

    useEffect(() => {
        getInformation().catch(console.log);
    }, []);

    if (!data || loading)
        return (
            <Wrapper>
                <ActivityIndicator size="large" color="#0000ff" />
            </Wrapper>
        );

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Wrapper>
                <View style={{ gap: 13 }}>
                    <SearchInput />
                    <CategoryBtnWrapper>
                        {transportTypes.map((Type, idx) => (
                            <CategoryBtn
                                onPress={() =>
                                    navigation.navigate("ListOfTransport", {
                                        transportType: idx,
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
                        <ScheduleTypeBtn isPrimary>
                            <ScheduleTypeText isPrimary>
                                Working days
                            </ScheduleTypeText>
                        </ScheduleTypeBtn>
                        <ScheduleTypeBtn>
                            <ScheduleTypeText>Holidays</ScheduleTypeText>
                        </ScheduleTypeBtn>
                    </View>
                    <View style={{ gap: 16 / 1.5 }}>
                        <TransportRow>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                        </TransportRow>
                        <TransportRow>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                        </TransportRow>
                        <TransportRow>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                            <TransportRowBtn bg={COLOR_PALETE.bus}>
                                <TransportRowText>12</TransportRowText>
                            </TransportRowBtn>
                        </TransportRow>
                    </View>

                    <View style={{ gap: 15 / 1.5 }}>
                        <TimeTableTitle>Timetable</TimeTableTitle>
                        <View style={{ gap: 15 / 1.5 }}>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                            <TimeTableRow>
                                <TransportRowBtn bg={COLOR_PALETE.troleybus}>
                                    <TransportRowText>9</TransportRowText>
                                </TransportRowBtn>
                                <Text>1 min ago</Text>
                            </TimeTableRow>
                        </View>
                    </View>
                </View>
            </Wrapper>
        </ScrollView>
    );
}

const StopTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 46 / 1.5,
    lineHeight: 60 / 1.5,

    color: COLOR_PALETE.text,
});

const ScheduleTypeBtn = styled.Pressable(
    ({ isPrimary }: { isPrimary?: boolean }) => ({
        minHeight: 43,
        flex: 1,
        backgroundColor: isPrimary ? COLOR_PALETE.tram : "white",
        borderRadius: 15,

        borderWidth: !isPrimary ? 1 : 0,
        borderColor: COLOR_PALETE.stroke,

        justifyContent: "center",
        alignItems: "center",
    })
);

const ScheduleTypeText = styled.Text(
    ({ isPrimary }: { isPrimary?: boolean }) => ({
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 18 / 1.5,
        lineHeight: 23 / 1.5,

        color: isPrimary ? "white" : "black",
    })
);

const TimeTableTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
});

const TimeTableRow = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});
