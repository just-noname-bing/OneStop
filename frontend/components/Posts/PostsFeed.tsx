import React, { useCallback, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { COLOR_PALETE } from "../../utils/colors";
import DropDownPicker from "react-native-dropdown-picker";
import { LoadingIndicator, Lupa } from "../../assets/icons";
import {
    NewPostBtn,
    NewPostText,
    ProblemList,
    SearchInput,
    SearchWrapper,
    Title,
} from "./SharedComponents";
import { View } from "react-native";
import { POST, POSTS_QUERY } from "../../utils/graphql";
import { Wrapper } from "../styled/Wrapper";

export default function Posts({ navigation }: any): JSX.Element {
    const { data: posts, loading } = useQuery<{ getPosts: POST[] }>(
        POSTS_QUERY
    );

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([{ label: "Popular", value: 0 }]);
    const [value, setValue] = useState(items[0].value);

    return (
        <Wrapper style={{ gap: 10, minHeight: "100%" }}>
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
                    <SearchInput/>
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
            {posts && posts?.getPosts && !loading ? (
                <ProblemList data={posts.getPosts} />
            ) : (
                <LoadingIndicator />
            )}
        </Wrapper>
    );
}

