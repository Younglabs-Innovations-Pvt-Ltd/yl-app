import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DemoClassScreen from './src/screens/demo-class.screen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="DemoClass" component={DemoClassScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
