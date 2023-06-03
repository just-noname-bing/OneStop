import React from "react"
import { Center } from "./styled/Center"
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native'
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client/core"
import { TouchableOpacity } from "react-native-gesture-handler"
import styled from "@emotion/native"
import { COLOR_PALETE } from "../utils/colors"

interface Props { }

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
}`

type POST = {
    id: string
    text: string
    title: string
    transport_id: string
    created_at: Date
    updated_at: Date
}

export function Posts(_: Props): JSX.Element {
    const { data: posts, loading, error } = useQuery<{ getPosts: POST[] }>(POSTS_QUERY)

    return (
        <PostsWrapper>
            {!loading ? (
                <View>
                    <View>
                        <Text>Last updates</Text>
                        <TouchableOpacity>
                            <Text>new post</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TextInput placeholder="Search" />
                        <View>
                            <Text>sort by:</Text>
                            <Text>Popular</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <PostsList>
                            {posts?.getPosts.map(post => (
                                <PostsItem key={post.id}>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                        <Text>{post.transport_id}</Text>
                                        <View>
                                            <Text>{post.title}</Text>
                                            <Text>Vodila daun</Text>
                                        </View>
                                        <Text>4 min ago</Text>
                                    </View>
                                    <View style={{ paddingHorizontal: 30 }}>
                                        <Text>Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.</Text>
                                    </View>
                                </PostsItem>
                            ))}
                            <Text>
                                {JSON.stringify(error, null, 2)}
                            </Text>
                        </PostsList>
                    </ScrollView>
                </View>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </PostsWrapper>
    )
}


const PostsWrapper = styled.View({
    paddingHorizontal: 50 / 1.5,
    paddingVertical: 100 / 1.5,
    width: "100%",
})

const PostsList = styled.View({
    gap: 15,
    marginBottom: 100
})

const PostsItem = styled.View({
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR_PALETE.stroke,

    gap: 20,

    paddingHorizontal: 7,
    paddingVertical: 15,
})
