import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientsScreen from "./Screens/ClientsScreen.js"
import ProductsScreen from "./Screens/ProductsScreen.js"
import HomeScreen from "./Screens/HomeScreen.js"
import DetailOrderScreen from "./Screens/DetailOrderScreen.js"
import MaPocheScreen from "./Screens/MaPocheScreen.js"
import MaPocheDetails from "./Screens/MaPocheDetailsScreen.js"

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil factures' }} />
        <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clients' }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Facture' }} />
        <Stack.Screen name="DetailOrder" component={DetailOrderScreen} options={{ title: 'Détails de facture' }} />
        <Stack.Screen name="MaPoche" component={MaPocheScreen} options={{ title: 'Ma poche' }} />
        <Stack.Screen name="MaPocheDetails" component={MaPocheDetails} options={{ title: 'Ma poche' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;