import React from "react"
import { Center } from "./styled/Center"
import { ActivityIndicator, Text, View } from 'react-native'
import { useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client/core"

interface Props { }

const POSTS_QUERY = gql`
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

export function Posts(_: Props): JSX.Element {
    const { data: posts, loading, error } = useQuery(POSTS_QUERY)
    return (
        <Center>
            {!loading ? (
                <View>
                    <Text>{JSON.stringify(posts, null, 2)}</Text>
                    <Text>{JSON.stringify(error)}</Text>
                </View>
            ) : (
                <ActivityIndicator size="large" color="#0000ff" />
            )}
        </Center>
    )
}
