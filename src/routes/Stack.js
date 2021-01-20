import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ItemList from "../screens/ItemList";
import Login from "../screens/LoginScreen/Login";
import Scanner from "../screens/Scanner";
import Drawer from './Drawer'

const Stack = createStackNavigator();

export default (props) => {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="CollectList" component={Drawer} />
        <Stack.Screen name="ItemList" component={ItemList} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Scanner" component={Scanner} />
      </Stack.Navigator>
    </View>
  );
};
