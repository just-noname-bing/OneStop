import { ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import {
    ApolloClient,
    from,
    HttpLink,
    InMemoryCache,
} from "@apollo/client/core";
import { StatusBar } from "expo-status-bar";
import Pages from "./components/Pages";
import { GRAPHQL_API_URL } from "./utils/constants";
import {
    DefaultTheme,
    NavigationContainer,
    useIsFocused,
} from "@react-navigation/native";
import { AsyncStorageWrapper, persistCacheSync } from "apollo3-cache-persist";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNewTokens, getAccessToken, TokensLogout } from "./utils/tokens";
import { useEffect } from "react";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
    },
};

const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors)
            graphQLErrors.forEach(
                async ({ message, locations, path, ...x }) => {
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    );

                    if (message.toLowerCase() === "not authenticated") {
                        const newA = await fetchNewTokens();
                        console.log(newA);
                        if (!newA) {
                            console.log("explode user");
                        } else {
                            // new token received
                            operation.setContext({
                                Headers: {
                                    ...operation.getContext().headers,
                                    authorization: newA,
                                },
                            });
                        }

                        return forward(operation);
                    } else if (message.toLowerCase() === "not authorized") {
                        await TokensLogout()
                        // gg
                    }
                }
            );

        if (networkError) console.log(`[Network error]: ${networkError}`);
    }
);

const cache = new InMemoryCache();

persistCacheSync({
    cache,
    storage: AsyncStorage,
});

const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
});

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
});

export default function App() {
    return (
        <ApolloProvider client={client}>
            <NavigationContainer theme={MyTheme}>
                <Pages />
            </NavigationContainer>
            <StatusBar style="auto" />
        </ApolloProvider>
    );
}
