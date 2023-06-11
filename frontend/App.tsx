import { ApolloProvider } from "@apollo/client";
import { addEventListener, openURL, parse } from "expo-linking";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { StatusBar } from "expo-status-bar";
import Pages from "./components/Pages";
import { GRAPHQL_API_URL } from "./utils/constants";
import { useNavigation } from "@react-navigation/native";

const client = new ApolloClient({
    uri: GRAPHQL_API_URL,
    cache: new InMemoryCache(),
});

addEventListener("url", (event) => {
    const url = event.url;
    if (url) {
        const navigation = useNavigation() as any;
        navigation.navigate(parseScreen(url));
    }
});

// Function to parse the URL and extract the screen name and parameter
function parseScreen(url: any) {
    const { path, queryParams } = parse(url);
    return {
        screenName: queryParams?.screenName,
        parameter: queryParams?.parameter,
    };
}

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Pages />
            <StatusBar style="auto" />
        </ApolloProvider>
    );
}
