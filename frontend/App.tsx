import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Account } from './components/Account';
import { Home } from './components/Home';
import { Posts } from './components/Posts';

//icons
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { COLOR_PALETE } from './utils/colors';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator()

export default function App() {
    return (
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
    );
}

