import styled from "@emotion/native";
import { CommonActions } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import {
    Keyboard,
    ScrollView,
    TextInput,
    View,
    TouchableWithoutFeedback,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { COLOR_PALETE } from "../../utils/colors";
import { TokenContext } from "../../utils/context";
import { transportTypes, Wrapper } from "../Home/SharedComponents";
import { Route } from "../Home/StopSmallSchedule";
import { TransportBtn, TransportText } from "./CreateNewPost";

export default function ({ route, navigation }: any) {
    const [tokens] = useContext(TokenContext);

    useEffect(() => {
        if (!tokens) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Account" }],
                })
            );
        }
    }, []);

    if (tokens === null) {
        return <></>;
    }

    const transport = route.params.transport as Route;
    const color = transportTypes.filter((r) => r.id === transport.route_type)[0]
        .color;
    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ height: "100%" }}
        >
            <ScrollView>
                <Wrapper style={{ gap: 25 }}>
                    <View
                        style={{ flexDirection: "row", gap: 10, flexGrow: 1 }}
                    >
                        <TransportBtn
                            bg={color}
                            style={{ position: "relative" }}
                            onPress={() => navigation.goBack()}
                        >
                            <PencilIcon />
                            <TransportText>
                                {transport.route_short_name}
                            </TransportText>
                        </TransportBtn>
                        <View style={{ flex: 1, gap: 12 / 1.5 }}>
                            <TitleInput placeholder="Traffic jam..." />
                            <TextInput
                                style={{ color: "silver" }}
                                value={transport.route_long_name}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View>
                        <TextBox
                            multiline={true}
                            placeholder={"Describe your problem.."}
                        />
                    </View>
                    <View>
                        <ConfirmBtn>
                            <ConfirmText>Create</ConfirmText>
                        </ConfirmBtn>
                    </View>
                </Wrapper>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

function PencilIcon() {
    return (
        <Svg
            style={{ position: "absolute", top: 5, right: 5, zIndex: 2 }}
            pointerEvents={"none"}
            width={19 / 1.5}
            height={19 / 1.5}
            viewBox="0 0 19 19"
            fill="none"
        >
            <Path
                d="M16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3043 0.75 14.863 0.75C15.4217 0.75 15.8923 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.571 18.275 4.113C18.2917 4.655 18.1083 5.11733 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"
                fill="black"
            />
        </Svg>
    );
}

const TitleInput = styled.TextInput({
    minHeight: 62 / 1.5,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 10,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    color: "#29221E",

    paddingHorizontal: 10,
});

const TextBox = styled.TextInput({
    height: 160,
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 5,

    textAlignVertical: "top",
    padding: 10,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
});

const ConfirmBtn = styled.Pressable({
    minHeight: 51 / 1.5,
    backgroundColor: COLOR_PALETE.tram,
    borderRadius: 6,
    paddingVertical: 10,

    justifyContent: "center",
    alignItems: "center",
});

const ConfirmText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    textAlign: "center",
    color: "#FFFFFF",
});
