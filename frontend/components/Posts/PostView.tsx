import styled from "@emotion/native";
import React, { useState } from "react";
import {
    Text,
    Keyboard,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Lupa } from "../../assets/icons";
import { COLOR_PALETE } from "../../utils/colors";
import { Wrapper } from "../Home/SharedComponents";
import {
    InfoWrapper,
    NewPostBtn,
    NewPostText,
    ProblemDescription,
    ProblemList,
    ProblemTitle,
    ProblemWrapper,
    SearchInput,
    SearchWrapper,
    TimeStamp,
    Title,
    TransportDirection,
    TransportIcon,
    TransportIconText,
} from "./SharedComponents";

export default function ({ navigation }: any) {
    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ flexGrow: 1 }}
        >
            <ScrollView>
                <Wrapper style={{ gap: 10 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View>
                            <Title>Last updates</Title>
                        </View>
                        <NewPostBtn
                            onPress={() => navigation.navigate("CreateNewPost")}
                        >
                            <NewPostText>New post</NewPostText>
                        </NewPostBtn>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 16,
                        }}
                    >
                        <SearchWrapper>
                            <Lupa />
                            <SearchInput />
                        </SearchWrapper>
                    </View>

                    <ProblemList>
                        <ProblemWrapper activeOpacity={1}>
                            <InfoWrapper>
                                <TransportIcon bg={COLOR_PALETE.bus}>
                                    <TransportIconText>41</TransportIconText>
                                </TransportIcon>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <ProblemTitle>Car crash</ProblemTitle>
                                    <TransportDirection>
                                        Imanta - Esplanāde
                                    </TransportDirection>
                                </View>
                                <View>
                                    <TimeStamp>3 min ago</TimeStamp>
                                </View>
                            </InfoWrapper>
                            <ProblemDescription>
                                the bus didn't arrive as usual, but today there
                                was a pretty decent reason, the driver said he
                                was attacked by optimus prime from the planet
                                Cybertron the de facto leader of the Autobots, a
                                faction of a transforming species of synthetic
                                intelligence 😭
                            </ProblemDescription>
                        </ProblemWrapper>

                        <View style={{ gap: 25 / 1.5 }}>
                            <CommentInput
                                multiline={true}
                                placeholder="Write your comment"
                            />
                            <CreateCommentBtn>
                                <CreateCommentText>Send</CreateCommentText>
                            </CreateCommentBtn>
                        </View>

                        <ProblemWrapper activeOpacity={1}>
                            <CommentAuthorWrapper>
                                <CommentAuthor>Nikkita733:</CommentAuthor>
                                <TimeStamp>5 min ago</TimeStamp>
                            </CommentAuthorWrapper>
                            <ProblemDescription>
                                Кидаю step, лечу прям вверх, мой красный сет
                                убил их всех У них в башке один preset, я покажу
                                тоннельный свет Им не найти меня, я скрылся, я
                                пропавший в dissimilate
                            </ProblemDescription>
                        </ProblemWrapper>
                        <ProblemWrapper activeOpacity={1}>
                            <CommentAuthorWrapper>
                                <CommentAuthor>Nikkita733:</CommentAuthor>
                                <TimeStamp>5 min ago</TimeStamp>
                            </CommentAuthorWrapper>
                            <ProblemDescription>real</ProblemDescription>
                        </ProblemWrapper>
                    </ProblemList>
                </Wrapper>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const CommentInput = styled.TextInput({
    height: 160,
    borderWidth: 1,
    borderColor: "#CDCDCD",
    borderRadius: 15,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,

    verticalAlign: "top",
    padding: 10,
});

const CreateCommentBtn = styled.Pressable({
    width: 119 / 1.5,
    height: 63 / 1.5,
    backgroundColor: "#FF3838",
    // borderWidth: 1,
    // borderColor: "#CDCDCD",
    borderRadius: 10,

    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
});
const CreateCommentText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,

    color: "#FFFFFF",
});

const CommentAuthorWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});
const CommentAuthor = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20 / 1.5,
    lineHeight: 26 / 1.5,
    color: "#999999",
});
