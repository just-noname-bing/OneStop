import styled from "@emotion/native";
import Svg, { Path } from "react-native-svg";
import { COLOR_PALETE } from "../../utils/colors";

export const SearchInput = styled.TextInput({
    minHeight: 58 / 1.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR_PALETE.additionalText,
    paddingHorizontal: 30 / 1.5,
});

export const CategoryBtnWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
});

export const CategoryBtn = styled.Pressable(
    ({ isActive }: { isActive?: boolean }) => ({
        paddingVertical: 11,
        paddingHorizontal: 15,
        borderRadius: 12 / 1.5,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        gap: 10,

        ...(isActive && {
            elevation: 2,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 1,
            shadowRadius: 2,
        }),
    })
);

export const CategoryBtnText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: "#FFFFFF",
});

export function BusIcon() {
    return (
        <Svg width={18 / 1.5} height={26 / 1.5} viewBox="0 0 18 26" fill="none">
            <Path
                d="M0.5 17.7368C0.5 18.6632 0.914375 19.4947 1.5625 20.0737V21.9474C1.5625 22.5263 2.04062 23 2.625 23H3.6875C4.27187 23 4.75 22.5263 4.75 21.9474V20.8947H13.25V21.9474C13.25 22.5263 13.7281 23 14.3125 23H15.375C15.9594 23 16.4375 22.5263 16.4375 21.9474V20.0737C17.0856 19.4947 17.5 18.6632 17.5 17.7368V7.21053C17.5 3.52632 13.6962 3 9 3C4.30375 3 0.5 3.52632 0.5 7.21053V17.7368ZM4.21875 18.7895C3.33687 18.7895 2.625 18.0842 2.625 17.2105C2.625 16.3368 3.33687 15.6316 4.21875 15.6316C5.10063 15.6316 5.8125 16.3368 5.8125 17.2105C5.8125 18.0842 5.10063 18.7895 4.21875 18.7895ZM13.7812 18.7895C12.8994 18.7895 12.1875 18.0842 12.1875 17.2105C12.1875 16.3368 12.8994 15.6316 13.7812 15.6316C14.6631 15.6316 15.375 16.3368 15.375 17.2105C15.375 18.0842 14.6631 18.7895 13.7812 18.7895ZM15.375 12.4737H2.625V7.21053H15.375V12.4737Z"
                fill="white"
            />
        </Svg>
    );
}

export const Wrapper = styled.View({
    paddingHorizontal: 54 / 2.5,
    paddingVertical: 80,

    gap: 58 / 1.5,
});

export const TransportRow = styled.View({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7 / 1.5,
});

export const TransportRowBtn = styled.Pressable(({ bg }: { bg: string }) => ({
    width: 69 / 1.5,
    height: 69 / 1.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bg,
    borderRadius: 10,
}));

export const TransportRowText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,

    color: "white",
});
export const transportTypes = [
    { title: "Tram", color: COLOR_PALETE.tram, icon: BusIcon },
    { title: "Trolley", color: COLOR_PALETE.troleybus, icon: BusIcon },
    { title: "Bus", color: COLOR_PALETE.bus, icon: BusIcon },
];

export const StopTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 46 / 1.5,
    lineHeight: 60 / 1.5,

    color: COLOR_PALETE.text,

    flex: 1,
    flexWrap: "wrap",
});

export const ScheduleTypeBtn = styled.Pressable(
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

export const ScheduleTypeText = styled.Text(
    ({ isPrimary }: { isPrimary?: boolean }) => ({
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 18 / 1.5,
        lineHeight: 23 / 1.5,

        color: isPrimary ? "white" : "black",
    })
);

export const TimeTableTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
});

export function isWorkingDay(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
}
