import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import styled from "@emotion/native";
import { PostItem } from "./Posts/PostItem";
import { COLOR_PALETE } from "../utils/colors";

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

export function Posts(_: Props): JSX.Element {
    const {
        data: posts,
        loading,
        error,
    } = useQuery<{ getPosts: POST[] }>(POSTS_QUERY);

    return (
        <PostsWrapper>
            {!loading ? (
                <View style={{ gap: 9 }}>
                    <TitleWrapper>
                        <Title>Last updates</Title>
                        <CreatePostButton>
                            <CreatePostButtonText>
                                New post
                            </CreatePostButtonText>
                        </CreatePostButton>
                    </TitleWrapper>
                    <SearchWrapper>
                        <SearchField placeholder="Search" />
                        <SortByWrapper>
                            <SortByWrapperTitle>Sort by:</SortByWrapperTitle>
                            <Text>Popular</Text>
                        </SortByWrapper>
                    </SearchWrapper>
                    <ScrollView showsVerticalScrollIndicator={false}>
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
    paddingHorizontal: 20 / 1.5,
    paddingVertical: 100 / 1.5,
    width: "100%",
});

const PostsList = styled.View({
    gap: 15,
    marginBottom: 100,
});

const TitleWrapper = styled.View({
    flexDirection: "row",
    justifyContent: "space-between",
});

const Title = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 48 / 1.5,
    lineHeight: 62 / 1.5,
    color: COLOR_PALETE.text,
});

const CreatePostButton = styled.TouchableOpacity({
    width: 172 / 1.5,
    height: 63 / 1.5,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLOR_PALETE.tram,

    borderRadius: 10 / 1.5,
});

const CreatePostButtonText = styled.Text({
    color: "white",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 32 / 1.5,
    lineHeight: 42 / 1.5,
});

const SearchWrapper = styled.View({
    flexDirection: "row",
    gap: 16 / 1.5,
});

const SearchField = styled.TextInput({
    width: "100%",
    maxWidth: 362 / 1.5,
    minHeight: 56 / 1.5,

    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETE.stroke,

    paddingHorizontal: 10,

    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 20 / 1.5,
    lineHeight: 26 / 1.5,
});

const SortByWrapper = styled.View({
    flexDirection: "row",
    alignItems: "center",

    gap:4
});

const SortByWrapperTitle = styled.Text({
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18 / 1.5,
    lineHeight: 23 / 1.5,
});
