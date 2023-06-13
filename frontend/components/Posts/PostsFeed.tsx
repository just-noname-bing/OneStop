import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import styled from "@emotion/native";
import { PostItem } from "./PostItem";
import { COLOR_PALETE } from "../../utils/colors";
import { Wrapper } from "../Home/SharedComponents";
import { Path, Svg } from "react-native-svg";
import { InputFieldWrapper } from "../Account/SharedComponents";
import DropDownPicker from "react-native-dropdown-picker";
import { Lupa } from "../../assets/icons";
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

interface Props {}

export const POSTS_QUERY = gql`
    query GetPosts {
        getPosts {
            id
            text
            title
            transport_id
            created_at
            updated_at
        }
    }
`;

type POST = {
    id: string;
    text: string;
    title: string;
    transport_id: string;
    created_at: Date;
    updated_at: Date;
};

export default function Posts({ navigation }: any): JSX.Element {
    const {
        data: posts,
        loading,
        error,
    } = useQuery<{ getPosts: POST[] }>(POSTS_QUERY);

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([{ label: "Popular", value: 0 }]);
    const [value, setValue] = useState(items[0].value);

    return (
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
                <View>
                    <DropDownPicker
                        style={{
                            width: 172 / 1.5,
                            minHeight: 63 / 1.5,
                            borderColor: COLOR_PALETE.stroke,
                        }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                    />
                </View>
            </View>

            <ScrollView
                style={{ height: "100%", zIndex: -1 }}
                showsVerticalScrollIndicator={false}
            >
                <ProblemList style={{ paddingBottom: 80 }}>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
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
                                <TimeStamp>4 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            the bus didn't arrive as usual, but today there was
                            a pretty decent reason, the driver said he was
                            attacked by optimus prime from the planet Cybertron
                            the de facto leader of the Autobots, a faction of a
                            transforming species of synthetic intelligence 😭
                        </ProblemDescription>
                    </ProblemWrapper>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
                        <InfoWrapper>
                            <TransportIcon bg={COLOR_PALETE.bus}>
                                <TransportIconText>13</TransportIconText>
                            </TransportIcon>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <ProblemTitle>Traffic jam</ProblemTitle>
                                <TransportDirection>
                                    Imanta - jugla
                                </TransportDirection>
                            </View>
                            <View>
                                <TimeStamp>5 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            223235223523235223523235223523235223523235223523235223532352235
                        </ProblemDescription>
                    </ProblemWrapper>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
                        <InfoWrapper>
                            <TransportIcon bg={COLOR_PALETE.bus}>
                                <TransportIconText>13</TransportIconText>
                            </TransportIcon>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <ProblemTitle>Traffic jam</ProblemTitle>
                                <TransportDirection>
                                    Imanta - jugla
                                </TransportDirection>
                            </View>
                            <View>
                                <TimeStamp>5 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            223235223523235223523235223523235223523235223523235223532352235
                        </ProblemDescription>
                    </ProblemWrapper>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
                        <InfoWrapper>
                            <TransportIcon bg={COLOR_PALETE.bus}>
                                <TransportIconText>13</TransportIconText>
                            </TransportIcon>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <ProblemTitle>Traffic jam</ProblemTitle>
                                <TransportDirection>
                                    Imanta - jugla
                                </TransportDirection>
                            </View>
                            <View>
                                <TimeStamp>5 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            223235223523235223523235223523235223523235223523235223532352235
                        </ProblemDescription>
                    </ProblemWrapper>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
                        <InfoWrapper>
                            <TransportIcon bg={COLOR_PALETE.bus}>
                                <TransportIconText>13</TransportIconText>
                            </TransportIcon>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <ProblemTitle>Traffic jam</ProblemTitle>
                                <TransportDirection>
                                    Imanta - jugla
                                </TransportDirection>
                            </View>
                            <View>
                                <TimeStamp>5 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            223235223523235223523235223523235223523235223523235223532352235
                        </ProblemDescription>
                    </ProblemWrapper>
                    <ProblemWrapper
                        activeOpacity={1}
                        onPress={() => navigation.navigate("PostView")}
                    >
                        <InfoWrapper>
                            <TransportIcon bg={COLOR_PALETE.bus}>
                                <TransportIconText>13</TransportIconText>
                            </TransportIcon>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "space-between",
                                }}
                            >
                                <ProblemTitle>Traffic jam</ProblemTitle>
                                <TransportDirection>
                                    Imanta - jugla
                                </TransportDirection>
                            </View>
                            <View>
                                <TimeStamp>5 min ago</TimeStamp>
                            </View>
                        </InfoWrapper>
                        <ProblemDescription>
                            223235223523235223523235223523235223523235223523235223532352235
                        </ProblemDescription>
                    </ProblemWrapper>
                </ProblemList>
            </ScrollView>
        </Wrapper>
    );
}
