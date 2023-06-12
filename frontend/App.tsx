import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { StatusBar } from "expo-status-bar";
import Pages from "./components/Pages";
import { GRAPHQL_API_URL } from "./utils/constants";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white",
    },
};

const client = new ApolloClient({
    uri: GRAPHQL_API_URL,
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
