import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Home from "./screens/Home";
import SongScreen from "./screens/SongScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForYouScreen from "./screens/ForYouScreen";

const Stack = createStackNavigator();

export default function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SongScreen"
          component={SongScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="ForYouScreen"
          component={ForYouScreen}
          options={({ navigation }) => ({
            headerTitle: "For You",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "black",
            },
            headerTitleStyle: {
              color: "white",
              textAlignVertical: "center",
              fontSize: 30,
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "SongWiz",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#000000",
            },
            headerTitleStyle: {
              color: "white",
              textAlignVertical: "center",
              fontSize: 30,
              fontWeight: "bold",
            },
            headerBackTitle: "Back",
            headerBackTitleVisible: true,
            headerRight: () => (
              <Button
                onPress={() => {
                  AsyncStorage.clear();
                  navigation.navigate("LoginScreen");
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                  });
                }}
                title="Log Out"
                color="#DC143C"
              />
            ),
            headerLeft: () => (
              <Button
                onPress={() => {
                  navigation.navigate("ForYouScreen");
                }}
                title="For You"
                color="#29ABE2"
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
