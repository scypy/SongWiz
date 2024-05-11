import React, { useState, useEffect, Component, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ForYouScreen({}) {
  const [personalRecs, setpersonalRecs] = useState([]);
  useEffect(() => {
    fetchrecs();
    return () => {};
  }, []);

  const fetchrecs = async () => {
    console.log("Fetchrecs");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "*");

    var raw = {
      userID: await AsyncStorage.getItem("userID"),
    };

    var request = new Request("http://172.16.14.217:5000/userprofile", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow",
    });

    fetch(request).then((res) => {
      res.json().then((recs) => {
        setpersonalRecs(recs);
        console.log(recs);
      });
    });
  };

  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <View style={{ marginTop: 50 }}>
        <Text style={styles.header}>Based on your ratings:</Text>
        <Text style={styles.recommendations}>{personalRecs[0]}</Text>
        <Text style={styles.recommendations}>{personalRecs[1]}</Text>
        <Text style={styles.recommendations}>{personalRecs[2]}</Text>
        <Text style={styles.recommendations}>{personalRecs[3]}</Text>
        <Text style={styles.recommendations}>{personalRecs[4]}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#29ABE2",
    marginLeft: 15,
    marginBottom: 30,
  },
  recommendations: {
    margin: 10,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
  },
});
