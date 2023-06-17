import React, { useCallback, useRef, useState } from "react";
import { useFragment_experimental, useQuery } from "@apollo/client/react";
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
import { Pressable, View } from "react-native";
import { POST, POSTS_QUERY } from "../../utils/graphql";
import { Wrapper } from "../styled/Wrapper";
import { TextInput } from "react-native";

export default function Posts({ navigation }: any): JSX.Element {
    const { data: posts, loading } = useQuery<{ getPosts: POST[] }>(
        POSTS_QUERY
    );

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: "Latest", value: 0 },
        { label: "Old", value: 1 },
    ]);
    const [value, setValue] = useState(items[0].value);

    const [searchInput, setSearchInput] = useState("");
    const handleSearch = useCallback(() => {
        if (!posts?.getPosts) {
            return [];
        }

        return posts.getPosts.filter((x) => {
            const searchinputLower = searchInput.toLowerCase();
            return (
                x.text.toLowerCase().includes(searchinputLower) ||
                x.title.toLowerCase().includes(searchinputLower) ||
                x.route.route_short_name
                    .toLowerCase()
                    .includes(searchinputLower) ||
                x.route.route_long_name
                    .toLowerCase()
                    .includes(searchinputLower) ||
                x.stop.stop_name.toLowerCase().includes(searchinputLower) ||
                x.stop_time.arrival_time
                    .toLowerCase()
                    .includes(searchinputLower)
            );
        });
    }, [posts, searchInput]);

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
                    <Pressable onPress={handleSearch}>
                        <Lupa />
                    </Pressable>
                    <SearchInput
                        onChangeText={(e) => setSearchInput(e)}
                        returnKeyType="done"
                    />
                </SearchWrapper>
                <View style={{}}>
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
                <ProblemList data={handleSearch()} sortOrder={value as any} />
            ) : (
                <LoadingIndicator />
            )}
        </Wrapper>
    );
}
