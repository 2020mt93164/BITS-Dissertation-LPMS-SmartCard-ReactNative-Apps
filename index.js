/**
 * @format
 */

import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text } from 'react-native';
import { SmartCardsScreen } from './screens/smart_cards_screen';
import { LoginScreen } from './screens/login_screen';
import { RegistrationScreen } from './screens/registration_screen';
import { AddNewLoyaltyCard } from './screens/add_new_loyalty_card';
import { LoyaltyCardsScreen } from './screens/loyalty_cards_screen';
import { ShoppingScreen } from './screens/shopping_screen';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
  	    <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Add New Loyalty Card" component={AddNewLoyaltyCard} />
        <Stack.Screen name="My Loyalty Cards" component={LoyaltyCardsScreen} />
        <Stack.Screen name="My Smart Cards" component={SmartCardsScreen} />
        <Stack.Screen name="Merchant Portal" component={ShoppingScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);
