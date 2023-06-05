import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import styled from "@emotion/native";
import { PostItem } from "./PostItem";
import { COLOR_PALETE } from "../../utils/colors";

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

export type POST = {
    id: string;
    text: string;
    title: string;
    transport_id: string;
    created_at: Date;
    updated_at: Date;
};

export function Posts(): JSX.Element {
    const {
        data: posts,
        loading,
        error,
    } = useQuery<{ getPosts: POST[] }>(POSTS_QUERY);

    return (
        <PostsWrapper>
            {!loading ? (
                <View style={{ gap: 8 }}>
                    <View style={{ gap: 10 }}>
                        <CreateNewPostWrapper>
                            <Text
                                style={{
                                    fontStyle: "normal",
                                    fontWeight: "400",
                                    fontSize: 48 / 1.5,
                                    lineHeight: 62 / 1.5,
                                }}
                            >
                                bomb
                            </Text>
                            <CreateNewPostButton>
                                <PostButtonText>New post</PostButtonText>
                            </CreateNewPostButton>
                        </CreateNewPostWrapper>
                        <SearchInputWrapper>
                            <SearchInputField placeholder="Search" />
                            <SelectorWrapper>
                                <Text>sort by:</Text>
                                <Text>Popular</Text>
                            </SelectorWrapper>
                        </SearchInputWrapper>
                    </View>
                    <ScrollView
                        style={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <PostsList>
                            {posts?.getPosts.map((post) => (
                                <PostItem key={post.id} post={post} />
                            ))}
                            <Text>{JSON.stringify(error, null, 2)}</Text>
                        </PostsList>
                    </ScrollView>
                </View>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </PostsWrapper>
    );
}

const PostsWrapper = styled.View({
    paddingHorizontal: 35 / 1.5,
    paddingVertical: 100 / 1.5,
    width: "100%",
});

const PostsList = styled.View({
    gap: 15,
    marginBottom: 100,
});

const CreateNewPostWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
});

const CreateNewPostButton = styled.TouchableOpacity({
    backgroundColor: COLOR_PALETE.tram,
    width: 172 / 1.5,
    height: 63 / 1.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
});

const PostButtonText = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,

    textAlign: "center",

    color: "white",
});

const SearchInputWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
});

const SelectorWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "center",
});

const SearchInputField = styled.TextInput({
    width: "100%",
    maxWidth: 300 / 1.5,
    height: 56 / 1.5,

    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETE.stroke,

    paddingHorizontal: 10,
});
