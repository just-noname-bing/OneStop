import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Account } from './components/Account';
import { BottomMenu } from './components/BottomMenu';
import { Home } from './components/Home';
import { Posts } from './components/Posts';

const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Home' options={{ header: () => null }} component={Home} />
                <Stack.Screen name='Account' component={Account} />
                <Stack.Screen name='Posts' options={{ gestureDirection: "horizontal" }} component={Posts} />
            </Stack.Navigator>
            <BottomMenu />
        </NavigationContainer>
    );
}

