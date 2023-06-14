import { gql, useMutation } from "@apollo/client";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { Pressable } from "react-native";
import { LOGOUT_MUTATION } from "../../utils/graphql";
import { TokensLogout, useAuth } from "../../utils/tokens";
import { Center } from "../styled/Center";

export default function ({}: any) {
    const [logout] = useMutation(LOGOUT_MUTATION);
    const navigation = useNavigation()

    const { rf } = useAuth();

    return (
        <Center>
            <Pressable
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
                }}
            >
                <Text>Profile press to logout</Text>
            </Pressable>
        </Center>
    );
}
