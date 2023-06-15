import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateNewPost from "./CreateNewPost";
import PostsFeed from "./PostsFeed";
import WhatHappend from "./WhatHappend";
import PostView from "./PostView";
import { TransportSelectorForPost } from "./selectStopForPost";
import { TransportStopTimeSelector } from "./TransportStopTimeSelector";

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
            <PostsStack.Screen name="PostView" component={PostView} />
            <PostsStack.Screen name="CreateNewPost" component={CreateNewPost} />
            <PostsStack.Screen
                name="TransportSelectorForPost"
                component={TransportSelectorForPost}
            />
            <PostsStack.Screen
                name="TransportStopTimeSelector"
                component={TransportStopTimeSelector}
            />
            <PostsStack.Screen name="WhatHappend" component={WhatHappend} />
        </PostsStack.Navigator>
    );
}
