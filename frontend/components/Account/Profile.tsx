import { gql, useMutation } from "@apollo/client";
import { CommonActions } from "@react-navigation/native";
import { useContext } from "react";
import { Text } from "react-native";
import { Pressable } from "react-native";
import { TokenContext } from "../../utils/context";
import { TokensLogout } from "../../utils/tokens";
import { Center } from "../styled/Center";

const LOGOUT_MUTATION = gql`
    mutation Logout($token: String!) {
        logout(token: $token)
    }
`;

export default function ({}: any) {
    const [logout] = useMutation(LOGOUT_MUTATION);
    const [tokens, setToken] = useContext(TokenContext);

    return (
        <Center>
            <Pressable
                onPress={async () => {
                    await logout({
                        variables: { token: tokens?.refreshToken },
                    });
                    await TokensLogout();
                    setToken(null);
                    CommonActions.reset({
                        index: 1,
                        routes: [{ name: "Account" }],
                    });
                }}
            >
                <Text>Profile press to logout</Text>
            </Pressable>
        </Center>
    );
}
