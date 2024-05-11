import React from "react";
import { render } from "react-dom";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import TextInput from "../components/TextInput";
import { color } from "react-native-reanimated";
import { usernameValidator } from "../helpers/usernameValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { useState } from "react";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const onRegisterPressed = () => {
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);
    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
    } else {
      console.log("Fetching");
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Access-Control-Allow-Origin", "*");
      var raw = JSON.stringify({
        username: username.value,
        password: password.value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://172.16.14.217:5000/signup", requestOptions)
        .then((response) => {
          response.json().then(async () => {
            if (response.ok) {
              navigation.navigate("LoginScreen");
              navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
              });
            } else {
              alert("Registration Failed, Try Again!");
            }
          });
        })
        .catch(function (err) {
          alert("Registration Failed, Try Again!");
          console.log(err);
        });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SongWiz</Text>
      <Text style={styles.login}>Sign Up</Text>
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
      <TouchableOpacity style={styles.loginBtn} onPress={onRegisterPressed}>
        <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginText}>Back</Text>
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
  inputText: {
    height: 50,
    color: "black",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#DC143C",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
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
