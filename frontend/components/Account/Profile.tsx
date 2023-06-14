import { gql, useApolloClient, useMutation } from "@apollo/client";
import styled from "@emotion/native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { RefreshControl } from "react-native";
import { Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { COLOR_PALETE } from "../../utils/colors";
import { formatRelativeTime } from "../../utils/formatTime";
import { LOGOUT_MUTATION } from "../../utils/graphql";
import { TokensLogout, useAuth } from "../../utils/tokens";
import { InfoWrapper, ProblemDescription, ProblemTitle, ProblemWrapper, TimeStamp, TransportDirection, TransportIcon, TransportIconText } from "../Posts/SharedComponents";
import { Center } from "../styled/Center";
import { Wrapper } from "../styled/Wrapper";

export default function({ }: any) {
    const [logout] = useMutation(LOGOUT_MUTATION);
    const navigation = useNavigation() as any

    const [isRefreshing, setIsRefreshing] = useState(false);

    const client = useApolloClient();

    const handleRefresh = () => {
        setIsRefreshing(true);
        client
            .refetchQueries({
                include: [],
            })
            .then(() => setIsRefreshing(false));
    };

    const { rf } = useAuth();

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
            <Wrapper>
                <View style={{ gap: 30 }}>
                    <InputWrapper>
                        <Lable>Name:</Lable>
                        <InputField value="name" />
                    </InputWrapper>
                    <InputWrapper>
                        <Lable>Surname:</Lable>
                        <InputField value="surname" />
                    </InputWrapper>
                    <InputWrapper>
                        <Lable>E-mail:</Lable>
                        <InputField value="users emai" editable={false} />
                    </InputWrapper>
                </View>
                <ConfirmWrapper>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <ConfirmBtn isPrimary>
                            <ConfirmText isPrimary>confirm</ConfirmText>
                        </ConfirmBtn>
                        <ConfirmBtn
                            onPress={async () => {
                                await logout({
                                    variables: { token: rf },
                                });
                                await TokensLogout();
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: "Account" }],
                                    })
                                );
                            }}>
                            <ConfirmText>logout</ConfirmText>
                        </ConfirmBtn>
                    </View>
                </ConfirmWrapper>

                <HistoryWrapper>
                    <HistoryCategory isSelected>Post History</HistoryCategory>
                    <HistoryCategory>Comment History</HistoryCategory>
                </HistoryWrapper>

                <ProblemWrapper
                    activeOpacity={1}
                    onPress={() =>
                        navigation.navigate("PostView", { postId: "" })
                    }
                >
                    <InfoWrapper>
                        <TransportIcon
                            bg={COLOR_PALETE.bus}
                        >
                            <TransportIconText>
                                12
                            </TransportIconText>
                        </TransportIcon>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "space-between",
                            }}
                        >
                            <ProblemTitle>Traffic jam</ProblemTitle>
                            <TransportDirection>
                            </TransportDirection>
                        </View>
                        <View>
                            <TimeStamp>
                                {formatRelativeTime(new Date())}
                            </TimeStamp>
                        </View>
                    </InfoWrapper>
                    <ProblemDescription>Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.</ProblemDescription>
                </ProblemWrapper>
            </Wrapper>
        </ScrollView>
    );
}


const Lable = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
    color: "#29221E",

    flex: .5
})

const InputField = styled.TextInput(({ isError }: { isError?: boolean }) => ({
    flex: 1,
    height: 32,
    borderBottomWidth: 1,
    borderBottomColor: isError ? '#FF3838' : "#9B9B9B",
}))

const InputWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
})

const ConfirmBtn = styled.Pressable(({ isPrimary }: { isPrimary?: boolean }) => ({
    minHeight: 50 / 1.5,
    paddingHorizontal: 54 / 1.5,
    backgroundColor: isPrimary ? '#FF3838' : "transparent",
    borderColor: '#FF3838',
    borderWidth: !isPrimary ? 1 : 0,
    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
}))

const ConfirmText = styled.Text(({ isPrimary }: { isPrimary?: boolean }) => ({
    color: isPrimary ? "white" : COLOR_PALETE.text,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
}))

const ConfirmWrapper = styled.View({
    alignItems: "flex-end"
})


const HistoryWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 74
})

const HistoryCategory = styled.Text(({ isSelected }: { isSelected?: boolean }) => ({
    color: isSelected ? COLOR_PALETE.tram : COLOR_PALETE.additionalText,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24 / 1.5,
    lineHeight: 31 / 1.5,
}))



