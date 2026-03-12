import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import CreateListScreen from './screens/CreateListScreen';
import MyLists from './screens/Mylists'



export type RootStackParamList = {
 Home: undefined,
 CreateListScreen: undefined,
 MyLists: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="CreateListScreen" component={CreateListScreen}/>
        <Stack.Screen name="MyLists" component={MyLists}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}