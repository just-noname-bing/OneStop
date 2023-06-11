import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateNewPost from "./CreateNewPost";
import PostsFeed from "./PostsFeed";
import WhatHappend from "./WhatHappend";

interface Props {}

const PostsStack = createNativeStackNavigator();

export default function Posts(_: Props): JSX.Element {
    return (
        <PostsStack.Navigator
            screenOptions={{
                header: () => null,
            }}
        >
            <PostsStack.Screen name="PostsFeed" component={PostsFeed} />
            <PostsStack.Screen name="CreateNewPost" component={CreateNewPost} />
            <PostsStack.Screen name="WhatHappend" component={WhatHappend} />
        </PostsStack.Navigator>
    );
}
