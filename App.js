import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsScreen from "./ClientsScreen.js"
import ProductsScreen from "./ProductsScreen.js"
import HomeScreen from "./HomeScreen.js"
import DetailOrderScreen from "./DetailOrderScreen.js"

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Clients" component={ClientsScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="DetailOrder" component={DetailOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;