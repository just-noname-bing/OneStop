import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Account } from './components/Account';
import { Home } from './components/Home';
import { Posts } from './components/Posts';
import { COLOR_PALETE } from './utils/colors';
import { GRAPHQL_API_URL } from './utils/constants';

const Tab = createBottomTabNavigator()

const client = new ApolloClient({
    uri: GRAPHQL_API_URL,
    cache: new InMemoryCache()
})

export default function App() {
    return (
        <ApolloProvider client={client}>
            <NavigationContainer>
                <Tab.Navigator screenOptions={{
                    header: () => null,
                    tabBarLabel: () => null,
                    tabBarActiveTintColor: COLOR_PALETE.buttonActive,
                }} initialRouteName="Map">
                    <Tab.Screen
                        options={{ tabBarIcon: (p) => <Entypo name="chat" {...p} /> }}
                        name='Posts'
                        component={Posts}
                    />
                    <Tab.Screen
                        options={{ tabBarIcon: (p) => <Ionicons name="map-sharp" {...p} /> }}
                        name='Map'
                        component={Home}
                    />
                    <Tab.Screen
                        options={{ tabBarIcon: (p) => <MaterialIcons name="account-circle" {...p} /> }}
                        name='Account'
                        component={Account}
                    />
                </Tab.Navigator>
                <StatusBar style='auto' />
            </NavigationContainer>
        </ApolloProvider>
    );
}

