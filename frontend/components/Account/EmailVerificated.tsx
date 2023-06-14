import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { LoadingIndicator } from "../../assets/icons";
import { GRAPHQL_API_URL } from "../../utils/constants";
import { Center } from "../styled/Center";
import { Description, Title, Wrapper } from "./EmailHasBeenSent";

export default function ({ route, navigation }: any) {
    const token = route.params?.token as string;
    const [success, setSuccess] = useState<boolean | null>(null);
    const [counter, setCounter] = useState(5);

    useEffect(() => {
        fetch(GRAPHQL_API_URL + "/confirm/verify_email", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .catch(() => {
                console.log("chelik vzorvalsja");
                setSuccess(false);
            })
            .then(async (d) => {
                if (d) {
                    const data = await d.json();
                    setSuccess(data.ok);
                }
            });
    }, []);

    useEffect(() => {
        let timeout: any;
        if (counter > 0) {
            timeout = setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            navigation.navigate("Account", { screen: "Login" });
        }

        return () => clearTimeout(timeout);
    }, [counter]);

    if (success === null) {
        return <LoadingIndicator />;
    }

    return (
        <Center>
            <Wrapper style={{ gap: 125 / 1.5 }}>
                {success && (
                    <View>
                        <CheckMark />
                    </View>
                )}
                {success ? (
                    <Title>Your email has been verified</Title>
                ) : (
                    <Title>Something went wrong 😭</Title>
                )}
            </Wrapper>
            <Wrapper
                style={{
                    paddingVertical: 101 / 1.5,
                }}
            >
                <Description>Return to menu in {counter}</Description>
            </Wrapper>
        </Center>
    );
}

function CheckMark() {
    return (
        <Svg
            width={170 / 1.5}
            height={133 / 1.5}
            viewBox="0 0 170 133"
            fill="none"
        >
            <Path
                d="M56.6667 133L0 76.4043L19.8333 56.5957L56.6667 93.383L150.167 0L170 19.8085L56.6667 133Z"
                fill="#34A853"
            />
        </Svg>
    );
}
