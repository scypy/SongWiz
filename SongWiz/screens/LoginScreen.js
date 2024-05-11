import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import TextInput from "../components/TextInput";
import { color } from "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { usernameValidator } from "../helpers/usernameValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const isLoading = false;

  const onLoginPressed = () => {
    const isLoading = true;
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
      const isLoading = false;
    } else {
      console.log("Logging in");

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Access-Control-Allow-Origin", "*");

      var data = JSON.stringify({
        username: username.value,
        password: password.value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
        redirect: "follow",
      };

      var request = new Request("http://172.16.14.217:5000/login", {
        method: "POST",
        headers: myHeaders,
        body: data,
        redirect: "follow",
      });

      fetch(request)
        .then((response) => {
          response.json().then(async (data) => {
            if (response.ok) {
              await AsyncStorage.setItem("userID", data.userID.toString());
              navigation.navigate("Home");
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            } else {
              alert("Login Failed, Try Again!");
            }
          });
        })
        .catch(function (err) {
          alert("Login Failed, Try Again!");
          console.log(err);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <Text style={styles.logo}>SongWiz</Text>
      <Text style={styles.login}>Login</Text>
      <TextInput
        style={styles.inputText}
        placeholder="Username"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: "" })}
        error={!!username.error}
        errorText={username.error}
        placeholderTextColor="#003f5c"
      />
      {/* <View style={styles.inputView} > */}
      <TextInput
        secureTextEntry
        style={styles.inputText}
        placeholder="Password"
        value={password.value}
        error={!!password.error}
        errorText={password.error}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        placeholderTextColor="#003f5c"
      />
      <TouchableOpacity style={styles.loginBtn} onPress={onLoginPressed}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#F0F8FF",
    marginBottom: 100,
  },
  login: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#F0F8FF",
    marginBottom: 30,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#F0F8FF",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  invalidPass: {
    width: "80%",
    backgroundColor: "#DC143C",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#DC143C",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  registerBtn: {
    width: "60%",
    backgroundColor: "#29ABE2",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  loginText: {
    color: "black",
    fontWeight: "bold",
  },
});
