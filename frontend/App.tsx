import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { StatusBar } from 'expo-status-bar';
import Pages from './components/Pages';
import { GRAPHQL_API_URL } from './utils/constants';

const client = new ApolloClient({
    uri: GRAPHQL_API_URL,
    cache: new InMemoryCache()
})

export default function App() {
    return (
        <ApolloProvider client={client}>
            <Pages />
            <StatusBar style='auto' />
        </ApolloProvider>
    );
}


