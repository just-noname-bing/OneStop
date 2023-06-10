import styled from "@emotion/native";
import { View, Text, ScrollView } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";
import {
    isWorkingDay,
    ScheduleTypeBtn,
    ScheduleTypeText,
    StopTitle,
    TimeTableTitle,
    TransportRowBtn,
    TransportRowText,
    Wrapper,
} from "./SharedComponents";

export function BigSchedule({ route }: any) {
    const { stop, transport } = route.params;

    return (
        <ScrollView
            style={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <Wrapper style={{ gap: 25 }}>
                <View style={{ flexDirection: "row", gap: 13 }}>
                    <TransportRowBtn
                        bg={transport.color}
                    >
                        <TransportRowText>{transport.code}</TransportRowText>
                    </TransportRowBtn>
                    <StopTitle>{stop.stop_name}</StopTitle>
                </View>
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
                <View style={{ gap: 23 / 1.5 }}>
                    <TimeTableTitle>Timetable</TimeTableTitle>
                    <View>
                        {Array.from(new Array(23), () => 1).map((_, i) => (
                            <TableRow key={i}>
                                <TableHourRow index={i}>
                                    <TableHourRowText>{i}</TableHourRowText>
                                </TableHourRow>
                                <TableMinRow index={i}>
                                    <Text>55</Text>
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
