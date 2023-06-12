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
import { PencilIcon } from "../../assets/icons";
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
