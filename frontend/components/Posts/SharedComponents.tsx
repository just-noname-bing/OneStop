import styled from "@emotion/native";
import { COLOR_PALETE } from "../../utils/colors";

export const NewPostBtn = styled.Pressable({
    width: 172 / 1.5,
    height: 63 / 1.5,
    backgroundColor: "#FF3838",
    // borderWidth: 1,
    // borderColor: "#CDCDCD",
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
});
export const NewPostText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 2,
    lineHeight: 42 / 2,
    color: "#FFFFFF",
});

export const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 48 / 2,
    lineHeight: 62 / 2,
    color: "#29221E",
});

export const SearchWrapper = styled.View({
    flexDirection: "row",
    gap: 8,

    flexGrow: 1,

    borderColor: COLOR_PALETE.stroke,
    borderWidth: 1,
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    height: 63 / 1.5,
});

export const SearchInput = styled.TextInput({
    flex: 1,
});

export const InfoWrapper = styled.View({
    flexDirection: "row",
    gap: 10,
});

export const ProblemList = styled.View({
    gap: 15,
});

export const ProblemWrapper = styled.TouchableOpacity({
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 10,

    padding: 10,

    gap: 20 / 1.5,
});

export const TransportIcon = styled.View(({ bg }: { bg: string }) => ({
    width: 74 / 1.5,
    height: 73 / 1.5,
    backgroundColor: bg,
    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
}));

export const TransportIconText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    color: "#FFFFFF",
});

export const ProblemTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
    color: "#29221E",
});

export const TransportDirection = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.8,
    lineHeight: 31 / 1.8,
    color: "#29221E",
});

export const ProblemDescription = styled.Text({});

export const TimeStamp = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
    color: "#29221E",
});
