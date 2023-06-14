import styled from "@emotion/native";
import { BusIcon } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";

// export const SearchInput = styled.TextInput({
//     minHeight: 58 / 1.5,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLOR_PALETE.additionalText,
//     paddingHorizontal: 30 / 1.5,
// });

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
    { id: "900", title: "Tram", color: COLOR_PALETE.tram, icon: BusIcon },
    {
        id: "800" ,
        title: "Trolley",
        color: COLOR_PALETE.troleybus,
        icon: BusIcon,
    },
    { id: "3",  title: "Bus", color: COLOR_PALETE.bus, icon: BusIcon },
] ;

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
